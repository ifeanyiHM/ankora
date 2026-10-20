"use client";

import { cn } from "@/lib/cn";
import type { Product } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SwatchImage } from "./SwatchImage";

interface Props {
  product: Product;
  sizes: string;
  className?: string;
}

/**
 * Main product photo with a thumbnail strip for the rest of product.images (main image + gallery).
 * Falls back to the generated fabric swatch per-slot, same as SwatchImage/ProductImage do elsewhere.
 * The thumbnail row only appears when there's more than one photo to choose from.
 * If thumbnails are hidden off either edge, a round arrow button floats over that edge
 * (it takes no space from the row) and disappears once there is nothing left to scroll to.
 */
export function ProductGallery({ product, sizes, className }: Props) {
  const images = product.images.length ? product.images : [null];
  const [active, setActive] = useState(0);
  const colors = product.colors.map((c) => c.hex);

  const stripRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;

    const update = () => {
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [images.length]);

  const scrollStrip = (direction: 1 | -1) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * Math.max(120, el.clientWidth * 0.8),
      behavior: "smooth",
    });
  };

  const arrow =
    "absolute top-1/2 z-10 hidden size-7 -translate-y-1/2 place-items-center lg:grid rounded-full border border-white/60 bg-white/85 text-ink shadow-[0_2px_10px_rgba(22,61,42,0.18)] backdrop-blur-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green xl1:size-8";

  return (
    <div className="min-w-0">
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
        <div className="relative mt-3 min-w-0 max-w-full xl1:mt-4 xl3:mt-5">
          <div
            ref={stripRef}
            role="tablist"
            aria-label={`${product.name} photos`}
            className="no-scrollbar flex gap-2 overflow-x-auto overscroll-x-contain py-1 xl1:gap-3 xl3:gap-4"
          >
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Show photo ${i + 1} of ${images.length}`}
                onClick={() => setActive(i)}
                className={cn(
                  "relative size-16 shrink-0 overflow-hidden rounded-sm ring-2 ring-inset transition xl1:size-20 xl3:size-24",
                  i === active
                    ? "ring-green"
                    : "ring-transparent hover:ring-ink/20",
                )}
              >
                <SwatchImage
                  src={src}
                  pattern={product.pattern}
                  colors={colors}
                  alt=""
                  sizes="96px"
                  className="size-full"
                />
              </button>
            ))}
          </div>

          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollStrip(-1)}
              aria-label="Scroll photos left"
              className={cn(arrow, "left-1")}
            >
              <ChevronLeft className="size-3.5 xl1:size-4" />
            </button>
          )}

          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollStrip(1)}
              aria-label="Scroll photos right"
              className={cn(arrow, "right-1")}
            >
              <ChevronRight className="size-3.5 xl1:size-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
