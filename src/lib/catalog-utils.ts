/** Pure catalogue helpers with no database import, so client components can use them safely. */
import type { Product } from "@/types";

export type SortKey = "featured" | "price-asc" | "price-desc" | "name";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
];

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const list = [...products];
  switch (sort) {
    case "price-asc": return list.sort((a, b) => a.price - b.price);
    case "price-desc": return list.sort((a, b) => b.price - a.price);
    case "name": return list.sort((a, b) => a.name.localeCompare(b.name));
    default: return list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }
}

export const parseSort = (value: string | undefined): SortKey =>
  SORT_OPTIONS.some((o) => o.value === value) ? (value as SortKey) : "featured";

export function searchProducts(products: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter(
    (p) => p.name.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q) || p.colors.some((c) => c.name.toLowerCase().includes(q)),
  );
}

export interface UnitLike { name: string; plural: string; min: number; max: number }
export const clampQuantity = (unit: UnitLike, qty: number): number =>
  Math.min(unit.max, Math.max(unit.min, Math.floor(Number.isFinite(qty) ? qty : unit.min)));
export const unitLabel = (unit: UnitLike, qty: number): string => (qty === 1 ? unit.name : unit.plural);
