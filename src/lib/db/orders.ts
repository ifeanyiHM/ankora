import { db, newId } from "./client";
import type { OrderItemRecord, OrderRecord, OrderStatus, OrderStatusEvent, PaymentStatus } from "@/types";

interface OrderRow {
  id: string; order_number: string; email: string; phone: string; full_name: string; address: string;
  city: string; state: string; notes: string | null; subtotal: number; delivery: number; total: number;
  status: string; payment_status: string; paystack_ref: string | null; tracking_number: string | null;
  courier: string | null; stock_decremented: number; confirmation_email_sent_at: string | null;
  created_at: string; updated_at: string;
}
interface ItemRow { id: string; product_id: string | null; slug: string; name: string; unit_label: string; price: number; quantity: number }
interface EventRow { id: string; status: string; note: string | null; created_at: string }

function items(orderId: string): OrderItemRecord[] {
  return db.prepare<[string], ItemRow>("SELECT * FROM order_items WHERE order_id = ? ORDER BY rowid ASC").all(orderId)
    .map((r) => ({ id: r.id, slug: r.slug, name: r.name, unitLabel: r.unit_label, price: r.price, quantity: r.quantity }));
}
function history(orderId: string): OrderStatusEvent[] {
  return db.prepare<[string], EventRow>("SELECT * FROM order_status_events WHERE order_id = ? ORDER BY created_at ASC").all(orderId)
    .map((r) => ({ id: r.id, status: r.status as OrderStatus, note: r.note, createdAt: r.created_at }));
}
function toOrder(r: OrderRow): OrderRecord {
  return {
    id: r.id, orderNumber: r.order_number, email: r.email, phone: r.phone, fullName: r.full_name,
    address: r.address, city: r.city, state: r.state, notes: r.notes, subtotal: r.subtotal, delivery: r.delivery,
    total: r.total, status: r.status as OrderStatus, paymentStatus: r.payment_status as PaymentStatus,
    paystackRef: r.paystack_ref, trackingNumber: r.tracking_number, courier: r.courier,
    createdAt: r.created_at, updatedAt: r.updated_at, items: items(r.id), statusHistory: history(r.id),
  };
}

export interface NewOrderItem { productId: string | null; slug: string; name: string; unitLabel: string; price: number; quantity: number }
export interface NewOrder {
  orderNumber: string; email: string; phone: string; fullName: string; address: string; city: string;
  state: string; notes?: string | null; subtotal: number; delivery: number; total: number;
  paystackRef: string; items: NewOrderItem[];
}

export function createOrder(input: NewOrder): OrderRecord {
  const id = newId();
  const insertOrder = db.prepare(
    `INSERT INTO orders (id, order_number, email, phone, full_name, address, city, state, notes, subtotal, delivery, total, paystack_ref)
     VALUES (@id, @orderNumber, @email, @phone, @fullName, @address, @city, @state, @notes, @subtotal, @delivery, @total, @paystackRef)`,
  );
  const insertItem = db.prepare(
    `INSERT INTO order_items (id, order_id, product_id, slug, name, unit_label, price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const insertEvent = db.prepare(`INSERT INTO order_status_events (id, order_id, status, note) VALUES (?, ?, 'PENDING_PAYMENT', 'Order placed, awaiting payment')`);

  db.transaction(() => {
    insertOrder.run({ id, notes: input.notes ?? null, ...input });
    for (const it of input.items) insertItem.run(newId(), id, it.productId, it.slug, it.name, it.unitLabel, it.price, it.quantity);
    insertEvent.run(newId(), id);
  })();

  return getOrderById(id)!;
}

export function getOrderById(id: string): OrderRecord | null {
  const row = db.prepare<[string], OrderRow>("SELECT * FROM orders WHERE id = ?").get(id);
  return row ? toOrder(row) : null;
}
export function getOrderByNumber(orderNumber: string): OrderRecord | null {
  const row = db.prepare<[string], OrderRow>("SELECT * FROM orders WHERE order_number = ?").get(orderNumber);
  return row ? toOrder(row) : null;
}
export function getOrderByPaystackRef(ref: string): OrderRecord | null {
  const row = db.prepare<[string], OrderRow>("SELECT * FROM orders WHERE paystack_ref = ?").get(ref);
  return row ? toOrder(row) : null;
}
export function orderNumberExists(orderNumber: string): boolean {
  return !!db.prepare("SELECT 1 FROM orders WHERE order_number = ?").get(orderNumber);
}

export interface OrderListFilter { status?: OrderStatus; search?: string; limit?: number }
export function listOrders(filter: OrderListFilter = {}): OrderRecord[] {
  const clauses: string[] = [];
  const params: (string | number)[] = [];
  if (filter.status) { clauses.push("status = ?"); params.push(filter.status); }
  if (filter.search) {
    clauses.push("(order_number LIKE ? OR email LIKE ? OR full_name LIKE ? OR phone LIKE ?)");
    const s = `%${filter.search}%`;
    params.push(s, s, s, s);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const limit = filter.limit ?? 200;
  const rows = db.prepare<(string | number)[], OrderRow>(`SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT ?`).all(...params, limit);
  return rows.map(toOrder);
}

export function countOrdersByStatus(): Record<string, number> {
  const rows = db.prepare<[], { status: string; n: number }>("SELECT status, COUNT(*) AS n FROM orders GROUP BY status").all();
  return Object.fromEntries(rows.map((r) => [r.status, r.n]));
}

/** Marks a pending order paid exactly once, decrementing stock inside the same transaction. Safe to call twice (webhook + return page). */
export function markOrderPaid(orderId: string): OrderRecord | null {
  const result = db.transaction(() => {
    const row = db.prepare<[string], OrderRow>("SELECT * FROM orders WHERE id = ?").get(orderId);
    if (!row) return null;
    if (row.payment_status === "PAID") return toOrder(row);

    db.prepare(
      `UPDATE orders SET payment_status='PAID', status=CASE WHEN status='PENDING_PAYMENT' THEN 'PAYMENT_CONFIRMED' ELSE status END, updated_at=datetime('now') WHERE id=?`,
    ).run(orderId);
    db.prepare("INSERT INTO order_status_events (id, order_id, status, note) VALUES (?, ?, 'PAYMENT_CONFIRMED', 'Payment confirmed by Paystack')").run(newId(), orderId);

    if (!row.stock_decremented) {
      const rows = db.prepare<[string], { product_id: string | null; quantity: number }>(
        "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
      ).all(orderId);
      for (const it of rows) {
        if (it.product_id) db.prepare("UPDATE products SET stock = MAX(0, stock - ?), updated_at = datetime('now') WHERE id = ?").run(it.quantity, it.product_id);
      }
      db.prepare("UPDATE orders SET stock_decremented = 1 WHERE id = ?").run(orderId);
    }
    return toOrder(db.prepare<[string], OrderRow>("SELECT * FROM orders WHERE id = ?").get(orderId)!);
  })();
  return result;
}

export function markOrderFailed(orderId: string): void {
  db.prepare("UPDATE orders SET payment_status='FAILED', updated_at=datetime('now') WHERE id = ? AND payment_status != 'PAID'").run(orderId);
}

export function setConfirmationEmailSent(orderId: string): void {
  db.prepare("UPDATE orders SET confirmation_email_sent_at = datetime('now') WHERE id = ?").run(orderId);
}
export function wasConfirmationEmailSent(orderId: string): boolean {
  const row = db.prepare<[string], { confirmation_email_sent_at: string | null }>("SELECT confirmation_email_sent_at FROM orders WHERE id = ?").get(orderId);
  return !!row?.confirmation_email_sent_at;
}

export interface StatusUpdateInput { status: OrderStatus; note?: string; trackingNumber?: string | null; courier?: string | null }
export function updateOrderStatus(orderId: string, input: StatusUpdateInput): OrderRecord | null {
  db.transaction(() => {
    const sets = ["status = @status", "updated_at = datetime('now')"];
    const params: Record<string, string | null> = { id: orderId, status: input.status };
    if (input.trackingNumber !== undefined) { sets.push("tracking_number = @trackingNumber"); params.trackingNumber = input.trackingNumber; }
    if (input.courier !== undefined) { sets.push("courier = @courier"); params.courier = input.courier; }
    db.prepare(`UPDATE orders SET ${sets.join(", ")} WHERE id = @id`).run(params);
    db.prepare("INSERT INTO order_status_events (id, order_id, status, note) VALUES (?, ?, ?, ?)").run(newId(), orderId, input.status, input.note ?? null);
  })();
  return getOrderById(orderId);
}

/** Look up an order for the public tracking page. Requires the order number AND a matching email or phone. */
export function findOrderForTracking(orderNumber: string, contact: string): OrderRecord | null {
  const order = getOrderByNumber(orderNumber.trim().toUpperCase());
  if (!order) return null;
  const c = contact.trim().toLowerCase();
  const emailMatches = order.email.toLowerCase() === c;
  const digits = (s: string) => s.replace(/\D/g, "").replace(/^234/, "0");
  const phoneMatches = digits(order.phone) === digits(contact) && digits(contact).length >= 10;
  return emailMatches || phoneMatches ? order : null;
}
