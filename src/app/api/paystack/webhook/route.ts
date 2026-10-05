import { NextResponse } from "next/server";
import { confirmOrderPayment } from "@/lib/orders";
import { markOrderFailed, getOrderByPaystackRef } from "@/lib/db/orders";
import { isValidWebhookSignature, type PaystackTransaction } from "@/lib/paystack";

/** Set this URL in Paystack Dashboard -> Settings -> API Keys & Webhooks: https://YOUR-DOMAIN/api/paystack/webhook */
export async function POST(req: Request) {
  const raw = await req.text();
  let valid = false;
  try {
    valid = isValidWebhookSignature(raw, req.headers.get("x-paystack-signature"));
  } catch {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }
  if (!valid) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

  const event = JSON.parse(raw) as { event: string; data: PaystackTransaction };
  if (event.event === "charge.success") {
    await confirmOrderPayment(event.data);
  } else if (event.event === "charge.failed") {
    const order = getOrderByPaystackRef(event.data.reference);
    if (order) markOrderFailed(order.id);
  }
  return NextResponse.json({ received: true });
}
