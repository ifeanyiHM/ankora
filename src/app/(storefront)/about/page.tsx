import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getCategories } from "@/lib/catalog";

export const metadata: Metadata = { title: "About", description: "Ankora sells Nigerian and African traditional fabrics online." };

export default async function AboutPage() {
  const count = (await getCategories()).length;
  return (
    <Container className="py-12 md:py-20 xl1:py-28 xl2:py-32 xl3:py-36 xl4:py-44">
      <div className="max-w-3xl xl1:max-w-4xl xl3:max-w-5xl">
        <h1 className="border-t border-ink pt-5 text-4xl font-bold leading-tight tracking-tight md:text-6xl xl1:pt-6 xl1:text-7xl xl3:text-8xl">Fabric, without the market run</h1>
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-soft xl1:mt-10 xl1:space-y-6 xl1:text-xl xl3:mt-12 xl3:text-2xl">
          <p>Ankora is a Nigerian online store for traditional fabrics. We bring {count} fabric families together in one place, from handwoven aso oke and indigo adire to printed ankara, lace and kente.</p>
          <p>Every fabric has its own page, and every variety shows its price, its colours and how it is sold, whether that is by the yard, the piece or the set. You choose the quantity, pay in Naira through Paystack, and we deliver.</p>
          <p>Questions about a cloth, a colour or a bulk order for aso ebi? Write to us and we will help you choose.</p>
        </div>
        <div className="mt-10 flex gap-3 xl1:mt-12 xl1:gap-4 xl3:mt-14"><ButtonLink href="/shop" size="lg">Shop fabrics</ButtonLink><ButtonLink href="/delivery" variant="outline" size="lg">Delivery</ButtonLink></div>
      </div>
    </Container>
  );
}
