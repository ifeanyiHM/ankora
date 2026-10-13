import { getOrderByPaystackRef, markOrderFailed } from "@/lib/db/orders";
import { confirmOrderPayment } from "@/lib/orders";
import {
  isValidWebhookSignature,
  type PaystackTransaction,
} from "@/lib/paystack";
import { NextResponse } from "next/server";

/** Configure this endpoint in Paystack Dashboard -> Settings -> API Keys & Webhooks. */
export async function POST(req: Request) {
  const raw = await req.text();
  let valid = false;

  try {
    valid = isValidWebhookSignature(
      raw,
      req.headers.get("x-paystack-signature"),
    );
  } catch {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event: string; data: PaystackTransaction };

  try {
    event = JSON.parse(raw) as {
      event: string;
      data: PaystackTransaction;
    };
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (event.event === "charge.success") {
    await confirmOrderPayment(event.data);
  } else if (event.event === "charge.failed") {
    const order = await getOrderByPaystackRef(event.data.reference);

    if (order) {
      await markOrderFailed(order.id);
    }
  }

  return NextResponse.json({ received: true });
}
