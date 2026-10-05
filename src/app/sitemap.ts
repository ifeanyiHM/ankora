import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { getAllProducts, getCategories } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [categories, products] = await Promise.all([getCategories(), getAllProducts()]);
  return [
    ...["", "/shop", "/about", "/delivery", "/track-order"].map((p) => ({ url: `${SITE.url}${p}`, lastModified: now })),
    ...categories.map((c) => ({ url: `${SITE.url}/category/${c.slug}`, lastModified: now })),
    ...products.map((p) => ({ url: `${SITE.url}/product/${p.slug}`, lastModified: now })),
  ];
}
