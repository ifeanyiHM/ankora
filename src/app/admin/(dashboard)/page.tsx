import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Package, ShoppingCart, Wallet } from "lucide-react";
import { listProducts } from "@/lib/db/products";
import { countOrdersByStatus, listOrders } from "@/lib/db/orders";
import { formatNaira } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/types";

export const metadata: Metadata = { title: "Admin overview", robots: { index: false } };

export default function AdminOverviewPage() {
  const products = listProducts();
  const lowStock = products.filter((p) => p.active && p.stock > 0 && p.stock <= 3);
  const soldOut = products.filter((p) => p.active && p.stock <= 0);
  const statusCounts = countOrdersByStatus();
  const recentOrders = listOrders({ limit: 8 });
  const paidTotal = listOrders({ limit: 5000 }).filter((o) => o.paymentStatus === "PAID").reduce((sum, o) => sum + o.total, 0);

  const cards = [
    { label: "Products", value: products.length, icon: Package, href: "/admin/products" },
    { label: "Orders", value: recentOrders.length ? Object.values(statusCounts).reduce((a, b) => a + b, 0) : 0, icon: ShoppingCart, href: "/admin/orders" },
    { label: "Paid revenue", value: formatNaira(paidTotal), icon: Wallet, href: "/admin/orders" },
    { label: "Needs attention", value: lowStock.length + soldOut.length, icon: AlertTriangle, href: "/admin/products" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold xl1:mb-8 xl1:text-3xl xl2:text-4xl xl3:mb-10 xl4:text-[2.6rem]">Overview</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl1:gap-5 xl2:gap-6 xl3:gap-7 xl4:gap-8">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-[4px] border border-line bg-white p-5 transition hover:border-ink/30 xl1:p-6 xl2:p-7 xl3:p-8">
            <c.icon className="size-5 text-green xl1:size-6 xl3:size-7" />
            <p className="mt-3 text-2xl font-bold xl1:mt-4 xl1:text-3xl xl2:text-4xl xl4:text-[2.6rem]">{c.value}</p>
            <p className="text-sm text-muted xl1:text-base xl3:text-lg">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_18rem] xl1:mt-14 xl1:gap-10 xl1:grid-cols-[1fr_22rem] xl2:grid-cols-[1fr_24rem] xl3:mt-16 xl3:gap-12 xl3:grid-cols-[1fr_28rem] xl4:grid-cols-[1fr_32rem]">
        <div>
          <h2 className="mb-3 text-lg font-bold xl1:mb-4 xl1:text-xl xl3:text-2xl">Recent orders</h2>
          <div className="overflow-hidden rounded-[4px] border border-line bg-white">
            <table className="w-full text-sm xl1:text-base xl3:text-[1.05rem]">
              <thead className="bg-surface text-left text-muted"><tr><th className="px-4 py-3 font-medium xl1:px-5 xl1:py-4 xl3:px-6 xl3:py-5">Order</th><th className="px-4 py-3 font-medium xl1:px-5 xl1:py-4 xl3:px-6 xl3:py-5">Customer</th><th className="px-4 py-3 font-medium xl1:px-5 xl1:py-4 xl3:px-6 xl3:py-5">Status</th><th className="px-4 py-3 text-right font-medium xl1:px-5 xl1:py-4 xl3:px-6 xl3:py-5">Total</th></tr></thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-line">
                    <td className="px-4 py-3 xl1:px-5 xl1:py-4 xl3:px-6 xl3:py-5"><Link href={`/admin/orders/${o.id}`} className="font-semibold text-green-dark hover:underline">{o.orderNumber}</Link></td>
                    <td className="px-4 py-3 xl1:px-5 xl1:py-4 xl3:px-6 xl3:py-5">{o.fullName}</td>
                    <td className="px-4 py-3 xl1:px-5 xl1:py-4 xl3:px-6 xl3:py-5">{ORDER_STATUS_LABELS[o.status]}</td>
                    <td className="px-4 py-3 text-right font-medium xl1:px-5 xl1:py-4 xl3:px-6 xl3:py-5">{formatNaira(o.total)}</td>
                  </tr>
                ))}
                {!recentOrders.length && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted xl1:py-10">No orders yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-bold xl1:mb-4 xl1:text-xl xl3:text-2xl">Stock alerts</h2>
          <div className="rounded-[4px] border border-line bg-white p-4 xl1:p-5 xl3:p-6">
            {soldOut.length === 0 && lowStock.length === 0 && <p className="text-sm text-muted xl1:text-base">All products are well stocked.</p>}
            {soldOut.map((p) => <Link key={p.id} href={`/admin/products/${p.id}/edit`} className="mb-2 flex items-center justify-between text-sm hover:underline xl1:mb-3 xl1:text-base"><span>{p.name}</span><span className="font-semibold text-danger">Sold out</span></Link>)}
            {lowStock.map((p) => <Link key={p.id} href={`/admin/products/${p.id}/edit`} className="mb-2 flex items-center justify-between text-sm hover:underline xl1:mb-3 xl1:text-base"><span>{p.name}</span><span className="font-semibold text-gold-dark">{p.stock} left</span></Link>)}
          </div>
        </div>
      </div>
    </div>
  );
}
