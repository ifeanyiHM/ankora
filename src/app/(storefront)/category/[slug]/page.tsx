import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/components/shop/ProductCard";
import { CategoryImage } from "@/components/shop/SwatchImage";
import { SortSelect } from "@/components/shop/SortSelect";
import { getCategories, getCategory, getProductsByCategory, parseSort, sortProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const category = await getCategory((await params).slug);
  if (!category) return {};
  return { title: category.name, description: `${category.tagline}. ${category.description}`, alternates: { canonical: `/category/${category.slug}` } };
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ sort?: string }> }) {
  const category = await getCategory((await params).slug);
  if (!category) notFound();
  const sort = parseSort((await searchParams).sort);
  const [products, allCategories] = await Promise.all([getProductsByCategory(category.slug), getCategories()]);
  const sorted = sortProducts(products, sort);
  const others = allCategories.filter((c) => c.slug !== category.slug);
  const facts: [string, string][] = [["Origin", category.origin], ["Sold by the", category.unit.name], ["Material", category.material], ["Width", category.width], ["Care", category.care]];

  return (
    <>
      <section className="bg-surface">
        <Container className="grid items-center gap-8 py-10 md:grid-cols-[1.2fr_1fr] md:py-14 xl1:gap-16 xl1:py-20 xl2:py-24 xl3:grid-cols-[1.4fr_1fr] xl3:gap-20 xl3:py-28 xl4:py-32">
          <div>
            <nav aria-label="Breadcrumb" className="mb-5 text-sm text-muted">
              <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/shop" className="hover:text-ink">Fabrics</Link> / <span className="text-ink">{category.name}</span>
            </nav>
            <h1 className="text-[2.6rem] font-bold leading-none tracking-tight md:text-6xl xl1:text-7xl xl3:text-[5.2rem] xl4:text-[6rem]">{category.name}</h1>
            <p className="mt-4 text-xl font-medium xl1:text-2xl xl3:mt-5 xl3:text-[1.7rem]">{category.tagline}</p>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted xl1:mt-6 xl1:text-xl xl2:max-w-3xl xl3:text-[1.35rem] xl4:max-w-4xl">{category.description}</p>
            <ul className="mt-6 flex flex-wrap gap-2 xl1:mt-8 xl1:gap-3 xl3:gap-3.5">
              {category.uses.map((u) => <li key={u} className="rounded-full bg-white px-3.5 py-1.5 text-sm font-medium xl1:px-4 xl1:py-2 xl1:text-base xl3:px-5 xl3:text-lg">{u}</li>)}
            </ul>
          </div>
          <CategoryImage category={category} sampleColors={products[0]?.colors.map((c) => c.hex)} priority sizes="(min-width:1024px) 40vw, 100vw" className="aspect-[5/4] rounded-[4px] md:aspect-[4/5] xl1:aspect-[5/4]" />
        </Container>
      </section>

      <Container className="py-12 xl1:py-20 xl2:py-24 xl3:py-28 xl4:py-32">
        <div className="mb-8 flex items-end justify-between gap-4 border-t border-ink pt-5 xl1:mb-12 xl1:pt-6 xl3:mb-14 xl3:pt-7 xl4:mb-16">
          <h2 className="text-2xl font-bold tracking-tight md:text-4xl xl1:text-[2.6rem] xl3:text-5xl xl4:text-[3.2rem]">{sorted.length} {category.name} varieties</h2>
          <Suspense fallback={null}><SortSelect value={sort} /></Suspense>
        </div>
        {sorted.length ? <ProductGrid products={sorted} /> : <p className="py-12 text-center text-muted">No varieties are listed for {category.name} right now.</p>}
      </Container>

      <Container className="pb-4">
        <div className="border-t border-ink pt-5">
          <h2 className="text-2xl font-bold tracking-tight xl1:text-3xl xl3:text-4xl">About {category.name}</h2>
          <dl className="mt-6 grid gap-x-10 md:grid-cols-2 xl1:gap-x-20 xl1:mt-8 xl3:gap-x-24 xl4:mt-10">
            {facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 border-b border-line py-3.5 xl1:grid-cols-[10rem_1fr] xl1:py-4 xl1:text-lg xl3:grid-cols-[11rem_1fr] xl3:py-5 xl3:text-xl xl4:grid-cols-[12rem_1fr]">
                <dt className="text-muted">{k}</dt><dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-14 xl1:mt-20 xl3:mt-24">
          <h2 className="text-xl font-bold xl1:text-2xl xl3:text-3xl">Other fabrics</h2>
          <ul className="mt-4 flex flex-wrap gap-2 xl1:mt-6 xl1:gap-3">
            {others.map((c) => <li key={c.slug}><Link href={`/category/${c.slug}`} className="inline-block rounded-full bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-2 xl1:text-base xl1:px-5 xl1:py-2.5 xl3:text-lg">{c.name}</Link></li>)}
          </ul>
        </div>
      </Container>
    </>
  );
}
