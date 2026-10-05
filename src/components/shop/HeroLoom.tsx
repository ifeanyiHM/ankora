import { FabricArt } from "@/components/art/FabricArt";
import type { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";

const STRIPS = [
  {
    image:
      "https://i.pinimg.com/1200x/16/86/9c/16869c0601befdd173ff5c5f166f1059.jpg",
    height: "h-[74%] mt-[26%]",
  },
  {
    image:
      // "https://i.pinimg.com/736x/66/07/ff/6607ffc16cfbb287c39c12800bc7a742.jpg",
      "https://i.pinimg.com/1200x/28/20/4a/28204aeabb2ee56115b8ed6d6a7c0afe.jpg",
    height: "h-[92%] mt-[8%]",
  },
  {
    image:
      // "https://i.pinimg.com/736x/e1/2b/c6/e12bc6ad8630e08750fe7c669896e668.jpg",
      "https://i.pinimg.com/736x/f7/68/f5/f768f5f57ac2f03a4e1cd19dbfd3c93a.jpg",
    height: "h-full mt-0",
  },
  {
    image:
      "https://i.pinimg.com/736x/45/d0/c3/45d0c3e1aa21b47eceb9e66087ed33e5.jpg",
    height: "h-[86%] mt-[14%]",
  },
  {
    image:
      "https://i.pinimg.com/1200x/35/d9/9b/35d99b797766a758d0474febb678adb4.jpg",
    // "https://i.pinimg.com/1200x/4e/eb/c5/4eebc56fac1a5eb04d6065dff4df9d96.jpg",
    height: "h-[68%] mt-[32%]",
  },
] as const;

/** Five fabric strips standing like warp threads on a loom, each linking to its category. */
export function HeroLoom({ products }: { products: Product[] }) {
  return (
    <div className="grid h-88 grid-cols-5 gap-2 sm:h-120 md:gap-3 lg:h-136 xl1:h-160 xl1:gap-3.5 xl2:h-168 xl3:h-176 xl3:gap-4 xl4:h-200 xl4:gap-5">
      {products.map((product, i) => {
        console.log(product, i);
        return (
          <Link
            key={product.slug}
            href={`/category/${product.categorySlug}`}
            style={{ "--i": i } as React.CSSProperties}
            className={`warp group relative block overflow-hidden rounded-sm ${STRIPS[i].height}`}
            aria-label={`Shop ${product.categoryName}`}
          >
            {"image" in STRIPS[i] ? (
              <Image
                src={STRIPS[i].image}
                alt={product.name}
                fill
                className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(min-width: 1920px) 20vw, (min-width: 1280px) 20vw, 20vw"
              />
            ) : (
              <FabricArt
                pattern={product.pattern}
                colors={product.colors.map((c) => c.hex)}
                className="size-full transition-transform duration-700 group-hover:scale-[1.04]"
              />
            )}
            <span className="absolute inset-x-1.5 bottom-1.5 truncate rounded-full bg-white px-2 py-1 text-center text-[0.7rem] font-semibold sm:text-xs xl1:inset-x-2.5 xl1:bottom-2.5 xl1:py-1.5 xl1:text-sm xl3:inset-x-3 xl3:bottom-3 xl3:px-3 xl3:py-2 xl3:text-base xl4:text-lg">
              {product.categoryName}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
