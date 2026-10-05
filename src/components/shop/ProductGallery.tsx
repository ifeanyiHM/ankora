"use client";

import { useState } from "react";
import { SwatchImage } from "./SwatchImage";
import { cn } from "@/lib/cn";
import type { Product } from "@/types";

interface Props {
  product: Product;
  sizes: string;
  className?: string;
}

/**
 * Main product photo with a thumbnail strip for the rest of product.images (main image + gallery).
 * Falls back to the generated fabric swatch per-slot, same as SwatchImage/ProductImage do elsewhere.
 * The thumbnail row only appears when there's more than one photo to choose from.
 */
export function ProductGallery({ product, sizes, className }: Props) {
  const images = product.images.length ? product.images : [null];
  const [active, setActive] = useState(0);
  const colors = product.colors.map((c) => c.hex);

  return (
    <div>
      <SwatchImage
        src={images[active] ?? null}
        pattern={product.pattern}
        colors={colors}
        alt={`${product.name} fabric${images.length > 1 ? `, photo ${active + 1} of ${images.length}` : ""}`}
        sizes={sizes}
        priority={active === 0}
        className={className}
      />
      {images.length > 1 && (
        <div role="tablist" aria-label={`${product.name} photos`} className="mt-3 flex gap-2 xl1:mt-4 xl1:gap-3 xl3:mt-5 xl3:gap-4">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show photo ${i + 1} of ${images.length}`}
              onClick={() => setActive(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-[4px] ring-2 transition xl1:size-20 xl3:size-24",
                i === active ? "ring-green" : "ring-transparent hover:ring-ink/20",
              )}
            >
              <SwatchImage src={src} pattern={product.pattern} colors={colors} alt="" sizes="96px" className="size-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
