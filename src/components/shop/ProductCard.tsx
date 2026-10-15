"use client";

import { formatNaira } from "@/lib/format";
import type { Product } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { QuickAdd } from "./QuickAdd";
import { StockBadge } from "./StockBadge";
import { ProductImage } from "./SwatchImage";

export function ProductCard({
  product,
  priority,
}: {
  product: Product;
  priority?: boolean;
}) {
  const href = `/product/${product.slug}`;
  const soldOut = product.stock <= 0;

  return (
    <article className="group">
      <div className="relative">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
          <ProductImage
            product={product}
            priority={priority}
            className="aspect-4/5 rounded-sm"
            sizes="(min-width:1920px) 16vw, (min-width:1680px) 18vw, (min-width:1280px) 22vw, (min-width:768px) 30vw, 48vw"
          />
          {soldOut && <div className="absolute inset-0 bg-white/45" />}
        </Link>

        <div className="pointer-events-none absolute left-2 top-2 flex flex-col items-start gap-2 xl1:left-2.5 xl1:top-2.5 xl3:left-3 xl3:top-3">
          {product.badge && (
            <span className="pointer-events-auto inline-flex items-center rounded-full border border-white/70 bg-[#F8F5EE]/95 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-green shadow-sm backdrop-blur-sm xl1:px-3 xl1:py-1.5 xl1:text-xs">
              {product.badge}
            </span>
          )}

          <span className="pointer-events-auto">
            <StockBadge stock={product.stock} />
          </span>
        </div>

        <QuickAdd
          item={{
            slug: product.slug,
            name: product.name,
            categorySlug: product.categorySlug,
            categoryName: product.categoryName,
            pattern: product.pattern,
            colors: product.colors.map((c) => c.hex),
            price: product.price,
            image: product.images[0] ?? null,
            unit: product.unit,
          }}
          stock={product.stock}
        />
      </div>

      <Link href={href} className="mt-3 block xl1:mt-4 xl3:mt-5">
        <h3 className="text-[0.95rem] font-semibold leading-snug decoration-green decoration-2 underline-offset-4 group-hover:underline xl1:text-base xl3:text-[1.05rem] xl4:text-lg">
          {product.name}
        </h3>

        <p className="mt-0.5 text-sm text-muted xl3:text-[0.95rem]">
          {product.categoryName}
        </p>

        <p className="mt-1.5 text-[0.95rem] font-semibold xl1:text-base xl3:mt-2 xl3:text-lg xl4:text-xl">
          {formatNaira(product.price)}{" "}
          <span className="font-normal text-muted">
            per {product.unit.name}
          </span>
        </p>
      </Link>
    </article>
  );
}

export function ProductGrid({
  products,
  columns = "full",
}: {
  products: Product[];
  columns?: "full" | "sidebar";
}) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const updateScreenSize = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateScreenSize();
    mediaQuery.addEventListener("change", updateScreenSize);

    return () => {
      mediaQuery.removeEventListener("change", updateScreenSize);
    };
  }, []);

  // Products per page:
  // Mobile: 8
  // Desktop full grid: 12
  // Desktop sidebar grid: 9
  const pageSize = !isDesktop ? 8 : columns === "sidebar" ? 9 : 12;

  const pageCount = Math.ceil(products.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleProducts = products.slice(startIndex, startIndex + pageSize);

  // Reset pagination when the product list or grid type changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [products, columns]);

  // Keep the selected page valid if the page size changes.
  useEffect(() => {
    setCurrentPage((page) => Math.max(1, Math.min(page, pageCount || 1)));
  }, [pageCount]);

  const cols =
    columns === "sidebar"
      ? "grid-cols-2 md:grid-cols-3"
      : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4";

  // Show up to five page numbers at a time.
  const startPage = Math.max(1, Math.min(currentPage - 2, pageCount - 4));

  const endPage = Math.min(pageCount, startPage + 4);

  const pageNumbers = Array.from(
    { length: Math.max(0, endPage - startPage + 1) },
    (_, index) => startPage + index,
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-w-0">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Page {currentPage} of {Math.max(1, pageCount)}. Showing{" "}
        {visibleProducts.length} products.
      </div>

      <div
        className={`grid gap-x-3 gap-y-8 sm:gap-x-4 md:gap-x-5 xl1:gap-x-6 xl1:gap-y-12 xl2:gap-y-14 xl3:gap-x-7 xl3:gap-y-16 xl4:gap-y-20 ${cols}`}
      >
        {visibleProducts.map((product, index) => (
          <ProductCard
            key={product.slug}
            product={product}
            priority={startIndex + index < 4}
          />
        ))}
      </div>

      {pageCount > 1 && (
        <nav
          aria-label="Product pagination"
          className="mt-10 flex flex-wrap items-center justify-center gap-2 xl1:mt-12 xl3:mt-16"
        >
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line text-ink transition hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-35 xl1:size-11"
          >
            <ChevronLeft className="size-4" />
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              className={`inline-flex size-10 items-center justify-center rounded-full text-sm font-semibold transition xl1:size-11 ${
                currentPage === page
                  ? "bg-green text-white"
                  : "text-ink hover:bg-surface-2"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === pageCount}
            aria-label="Next page"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line text-ink transition hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-35 xl1:size-11"
          >
            <ChevronRight className="size-4" />
          </button>
        </nav>
      )}

      {products.length > 0 && (
        <p className="mt-4 text-center text-sm text-muted">
          Showing {startIndex + 1}–{startIndex + visibleProducts.length} of{" "}
          {products.length} products
        </p>
      )}
    </div>
  );
}
