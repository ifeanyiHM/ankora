import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/config/site";
import { DELIVERY_ZONES } from "@/lib/delivery";
import { formatNaira } from "@/lib/format";

export const metadata: Metadata = { title: "Delivery", description: "Delivery fees and timing for Ankora orders across Nigeria." };

export default function DeliveryPage() {
  return (
    <Container className="py-12 md:py-20 xl1:py-28 xl2:py-32 xl3:py-36 xl4:py-44">
      <div className="max-w-3xl xl1:max-w-4xl xl3:max-w-5xl">
        <h1 className="border-t border-ink pt-5 text-4xl font-bold tracking-tight md:text-6xl xl1:pt-6 xl1:text-7xl xl3:text-8xl">Delivery</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-soft xl1:mt-8 xl1:text-xl xl3:mt-10 xl3:text-2xl">
          Orders are dispatched {SITE.dispatchDays} working days after payment. Orders with a subtotal of {formatNaira(SITE.freeDeliveryThreshold)} or more ship free. Otherwise the fee depends on your state, and you see it before you pay.
        </p>
        <dl className="mt-10 border-t border-ink xl1:mt-14 xl3:mt-16">
          {DELIVERY_ZONES.map((z) => (
            <div key={z.label} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[1fr_auto] sm:gap-8 xl1:py-5 xl3:py-6">
              <div><dt className="font-semibold xl1:text-lg xl3:text-xl">{z.label}</dt><dd className="mt-1 text-sm text-muted xl1:text-base xl3:text-lg">{z.states.join(", ")}</dd></div>
              <dd className="font-bold xl1:text-lg xl3:text-xl">{formatNaira(z.fee)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Container>
  );
}
