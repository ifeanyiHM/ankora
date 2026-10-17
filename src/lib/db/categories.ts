import { resolveImageUrl } from "@/lib/images";
import type { Category, FabricPattern, SellingUnit } from "@/types";
import { revalidateTag, unstable_cache } from "next/cache";
import { sql } from "./client";

interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  origin: string;
  uses: string;
  material: string;
  width: string;
  care: string;
  pattern: string;
  unit_name: string;
  unit_plural: string;
  unit_min: number;
  unit_max: number;
  unit_default: number;
  image: string | null;
  images: unknown;
  sort_order: number;
}

const CATEGORIES_TAG = "categories";

/** Network-level errors that are worth retrying (DNS blips, dropped connections). */
const TRANSIENT_ERROR_CODES = new Set([
  "ENOTFOUND",
  "EAI_AGAIN",
  "ECONNRESET",
  "ETIMEDOUT",
  "ECONNREFUSED",
]);

/**
 * Runs a database call and retries it a couple of times when it fails
 * because of a temporary network problem. Real errors (bad SQL, etc.)
 * are thrown straight away.
 */
async function withRetry<T>(fn: () => Promise<T>, tries = 3): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const code = (error as { code?: string }).code;

      if (attempt >= tries || !code || !TRANSIENT_ERROR_CODES.has(code)) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
    }
  }
}

function parseCategoryImages(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item): item is string => typeof item === "string",
        );
      }
    } catch {
      // Invalid JSON; return an empty image list.
    }
  }

  return [];
}

function toCategory(r: CategoryRow): Category {
  const unit: SellingUnit = {
    name: r.unit_name,
    plural: r.unit_plural,
    min: r.unit_min,
    max: r.unit_max,
    defaultQty: r.unit_default,
  };

  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    tagline: r.tagline,
    description: r.description,
    origin: r.origin,
    uses: JSON.parse(r.uses) as string[],
    material: r.material,
    width: r.width,
    care: r.care,
    pattern: r.pattern as FabricPattern,
    unit,
    image: resolveImageUrl(r.image),
    images: parseCategoryImages(r.images),
  };
}

/**
 * All categories, cached for 5 minutes so most page loads never touch the
 * database. Cleared immediately when a category is updated (see updateCategory).
 */
export const listCategories = unstable_cache(
  async (): Promise<Category[]> => {
    const rows = await withRetry(
      () => sql<CategoryRow[]>`
        SELECT *
        FROM categories
        ORDER BY sort_order ASC
      `,
    );

    return rows.map(toCategory);
  },
  ["categories:list"],
  { revalidate: 300, tags: [CATEGORIES_TAG] },
);

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const rows = await withRetry(
    () => sql<CategoryRow[]>`
      SELECT *
      FROM categories
      WHERE slug = ${slug}
      LIMIT 1
    `,
  );

  return rows[0] ? toCategory(rows[0]) : null;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const rows = await withRetry(
    () => sql<CategoryRow[]>`
      SELECT *
      FROM categories
      WHERE id = ${id}
      LIMIT 1
    `,
  );

  return rows[0] ? toCategory(rows[0]) : null;
}

export interface CategoryUpdateInput {
  name: string;
  tagline: string;
  description: string;
  origin: string;
  uses: string[];
  material: string;
  width: string;
  care: string;
  image: string | null;
  images: string[];
}

export async function updateCategory(
  id: string,
  input: CategoryUpdateInput,
): Promise<void> {
  await withRetry(
    () => sql`
      UPDATE categories
      SET
        name = ${input.name},
        tagline = ${input.tagline},
        description = ${input.description},
        origin = ${input.origin},
        uses = ${JSON.stringify(input.uses)},
        material = ${input.material},
        width = ${input.width},
        care = ${input.care},
        image = ${input.image},
        images = ${JSON.stringify(input.images)}::jsonb,
        updated_at = CURRENT_TIMESTAMP::text
      WHERE id = ${id}
    `,
  );

  // Make the storefront pick up the change straight away.
  revalidateTag(CATEGORIES_TAG, "max");
}
