import { AddToCart } from "@/components/shop/AddToCart";
import { ProductGrid } from "@/components/shop/ProductCard";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { StockBadge } from "@/components/shop/StockBadge";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/config/site";
import { getProduct, getRelatedProducts } from "@/lib/catalog";
import { formatNaira } from "@/lib/format";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.name}: ${product.categoryName} fabric. ${formatNaira(product.price)} per ${product.unit.name}.`,
    alternates: { canonical: `/product/${product.slug}` },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const details: [string, string][] = [
    ["Sold by the", product.unit.name],
    ["Category", product.categoryName],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.categoryName,
    image: product.images,
    offers: {
      "@type": "Offer",
      priceCurrency: SITE.currency,
      price: product.price,
      url: `${SITE.url}/product/${product.slug}`,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <Container className="py-8 md:py-12 xl1:py-16 xl2:py-18 xl3:py-20 xl4:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <nav
        aria-label="Breadcrumb"
        className="mb-6 text-sm text-muted xl1:mb-8 xl1:text-base xl3:text-lg"
      >
        <Link href="/shop" className="hover:text-ink">
          Fabrics
        </Link>{" "}
        /{" "}
        <Link
          href={`/category/${product.categorySlug}`}
          className="hover:text-ink"
        >
          {product.categoryName}
        </Link>{" "}
        / <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14 xl1:gap-20 xl2:gap-24 xl3:grid-cols-[1.2fr_1fr] xl3:gap-28 xl4:gap-32">
        <div className="lg:sticky lg:top-44 lg:self-start">
          <ProductGallery
            product={product}
            sizes="(min-width:1024px) 55vw, 100vw"
            className="aspect-4/5 rounded-sm md:aspect-5/4 lg:aspect-4/5"
          />
        </div>

        <div>
          <div className="mb-3 flex flex-wrap gap-2 xl1:mb-4 xl1:gap-2.5 xl3:mb-5">
            {product.badge && (
              <span className="inline-block rounded-full bg-gold-tint px-3 py-1 text-sm font-semibold text-gold-dark xl1:px-3.5 xl1:py-1.5 xl1:text-base xl3:text-lg">
                {product.badge}
              </span>
            )}
            <StockBadge
              stock={product.stock}
              className="px-3 py-1 text-sm xl1:px-3.5 xl1:py-1.5 xl1:text-base xl3:text-lg"
            />
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl xl1:text-6xl xl3:text-7xl xl4:text-[5rem]">
            {product.name}
          </h1>
          <p className="mt-2 text-lg text-muted xl1:text-xl xl3:mt-3 xl3:text-2xl">
            <Link
              href={`/category/${product.categorySlug}`}
              className="underline decoration-green decoration-2 underline-offset-4 hover:text-ink"
            >
              {product.categoryName}
            </Link>
          </p>
          <p className="mt-5 text-3xl font-bold xl1:mt-6 xl1:text-4xl xl3:mt-7 xl3:text-5xl">
            {formatNaira(product.price)}{" "}
            <span className="text-lg font-normal text-muted xl3:text-xl">
              per {product.unit.name}
            </span>
          </p>

          <div className="mt-6 xl1:mt-8 xl3:mt-10">
            <p className="mb-2 text-sm font-semibold xl1:text-base xl3:text-lg">
              Colours in this cloth
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 xl1:gap-x-6 xl3:gap-x-7">
              {product.colors.map((c) => (
                <li
                  key={c.name}
                  className="flex items-center gap-2 text-sm xl1:text-base xl3:text-lg"
                >
                  <span
                    className="size-5 rounded-full ring-1 ring-ink/20 xl1:size-6 xl3:size-7"
                    style={{ background: c.hex }}
                  />
                  {c.name}
                </li>
              ))}
            </ul>
          </div>

          <AddToCart
            stock={product.stock}
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
          />

          <p className="mt-8 leading-relaxed text-ink-soft xl1:text-lg xl3:mt-10 xl3:text-xl">
            {product.description}
          </p>
          <dl className="mt-8 border-t border-ink xl1:mt-10 xl3:mt-12">
            {details.map(([k, v]) => (
              <div
                key={k}
                className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-line py-3 text-[0.95rem] xl1:grid-cols-[9rem_1fr] xl1:py-3.5 xl1:text-base xl3:grid-cols-[10rem_1fr] xl3:py-4 xl3:text-lg"
              >
                <dt className="text-muted">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-muted xl1:text-base">
            Colours on screen can differ slightly from the cloth.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 xl1:mt-28 xl2:mt-32 xl3:mt-36 xl4:mt-44">
          <div className="mb-8 border-t border-ink pt-5 xl1:mb-12 xl1:pt-6">
            <h2 className="text-2xl font-bold tracking-tight md:text-4xl xl1:text-[2.6rem] xl3:text-5xl">
              More {product.categoryName}
            </h2>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </Container>
  );
}
