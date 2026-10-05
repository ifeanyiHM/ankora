import { getOrderByPaystackRef, markOrderPaid, setConfirmationEmailSent, wasConfirmationEmailSent } from "@/lib/db/orders";
import { orderConfirmationEmail } from "@/lib/email-templates";
import { sendMail } from "@/lib/mail";
import type { OrderRecord } from "@/types";
import type { PaystackTransaction } from "@/lib/paystack";

/**
 * Called once Paystack confirms a payment, from both the webhook and the return page —
 * whichever arrives first does the work, the other is a safe no-op. Decrements stock and
 * sends the confirmation email exactly once per order.
 */
export async function confirmOrderPayment(tx: PaystackTransaction): Promise<OrderRecord | null> {
  const existing = getOrderByPaystackRef(tx.reference);
  if (!existing) {
    console.warn(`[orders] No order found for Paystack reference ${tx.reference}`);
    return null;
  }
  if (tx.status !== "success") return existing;

  const order = markOrderPaid(existing.id);
  if (!order) return null;

  if (!wasConfirmationEmailSent(order.id)) {
    const { subject, html, text } = orderConfirmationEmail(order);
    await sendMail({ to: order.email, subject, html, text });
    setConfirmationEmailSent(order.id);
  }
  return order;
}
