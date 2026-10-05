import type { Category } from "@/types";
import Link from "next/link";
import { CategoryImage } from "./SwatchImage";

export function CategoryTile({
  category,
  count,
  sampleColors,
}: {
  category: Category;
  count: number;
  sampleColors?: string[];
}) {
  return (
    <Link href={`/category/${category.slug}`} className="group block">
      <CategoryImage
        category={category}
        sampleColors={sampleColors}
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
