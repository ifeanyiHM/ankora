import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { ClearCart } from "@/components/checkout/ClearCart";
import { OrderTimeline } from "@/components/track/OrderTimeline";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { formatNaira } from "@/lib/format";
import { getOrderByPaystackRef } from "@/lib/db/orders";
import { confirmOrderPayment } from "@/lib/orders";
import { verifyTransaction } from "@/lib/paystack";

export const metadata: Metadata = { title: "Order status", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ reference?: string; trxref?: string }> }) {
  const sp = await searchParams;
  const reference = sp.reference ?? sp.trxref;

  let order = reference ? getOrderByPaystackRef(reference) : null;
  let failed = false;

  if (reference && order && order.paymentStatus !== "PAID") {
    try {
      const tx = await verifyTransaction(reference);
      order = (await confirmOrderPayment(tx)) ?? order;
    } catch (e) {
      console.error("[verify]", e);
      failed = true;
    }
  }

  const paid = order?.paymentStatus === "PAID";

  return (
    <Container className="py-14 md:py-20 xl1:py-28 xl2:py-32 xl3:py-36 xl4:py-44">
      <div className="mx-auto max-w-2xl xl1:max-w-3xl xl3:max-w-4xl">
        {paid && order ? (
          <>
            <ClearCart />
            <CheckCircle2 className="size-14 text-green xl1:size-16 xl3:size-20" strokeWidth={1.5} />
            <h1 className="mt-5 text-4xl font-bold tracking-tight xl1:mt-6 xl1:text-5xl xl3:text-6xl">Thank you, your order is paid</h1>
            <p className="mt-3 text-lg text-muted xl1:mt-4 xl1:text-xl xl3:text-2xl">
              We have received {formatNaira(order.total)}. A receipt is on its way to {order.email}. We will contact you on {order.phone} about delivery to {order.address}, {order.city}, {order.state}.
            </p>
            <p className="mt-2 text-sm text-muted xl1:text-base xl3:text-lg">Order number: <span className="font-semibold text-ink">{order.orderNumber}</span></p>

            <div className="mt-8 xl1:mt-10 xl3:mt-12"><OrderTimeline status={order.status} /></div>

            <ul className="mt-8 divide-y divide-line border-y border-line xl1:mt-10 xl1:text-lg xl3:mt-12 xl3:text-xl">
              {order.items.map((i) => (
                <li key={i.id} className="flex justify-between gap-4 py-3 xl1:py-4 xl3:py-5">
                  <span>{i.name} <span className="text-muted">× {i.quantity} {i.unitLabel}</span></span>
                  <span className="font-semibold">{formatNaira(i.price * i.quantity)}</span>
                </li>
              ))}
              <li className="flex justify-between py-3 text-muted xl1:py-4 xl3:py-5"><span>Delivery</span><span>{order.delivery ? formatNaira(order.delivery) : "Free"}</span></li>
              <li className="flex justify-between py-3 text-lg font-bold xl1:py-4 xl1:text-xl xl3:py-5 xl3:text-2xl"><span>Total paid</span><span>{formatNaira(order.total)}</span></li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3 xl1:mt-10 xl1:gap-4 xl3:mt-12">
              <Link href={`/track-order?order=${encodeURIComponent(order.orderNumber)}`} className={buttonClasses("primary", "lg")}>Track this order</Link>
              <Link href="/shop" className={buttonClasses("outline", "lg")}>Continue shopping</Link>
            </div>
          </>
        ) : (
          <>
            <XCircle className="size-14 text-danger xl1:size-16 xl3:size-20" strokeWidth={1.5} />
            <h1 className="mt-5 text-4xl font-bold tracking-tight xl1:mt-6 xl1:text-5xl xl3:text-6xl">{!reference || !order ? "No payment found" : failed ? "We could not confirm your payment" : "Payment was not completed"}</h1>
            <p className="mt-3 text-lg text-muted xl1:mt-4 xl1:text-xl xl3:text-2xl">
              {!reference || !order
                ? "Open this page from the link Paystack sends you after paying."
                : failed
                  ? "If money left your account, do not pay again. Contact us with your order number and we will check."
                  : "You have not been charged. Your cart is saved, so you can try again."}
            </p>
            {order && <p className="mt-2 text-sm text-muted xl1:text-base xl3:text-lg">Order number: <span className="font-semibold text-ink">{order.orderNumber}</span></p>}
            <div className="mt-8 flex flex-wrap gap-3 xl1:mt-10 xl1:gap-4 xl3:mt-12">
              <Link href="/checkout" className={buttonClasses("primary", "lg")}>Back to checkout</Link>
              <Link href="/shop" className={buttonClasses("outline", "lg")}>Keep shopping</Link>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
