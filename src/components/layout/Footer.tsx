import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/config/site";
import { getCategories } from "@/lib/catalog";
import Link from "next/link";

export async function Footer() {
  const categories = await getCategories();
  const h =
    "mb-4 text-sm font-semibold text-white xl1:mb-5 xl1:text-[0.95rem] xl3:mb-6 xl2:text-md xl4:text-lg";
  const a =
    "text-[0.95rem] text-white/70 transition-colors hover:text-white xl1:text-base xl2:text-lg xl4:text-xl";
  return (
    <footer className=" bg-ink text-white">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_2fr_1fr] xl1:gap-16 lg:py-20 xl2:py-24 xl3:gap-20 xl3:py-28 xl4:py-32">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-white/70 xl1:max-w-md xl1:text-base xl2:text-lg xl3:max-w-lg xl4:max-w-xl xl4:text-xl">
            {SITE.description}
          </p>
          <p className="mt-5 text-sm xl2:text-lg xl4:text-xl text-white/70">
            Payments secured by Paystack
          </p>
        </div>
        <div>
          <h2 className={h}>Fabrics</h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 xl1:gap-y-3 xl3:gap-x-8 xl4:gap-x-10">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className={a}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className={h}>Ankora</h2>
          <ul className="space-y-2.5 xl1:space-y-3">
            <li>
              <Link href="/shop" className={a}>
                All fabrics
              </Link>
            </li>
            <li>
              <Link href="/cart" className={a}>
                Your cart
              </Link>
            </li>
            <li>
              <Link href="/about" className={a}>
                About us
              </Link>
            </li>
            <li>
              <Link href="/delivery" className={a}>
                Delivery
              </Link>
            </li>
            <li>
              <Link href="/track-order" className={a}>
                Track order
              </Link>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className={a}>
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-1 py-6 text-sm text-white/50 sm:flex-row sm:justify-between xl1:py-7 xl2:text-lg xl3:py-8">
          <p>
            © {new Date().getFullYear()} Ankora. All prices are in Nigerian
            Naira (₦).
          </p>
          <p>Made in Nigeria</p>
        </Container>
      </div>
    </footer>
  );
}
