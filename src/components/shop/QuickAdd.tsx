"use client";

import { unitLabel } from "@/lib/catalog-utils";
import { useCart } from "@/store/cart";
import type { CartItem } from "@/types";
import { Plus } from "lucide-react";

/**
 * Round quick-add button on product cards.
 * Adds the fabric's usual quantity and opens the cart.
 */
export function QuickAdd({
  item,
  stock,
}: {
  item: Omit<CartItem, "quantity">;
  stock: number;
}) {
  const add = useCart((s) => s.add);

  if (stock <= 0) return null;

  const qty = Math.min(item.unit.defaultQty, stock);

  return (
    <button
      type="button"
      onClick={() => add(item, qty)}
      aria-label={`Add ${qty} ${unitLabel(item.unit, qty)} of ${item.name} to cart`}
      className="
        group/quick-add absolute bottom-2.5 right-2.5
        grid size-11 place-items-center rounded-full
        border border-white/20 bg-green text-white
        shadow-[0_3px_12px_rgba(22,61,42,0.22)]
        transition-all duration-200 ease-out
        hover:scale-105 hover:bg-green-dark
        hover:shadow-[0_5px_16px_rgba(22,61,42,0.3)]
        active:scale-95
        focus-visible:opacity-100
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-[#163D2A] focus-visible:ring-offset-2
        lg:size-10 lg:opacity-0 lg:group-hover:opacity-100
        xl1:bottom-3 xl1:right-3 xl1:size-11
        xl3:size-12
      "
    >
      <Plus
        className="size-5 transition-transform duration-200 group-hover/quick-add:rotate-90 xl3:size-[1.35rem]"
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </button>
  );
}
