"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { SwatchImage } from "@/components/shop/SwatchImage";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { unitLabel } from "@/lib/catalog-utils";
import { formatNaira } from "@/lib/format";
import type { CartItem } from "@/types";

interface Props {
  item: CartItem;
  onQuantity: (q: number) => void;
  onRemove: () => void;
  onNavigate?: () => void;
}

export function CartLineItem({ item, onQuantity, onRemove, onNavigate }: Props) {
  return (
    <div className="flex gap-4 xl1:gap-5 xl3:gap-6">
      <Link href={`/product/${item.slug}`} onClick={onNavigate} className="shrink-0" tabIndex={-1} aria-hidden="true">
        <SwatchImage src={item.image} pattern={item.pattern} colors={item.colors} alt={item.name} sizes="96px" className="h-24 w-[4.8rem] rounded-[4px] xl1:h-28 xl1:w-[5.6rem] xl3:h-32 xl3:w-[6.4rem]" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/product/${item.slug}`} onClick={onNavigate} className="block truncate font-semibold hover:underline xl1:text-lg xl3:text-xl">{item.name}</Link>
            <p className="text-sm text-muted xl1:text-base xl3:text-lg">{formatNaira(item.price)} per {item.unit.name}</p>
          </div>
          <button type="button" onClick={onRemove} aria-label={`Remove ${item.name}`} className="grid size-8 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-danger xl1:size-9 xl3:size-10">
            <Trash2 className="size-4 xl3:size-[1.1rem]" />
          </button>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <QuantityStepper size="sm" value={item.quantity} min={item.unit.min} max={item.unit.max} onChange={onQuantity} label={`Quantity of ${item.name}`} />
            <p className="mt-1 text-xs text-muted xl1:text-sm">{unitLabel(item.unit, item.quantity)}</p>
          </div>
          <p className="font-bold xl1:text-lg xl3:text-xl">{formatNaira(item.price * item.quantity)}</p>
        </div>
      </div>
    </div>
  );
}
