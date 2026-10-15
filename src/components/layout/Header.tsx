import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/config/site";
import { getCategories } from "@/lib/catalog";
import { formatNaira } from "@/lib/format";
import Link from "next/link";
import { CartButton } from "./CartButton";
import { CategoryRail } from "./CategoryRail";
import { MobileNav } from "./MobileNav";
import { SearchForm } from "./SearchForm";

const NAV_LINKS = [
  { href: "/shop", label: "Shop", prominent: true },
  { href: "/about", label: "About" },
  { href: "/delivery", label: "Delivery" },
  { href: "/track-order", label: "Track order" },
];

export async function Header() {
  const categories = await getCategories();
  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="bg-ink text-white">
        <Container className="flex h-9 items-center justify-center text-center text-[0.8rem] xl1:h-10 xl1:text-sm xl2:h-11 xl3:h-11 xl3:text-[0.95rem] xl4:h-12 xl4:text-base">
          <p>
            Free delivery across Nigeria on orders over{" "}
            {formatNaira(SITE.freeDeliveryThreshold)}
          </p>
        </Container>
      </div>
      <div className="border-b border-line lg:border-b-0">
        <Container className="flex h-16 items-center gap-3 lg:gap-8 xl1:h-18 xl2:h-19 xl2:gap-9 xl3:h-20 xl3:gap-10 xl4:h-22 xl4:gap-12">
          <Link href="/" aria-label="Ankora home" className="shrink-0">
            <Logo className="" />
          </Link>

          <div className="ml-auto flex items-center gap-0 lg:hidden">
            <MobileNav categories={categories} />
            <CartButton />
          </div>
          <SearchForm className="hidden max-w-2xl flex-1 xl4:flex-2 lg:block xl1:max-w-176 xl2:max-w-3xl xl3:max-w-208 xl4:max-w-240" />

          <nav
            aria-label="Main"
            className="ml-auto hidden items-center gap-1 lg:flex"
          >
            {NAV_LINKS.map(({ href, label, prominent }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-4 py-2 text-[0.95rem] hover:bg-surface-2 xl1:px-4.5 xl2:px-5 xl1:text-base xl3:text-[1.15rem] xl3:px-6 xl4:px-7 xl4:text-[1.2rem] ${
                  prominent ? "font-semibold" : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="hidden lg:block xl1:scale-105 xl2:scale-110 xl3:scale-[1.15] xl4:scale-125">
            <CartButton />
          </div>
        </Container>
      </div>
      <CategoryRail categories={categories} />
      <div className="h-px w-full bg-line" />
    </header>
  );
}
