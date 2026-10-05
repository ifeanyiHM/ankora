"use client";

import { Plus } from "lucide-react";
import { unitLabel } from "@/lib/catalog-utils";
import { useCart } from "@/store/cart";
import type { CartItem } from "@/types";

/** Round "add" button on product cards. Adds the fabric's usual quantity (e.g. 5 yards) and opens the cart. */
export function QuickAdd({ item, stock }: { item: Omit<CartItem, "quantity">; stock: number }) {
  const add = useCart((s) => s.add);
  if (stock <= 0) return null;
  const qty = Math.min(item.unit.defaultQty, stock);
  return (
    <button
      type="button"
      onClick={() => add(item, qty)}
      aria-label={`Add ${qty} ${unitLabel(item.unit, qty)} of ${item.name} to cart`}
      className="absolute bottom-2 right-2 grid size-10 place-items-center rounded-full bg-white text-ink transition hover:bg-green hover:text-white focus-visible:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 xl1:size-11"
    >
      <Plus className="size-5" />
    </button>
  );
}
