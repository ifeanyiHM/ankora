import type {
  OrderItemRecord,
  OrderRecord,
  OrderStatus,
  OrderStatusEvent,
  PaymentStatus,
} from "@/types";
import { newId, sql } from "./client";

interface OrderRow {
  id: string;
  order_number: string;
  email: string;
  phone: string;
  full_name: string;
  address: string;
  city: string;
  state: string;
  notes: string | null;
  subtotal: number;
  delivery: number;
  total: number;
  status: string;
  payment_status: string;
  paystack_ref: string | null;
  tracking_number: string | null;
  courier: string | null;
  stock_decremented: number;
  confirmation_email_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ItemRow {
  id: string;
  product_id: string | null;
  slug: string;
  name: string;
  unit_label: string;
  price: number;
  quantity: number;
}

interface EventRow {
  id: string;
  status: string;
  note: string | null;
  created_at: string;
}

async function items(orderId: string): Promise<OrderItemRecord[]> {
  const rows = await sql<ItemRow[]>`
    SELECT id, product_id, slug, name, unit_label, price, quantity
    FROM order_items
    WHERE order_id = ${orderId}
    ORDER BY id ASC
  `;

  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    unitLabel: r.unit_label,
    price: r.price,
    quantity: r.quantity,
  }));
}

async function history(orderId: string): Promise<OrderStatusEvent[]> {
  const rows = await sql<EventRow[]>`
    SELECT id, status, note, created_at
    FROM order_status_events
    WHERE order_id = ${orderId}
    ORDER BY created_at ASC, id ASC
  `;

  return rows.map((r) => ({
    id: r.id,
    status: r.status as OrderStatus,
    note: r.note,
    createdAt: r.created_at,
  }));
}

async function toOrder(r: OrderRow): Promise<OrderRecord> {
  const [orderItems, statusHistory] = await Promise.all([
    items(r.id),
    history(r.id),
  ]);

  return {
    id: r.id,
    orderNumber: r.order_number,
    email: r.email,
    phone: r.phone,
    fullName: r.full_name,
    address: r.address,
    city: r.city,
    state: r.state,
    notes: r.notes,
    subtotal: r.subtotal,
    delivery: r.delivery,
    total: r.total,
    status: r.status as OrderStatus,
    paymentStatus: r.payment_status as PaymentStatus,
    paystackRef: r.paystack_ref,
    trackingNumber: r.tracking_number,
    courier: r.courier,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    items: orderItems,
    statusHistory,
  };
}

export interface NewOrderItem {
  productId: string | null;
  slug: string;
  name: string;
  unitLabel: string;
  price: number;
  quantity: number;
}

export interface NewOrder {
  orderNumber: string;
  email: string;
  phone: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  notes?: string | null;
  subtotal: number;
  delivery: number;
  total: number;
  paystackRef: string;
  items: NewOrderItem[];
}

export async function createOrder(input: NewOrder): Promise<OrderRecord> {
  const id = newId();

  await sql.begin(async (tx) => {
    await tx`
      INSERT INTO orders (
        id, order_number, email, phone, full_name, address, city, state,
        notes, subtotal, delivery, total, paystack_ref
      )
      VALUES (
        ${id},
        ${input.orderNumber},
        ${input.email},
        ${input.phone},
        ${input.fullName},
        ${input.address},
        ${input.city},
        ${input.state},
        ${input.notes ?? null},
        ${input.subtotal},
        ${input.delivery},
        ${input.total},
        ${input.paystackRef}
      )
    `;

    for (const item of input.items) {
      await tx`
        INSERT INTO order_items (
          id, order_id, product_id, slug, name, unit_label, price, quantity
        )
        VALUES (
          ${newId()},
          ${id},
          ${item.productId},
          ${item.slug},
          ${item.name},
          ${item.unitLabel},
          ${item.price},
          ${item.quantity}
        )
      `;
    }

    await tx`
      INSERT INTO order_status_events (id, order_id, status, note)
      VALUES (
        ${newId()},
        ${id},
        'PENDING_PAYMENT',
        'Order placed, awaiting payment'
      )
    `;
  });

  const order = await getOrderById(id);

  if (!order) {
    throw new Error("Order was created but could not be retrieved.");
  }

  return order;
}

export async function getOrderById(id: string): Promise<OrderRecord | null> {
  const rows = await sql<OrderRow[]>`
    SELECT *
    FROM orders
    WHERE id = ${id}
    LIMIT 1
  `;

  return rows[0] ? toOrder(rows[0]) : null;
}

export async function getOrderByNumber(
  orderNumber: string,
): Promise<OrderRecord | null> {
  const rows = await sql<OrderRow[]>`
    SELECT *
    FROM orders
    WHERE order_number = ${orderNumber}
    LIMIT 1
  `;

  return rows[0] ? toOrder(rows[0]) : null;
}

export async function getOrderByPaystackRef(
  ref: string,
): Promise<OrderRecord | null> {
  const rows = await sql<OrderRow[]>`
    SELECT *
    FROM orders
    WHERE paystack_ref = ${ref}
    LIMIT 1
  `;

  return rows[0] ? toOrder(rows[0]) : null;
}

export async function orderNumberExists(orderNumber: string): Promise<boolean> {
  const rows = await sql<{ exists: number }[]>`
    SELECT 1 AS exists
    FROM orders
    WHERE order_number = ${orderNumber}
    LIMIT 1
  `;

  return rows.length > 0;
}

export interface OrderListFilter {
  status?: OrderStatus;
  search?: string;
  limit?: number;
}

export async function listOrders(
  filter: OrderListFilter = {},
): Promise<OrderRecord[]> {
  const limit = Math.max(1, Math.min(5000, Math.floor(filter.limit ?? 200)));
  let rows: OrderRow[];

  if (filter.status && filter.search) {
    const search = `%${filter.search}%`;
    rows = await sql<OrderRow[]>`
      SELECT *
      FROM orders
      WHERE status = ${filter.status}
        AND (
          order_number ILIKE ${search}
          OR email ILIKE ${search}
          OR full_name ILIKE ${search}
          OR phone ILIKE ${search}
        )
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
  } else if (filter.status) {
    rows = await sql<OrderRow[]>`
      SELECT *
      FROM orders
      WHERE status = ${filter.status}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
  } else if (filter.search) {
    const search = `%${filter.search}%`;
    rows = await sql<OrderRow[]>`
      SELECT *
      FROM orders
      WHERE order_number ILIKE ${search}
        OR email ILIKE ${search}
        OR full_name ILIKE ${search}
        OR phone ILIKE ${search}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
  } else {
    rows = await sql<OrderRow[]>`
      SELECT *
      FROM orders
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
  }

  return Promise.all(rows.map(toOrder));
}

export async function countOrdersByStatus(): Promise<Record<string, number>> {
  const rows = await sql<{ status: string; n: number }[]>`
    SELECT status, COUNT(*)::int AS n
    FROM orders
    GROUP BY status
  `;

  return Object.fromEntries(rows.map((r) => [r.status, r.n]));
}

/**
 * Marks a pending order paid exactly once.
 * The row lock and transaction protect stock deductions from duplicate callbacks.
 */
export async function markOrderPaid(
  orderId: string,
): Promise<OrderRecord | null> {
  const result = await sql.begin(async (tx) => {
    const rows = await tx<OrderRow[]>`
      SELECT *
      FROM orders
      WHERE id = ${orderId}
      FOR UPDATE
    `;

    const row = rows[0];

    if (!row) return null;

    if (row.payment_status === "PAID") {
      return row;
    }

    await tx`
      UPDATE orders
      SET
        payment_status = 'PAID',
        status = CASE
          WHEN status = 'PENDING_PAYMENT' THEN 'PAYMENT_CONFIRMED'
          ELSE status
        END,
        updated_at = CURRENT_TIMESTAMP::text
      WHERE id = ${orderId}
    `;

    await tx`
      INSERT INTO order_status_events (id, order_id, status, note)
      VALUES (
        ${newId()},
        ${orderId},
        'PAYMENT_CONFIRMED',
        'Payment confirmed by Paystack'
      )
    `;

    if (!row.stock_decremented) {
      const orderItems = await tx<
        { product_id: string | null; quantity: number }[]
      >`
        SELECT product_id, quantity
        FROM order_items
        WHERE order_id = ${orderId}
      `;

      for (const item of orderItems) {
        if (item.product_id) {
          await tx`
            UPDATE products
            SET
              stock = GREATEST(0, stock - ${item.quantity}),
              updated_at = CURRENT_TIMESTAMP::text
            WHERE id = ${item.product_id}
          `;
        }
      }

      await tx`
        UPDATE orders
        SET stock_decremented = 1
        WHERE id = ${orderId}
      `;
    }

    const updatedRows = await tx<OrderRow[]>`
      SELECT *
      FROM orders
      WHERE id = ${orderId}
    `;

    return updatedRows[0] ?? null;
  });

  return result ? toOrder(result) : null;
}

export async function markOrderFailed(orderId: string): Promise<void> {
  await sql`
    UPDATE orders
    SET
      payment_status = 'FAILED',
      updated_at = CURRENT_TIMESTAMP::text
    WHERE id = ${orderId}
      AND payment_status <> 'PAID'
  `;
}

export async function setConfirmationEmailSent(orderId: string): Promise<void> {
  await sql`
    UPDATE orders
    SET confirmation_email_sent_at = CURRENT_TIMESTAMP::text
    WHERE id = ${orderId}
  `;
}

export async function wasConfirmationEmailSent(
  orderId: string,
): Promise<boolean> {
  const rows = await sql<{ confirmation_email_sent_at: string | null }[]>`
    SELECT confirmation_email_sent_at
    FROM orders
    WHERE id = ${orderId}
    LIMIT 1
  `;

  return !!rows[0]?.confirmation_email_sent_at;
}

export interface StatusUpdateInput {
  status: OrderStatus;
  note?: string;
  trackingNumber?: string | null;
  courier?: string | null;
}

export async function updateOrderStatus(
  orderId: string,
  input: StatusUpdateInput,
): Promise<OrderRecord | null> {
  await sql.begin(async (tx) => {
    if (input.trackingNumber !== undefined && input.courier !== undefined) {
      await tx`
        UPDATE orders
        SET
          status = ${input.status},
          tracking_number = ${input.trackingNumber},
          courier = ${input.courier},
          updated_at = CURRENT_TIMESTAMP::text
        WHERE id = ${orderId}
      `;
    } else if (input.trackingNumber !== undefined) {
      await tx`
        UPDATE orders
        SET
          status = ${input.status},
          tracking_number = ${input.trackingNumber},
          updated_at = CURRENT_TIMESTAMP::text
        WHERE id = ${orderId}
      `;
    } else if (input.courier !== undefined) {
      await tx`
        UPDATE orders
        SET
          status = ${input.status},
          courier = ${input.courier},
          updated_at = CURRENT_TIMESTAMP::text
        WHERE id = ${orderId}
      `;
    } else {
      await tx`
        UPDATE orders
        SET
          status = ${input.status},
          updated_at = CURRENT_TIMESTAMP::text
        WHERE id = ${orderId}
      `;
    }

    await tx`
      INSERT INTO order_status_events (id, order_id, status, note)
      SELECT ${newId()}, ${orderId}, ${input.status}, ${input.note ?? null}
      WHERE EXISTS (
        SELECT 1 FROM orders WHERE id = ${orderId}
      )
    `;
  });

  return getOrderById(orderId);
}

/**
 * Public order tracking requires an order number and a matching email or phone.
 */
export async function findOrderForTracking(
  orderNumber: string,
  contact: string,
): Promise<OrderRecord | null> {
  const order = await getOrderByNumber(orderNumber.trim().toUpperCase());

  if (!order) return null;

  const normalizedContact = contact.trim().toLowerCase();
  const emailMatches = order.email.toLowerCase() === normalizedContact;

  const digits = (value: string) =>
    value.replace(/\D/g, "").replace(/^234/, "0");

  const normalizedPhone = digits(contact);
  const phoneMatches =
    digits(order.phone) === normalizedPhone && normalizedPhone.length >= 10;

  return emailMatches || phoneMatches ? order : null;
}
