import { CategoryTile } from "@/components/shop/CategoryTile";
import { HeroLoom } from "@/components/shop/HeroLoom";
import { ProductGrid } from "@/components/shop/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  getCategories,
  getCategoryProductCounts,
  getFeaturedProducts,
  getProductsByCategory,
} from "@/lib/catalog";
import Link from "next/link";

export const dynamic = "force-dynamic";

const OCCASIONS: { title: string; note: string; fabrics: string[] }[] = [
  {
    title: "Weddings and aso ebi",
    note: "Woven, laced and embroidered cloth for the bride, the family and the guests.",
    fabrics: ["aso-oke", "lace", "george"],
  },
  {
    title: "Men's traditional wear",
    note: "Crisp cloth that holds an agbada, kaftan or senator cut.",
    fabrics: ["guinea-brocade", "damask", "atiku", "senator-material"],
  },
  {
    title: "Ceremony and celebration",
    note: "Statement weaves and rich pile for the days people dress up for.",
    fabrics: ["kente", "akwete", "brocade", "velvet"],
  },
  {
    title: "Everyday colour",
    note: "Prints and dyes for dresses, shirts, skirts and head ties.",
    fabrics: ["ankara", "hollandais", "adire"],
  },
];

const FACTS = [
  {
    title: "14 fabric families",
    text: "From handwoven aso oke to printed ankara.",
  },
  {
    title: "Sold your way",
    text: "By the yard, the piece or the set, depending on the cloth.",
  },
  {
    title: "Pay with Paystack",
    text: "Cards, bank transfer and USSD, in Naira.",
  },
  {
    title: "Delivered across Nigeria",
    text: "Delivery fee is shown before you pay.",
  },
];

export default async function HomePage() {
  const categories = await getCategories();
  const featured = await getFeaturedProducts(12);
  const counts = await getCategoryProductCounts();
  const loomProducts = (
    await Promise.all(
      ["aso-oke", "adire", "ankara", "hollandais", "lace"].map((slug) =>
        getProductsByCategory(slug),
      ),
    )
  )
    .map((list) => list[0])
    .filter((p): p is NonNullable<typeof p> => !!p);
  const nameOf = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <>
      <section className="pb-14 pt-8 md:pt-12 xl1:pb-24 xl1:pt-16 xl2:pb-28 xl3:pt-20 xl3:pb-32 xl4:pt-24 xl4:pb-40">
        <Container className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14 xl1:gap-20 xl2:gap-24 xl3:gap-28 xl4:gap-32">
          <div>
            <h1 className="text-[2.6rem] font-bold leading-[1.02] tracking-tight sm:text-6xl xl:text-[4.2rem] xl1:text-[4.8rem] xl2:text-[5.2rem] xl3:text-[5.4rem] xl4:text-[6.2rem]">
              Nigerian fabrics, cut by the yard
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted xl1:mt-8 xl1:max-w-2xl xl1:text-xl xl2:max-w-[42rem] xl3:mt-10 xl3:text-[1.35rem] xl4:max-w-[46rem] xl4:text-2xl">
              Aso Oke, Adire, Ankara, Lace, Kente and nine more fabric families.
              Pick your cloth, set your quantity and pay securely in Naira.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 xl1:mt-10 xl1:gap-4 xl3:mt-12 xl4:mt-14 xl4:gap-5">
              <ButtonLink href="/shop" size="lg">
                Shop all fabrics
              </ButtonLink>
              <ButtonLink href="#fabrics" variant="outline" size="lg">
                Browse by fabric
              </ButtonLink>
            </div>
          </div>
          <HeroLoom products={loomProducts} />
        </Container>
      </section>

      <section
        aria-label="Why shop with Ankora"
        className="border-y border-line"
      >
        <Container className="grid grid-cols-2 lg:grid-cols-4">
          {FACTS.map((f, i) => (
            <div
              key={f.title}
              className={`px-0 py-6 pr-4 xl1:py-8 xl2:py-10 xl3:py-12 xl4:py-14 lg:px-6 lg:first:pl-0 ${i > 0 ? "lg:border-l lg:border-line" : ""} ${i % 2 === 1 ? "border-l border-line pl-4 lg:pl-6" : ""}`}
            >
              <p className="font-semibold xl1:text-lg xl3:text-xl">{f.title}</p>
              <p className="mt-1 text-sm text-muted xl1:text-base xl3:mt-2 xl3:text-[1.05rem]">
                {f.text}
              </p>
            </div>
          ))}
        </Container>
      </section>

      <section
        id="fabrics"
        className="scroll-mt-40 pt-16 xl1:pt-24 xl2:pt-28 xl3:pt-32 xl4:pt-40"
      >
        <Container>
          <SectionHeading
            title="Shop by fabric"
            description="Each family has its own page with every variety we stock."
          />
          <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4 xl1:grid-cols-7 xl1:gap-x-5 xl1:gap-y-12 xl2:gap-y-14 xl3:gap-x-6 xl3:gap-y-16 xl4:gap-x-8 xl4:gap-y-20">
            {categories.map((c, i) => (
              <CategoryTile
                key={c.slug}
                category={c}
                count={counts[c.slug] ?? 0}
                sampleColors={loomProducts[i % loomProducts.length]?.colors.map(
                  (x) => x.hex,
                )}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="pt-20 xl1:pt-28 xl2:pt-32 xl3:pt-36 xl4:pt-44">
        <Container>
          <SectionHeading
            title="Popular right now"
            href="/shop"
            linkLabel="See all fabrics"
          />
          <ProductGrid products={featured} />
        </Container>
      </section>

      <section className="mt-20 bg-green text-white xl1:mt-28 xl2:mt-32 xl3:mt-36 xl4:mt-44">
        <Container className="py-14 xl1:py-20 xl2:py-24 xl3:py-28 xl4:py-32">
          <h2 className="max-w-2xl text-[1.75rem] font-bold leading-tight tracking-tight md:text-4xl xl1:text-[2.6rem] xl2:max-w-3xl xl3:text-5xl xl4:max-w-4xl xl4:text-[3.4rem]">
            What are you dressing for?
          </h2>
          <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-4 xl1:mt-14 xl1:gap-x-10 xl2:mt-16 xl3:gap-x-12 xl3:gap-y-12 xl4:mt-20 xl4:gap-x-16">
            {OCCASIONS.map((o) => (
              <div key={o.title} className="border-t border-white/60 pt-5">
                <h3 className="text-xl font-semibold xl1:text-2xl xl3:text-[1.7rem]">
                  {o.title}
                </h3>
                <p className="mt-2 text-white/85 xl1:text-lg xl3:mt-3 xl3:text-xl">
                  {o.note}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {o.fabrics.map((slug) => (
                    <li key={slug}>
                      <Link
                        href={`/category/${slug}`}
                        className="inline-block rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-green-dark hover:bg-gold-tint"
                      >
                        {nameOf(slug)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
