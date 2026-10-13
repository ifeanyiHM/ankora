"use server";

import { requireAdminSession } from "@/lib/admin-auth";
import { getOrderById, updateOrderStatus } from "@/lib/db/orders";
import { orderStatusEmail } from "@/lib/email-templates";
import { sendMail } from "@/lib/mail";
import { ORDER_STATUSES, type OrderStatus } from "@/types";
import { revalidatePath } from "next/cache";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export interface OrderUpdateInput {
  status: OrderStatus;
  trackingNumber: string;
  courier: string;
  note: string;
}

export async function updateOrderAction(
  orderId: string,
  input: OrderUpdateInput,
): Promise<ActionResult> {
  await requireAdminSession();

  if (!ORDER_STATUSES.includes(input.status)) {
    return { ok: false, error: "Choose a valid status." };
  }

  const before = await getOrderById(orderId);

  if (!before) {
    return { ok: false, error: "Order not found." };
  }

  const order = await updateOrderStatus(orderId, {
    status: input.status,
    trackingNumber: input.trackingNumber.trim() || null,
    courier: input.courier.trim() || null,
    note: input.note.trim() || undefined,
  });

  if (!order) {
    return { ok: false, error: "Order not found." };
  }

  if (order.status !== before.status && order.paymentStatus === "PAID") {
    const { subject, html, text } = orderStatusEmail(order, order.status);
    await sendMail({ to: order.email, subject, html, text });
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);

  return { ok: true };
}
