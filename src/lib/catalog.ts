import { getCategoryBySlug, listCategories } from "@/lib/db/categories";
import {
  getProductBySlug,
  listFeaturedProducts,
  listProducts,
  listProductsByCategory,
} from "@/lib/db/products";
import type { Category, Product } from "@/types";

export * from "./catalog-utils";
export const getCategories = async (): Promise<Category[]> => listCategories();
export const getCategory = async (slug: string): Promise<Category | null> =>
  getCategoryBySlug(slug);
export const getProduct = async (slug: string): Promise<Product | null> =>
  getProductBySlug(slug);
export const getAllProducts = async (): Promise<Product[]> =>
  listProducts({ activeOnly: true });
export const getProductsByCategory = async (
  categorySlug: string,
): Promise<Product[]> =>
  listProductsByCategory(categorySlug, { activeOnly: true });
export const getFeaturedProducts = async (limit = 12): Promise<Product[]> =>
  listFeaturedProducts(limit);
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
  for (const p of products)
    counts[p.categorySlug] = (counts[p.categorySlug] ?? 0) + 1;
  return counts;
}
