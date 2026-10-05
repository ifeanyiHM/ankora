import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ cancelled?: string }> }) {
  const { cancelled } = await searchParams;
  return (
    <Container className="py-8 md:py-12 xl1:py-16 xl2:py-20 xl3:py-24 xl4:py-28">
      <h1 className="mb-8 border-t border-ink pt-5 text-3xl font-bold tracking-tight md:text-5xl xl1:mb-10 xl1:pt-6 xl1:text-6xl xl3:mb-12 xl3:pt-7 xl3:text-7xl xl4:text-[5rem]">Checkout</h1>
      <CheckoutForm cancelled={cancelled === "1"} />
    </Container>
  );
}
