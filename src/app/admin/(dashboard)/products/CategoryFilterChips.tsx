"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Category } from "@/types";

interface Props {
  categories: Category[];
  activeSlug?: string;
  /** Page the chips link to, e.g. "/admin/products"; each chip appends ?category=<slug>. */
  basePath: string;
}

const chip =
  "shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors xl1:px-3.5 xl1:py-2 xl1:text-[0.95rem] xl3:px-4 xl3:text-base";

/** A horizontally scrolling row of filter chips, with left/right arrow buttons on the right
 *  side to scroll chips that are cut off into view. The arrows disable themselves at each end. */
export function CategoryFilterChips({ categories, activeSlug, basePath }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const href = (slug?: string) => (slug ? `${basePath}?category=${slug}` : basePath);

  const updateScrollState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    updateScrollState();
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.length]);

  const scrollBy = (direction: 1 | -1) => scrollerRef.current?.scrollBy({ left: direction * 220, behavior: "smooth" });

  return (
    <div className="mb-4 flex items-center gap-2 xl1:mb-6 xl1:gap-3 xl3:mb-8">
      <div ref={scrollerRef} className="no-scrollbar flex flex-1 gap-1.5 overflow-x-auto xl1:gap-2">
        <Link href={href()} className={cn(chip, !activeSlug ? "bg-ink text-white" : "bg-surface hover:bg-surface-2")}>
          All categories
        </Link>
        {categories.map((c) => (
          <Link key={c.slug} href={href(c.slug)} className={cn(chip, activeSlug === c.slug ? "bg-ink text-white" : "bg-surface hover:bg-surface-2")}>
            {c.name}
          </Link>
        ))}
      </div>
      <div className="flex shrink-0 items-center gap-1 xl1:gap-1.5">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          disabled={!canScrollLeft}
          aria-label="Scroll categories left"
          className="grid size-8 place-items-center rounded-full border border-ink/15 text-ink transition hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent xl1:size-9"
        >
          <ChevronLeft className="size-4 xl1:size-[1.1rem]" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          disabled={!canScrollRight}
          aria-label="Scroll categories right"
          className="grid size-8 place-items-center rounded-full border border-ink/15 text-ink transition hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent xl1:size-9"
        >
          <ChevronRight className="size-4 xl1:size-[1.1rem]" />
        </button>
      </div>
    </div>
  );
}
