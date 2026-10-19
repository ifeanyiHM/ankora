import { ProductGrid } from "@/components/shop/ProductCard";
import { SortSelect } from "@/components/shop/SortSelect";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
  getAllProducts,
  getCategories,
  getCategory,
  getProductsByCategory,
  parseSort,
  searchProducts,
  sortProducts,
} from "@/lib/catalog";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CategoryScrollButtons } from "../../../components/shop/CategoryScrollButton";
import { cn } from "../../../lib/cn";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All fabrics",
  description:
    "Browse every Nigerian and African fabric in the Ankora catalogue.",
};

type Params = { category?: string; sort?: string; q?: string };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const {
    category: categorySlug,
    sort: sortParam,
    q = "",
  } = await searchParams;
  const sort = parseSort(sortParam);
  const [categories, active] = await Promise.all([
    getCategories(),
    categorySlug ? getCategory(categorySlug) : Promise.resolve(null),
  ]);

  const base = active
    ? await getProductsByCategory(active.slug)
    : await getAllProducts();
  const products = sortProducts(searchProducts(base, q), sort);

  const href = (slug?: string) => {
    const p = new URLSearchParams();
    if (slug) p.set("category", slug);
    if (q) p.set("q", q);
    if (sort !== "featured") p.set("sort", sort);
    const s = p.toString();
    return s ? `/shop?${s}` : "/shop";
  };
  const chip =
    "shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-sm transition-colors lg:rounded-md lg:px-3 lg:py-2 xl1:text-[0.95rem] xl3:px-3.5 xl3:py-2.5 xl3:text-base";

  return (
    <Container className="py-6 md:py-12 xl1:py-16 xl2:py-18 xl3:py-20 xl4:py-24">
      <div className="mb-8 flex flex-wrap items-baseline lg:items-end justify-between gap-4 lg:border-t border-ink pt-5 xl1:mb-10 xl1:pt-6 xl3:mb-12 xl3:pt-7 xl4:mb-14">
        <div>
          <h1 className="md:hidden text-3xl font-bold tracking-tight md:text-5xl xl1:text-6xl xl3:text-7xl xl4:text-[5rem]">
            {q ? `Results for “${q}”` : active ? active.name : "Fabrics"}
          </h1>
          <h1 className="hidden md:block text-3xl font-bold tracking-tight md:text-5xl xl1:text-6xl xl3:text-7xl xl4:text-[5rem]">
            {q ? `Results for “${q}”` : active ? active.name : "All fabrics"}
          </h1>
          <p className="lg:mt-2 text-muted xl1:text-lg xl3:mt-3 xl3:text-xl">
            {products.length} {products.length === 1 ? "variety" : "varieties"}
          </p>
        </div>
        <Suspense fallback={null}>
          <SortSelect value={sort} />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] xl1:grid-cols-[16rem_minmax(0,1fr)] xl2:grid-cols-[17rem_minmax(0,1fr)] xl3:grid-cols-[18rem_minmax(0,1fr)] xl4:grid-cols-[20rem_minmax(0,1fr)] xl4:gap-20">
        <nav
          aria-label="Filter by fabric"
          className="lg:sticky lg:top-44 lg:self-start"
        >
          <div className="mb-3 hidden items-center justify-between lg:flex xl1:mb-4">
            <p className="text-sm font-semibold xl1:text-base xl3:text-lg">
              Fabric
            </p>

            <CategoryScrollButtons />
          </div>

          <ul
            id="fabric-category-list"
            className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:h-[calc(100vh-14rem)] lg:max-h-[calc(100vh-14rem)] lg:flex-col lg:gap-0.5 lg:overflow-x-hidden lg:overflow-y-auto lg:overscroll-y-contain lg:px-0"
          >
            <li className="shrink-0">
              <Link
                href={href()}
                aria-current={!active ? "page" : undefined}
                className={cn(
                  chip,
                  "block",
                  !active
                    ? "bg-ink font-semibold text-white"
                    : "bg-surface lg:bg-transparent lg:hover:bg-surface-2",
                )}
              >
                All Fabrics
              </Link>
            </li>

            {categories.map((c) => (
              <li key={c.slug} className="shrink-0">
                <Link
                  href={href(c.slug)}
                  aria-current={active?.slug === c.slug ? "page" : undefined}
                  className={cn(
                    chip,
                    "block",
                    active?.slug === c.slug
                      ? "bg-ink font-semibold text-white"
                      : "bg-surface lg:bg-transparent lg:hover:bg-surface-2",
                  )}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {products.length ? (
          <ProductGrid products={products} columns="sidebar" />
        ) : (
          <div className="py-16 text-center">
            <p className="text-xl font-semibold">
              No fabrics match that search
            </p>
            <p className="mt-2 text-muted">
              Try a fabric name like ankara or lace, or a colour like blue.
            </p>
            <ButtonLink href="/shop" className="mt-6">
              Clear search
            </ButtonLink>
          </div>
        )}
      </div>
    </Container>
  );
}
