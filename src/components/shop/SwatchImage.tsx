"use client";

import { FabricArt } from "@/components/art/FabricArt";
import { cn } from "@/lib/cn";
import type { Category, FabricPattern, Product } from "@/types";
import Image from "next/image";
import { useState } from "react";

interface BaseProps {
  src: string | null;
  pattern: FabricPattern;
  colors: string[];
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/** Shows the photo when one is set, and the generated fabric swatch when not (or if the photo fails to load). */
export function SwatchImage({
  src,
  pattern,
  colors,
  alt,
  sizes,
  priority,
  className,
}: BaseProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showPhoto = src && failedSrc !== src;

  return (
    <div className={cn("relative overflow-hidden bg-surface", className)}>
      {showPhoto ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <div role="img" aria-label={alt} className="absolute inset-0">
          <FabricArt pattern={pattern} colors={colors} className="size-full" />
        </div>
      )}
    </div>
  );
}

export function ProductImage({
  product,
  sizes,
  priority,
  className,
  imageIndex = 0,
}: {
  product: Product;
  sizes: string;
  priority?: boolean;
  className?: string;
  imageIndex?: number;
}) {
  return (
    <SwatchImage
      src={product.images[imageIndex] ?? null}
      pattern={product.pattern}
      colors={product.colors.map((c) => c.hex)}
      alt={`${product.name} fabric`}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}

export function CategoryImage({
  category,
  sampleColors,
  sizes,
  priority,
  className,
}: {
  category: Category;
  sampleColors?: string[];
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <SwatchImage
      src={category.image}
      pattern={category.pattern}
      colors={sampleColors ?? ["#008751", "#D4A017", "#ffffff"]}
      alt={`${category.name} fabric`}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
