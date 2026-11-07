import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { getCategories, getProductsByCategory } from "@/lib/catalog";
import { Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { HeroLoom } from "../components/shop/HeroLoom";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const stripe = [
  {
    image:
      "https://i.pinimg.com/736x/8a/02/48/8a0248cf2ee126bec193387b41dcfed8.jpg",
    height: "h-[50vh] mt-0",
  },
  {
    image:
      // "https://i.pinimg.com/736x/66/07/ff/6607ffc16cfbb287c39c12800bc7a742.jpg",

      "https://i.pinimg.com/736x/5b/b6/d4/5bb6d42fa39e29a303bc21c19f7d5c3d.jpg",
    height: "h-[50vh] mt-0",
  },
  {
    image:
      // "https://i.pinimg.com/736x/e1/2b/c6/e12bc6ad8630e08750fe7c669896e668.jpg",
      "https://i.pinimg.com/1200x/f2/b0/05/f2b0054fd8e46916fee98ce0bc6ef62d.jpg",
    height: "h-[50vh] mt-0",
  },
  {
    image:
      "https://i.pinimg.com/1200x/86/c0/49/86c049641ad3670fab295dabefb1f30f.jpg",
    height: "h-[50vh] mt-0",
  },
  // {
  //   image:
  //     "https://i.pinimg.com/1200x/3e/81/8a/3e818ae44f3683e7cd73e48cb8b5f01f.jpg",
  //   // "https://i.pinimg.com/1200x/4e/eb/c5/4eebc56fac1a5eb04d6065dff4df9d96.jpg",
  //   height: "h-screen mt-0",
  // },
  // {
  //   image:
  //     // "https://i.pinimg.com/1200x/35/d9/9b/35d99b797766a758d0474febb678adb4.jpg",
  //     "https://i.pinimg.com/736x/94/87/40/94874008be593be64b854f482bfbcfd8.jpg",
  //   height: "h-screen mt-0",
  // },
] as const;

const footerLink = "hover:text-ink hover:underline underline-offset-4";

export default async function NotFound() {
  // A missing page must still render if the database is down, so the fabric links are optional.
  const popular = (await getCategories().catch(() => [])).slice(0, 8);

  const loomProducts = (
    await Promise.all(
      ["aso-oke", "adire", "ankara", "hollandais"].map((slug) =>
        getProductsByCategory(slug),
      ),
    )
  )
    .map((list) => list[0])
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <div className="flex flex-col px-5 py-6 sm:px-10 sm:py-8 xl1:px-16 xl1:py-10 xl3:px-24 xl3:py-14">
        <header>
          <Link href="/" aria-label="Ankora home" className="inline-block">
            <Logo className="" />
          </Link>
        </header>

        <main className="my-auto w-full max-w-2xl py-6 xl1:max-w-3xl xl1:py-8 xl3:max-w-4xl xl3:py-12">
          <p className="border-t border-ink pt-4 text-sm font-semibold uppercase tracking-[0.22em] text-green xl1:text-base xl3:text-lg">
            Error 404
          </p>
          <h1 className="mt-5 text-balance text-5xl font-bold leading-[1.04] tracking-tight md:text-7xl xl1:mt-6 xl1:text-[5.5rem] xl3:text-9xl">
            That page is not here
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft xl1:mt-8 xl1:max-w-xl xl1:text-xl xl3:text-2xl">
            The link may be old, or the fabric may have moved. Search for what
            you were after, or start from the shop.
          </p>

          <form action="/shop" role="search" className="mt-8 xl1:mt-10">
            <label htmlFor="not-found-search" className="sr-only">
              Search fabrics
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted" />
              <input
                id="not-found-search"
                name="q"
                type="search"
                placeholder="Search fabrics, colours or prints"
                className="h-14 w-full rounded-full bg-surface pl-14 pr-32 text-base outline-none ring-1 ring-line transition focus:bg-white focus:ring-green xl1:h-16 xl1:text-lg xl3:h-18 xl3:text-xl"
              />
              <button
                type="submit"
                className="absolute bottom-1.5 right-1.5 top-1.5 rounded-full bg-green px-6 font-semibold text-white transition-colors hover:bg-green-dark xl1:px-8 xl1:text-lg xl3:text-xl"
              >
                Search
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap gap-3 xl1:mt-8">
            <ButtonLink href="/shop" size="lg">
              Browse fabrics
            </ButtonLink>
            <ButtonLink href="/" variant="outline" size="lg">
              Back home
            </ButtonLink>
          </div>
        </main>
      </div>

      <aside
        aria-hidden="true"
        className="hidden lg:block relative h-56 lg:h-auto lg:min-h-screen"
      >
        {/* <SwatchImage
          src="https://i.pinimg.com/736x/fb/d4/3e/fbd43e7d4db8305e82619ec349625926.jpg"
          pattern="aso-oke"
          colors={["#163D2A", "#D4A017", "#F5F5F0"]}
          alt=""
          sizes="45vw"
          className="absolute inset-0 h-full w-full"
        /> */}
        <HeroLoom products={loomProducts} stripe={stripe} isNotFound={true} />
        <div className="absolute inset-0 grid place-items-center">
          <div className="rounded-sm bg-white px-10 py-7 text-center shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)] xl1:px-14 xl1:py-9 xl3:px-20 xl3:py-12">
            <p className="text-7xl font-bold leading-none tracking-tight text-ink xl1:text-8xl xl3:text-9xl">
              404
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted xl1:text-sm xl3:text-base">
              Page not found
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
