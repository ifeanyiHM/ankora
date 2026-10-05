"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { buttonClasses } from "@/components/ui/Button";
import { cartSubtotal } from "@/lib/cart-helpers";
import { useMounted } from "@/lib/use-mounted";
import { useCart } from "@/store/cart";

export function CartPageClient() {
  const mounted = useMounted();
  const { items, setQuantity, remove } = useCart();
  const lines = mounted ? items : [];

  if (!mounted) return <div className="h-64" aria-busy="true" />;

  if (!lines.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center xl1:gap-5 xl1:py-28 xl3:py-32">
        <ShoppingBag className="size-12 text-muted xl1:size-14 xl3:size-16" strokeWidth={1.4} />
        <h2 className="text-2xl font-bold xl1:text-3xl xl3:text-4xl">Your cart is empty</h2>
        <p className="text-muted xl1:text-lg xl3:text-xl">Add a fabric and it will show up here.</p>
        <Link href="/shop" className={buttonClasses("primary", "lg")}>Browse fabrics</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_24rem] xl1:grid-cols-[1fr_28rem] xl1:gap-16 xl2:gap-20 xl3:grid-cols-[1fr_32rem] xl3:gap-24 xl4:gap-28">
      <ul className="divide-y divide-line border-y border-line">
        {lines.map((item) => (
          <li key={item.slug} className="py-5 xl1:py-7 xl3:py-8">
            <CartLineItem item={item} onQuantity={(q) => setQuantity(item.slug, q)} onRemove={() => remove(item.slug)} />
          </li>
        ))}
      </ul>
      <div className="lg:sticky lg:top-44 lg:self-start">
        <OrderSummary subtotal={cartSubtotal(lines)} delivery={null}>
          <Link href="/checkout" className={buttonClasses("primary", "lg", "mt-5 w-full")}>Continue to checkout</Link>
          <Link href="/shop" className="mt-3 block text-center text-sm font-semibold underline decoration-green decoration-2 underline-offset-4">Keep shopping</Link>
        </OrderSummary>
      </div>
    </div>
  );
}
