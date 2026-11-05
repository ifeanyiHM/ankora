import { SITE } from "@/config/site";
import { getAllProducts, getCategories } from "@/lib/catalog";
import { listPublishedPosts } from "@/lib/db/blog";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [categories, products] = await Promise.all([
    getCategories(),
    getAllProducts(),
  ]);
  // The blog is optional: a missing table must not break the whole sitemap.
  const posts = await listPublishedPosts({ limit: 1000 }).catch(() => []);
  return [
    ...[
      "",
      "/shop",
      "/about",
      "/delivery",
      "/track-order",
      "/blogs",
      "/contact",
    ].map((p) => ({ url: `${SITE.url}${p}`, lastModified: now })),
    ...categories.map((c) => ({
      url: `${SITE.url}/category/${c.slug}`,
      lastModified: now,
    })),
    ...products.map((p) => ({
      url: `${SITE.url}/product/${p.slug}`,
      lastModified: now,
    })),
    ...posts.map((p) => ({
      url: `${SITE.url}/blogs/${p.slug}`,
      lastModified: new Date(p.updatedAt),
    })),
  ];
}
