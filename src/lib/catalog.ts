import { getCategoryBySlug, listCategories } from "@/lib/db/categories";
import {
  getProductBySlug,
  listFeaturedProducts,
  listProducts,
  listProductsByCategory,
} from "@/lib/db/products";
import type { Category, Product } from "@/types";

export * from "./catalog-utils";

export const getCategories = async (): Promise<Category[]> =>
  await listCategories();

export const getCategory = async (slug: string): Promise<Category | null> =>
  await getCategoryBySlug(slug);

export const getProduct = async (slug: string): Promise<Product | null> =>
  await getProductBySlug(slug);

export const getAllProducts = async (): Promise<Product[]> =>
  await listProducts({ activeOnly: true });

export const getProductsByCategory = async (
  categorySlug: string,
): Promise<Product[]> =>
  await listProductsByCategory(categorySlug, { activeOnly: true });

export const getFeaturedProducts = async (limit = 12): Promise<Product[]> =>
  await listFeaturedProducts(limit);

export const getRelatedProducts = async (
  product: Product,
  limit = 4,
): Promise<Product[]> =>
  (await getProductsByCategory(product.categorySlug))
    .filter((p) => p.slug !== product.slug)
    .slice(0, limit);

export async function getCategoryProductCounts(): Promise<
  Record<string, number>
> {
  const products = await getAllProducts();
  const counts: Record<string, number> = {};

  for (const product of products) {
    counts[product.categorySlug] = (counts[product.categorySlug] ?? 0) + 1;
  }

  return counts;
}
