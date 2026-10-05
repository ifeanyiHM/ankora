import { resolveImageUrl } from "@/lib/images";
import type { FabricColor, Product, ProductBadge } from "@/types";
import { db, newId } from "./client";

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
  SELECT p.*, c.slug AS cat_slug, c.name AS cat_name, c.pattern AS cat_pattern,
         c.unit_name AS unit_name, c.unit_plural AS unit_plural, c.unit_min AS unit_min, c.unit_max AS unit_max, c.unit_default AS unit_default
  FROM products p JOIN categories c ON c.id = p.category_id
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
    featured: !!r.featured,
    stock: r.stock,
    active: !!r.active,
    images: [main, ...gallery].filter((u): u is string => !!u),
  };
}

export function listProducts(opts: { activeOnly?: boolean } = {}): Product[] {
  const where = opts.activeOnly ? "WHERE p.active = 1" : "";
  return db
    .prepare<[], ProductRow>(`${SELECT} ${where} ORDER BY p.name ASC`)
    .all()
    .map(toProduct);
}

export function listProductsByCategory(
  categorySlug: string,
  opts: { activeOnly?: boolean } = {},
): Product[] {
  const where = opts.activeOnly ? "AND p.active = 1" : "";
  return db
    .prepare<
      [string],
      ProductRow
    >(`${SELECT} WHERE c.slug = ? ${where} ORDER BY p.name ASC`)
    .all(categorySlug)
    .map(toProduct);
}

export function listFeaturedProducts(limit: number): Product[] {
  return db
    .prepare<
      [number],
      ProductRow
    >(`${SELECT} WHERE p.active = 1 AND p.featured = 1 ORDER BY p.name ASC LIMIT ?`)
    .all(limit)
    .map(toProduct);
}

export function getProductBySlug(slug: string): Product | null {
  const row = db
    .prepare<[string], ProductRow>(`${SELECT} WHERE p.slug = ?`)
    .get(slug);
  return row ? toProduct(row) : null;
}

export function getProductById(id: string): Product | null {
  const row = db
    .prepare<[string], ProductRow>(`${SELECT} WHERE p.id = ?`)
    .get(id);
  return row ? toProduct(row) : null;
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

export function createProduct(input: ProductInput): string {
  const id = newId();
  db.prepare(
    `INSERT INTO products (id, slug, name, category_id, price, colors, description, badge, featured, stock, active, main_image, gallery)
     VALUES (@id, @slug, @name, @categoryId, @price, @colors, @description, @badge, @featured, @stock, @active, @mainImage, @gallery)`,
  ).run({
    id,
    slug: input.slug,
    name: input.name,
    categoryId: input.categoryId,
    price: input.price,
    colors: JSON.stringify(input.colors),
    description: input.description,
    badge: input.badge,
    featured: input.featured ? 1 : 0,
    stock: input.stock,
    active: input.active ? 1 : 0,
    mainImage: input.mainImage,
    gallery: JSON.stringify(input.gallery),
  });
  return id;
}

export function updateProduct(id: string, input: ProductInput): void {
  db.prepare(
    `UPDATE products SET slug=@slug, name=@name, category_id=@categoryId, price=@price, colors=@colors, description=@description,
       badge=@badge, featured=@featured, stock=@stock, active=@active, main_image=@mainImage, gallery=@gallery, updated_at=datetime('now')
     WHERE id=@id`,
  ).run({
    id,
    slug: input.slug,
    name: input.name,
    categoryId: input.categoryId,
    price: input.price,
    colors: JSON.stringify(input.colors),
    description: input.description,
    badge: input.badge,
    featured: input.featured ? 1 : 0,
    stock: input.stock,
    active: input.active ? 1 : 0,
    mainImage: input.mainImage,
    gallery: JSON.stringify(input.gallery),
  });
}

export function deleteProduct(id: string): void {
  db.prepare("DELETE FROM products WHERE id = ?").run(id);
}

export function slugExists(slug: string, excludingId?: string): boolean {
  const row = excludingId
    ? db
        .prepare("SELECT 1 FROM products WHERE slug = ? AND id != ?")
        .get(slug, excludingId)
    : db.prepare("SELECT 1 FROM products WHERE slug = ?").get(slug);
  return !!row;
}

/** Lowers stock by quantity, floored at 0. Used once, when a payment is confirmed. */
export function decrementStock(productId: string, quantity: number): void {
  db.prepare(
    "UPDATE products SET stock = MAX(0, stock - ?), updated_at = datetime('now') WHERE id = ?",
  ).run(quantity, productId);
}

/** Restores stock, e.g. when a paid order is cancelled. */
export function incrementStock(productId: string, quantity: number): void {
  db.prepare(
    "UPDATE products SET stock = stock + ?, updated_at = datetime('now') WHERE id = ?",
  ).run(quantity, productId);
}
