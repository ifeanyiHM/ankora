"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OrderTimeline } from "@/components/track/OrderTimeline";
import { formatNaira } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/types";
import { trackOrderAction, type TrackOrderResult } from "@/app/(storefront)/track-order/actions";

const input = "h-12 w-full rounded-lg border border-ink/25 bg-white px-4 text-base outline-none transition focus:border-green focus:ring-1 focus:ring-green xl1:h-[3.25rem] xl1:px-[1.125rem] xl1:text-[1.05rem] xl2:h-14 xl3:text-lg";

export function TrackOrderForm({ initialOrderNumber = "" }: { initialOrderNumber?: string }) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackOrderResult | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await trackOrderAction(orderNumber, contact);
    setResult(res);
    setLoading(false);
  }

  const order = result?.order;

  return (
    <div className="grid gap-10 lg:grid-cols-[24rem_1fr] xl1:grid-cols-[28rem_1fr] xl1:gap-16 xl2:gap-20 xl3:grid-cols-[32rem_1fr] xl3:gap-24 xl4:gap-28">
      <form onSubmit={onSubmit} className="lg:sticky lg:top-44 lg:self-start">
        <div className="grid gap-4 xl1:gap-5 xl3:gap-6">
          <div>
            <label htmlFor="orderNumber" className="mb-1.5 block text-sm font-semibold xl1:mb-2 xl1:text-base xl3:text-lg">Order number</label>
            <input id="orderNumber" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="ANK-20260928-00124" className={`${input} font-mono uppercase tracking-wide placeholder:normal-case placeholder:tracking-normal`} />
          </div>
          <div>
            <label htmlFor="contact" className="mb-1.5 block text-sm font-semibold xl1:mb-2 xl1:text-base xl3:text-lg">Email or phone number</label>
            <input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="you@example.com or 0803 123 4567" className={input} />
          </div>
          {result && !result.ok && <p role="alert" className="rounded-lg border border-danger/40 bg-danger/5 p-3 text-sm text-danger xl1:p-4 xl1:text-base">{result.error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            <Search className="size-4" /> {loading ? "Looking up your order..." : "Track order"}
          </Button>
        </div>
      </form>

      <div>
        {!result && <p className="text-muted xl1:text-lg xl3:text-xl">Enter your order number and the email or phone you used at checkout to see its status.</p>}
        {order && (
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6 xl1:pb-8 xl3:pb-10">
              <div>
                <p className="text-sm text-muted xl1:text-base">Order number</p>
                <p className="text-2xl font-bold xl1:text-3xl xl3:text-4xl">{order.orderNumber}</p>
                <p className="mt-1 text-sm text-muted xl1:text-base">Placed {new Date(order.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted xl1:text-base">Payment status</p>
                <p className={`text-lg font-bold xl1:text-xl xl3:text-2xl ${order.paymentStatus === "PAID" ? "text-green-dark" : order.paymentStatus === "FAILED" ? "text-danger" : "text-gold-dark"}`}>
                  {order.paymentStatus === "PAID" ? "Paid" : order.paymentStatus === "FAILED" ? "Failed" : "Pending"}
                </p>
                <p className="mt-1 text-sm text-muted xl1:text-base">Order status</p>
                <p className="font-semibold xl1:text-lg xl3:text-xl">{ORDER_STATUS_LABELS[order.status]}</p>
              </div>
            </div>

            <div className="py-8 xl1:py-10 xl3:py-12"><OrderTimeline status={order.status} /></div>

            {order.trackingNumber && (
              <div className="mb-8 rounded-lg bg-surface p-4 xl1:p-5 xl3:p-6">
                <p className="text-sm text-muted xl1:text-base">Tracking number</p>
                <p className="font-semibold xl1:text-lg">{order.trackingNumber}{order.courier ? ` · ${order.courier}` : ""}</p>
              </div>
            )}

            <h2 className="mb-3 text-lg font-bold xl1:mb-4 xl1:text-xl xl3:text-2xl">Items</h2>
            <ul className="divide-y divide-line border-y border-line">
              {order.items.map((i) => (
                <li key={i.id} className="flex justify-between gap-4 py-3 xl1:py-4 xl1:text-lg xl3:py-5 xl3:text-xl">
                  <span>{i.name} <span className="text-muted">× {i.quantity} {i.unitLabel}</span></span>
                  <span className="font-semibold">{formatNaira(i.price * i.quantity)}</span>
                </li>
              ))}
              <li className="flex justify-between py-3 text-muted xl1:py-4 xl1:text-lg xl3:py-5 xl3:text-xl"><span>Delivery</span><span>{order.delivery ? formatNaira(order.delivery) : "Free"}</span></li>
              <li className="flex justify-between py-3 text-lg font-bold xl1:py-4 xl1:text-xl xl3:py-5 xl3:text-2xl"><span>Total</span><span>{formatNaira(order.total)}</span></li>
            </ul>

            <h2 className="mb-3 mt-8 text-lg font-bold xl1:mt-10 xl1:text-xl xl3:mt-12 xl3:text-2xl">Shipping information</h2>
            <div className="grid gap-1 text-[0.95rem] xl1:gap-1.5 xl1:text-base xl3:text-lg">
              <p>{order.fullName}</p>
              <p className="text-muted">{order.address}, {order.city}, {order.state}</p>
              <p className="text-muted">{order.phone} · {order.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
