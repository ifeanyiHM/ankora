import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { TrackOrderForm } from "@/components/track/TrackOrderForm";

export const metadata: Metadata = { title: "Track your order", description: "Check the status of your Ankora order." };

export default async function TrackOrderPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  return (
    <Container className="py-8 md:py-12 xl1:py-16 xl2:py-20 xl3:py-24 xl4:py-28">
      <h1 className="mb-3 border-t border-ink pt-5 text-3xl font-bold tracking-tight md:text-5xl xl1:mb-4 xl1:pt-6 xl1:text-6xl xl3:text-7xl xl4:text-[5rem]">Track your order</h1>
      <p className="mb-10 max-w-xl text-muted xl1:mb-12 xl1:max-w-2xl xl1:text-lg xl3:text-xl">Enter your order number together with the email or phone number you used at checkout.</p>
      <TrackOrderForm initialOrderNumber={order ?? ""} />
    </Container>
  );
}
