import type { Category, FabricPattern } from "@/types";
import Link from "next/link";
import { SwatchImage } from "./SwatchImage";

interface Props {
  category: Category;
  count: number;
  /** A product photo from this category, picked by the caller. Falls back to category.image, then the generated swatch. */
  image?: string | null;
  pattern?: FabricPattern;
  sampleColors?: string[];
}

export function CategoryTile({
  category,
  count,
  image,
  pattern,
  sampleColors,
}: Props) {
  return (
    <Link href={`/category/${category.slug}`} className="group block">
      <SwatchImage
        src={image ?? category.image}
        pattern={pattern ?? category.pattern}
        colors={sampleColors ?? ["#008751", "#D4A017", "#ffffff"]}
        alt={`${category.name} fabric`}
        sizes="(min-width:1440px) 13vw, (min-width:1024px) 22vw, (min-width:640px) 30vw, 48vw"
        className="aspect-4/5 rounded-sm transition-transform duration-500 [&_svg]:transition-transform [&_svg]:duration-500 group-hover:[&_svg]:scale-105"
      />
      <h3 className="mt-3 text-base font-semibold decoration-green decoration-2 underline-offset-4 group-hover:underline xl1:mt-4 xl1:text-[1.05rem] xl3:text-lg xl4:text-xl">
        {category.name}
      </h3>
      <p className="text-sm text-muted xl3:text-[0.95rem]">{count} varieties</p>
    </Link>
  );
}
