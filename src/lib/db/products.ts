import { resolveImageUrl } from "@/lib/images";
import type { FabricColor, Product, ProductBadge } from "@/types";
import { newId, sql } from "./client";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  category_id: string;
  price: number;
  colors: string;
  description: string;
  badge: string | null;
  featured: number;
  stock: number;
  active: number;
  main_image: string | null;
  gallery: string;
  cat_slug: string;
  cat_name: string;
  cat_pattern: string;
  unit_name: string;
  unit_plural: string;
  unit_min: number;
  unit_max: number;
  unit_default: number;
}

const SELECT = `
  SELECT
    p.*,
    c.slug AS cat_slug,
    c.name AS cat_name,
    c.pattern AS cat_pattern,
    c.unit_name AS unit_name,
    c.unit_plural AS unit_plural,
    c.unit_min AS unit_min,
    c.unit_max AS unit_max,
    c.unit_default AS unit_default
  FROM products p
  JOIN categories c ON c.id = p.category_id
`;

function toProduct(r: ProductRow): Product {
  const gallery = (JSON.parse(r.gallery) as string[])
    .map(resolveImageUrl)
    .filter((u): u is string => !!u);

  const main = resolveImageUrl(r.main_image);

  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    categorySlug: r.cat_slug,
    categoryName: r.cat_name,
    pattern: r.cat_pattern as Product["pattern"],
    unit: {
      name: r.unit_name,
      plural: r.unit_plural,
      min: r.unit_min,
      max: r.unit_max,
      defaultQty: r.unit_default,
    },
    price: r.price,
    colors: JSON.parse(r.colors) as FabricColor[],
    description: r.description,
    badge: (r.badge as ProductBadge | null) ?? null,
    featured: Boolean(r.featured),
    stock: r.stock,
    active: Boolean(r.active),
    images: [main, ...gallery].filter((u): u is string => !!u),
  };
}

export async function listProducts(
  opts: { activeOnly?: boolean } = {},
): Promise<Product[]> {
  const rows = opts.activeOnly
    ? await sql<ProductRow[]>`
        ${sql.unsafe(SELECT)}
        WHERE p.active = 1
        ORDER BY p.name ASC
      `
    : await sql<ProductRow[]>`
        ${sql.unsafe(SELECT)}
        ORDER BY p.name ASC
      `;

  return rows.map(toProduct);
}

export async function listProductsByCategory(
  categorySlug: string,
  opts: { activeOnly?: boolean } = {},
): Promise<Product[]> {
  const rows = opts.activeOnly
    ? await sql<ProductRow[]>`
        ${sql.unsafe(SELECT)}
        WHERE c.slug = ${categorySlug} AND p.active = 1
        ORDER BY p.name ASC
      `
    : await sql<ProductRow[]>`
        ${sql.unsafe(SELECT)}
        WHERE c.slug = ${categorySlug}
        ORDER BY p.name ASC
      `;

  return rows.map(toProduct);
}

export async function listFeaturedProducts(limit: number): Promise<Product[]> {
  const rows = await sql<ProductRow[]>`
    ${sql.unsafe(SELECT)}
    WHERE p.active = 1 AND p.featured = 1
    ORDER BY p.name ASC
    LIMIT ${Math.max(0, Math.floor(limit))}
  `;

  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const rows = await sql<ProductRow[]>`
    ${sql.unsafe(SELECT)}
    WHERE p.slug = ${slug}
    LIMIT 1
  `;

  return rows[0] ? toProduct(rows[0]) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const rows = await sql<ProductRow[]>`
    ${sql.unsafe(SELECT)}
    WHERE p.id = ${id}
    LIMIT 1
  `;

  return rows[0] ? toProduct(rows[0]) : null;
}

export interface ProductInput {
  slug: string;
  name: string;
  categoryId: string;
  price: number;
  colors: FabricColor[];
  description: string;
  badge: ProductBadge | null;
  featured: boolean;
  stock: number;
  active: boolean;
  mainImage: string | null;
  gallery: string[];
}

export async function createProduct(input: ProductInput): Promise<string> {
  const id = newId();

  await sql`
    INSERT INTO products (
      id, slug, name, category_id, price, colors, description, badge,
      featured, stock, active, main_image, gallery
    )
    VALUES (
      ${id},
      ${input.slug},
      ${input.name},
      ${input.categoryId},
      ${input.price},
      ${JSON.stringify(input.colors)},
      ${input.description},
      ${input.badge},
      ${input.featured ? 1 : 0},
      ${input.stock},
      ${input.active ? 1 : 0},
      ${input.mainImage},
      ${JSON.stringify(input.gallery)}
    )
  `;

  return id;
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<void> {
  await sql`
    UPDATE products
    SET
      slug = ${input.slug},
      name = ${input.name},
      category_id = ${input.categoryId},
      price = ${input.price},
      colors = ${JSON.stringify(input.colors)},
      description = ${input.description},
      badge = ${input.badge},
      featured = ${input.featured ? 1 : 0},
      stock = ${input.stock},
      active = ${input.active ? 1 : 0},
      main_image = ${input.mainImage},
      gallery = ${JSON.stringify(input.gallery)},
      updated_at = CURRENT_TIMESTAMP::text
    WHERE id = ${id}
  `;
}

export async function deleteProduct(id: string): Promise<void> {
  await sql`DELETE FROM products WHERE id = ${id}`;
}

export async function slugExists(
  slug: string,
  excludingId?: string,
): Promise<boolean> {
  const rows = excludingId
    ? await sql<{ exists: number }[]>`
        SELECT 1 AS exists
        FROM products
        WHERE slug = ${slug} AND id <> ${excludingId}
        LIMIT 1
      `
    : await sql<{ exists: number }[]>`
        SELECT 1 AS exists
        FROM products
        WHERE slug = ${slug}
        LIMIT 1
      `;

  return rows.length > 0;
}

/** Lowers stock by quantity, floored at zero. */
export async function decrementStock(
  productId: string,
  quantity: number,
): Promise<void> {
  await sql`
    UPDATE products
    SET
      stock = GREATEST(0, stock - ${Math.max(0, Math.floor(quantity))}),
      updated_at = CURRENT_TIMESTAMP::text
    WHERE id = ${productId}
  `;
}

/** Restores stock, e.g. when a paid order is cancelled. */
export async function incrementStock(
  productId: string,
  quantity: number,
): Promise<void> {
  await sql`
    UPDATE products
    SET
      stock = stock + ${Math.max(0, Math.floor(quantity))},
      updated_at = CURRENT_TIMESTAMP::text
    WHERE id = ${productId}
  `;
}
