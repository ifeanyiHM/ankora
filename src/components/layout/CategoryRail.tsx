"use client";

import { cn } from "@/lib/cn";
import type { Category } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** Horizontal list of the 14 fabric families, shown under the header on desktop.
 *  Below xl2 (where the row can overflow) a pair of arrow buttons on the right scrolls it;
 *  at xl2 and up the items spread out with justify-between and nothing overflows, so the
 *  arrows hide themselves. */
export function CategoryRail({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  const scrollBy = (direction: 1 | -1) =>
    scrollerRef.current?.scrollBy({
      left: direction * 220,
      behavior: "smooth",
    });

  const item =
    "shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors xl1:px-3.5 xl1:py-2 xl1:text-[0.95rem] xl2:px-4 xl3:px-[1.125rem] xl3:text-base xl4:px-5";

  return (
    <nav
      aria-label="Fabric categories"
      className="hidden border-t border-line lg:block"
    >
      <div className="mx-auto w-full px-10 xl:max-w-296 xl1:max-w-328 xl1:px-12 xl2:max-w-352 xl2:px-14 xl3:max-w-368 xl3:px-16 xl4:max-w-[100rem] xl4:px-20">
        <div className="flex items-center gap-2 xl1:gap-3">
          <ul
            ref={scrollerRef}
            className="no-scrollbar -mx-3 flex flex-1 items-center gap-0.5 overflow-x-auto py-2 xl1:py-2.5 xl2:justify-between xl2:gap-0 xl3:py-3"
          >
            <li>
              <Link
                href="/shop"
                className={cn(
                  item,
                  "font-semibold",
                  pathname === "/shop"
                    ? "bg-ink text-white"
                    : "hover:bg-surface-2",
                )}
              >
                All fabrics
              </Link>
            </li>
            {categories.map((c) => {
              const active = pathname === `/category/${c.slug}`;
              return (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      item,
                      active
                        ? "bg-green-tint font-semibold text-green-dark"
                        : "text-ink-soft hover:bg-surface-2",
                    )}
                  >
                    {c.name}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex shrink-0 items-center gap-1 xl2:hidden">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={!canScrollLeft}
              aria-label="Scroll categories left"
              className="grid size-7 place-items-center rounded-full border border-ink/15 text-ink transition hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent xl1:size-8"
            >
              <ChevronLeft className="size-3.5 xl1:size-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={!canScrollRight}
              aria-label="Scroll categories right"
              className="grid size-7 place-items-center rounded-full border border-ink/15 text-ink transition hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent xl1:size-8"
            >
              <ChevronRight className="size-3.5 xl1:size-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// "use client";

// import { cn } from "@/lib/cn";
// import type { Category } from "@/types";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// /** Horizontal list of the 14 fabric families, shown under the header on desktop. */
// export function CategoryRail({ categories }: { categories: Category[] }) {
//   const pathname = usePathname();
//   const item =
//     "shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors xl1:px-3.5 xl1:py-2 xl1:text-[0.95rem] xl2:px-4 xl3:px-[1.125rem] xl3:text-base xl4:px-5";
//   return (
//     <nav
//       aria-label="Fabric categories"
//       className="hidden border-t border-line lg:block"
//     >
//       <div className="mx-auto w-full px-10 xl:max-w-296 xl1:max-w-328 xl1:px-12 xl2:max-w-352 xl2:px-14 xl3:max-w-368 xl3:px-16 xl4:max-w-[100rem] xl4:px-20">
//         <ul className="no-scrollbar -mx-3 flex items-center gap-0.5 overflow-x-auto py-2 xl1:py-2.5 xl2:justify-between xl2:gap-0 xl3:py-3">
//           <li>
//             <Link
//               href="/shop"
//               className={cn(
//                 item,
//                 "font-semibold",
//                 pathname === "/shop"
//                   ? "bg-ink text-white"
//                   : "hover:bg-surface-2",
//               )}
//             >
//               All fabrics
//             </Link>
//           </li>
//           {categories.map((c) => {
//             const active = pathname === `/category/${c.slug}`;
//             return (
//               <li key={c.slug}>
//                 <Link
//                   href={`/category/${c.slug}`}
//                   aria-current={active ? "page" : undefined}
//                   className={cn(
//                     item,
//                     active
//                       ? "bg-green-tint font-semibold text-green-dark"
//                       : "text-ink-soft hover:bg-surface-2",
//                   )}
//                 >
//                   {c.name}
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//     </nav>
//   );
// }
