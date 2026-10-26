import { AboutMosaic } from "@/components/shop/AboutMosaic";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getCategories } from "@/lib/catalog";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description: "Ankora sells Nigerian and African traditional fabrics online.",
};

/** The five fabric families shown in the mosaic, in layout order: large, top-right, bottom-right, bottom-left, medallion. */
const MOSAIC = ["aso-oke", "adire", "ankara", "brocade", "lace"];

export default async function AboutPage() {
  const categories = await getCategories();
  const count = categories.length;

  const tiles: Parameters<typeof AboutMosaic>[0]["tiles"] = [
    {
      slug: "hollandais",
      name: "Holandais",
      image:
        "https://i.pinimg.com/1200x/a8/ea/92/a8ea92972ffde95e3ee785e9f2792447.jpg",
      pattern: "hollandais",
      colors: ["#163D2A", "#D4A017", "#F5F5F0"],
    },

    {
      slug: "aso-oke",
      name: "Aso Oke",
      image:
        "https://i.pinimg.com/1200x/90/c1/77/90c1778db3c4bc5574a6f9a70bc9633d.jpg",
      pattern: "aso-oke",
      colors: ["#D4A017", "#163D2A", "#F5F5F0"],
    },
    {
      slug: "adire",
      name: "Adire",
      image:
        "https://i.pinimg.com/1200x/07/72/c8/0772c83868e342d297bdef1bf49e1ac1.jpg",
      pattern: "adire",
      colors: ["#163D2A", "#FFFFFF", "#D4A017"],
    },
    {
      slug: "brocade",
      name: "Brocade",
      image:
        "https://i.pinimg.com/736x/64/8e/a5/648ea57c895a156aac6b3df77e6baeaf.jpg",
      pattern: "brocade",
      colors: ["#163D2A", "#D4A017", "#8B4513"],
    },
    {
      slug: "lace",
      name: "Lace",
      image:
        "https://i.pinimg.com/1200x/6d/b1/9b/6db19b77b3e345429a48c557cf68e337.jpg",
      pattern: "lace",
      colors: ["#163D2A", "#D4A017", "#F5F5F0"],
    },
  ];

  return (
    <Container className="py-12 md:py-16 xl1:py-24">
      <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-14 xl1:gap-20 xl3:gap-28">
        <div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl xl1:text-7xl xl3:text-8xl">
            Fabric, without the market run
          </h1>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-soft xl1:mt-10 xl1:space-y-6 xl1:text-xl xl3:mt-12 xl3:text-2xl">
            <p>
              Ankora is a Nigerian online store for traditional fabrics. We
              bring {count} fabric families together in one place, from
              handwoven aso oke and indigo adire to printed ankara, lace and
              brocade.
            </p>
            <p>
              Every fabric has its own page, and every variety shows its price,
              its colours and how it is sold, whether that is by the yard, the
              piece or the set. You choose the quantity, pay in Naira through
              Paystack, and we deliver.
            </p>
            <p>
              Questions about a cloth, a colour or a bulk order for aso ebi?
              Write to us and we will help you choose.
            </p>
          </div>
          <div className="mt-10 flex gap-3 xl1:mt-12 xl1:gap-4 xl3:mt-14">
            <ButtonLink href="/shop" size="lg">
              Shop fabrics
            </ButtonLink>
            <ButtonLink href="/delivery" variant="outline" size="lg">
              Delivery
            </ButtonLink>
          </div>
        </div>

        <AboutMosaic tiles={tiles} />
      </div>
    </Container>
  );
}
