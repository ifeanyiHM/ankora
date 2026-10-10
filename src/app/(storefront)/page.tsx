import { CategoryTile } from "@/components/shop/CategoryTile";
import { HeroLoom } from "@/components/shop/HeroLoom";
import { ProductGrid } from "@/components/shop/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  getAllProducts,
  getCategories,
  getCategoryProductCounts,
  getFeaturedProducts,
  getProductsByCategory,
} from "@/lib/catalog";
import type { Product } from "@/types";
import { OccasionsCarousel } from "../../components/shop/OccasionsCarousel";

export const dynamic = "force-dynamic";

export interface Occasion {
  title: string;
  note?: string;
  fabrics: string[];
  media: string[];
}

const OCCASIONS: Occasion[] = [
  {
    title: "Everyday colour",
    note: "Prints and dyes for dresses, shirts, skirts and head ties.",
    fabrics: ["ankara", "hollandais", "adire"],
    media: [
      "https://i.pinimg.com/1200x/8d/7a/e1/8d7ae1062f9eb1d3d742e3931252c48d.jpg",
      "https://i.pinimg.com/1200x/98/08/bc/9808bc5bc7c9d38c5ac866b308dc1418.jpg",
      "https://i.pinimg.com/736x/9d/09/02/9d0902b416416176e7978d1621a20689.jpg",
      "https://i.pinimg.com/736x/70/5f/f9/705ff9fdce8edf40232018c736d1df57.jpg",
      "https://i.pinimg.com/736x/43/40/74/434074c30e92e470ab10260dc3303f16.jpg",
      "https://i.pinimg.com/736x/ca/9b/6e/ca9b6edbda8a4fd425f423b3540338e5.jpg",
      "https://i.pinimg.com/736x/42/d8/56/42d8569d6b6d869fcd92cb9e936a333d.jpg",
      "https://i.pinimg.com/736x/fb/22/82/fb2282a4468fd99ab96b9faa7cb05883.jpg",
      "https://i.pinimg.com/736x/43/ce/f6/43cef6aa546bf2de20843dd105f0b269.jpg",
      "https://i.pinimg.com/1200x/06/d9/55/06d9554f1aa5edbaeb27e9727aca96e5.jpg",
      "https://i.pinimg.com/736x/bc/0c/62/bc0c62576d9a8da7e1554edd376ab50b.jpg",
      "https://i.pinimg.com/1200x/e8/5b/cb/e85bcb10feda7945a5545b596692eaf9.jpg",
      "https://i.pinimg.com/1200x/a0/c5/ea/a0c5ea5d53c10ea615471c986a462dcb.jpg",
      "https://i.pinimg.com/736x/93/df/60/93df60939bc42fac58de583792166b69.jpg",
    ],
  },
  {
    title: "Men's traditional wear",
    note: "Crisp cloth that holds an agbada, kaftan or senator cut.",
    fabrics: ["guinea-brocade", "senator-material"],
    media: [
      "https://i.pinimg.com/736x/a1/60/fc/a160fc78c5cc7f627b11f67f9e7663b1.jpg",
      "https://i.pinimg.com/1200x/5e/23/fd/5e23fd7b6cd26557cf5b4ccbed21106e.jpg",
      "https://i.pinimg.com/736x/82/e0/59/82e059fb9b4ede4901e5bd568f5771df.jpg",
      "https://i.pinimg.com/1200x/ec/1e/19/ec1e19357edac03b16b6640ba9db8145.jpg",
      "https://i.pinimg.com/736x/cf/6a/49/cf6a49d90812bd2e4d4f169181422190.jpg",
      "https://i.pinimg.com/736x/c1/95/ff/c195ffe4b55d6b66f677ccedd6b8bf81.jpg",
      "https://i.pinimg.com/736x/d5/a0/54/d5a054739e07201379e6d360561cd582.jpg",
      "https://i.pinimg.com/1200x/cc/dc/84/ccdc844e223ad35a8c98df660a91620b.jpg",
    ],
  },
  {
    title: "Weddings and aso ebi",
    note: "Woven, laced and embroidered cloth for the bride, the family and the guests.",
    fabrics: ["aso-oke", "lace", "george"],
    media: [
      "https://i.pinimg.com/1200x/a5/a5/d0/a5a5d0f1fe0b83a67ac7a7cece0b0c97.jpg",
      "https://i.pinimg.com/1200x/03/d1/fe/03d1fe57e9f051d21d020a90ce80e3f0.jpg",
      "https://i.pinimg.com/736x/8a/4c/a8/8a4ca82dfc7f74f8ee962d9e33541d86.jpg",
      "https://i.pinimg.com/736x/b9/5e/5d/b95e5dd34b0cbf890214b71d4d91be1b.jpg",
      "https://i.pinimg.com/736x/71/7e/8a/717e8aee2011010ebed6ac7c08b1b644.jpg",
      "https://i.pinimg.com/736x/dc/db/5a/dcdb5a22604446314cf1f321b30fab56.jpg",
      "https://i.pinimg.com/736x/5b/95/ff/5b95ff57bbca8dd5aed5900b722bf184.jpg",
      "https://i.pinimg.com/1200x/68/21/a0/6821a0c2511a7cf356a47c11fc7e966d.jpg",
    ],
  },
  {
    title: "Ceremony and celebration",
    note: "Statement weaves and rich pile for the days people dress up for.",
    fabrics: ["akwete", "brocade", "velvet"],
    media: [
      "https://i.pinimg.com/736x/1e/4a/54/1e4a5456f6e1931e6731496974cc6edd.jpg",
      "https://i.pinimg.com/1200x/8b/c2/25/8bc2256347a72d14bfd1eaaa6ae7e9fe.jpg",
      "https://i.pinimg.com/1200x/7c/c2/e1/7cc2e1c028555037d2cb170de9916989.jpg",
      "https://i.pinimg.com/1200x/40/70/48/407048f4f19e84f91caf00b06077ba23.jpg",
      "https://i.pinimg.com/1200x/9e/d5/9a/9ed59a5aca4c4f3450d6749c3e6ad327.jpg",
      "https://i.pinimg.com/736x/14/e3/6b/14e36bbb33aef427f71f3cc859cd766f.jpg",
      "https://i.pinimg.com/736x/dc/82/82/dc82828bfead9aa8edbcb6590a5d23a8.jpg",
      "https://i.pinimg.com/1200x/7e/a8/88/7ea88890c8867fa5ae381808cfa525a7.jpg",
      "https://i.pinimg.com/736x/59/f8/7c/59f87cc48266c9ed1d536ecc75880e40.jpg",
    ],
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

  // One random product photo per category for the "Shop by fabric" tiles below — picked fresh
  // on every page load, since this page is force-dynamic.
  const productsByCategory = new Map<string, Product[]>();
  for (const p of await getAllProducts()) {
    const list = productsByCategory.get(p.categorySlug);
    if (list) list.push(p);
    else productsByCategory.set(p.categorySlug, [p]);
  }
  const randomProductFor = (slug: string): Product | undefined => {
    const list = productsByCategory.get(slug);
    return list?.length
      ? list[Math.floor(Math.random() * list.length)]
      : undefined;
  };

  const loomProducts = (
    await Promise.all(
      ["aso-oke", "adire", "ankara", "hollandais", "lace"].map((slug) =>
        getProductsByCategory(slug),
      ),
    )
  )
    .map((list) => list[0])
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <>
      <section className="pb-14 pt-8 md:pt-12 xl1:pb-24 xl1:pt-16 xl2:pb-28 xl3:pt-20 xl3:pb-32 xl4:pt-24 xl4:pb-40">
        <Container className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14 xl1:gap-20 xl2:gap-24 xl3:gap-28 xl4:gap-32">
          <div>
            <h1 className="text-[2.6rem] font-bold leading-[1.02] tracking-tight sm:text-6xl xl:text-[4.2rem] xl1:text-[4.8rem] xl2:text-[5.2rem] xl3:text-[5.4rem] xl4:text-[6.2rem]">
              Nigerian fabrics, cut by the yard
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted xl1:mt-8 xl1:max-w-2xl xl1:text-xl xl2:max-w-2xl xl3:mt-10 xl3:text-[1.35rem] xl4:max-w-184 xl4:text-2xl">
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
            {categories.map((c) => {
              const sample = randomProductFor(c.slug);
              return (
                <CategoryTile
                  key={c.slug}
                  category={c}
                  count={counts[c.slug] ?? 0}
                  image={sample?.images[0] ?? null}
                  pattern={sample?.pattern}
                  sampleColors={sample?.colors.map((x) => x.hex)}
                />
              );
            })}
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

      <OccasionsCarousel occasions={OCCASIONS} />
    </>
  );
}
