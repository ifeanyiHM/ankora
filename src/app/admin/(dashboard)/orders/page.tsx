import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { listOrders } from "@/lib/db/orders";
import { formatNaira } from "@/lib/format";
import { ORDER_STATUS_LABELS, ORDER_STATUSES, type OrderStatus } from "@/types";

export const metadata: Metadata = { title: "Orders", robots: { index: false } };

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const { status, q } = await searchParams;
  const activeStatus = ORDER_STATUSES.includes(status as OrderStatus) ? (status as OrderStatus) : undefined;
  const orders = listOrders({ status: activeStatus, search: q });

  const chip = "shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium xl1:px-3.5 xl1:py-2 xl1:text-[0.95rem] xl3:px-4 xl3:text-base";
  const href = (s?: OrderStatus) => {
    const p = new URLSearchParams();
    if (s) p.set("status", s);
    if (q) p.set("q", q);
    const qs = p.toString();
    return qs ? `/admin/orders?${qs}` : "/admin/orders";
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold xl1:mb-8 xl1:text-3xl xl2:text-4xl xl4:text-[2.6rem]">Orders</h1>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 xl1:mb-6 xl1:gap-5 xl3:mb-8">
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto xl1:gap-2">
          <Link href={href()} className={cn(chip, !activeStatus ? "bg-ink text-white" : "bg-white text-ink hover:bg-surface-2")}>All</Link>
          {ORDER_STATUSES.map((s) => (
            <Link key={s} href={href(s)} className={cn(chip, activeStatus === s ? "bg-ink text-white" : "bg-white text-ink hover:bg-surface-2")}>{ORDER_STATUS_LABELS[s]}</Link>
          ))}
        </div>
        <form action="/admin/orders" method="get">
          {activeStatus && <input type="hidden" name="status" value={activeStatus} />}
          <input name="q" defaultValue={q} placeholder="Search order #, name, email, phone" className="h-10 w-64 rounded-full border border-ink/25 bg-white px-4 text-sm outline-none focus:border-green xl1:h-11 xl1:w-72 xl1:text-base xl3:h-12 xl3:w-80" />
        </form>
      </div>

      <div className="overflow-x-auto rounded-[4px] border border-line bg-white">
        <table className="w-full text-sm xl1:text-base xl3:text-[1.05rem]">
          <thead className="bg-surface text-left text-muted">
            <tr><th className="px-4 py-3 font-medium xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">Order</th><th className="px-4 py-3 font-medium xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">Customer</th><th className="px-4 py-3 font-medium xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">Payment</th><th className="px-4 py-3 font-medium xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">Status</th><th className="px-4 py-3 text-right font-medium xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">Total</th><th className="px-4 py-3 font-medium xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">Date</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-line">
                <td className="px-4 py-3 xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5"><Link href={`/admin/orders/${o.id}`} className="font-semibold text-green-dark hover:underline">{o.orderNumber}</Link></td>
                <td className="px-4 py-3 xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">{o.fullName}<br /><span className="text-xs text-muted xl1:text-sm">{o.email}</span></td>
                <td className="px-4 py-3 xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold xl1:px-3 xl1:py-1.5 xl1:text-sm", o.paymentStatus === "PAID" ? "bg-green-tint text-green-dark" : o.paymentStatus === "FAILED" ? "bg-danger/10 text-danger" : "bg-gold-tint text-gold-dark")}>
                    {o.paymentStatus === "PAID" ? "Paid" : o.paymentStatus === "FAILED" ? "Failed" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3 xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">{ORDER_STATUS_LABELS[o.status]}</td>
                <td className="px-4 py-3 text-right xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5 font-medium">{formatNaira(o.total)}</td>
                <td className="px-4 py-3 xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5 text-muted">{new Date(o.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</td>
              </tr>
            ))}
            {!orders.length && <tr><td colSpan={6} className="px-4 py-10 text-center text-muted xl1:py-14">No orders match.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
