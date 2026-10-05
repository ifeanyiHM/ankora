"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { unitLabel } from "@/lib/catalog-utils";
import { formatNaira } from "@/lib/format";
import { useCart } from "@/store/cart";
import type { CartItem } from "@/types";

export function AddToCart({ item, stock }: { item: Omit<CartItem, "quantity">; stock: number }) {
  const max = Math.min(item.unit.max, stock);
  const [qty, setQty] = useState(Math.min(item.unit.defaultQty, Math.max(item.unit.min, max)));
  const add = useCart((s) => s.add);

  if (stock <= 0) {
    return (
      <div className="mt-8 border-t border-line pt-6 xl1:mt-10 xl1:pt-8 xl3:mt-12 xl3:pt-9">
        <p className="rounded-lg bg-surface px-4 py-3 text-center font-semibold text-muted">Currently sold out</p>
        <p className="mt-2 text-center text-sm text-muted">Check back soon, or message us to ask when more arrives.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t border-line pt-6 xl1:mt-10 xl1:pt-8 xl3:mt-12 xl3:pt-9">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold xl1:text-base xl3:text-lg">Quantity <span className="font-normal text-muted">({unitLabel(item.unit, qty)})</span></p>
          <QuantityStepper value={qty} min={item.unit.min} max={max} onChange={setQty} label={`Number of ${item.unit.plural}`} />
        </div>
        <div className="text-right">
          <p className="text-sm text-muted xl1:text-base xl3:text-lg">Total</p>
          <p className="text-2xl font-bold xl1:text-3xl xl3:text-4xl">{formatNaira(item.price * qty)}</p>
        </div>
      </div>
      <Button size="lg" className="mt-6 w-full" onClick={() => add(item, qty)}>
        <ShoppingBag className="size-5" /> Add to cart
      </Button>
      {max < item.unit.max && <p className="mt-2 text-center text-sm text-muted">Only {stock} {unitLabel(item.unit, stock)} in stock.</p>}
    </div>
  );
}
