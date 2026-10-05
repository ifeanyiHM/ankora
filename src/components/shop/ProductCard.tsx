import Link from "next/link";
import { formatNaira } from "@/lib/format";
import type { Product } from "@/types";
import { ProductImage } from "./SwatchImage";
import { QuickAdd } from "./QuickAdd";
import { StockBadge } from "./StockBadge";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const href = `/product/${product.slug}`;
  const soldOut = product.stock <= 0;
  return (
    <article className="group">
      <div className="relative">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
          <ProductImage
            product={product}
            priority={priority}
            className="aspect-[4/5] rounded-[4px]"
            sizes="(min-width:1920px) 16vw, (min-width:1680px) 18vw, (min-width:1280px) 22vw, (min-width:768px) 30vw, 48vw"
          />
          {soldOut && <div className="absolute inset-0 bg-white/45" />}
        </Link>
        <div className="pointer-events-none absolute left-2 top-2 flex flex-col items-start gap-1.5 xl1:left-2.5 xl1:top-2.5 xl3:left-3 xl3:top-3">
          {product.badge && <span className="pointer-events-auto rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink xl1:text-[0.8rem] xl3:px-3 xl3:text-sm">{product.badge}</span>}
          <span className="pointer-events-auto"><StockBadge stock={product.stock} /></span>
        </div>
        <QuickAdd item={{ slug: product.slug, name: product.name, categorySlug: product.categorySlug, categoryName: product.categoryName, pattern: product.pattern, colors: product.colors.map((c) => c.hex), price: product.price, image: product.images[0] ?? null, unit: product.unit }} stock={product.stock} />
      </div>
      <Link href={href} className="mt-3 block xl1:mt-4 xl3:mt-5">
        <h3 className="text-[0.95rem] font-semibold leading-snug decoration-green decoration-2 underline-offset-4 group-hover:underline xl1:text-base xl3:text-[1.05rem] xl4:text-lg">{product.name}</h3>
        <p className="mt-0.5 text-sm text-muted xl3:text-[0.95rem]">{product.categoryName}</p>
        <p className="mt-1.5 text-[0.95rem] font-semibold xl1:text-base xl3:mt-2 xl3:text-lg xl4:text-xl">
          {formatNaira(product.price)} <span className="font-normal text-muted">per {product.unit.name}</span>
        </p>
      </Link>
    </article>
  );
}

export function ProductGrid({ products, columns = "full" }: { products: Product[]; columns?: "full" | "sidebar" }) {
  const cols =
    columns === "sidebar"
      ? "grid-cols-2 md:grid-cols-3 xl1:grid-cols-4 xl2:grid-cols-4 xl3:grid-cols-5 xl4:grid-cols-6"
      : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4 xl1:grid-cols-5 xl2:grid-cols-5 xl3:grid-cols-6 xl4:grid-cols-7";
  return (
    <div className={`grid gap-x-3 gap-y-8 sm:gap-x-4 md:gap-x-5 xl1:gap-x-6 xl1:gap-y-12 xl2:gap-y-14 xl3:gap-x-7 xl3:gap-y-16 xl4:gap-x-8 xl4:gap-y-20 ${cols}`}>
      {products.map((p, i) => <ProductCard key={p.slug} product={p} priority={i < 4} />)}
    </div>
  );
}
