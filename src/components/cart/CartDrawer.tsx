"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import { SITE } from "@/config/site";
import { formatNaira } from "@/lib/format";
import { cartSubtotal } from "@/lib/cart-helpers";
import { useMounted } from "@/lib/use-mounted";
import { useCart } from "@/store/cart";
import { buttonClasses } from "@/components/ui/Button";
import { CartLineItem } from "./CartLineItem";

export function CartDrawer() {
  const mounted = useMounted();
  const { items, isOpen, close, setQuantity, remove } = useCart();
  const lines = mounted ? items : [];
  const subtotal = cartSubtotal(lines);
  const remaining = Math.max(0, SITE.freeDeliveryThreshold - subtotal);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(o) => (o ? undefined : close())}>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay fixed inset-0 z-50 bg-ink/50" />
        <Dialog.Content aria-describedby={undefined} className="drawer-right fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl xl1:max-w-lg xl2:max-w-xl xl3:max-w-2xl xl4:max-w-3xl">
          <div className="flex items-center justify-between border-b border-line px-5 py-4 xl1:px-7 xl1:py-5 xl3:px-8">
            <Dialog.Title className="text-lg font-bold xl1:text-xl xl3:text-2xl">Your cart</Dialog.Title>
            <Dialog.Close className="grid size-9 place-items-center rounded-full hover:bg-surface-2 xl1:size-10 xl3:size-11" aria-label="Close cart"><X className="size-5 xl1:size-6" /></Dialog.Close>
          </div>

          {lines.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
              <ShoppingBag className="size-10 text-muted" strokeWidth={1.5} />
              <p className="text-lg font-semibold">Your cart is empty</p>
              <p className="text-muted">Pick a fabric family to start.</p>
              <Link href="/shop" onClick={close} className={buttonClasses("primary", "md")}>Browse fabrics</Link>
            </div>
          ) : (
            <>
              <div className="border-b border-line bg-surface px-5 py-3 text-sm xl1:px-7 xl1:py-4 xl1:text-base xl3:px-8">
                {remaining > 0 ? (
                  <p>Add <strong>{formatNaira(remaining)}</strong> more for free delivery.</p>
                ) : (
                  <p className="font-semibold text-green-dark">Your order gets free delivery.</p>
                )}
                <div className="mt-2 h-1.5 rounded-full bg-surface-2">
                  <div className="h-full rounded-full bg-green transition-all" style={{ width: `${Math.min(100, (subtotal / SITE.freeDeliveryThreshold) * 100)}%` }} />
                </div>
              </div>
              <ul className="flex-1 divide-y divide-line overflow-y-auto px-5 xl1:px-7 xl3:px-8">
                {lines.map((item) => (
                  <li key={item.slug} className="py-4 xl1:py-5 xl3:py-6">
                    <CartLineItem item={item} onQuantity={(q) => setQuantity(item.slug, q)} onRemove={() => remove(item.slug)} onNavigate={close} />
                  </li>
                ))}
              </ul>
              <div className="border-t border-line px-5 py-4 xl1:px-7 xl1:py-5 xl3:px-8">
                <div className="flex items-center justify-between text-lg font-bold xl1:text-xl xl3:text-2xl"><span>Subtotal</span><span>{formatNaira(subtotal)}</span></div>
                <p className="mt-1 text-sm text-muted xl1:text-base">Delivery is worked out at checkout from your state.</p>
                <div className="mt-4 grid gap-2">
                  <Link href="/checkout" onClick={close} className={buttonClasses("primary", "lg", "w-full")}>Checkout</Link>
                  <Link href="/cart" onClick={close} className={buttonClasses("outline", "md", "w-full")}>View cart</Link>
                </div>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
