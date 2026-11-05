import { SwatchImage } from "@/components/shop/SwatchImage";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/config/site";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about a fabric, a bulk order or your delivery? Get in touch with Ankora.",
  alternates: { canonical: "/contact" },
};

const row = "grid gap-1 border-b border-line py-5 sm:grid-cols-[9rem_1fr] sm:gap-8 xl1:py-6 xl3:py-7";
const term = "text-sm text-muted xl1:text-base xl3:text-lg";
const link =
  "inline-flex items-center gap-1 font-semibold decoration-green decoration-2 underline-offset-4 hover:underline xl1:text-lg xl3:text-xl";

export default function ContactPage() {
  return (
    <Container className="py-12 md:py-20 xl1:py-28">
      <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] xl1:gap-20 xl3:gap-28">
        <div className="min-w-0">
          <h1 className="border-t border-ink pt-5 text-4xl font-bold tracking-tight md:text-6xl xl1:pt-6 xl1:text-7xl xl3:text-8xl">
            Contact
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft xl1:mt-8 xl1:max-w-2xl xl1:text-xl xl3:mt-10 xl3:text-2xl">
            Choosing a cloth, planning an aso ebi order or checking on a delivery? Write to us and
            we will help you choose.
          </p>

          <dl className="mt-10 border-t border-ink xl1:mt-14 xl3:mt-16">
            <div className={row}>
              <dt className={term}>Email</dt>
              <dd>
                <a href={`mailto:${SITE.email}`} className={link}>
                  {SITE.email}
                </a>
              </dd>
            </div>
            {SITE.whatsapp && (
              <div className={row}>
                <dt className={term}>WhatsApp</dt>
                <dd>
                  <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className={link}>
                    Message us <ArrowUpRight className="size-4 xl1:size-5" />
                  </a>
                </dd>
              </div>
            )}
            <div className={row}>
              <dt className={term}>Your order</dt>
              <dd>
                <Link href="/track-order" className={link}>
                  Track an order <ArrowUpRight className="size-4 xl1:size-5" />
                </Link>
              </dd>
            </div>
            <div className={row}>
              <dt className={term}>Delivery</dt>
              <dd>
                <Link href="/delivery" className={link}>
                  Fees and timing <ArrowUpRight className="size-4 xl1:size-5" />
                </Link>
              </dd>
            </div>
          </dl>

          <SwatchImage
            src={null}
            pattern="aso-oke"
            colors={["#163D2A", "#D4A017", "#F5F5F0"]}
            alt=""
            sizes="40vw"
            className="mt-12 hidden aspect-[16/7] rounded-sm lg:block xl1:mt-16"
          />
        </div>

        <section aria-labelledby="contact-form-title" className="rounded-sm bg-surface-3 p-6 sm:p-8 xl1:p-12 xl3:p-14">
          <h2 id="contact-form-title" className="mb-6 text-2xl font-bold xl1:mb-8 xl1:text-3xl xl3:text-4xl">
            Send us a message
          </h2>
          <ContactForm />
        </section>
      </div>
    </Container>
  );
}
