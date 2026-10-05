"use client";

import { ShoppingBag } from "lucide-react";
import { cartCount } from "@/lib/cart-helpers";
import { useMounted } from "@/lib/use-mounted";
import { useCart } from "@/store/cart";

export function CartButton() {
  const mounted = useMounted();
  const open = useCart((s) => s.open);
  const items = useCart((s) => s.items);
  const count = mounted ? cartCount(items) : 0;
  return (
    <button type="button" onClick={open} aria-label={`Open cart${count ? `, ${count} ${count === 1 ? "item" : "items"}` : ""}`} className="relative grid size-11 place-items-center rounded-full hover:bg-surface-2 xl1:size-12">
      <ShoppingBag className="size-[1.4rem]" strokeWidth={1.8} />
      {count > 0 && (
        <span className="absolute right-0.5 top-0.5 grid min-w-5 place-items-center rounded-full bg-green px-1 text-[0.7rem] font-bold leading-5 text-white">{count}</span>
      )}
    </button>
  );
}
