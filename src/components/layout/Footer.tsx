import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/config/site";
import { getCategories } from "@/lib/catalog";

export async function Footer() {
  const categories = await getCategories();
  const h = "mb-4 text-sm font-semibold text-white xl1:mb-5 xl1:text-[0.95rem] xl3:mb-6 xl4:text-base";
  const a = "text-[0.95rem] text-white/70 transition-colors hover:text-white xl1:text-base xl3:text-[1.05rem]";
  return (
    <footer className="mt-24 bg-ink text-white xl1:mt-32 xl2:mt-36 xl3:mt-40 xl4:mt-48">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_2fr_1fr] xl1:gap-16 xl1:py-20 xl2:py-24 xl3:gap-20 xl3:py-28 xl4:py-32">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-white/70 xl1:max-w-md xl1:text-base xl3:max-w-lg xl3:text-[1.05rem]">
            {SITE.description}
          </p>
          <p className="mt-5 text-sm text-white/70">Payments secured by Paystack</p>
        </div>
        <div>
          <h2 className={h}>Fabrics</h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 xl1:grid-cols-3 xl1:gap-y-3 xl3:gap-x-8 xl4:gap-x-10">
            {categories.map((c) => <li key={c.slug}><Link href={`/category/${c.slug}`} className={a}>{c.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className={h}>Ankora</h2>
          <ul className="space-y-2.5 xl1:space-y-3">
            <li><Link href="/shop" className={a}>All fabrics</Link></li>
            <li><Link href="/cart" className={a}>Your cart</Link></li>
            <li><Link href="/about" className={a}>About us</Link></li>
            <li><Link href="/delivery" className={a}>Delivery</Link></li>
            <li><Link href="/track-order" className={a}>Track order</Link></li>
            <li><a href={`mailto:${SITE.email}`} className={a}>{SITE.email}</a></li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-1 py-6 text-sm text-white/50 sm:flex-row sm:justify-between xl1:py-7 xl1:text-[0.95rem] xl3:py-8">
          <p>© {new Date().getFullYear()} Ankora. All prices are in Nigerian Naira (₦).</p>
          <p>Made in Nigeria</p>
        </Container>
      </div>
    </footer>
  );
}
