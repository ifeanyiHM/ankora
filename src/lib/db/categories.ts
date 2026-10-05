import { db } from "./client";
import { resolveImageUrl } from "@/lib/images";
import type { Category, FabricPattern, SellingUnit } from "@/types";

interface CategoryRow {
  id: string; slug: string; name: string; tagline: string; description: string; origin: string;
  uses: string; material: string; width: string; care: string; pattern: string;
  unit_name: string; unit_plural: string; unit_min: number; unit_max: number; unit_default: number;
  image: string | null; sort_order: number;
}

function toCategory(r: CategoryRow): Category {
  const unit: SellingUnit = { name: r.unit_name, plural: r.unit_plural, min: r.unit_min, max: r.unit_max, defaultQty: r.unit_default };
  return {
    id: r.id, slug: r.slug, name: r.name, tagline: r.tagline, description: r.description, origin: r.origin,
    uses: JSON.parse(r.uses) as string[], material: r.material, width: r.width, care: r.care,
    pattern: r.pattern as FabricPattern, unit, image: resolveImageUrl(r.image),
  };
}

export function listCategories(): Category[] {
  const rows = db.prepare<[], CategoryRow>("SELECT * FROM categories ORDER BY sort_order ASC").all();
  return rows.map(toCategory);
}

export function getCategoryBySlug(slug: string): Category | null {
  const row = db.prepare<[string], CategoryRow>("SELECT * FROM categories WHERE slug = ?").get(slug);
  return row ? toCategory(row) : null;
}

export function getCategoryById(id: string): Category | null {
  const row = db.prepare<[string], CategoryRow>("SELECT * FROM categories WHERE id = ?").get(id);
  return row ? toCategory(row) : null;
}

export interface CategoryUpdateInput {
  name: string; tagline: string; description: string; origin: string; uses: string[];
  material: string; width: string; care: string; image: string | null;
}

export function updateCategory(id: string, input: CategoryUpdateInput): void {
  db.prepare(
    `UPDATE categories SET name=?, tagline=?, description=?, origin=?, uses=?, material=?, width=?, care=?, image=?, updated_at=datetime('now') WHERE id=?`,
  ).run(input.name, input.tagline, input.description, input.origin, JSON.stringify(input.uses), input.material, input.width, input.care, input.image, id);
}
