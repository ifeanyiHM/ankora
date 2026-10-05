import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { SITE } from "@/config/site";
import { getCategories } from "@/lib/catalog";
import { formatNaira } from "@/lib/format";
import { CartButton } from "./CartButton";
import { CategoryRail } from "./CategoryRail";
import { MobileNav } from "./MobileNav";
import { SearchForm } from "./SearchForm";
import { Container } from "@/components/ui/Container";

export async function Header() {
  const categories = await getCategories();
  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="bg-green-dark text-white">
        <Container className="flex h-9 items-center justify-center text-center text-[0.8rem] xl1:h-10 xl1:text-sm xl2:h-[2.75rem] xl3:h-11 xl3:text-[0.95rem] xl4:h-12 xl4:text-base">
          <p>Free delivery across Nigeria on orders over {formatNaira(SITE.freeDeliveryThreshold)}</p>
        </Container>
      </div>
      <div className="border-b border-line lg:border-b-0">
        <Container className="flex h-16 items-center gap-3 lg:gap-8 xl1:h-[4.5rem] xl2:h-[4.75rem] xl2:gap-9 xl3:h-20 xl3:gap-10 xl4:h-[5.5rem] xl4:gap-12">
          <MobileNav categories={categories} />
          <Link href="/" aria-label="Ankora home" className="mx-auto lg:mx-0"><Logo className="xl1:scale-105 xl1:origin-left xl2:scale-110 xl3:scale-[1.15] xl4:scale-125" /></Link>
          <SearchForm className="hidden max-w-2xl flex-1 lg:block xl1:max-w-[44rem] xl2:max-w-3xl xl3:max-w-[52rem] xl4:max-w-[58rem]" />
          <nav aria-label="Main" className="ml-auto hidden items-center gap-1 lg:flex xl1:gap-2 xl2:gap-3 xl3:gap-4 xl4:gap-5">
            <Link href="/shop" className="rounded-full px-4 py-2 text-[0.95rem] font-semibold hover:bg-surface-2 xl1:px-[1.125rem] xl2:px-5 xl2:text-base xl3:px-6 xl4:px-7 xl4:text-[1.05rem]">Shop</Link>
            <Link href="/about" className="rounded-full px-4 py-2 text-[0.95rem] hover:bg-surface-2 xl1:px-[1.125rem] xl2:px-5 xl2:text-base xl3:px-6 xl4:px-7 xl4:text-[1.05rem]">About</Link>
            <Link href="/delivery" className="rounded-full px-4 py-2 text-[0.95rem] hover:bg-surface-2 xl1:px-[1.125rem] xl2:px-5 xl2:text-base xl3:px-6 xl4:px-7 xl4:text-[1.05rem]">Delivery</Link>
            <Link href="/track-order" className="rounded-full px-4 py-2 text-[0.95rem] hover:bg-surface-2 xl1:px-[1.125rem] xl2:px-5 xl2:text-base xl3:px-6 xl4:px-7 xl4:text-[1.05rem]">Track order</Link>
          </nav>
          <div className="lg:ml-0"><CartButton /></div>
        </Container>
      </div>
      <CategoryRail categories={categories} />
      <div className="h-px w-full bg-line" />
    </header>
  );
}
