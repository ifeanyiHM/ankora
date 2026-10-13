import {
  getOrderByPaystackRef,
  markOrderPaid,
  setConfirmationEmailSent,
  wasConfirmationEmailSent,
} from "@/lib/db/orders";
import { orderConfirmationEmail } from "@/lib/email-templates";
import { sendMail } from "@/lib/mail";
import type { PaystackTransaction } from "@/lib/paystack";
import type { OrderRecord } from "@/types";

/**
 * Called when Paystack confirms a payment, from both the webhook and
 * the return page. The database transaction protects stock deduction
 * from duplicate payment callbacks.
 */
export async function confirmOrderPayment(
  tx: PaystackTransaction,
): Promise<OrderRecord | null> {
  const existing = await getOrderByPaystackRef(tx.reference);

  if (!existing) {
    console.warn(
      `[orders] No order found for Paystack reference ${tx.reference}`,
    );
    return null;
  }

  if (tx.status !== "success") return existing;

  const order = await markOrderPaid(existing.id);

  if (!order) return null;

  if (!(await wasConfirmationEmailSent(order.id))) {
    const { subject, html, text } = orderConfirmationEmail(order);

    await sendMail({
      to: order.email,
      subject,
      html,
      text,
    });

    await setConfirmationEmailSent(order.id);
  }

  return order;
}
