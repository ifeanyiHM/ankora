import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cn } from "@/lib/cn";
import { getOrderById } from "@/lib/db/orders";
import { formatNaira } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/types";
import { OrderStatusForm } from "./OrderStatusForm";

export const metadata: Metadata = { title: "Order detail", robots: { index: false } };

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) notFound();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 xl1:mb-8 xl1:gap-4 xl3:mb-10">
        <div>
          <h1 className="text-2xl font-bold xl1:text-3xl xl2:text-4xl xl4:text-[2.6rem]">{order.orderNumber}</h1>
          <p className="text-sm text-muted xl1:mt-1 xl1:text-base xl3:text-lg">Placed {new Date(order.createdAt).toLocaleString("en-NG")}</p>
        </div>
        <span className={cn("rounded-full px-3 py-1.5 text-sm font-semibold xl1:px-4 xl1:py-2 xl1:text-base xl3:px-5 xl3:text-lg", order.paymentStatus === "PAID" ? "bg-green-tint text-green-dark" : order.paymentStatus === "FAILED" ? "bg-danger/10 text-danger" : "bg-gold-tint text-gold-dark")}>
          Payment: {order.paymentStatus === "PAID" ? "Paid" : order.paymentStatus === "FAILED" ? "Failed" : "Pending"}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem] xl1:gap-10 xl1:grid-cols-[1fr_26rem] xl2:grid-cols-[1fr_28rem] xl3:gap-12 xl3:grid-cols-[1fr_32rem] xl4:grid-cols-[1fr_36rem]">
        <div className="grid gap-6 xl1:gap-7 xl3:gap-8">
          <div className="rounded-[4px] border border-line bg-white p-5 xl1:p-6 xl2:p-7 xl3:p-8">
            <h2 className="mb-3 text-lg font-bold xl1:mb-4 xl1:text-xl xl3:text-2xl">Items</h2>
            <ul className="divide-y divide-line">
              {order.items.map((i) => (
                <li key={i.id} className="flex justify-between gap-4 py-2.5 text-sm xl1:py-3 xl1:text-base xl3:py-3.5 xl3:text-lg"><span>{i.name} <span className="text-muted">× {i.quantity} {i.unitLabel}</span></span><span className="font-semibold">{formatNaira(i.price * i.quantity)}</span></li>
              ))}
            </ul>
            <div className="mt-2 space-y-1 border-t border-line pt-2 text-sm xl1:mt-3 xl1:pt-3 xl1:text-base xl3:text-lg">
              <div className="flex justify-between text-muted"><span>Subtotal</span><span>{formatNaira(order.subtotal)}</span></div>
              <div className="flex justify-between text-muted"><span>Delivery</span><span>{order.delivery ? formatNaira(order.delivery) : "Free"}</span></div>
              <div className="flex justify-between text-base font-bold xl1:text-lg xl3:text-xl"><span>Total</span><span>{formatNaira(order.total)}</span></div>
            </div>
          </div>

          <div className="rounded-[4px] border border-line bg-white p-5 xl1:p-6 xl2:p-7 xl3:p-8">
            <h2 className="mb-3 text-lg font-bold xl1:mb-4 xl1:text-xl xl3:text-2xl">Customer and shipping</h2>
            <dl className="grid gap-2 text-sm sm:grid-cols-2 xl1:gap-3 xl1:text-base xl3:text-lg">
              <div><dt className="text-muted">Name</dt><dd className="font-medium">{order.fullName}</dd></div>
              <div><dt className="text-muted">Email</dt><dd className="font-medium">{order.email}</dd></div>
              <div><dt className="text-muted">Phone</dt><dd className="font-medium">{order.phone}</dd></div>
              <div><dt className="text-muted">State</dt><dd className="font-medium">{order.state}</dd></div>
              <div className="sm:col-span-2"><dt className="text-muted">Address</dt><dd className="font-medium">{order.address}, {order.city}</dd></div>
              {order.notes && <div className="sm:col-span-2"><dt className="text-muted">Order notes</dt><dd className="font-medium">{order.notes}</dd></div>}
            </dl>
          </div>

          <div className="rounded-[4px] border border-line bg-white p-5 xl1:p-6 xl2:p-7 xl3:p-8">
            <h2 className="mb-3 text-lg font-bold xl1:mb-4 xl1:text-xl xl3:text-2xl">Status history</h2>
            <ul className="space-y-2 text-sm xl1:space-y-3 xl1:text-base xl3:text-lg">
              {order.statusHistory.map((e) => (
                <li key={e.id} className="flex items-start justify-between gap-4 border-b border-line pb-2 last:border-0 xl1:pb-3">
                  <div><p className="font-medium">{ORDER_STATUS_LABELS[e.status]}</p>{e.note && <p className="text-muted">{e.note}</p>}</div>
                  <p className="shrink-0 text-xs text-muted xl1:text-sm">{new Date(e.createdAt).toLocaleString("en-NG")}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start xl1:top-10"><OrderStatusForm order={order} /></div>
      </div>
    </div>
  );
}
