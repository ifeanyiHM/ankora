import { SITE } from "@/config/site";
import { createOrder } from "@/lib/db/orders";
import { toKobo } from "@/lib/format";
import { generateOrderNumber } from "@/lib/order-number";
import {
  createReference,
  initializeTransaction,
  PaystackConfigError,
  type OrderMetadata,
} from "@/lib/paystack";
import { priceOrder, toNewOrderItems } from "@/lib/pricing";
import { checkoutSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    const field = parsed.error.issues.find((i) => i.path.length > 1);

    return NextResponse.json(
      {
        error:
          field?.message ??
          "Your order could not be read. Refresh and try again.",
      },
      { status: 400 },
    );
  }

  const { customer, items } = parsed.data;

  // Prices, stock, and units always come from the database.
  const priced = await priceOrder(items, customer.state);

  if (priced.unavailable.length) {
    return NextResponse.json(
      {
        error:
          "One or more fabrics in your cart are no longer available. Please review your cart.",
      },
      { status: 409 },
    );
  }

  if (priced.adjusted.length) {
    const adjusted = priced.adjusted[0];

    return NextResponse.json(
      {
        error: `Only ${adjusted.quantity} ${adjusted.unitLabel} of ${adjusted.name} left in stock. Please update your cart.`,
      },
      { status: 409 },
    );
  }

  if (!priced.lines.length) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  const orderNumber = await generateOrderNumber();
  const paystackReference = createReference();

  let order;

  try {
    order = await createOrder({
      orderNumber,
      email: customer.email,
      phone: customer.phone,
      fullName: customer.fullName,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      notes: customer.notes ?? null,
      subtotal: priced.subtotal,
      delivery: priced.delivery,
      total: priced.total,
      paystackRef: paystackReference,
      items: toNewOrderItems(priced.lines),
    });
  } catch (err) {
    console.error("[checkout] Order creation failed:", err);

    return NextResponse.json(
      { error: "We could not create your order. Please try again." },
      { status: 500 },
    );
  }

  const metadata: OrderMetadata = {
    orderNumber: order.orderNumber,
    customer: {
      fullName: customer.fullName,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      state: customer.state,
    },
    cancel_action: `${SITE.url}/checkout?cancelled=1`,
  };

  try {
    const tx = await initializeTransaction({
      email: customer.email,
      amountKobo: toKobo(priced.total),
      reference: paystackReference,
      metadata,
    });

    return NextResponse.json({
      authorizationUrl: tx.authorization_url,
      orderNumber: order.orderNumber,
    });
  } catch (err) {
    console.error("[checkout] Paystack initialize failed:", err);

    const isConfigError = err instanceof PaystackConfigError;
    const msg = isConfigError
      ? "Payments are not set up yet. Please try again later."
      : "We could not start your payment. Please try again.";

    return NextResponse.json(
      { error: msg },
      { status: isConfigError ? 503 : 502 },
    );
  }
}
