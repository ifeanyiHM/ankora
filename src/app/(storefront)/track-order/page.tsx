import { TrackOrderForm } from "@/components/track/TrackOrderForm";
import { Container } from "@/components/ui/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Check the status of your Ankora order.",
};

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  return (
    <Container className="py-8 md:py-12 xl1:py-16 xl2:py-20 xl3:py-24 xl4:py-28">
      <TrackOrderForm initialOrderNumber={order ?? ""} />
    </Container>
  );
}
