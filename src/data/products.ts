import { slugify } from "@/lib/slug";
import type { FabricColor, ProductBadge } from "@/types";
import { CATEGORIES } from "./categories";

/** Seed-only shape: what the seed script needs to create a row in the products table. */
export interface SeedProduct {
  slug: string;
  name: string;
  categorySlug: string;
  price: number;
  colors: FabricColor[];
  description: string;
  badge: ProductBadge | null;
  featured: boolean;
}

type Color = [name: string, hex: string];
/** [name, price in ₦ per selling unit, colours (first = ground colour), badge, featured] */
type Row = [string, number, Color[], ProductBadge?, boolean?];

const toColors = (cs: Color[]): FabricColor[] =>
  cs.map(([name, hex]) => ({ name, hex }));

/**
 * Prices are placeholders: edit them here.
 * Each row is one variety; the category decides the selling unit (yard, piece, set...).
 */
const CATALOG: Record<string, Row[]> = {
  "aso-oke": [],
  adire: [],
  akwete: [],
  george: [],
  ankara: [],
  // atiku: [],
  hollandais: [],
  lace: [],
  "guinea-brocade": [],
  "tribal-ankara": [],
  velvet: [],
  "senator-material": [
    [
      "Senator Black",
      6800,
      [
        ["Black", "#16161A"],
        ["Charcoal", "#3B3B44"],
      ],
    ],
    [
      "Senator Navy",
      7000,
      [
        ["Navy", "#14204F"],
        ["Blue", "#2B3E85"],
      ],
    ],
    [
      "Senator Ash Twill",
      7500,
      [
        ["Ash", "#B8BCC4"],
        ["Grey", "#8C919C"],
      ],
    ],
    [
      "Senator Cream",
      7200,
      [
        ["Cream", "#EEE6D2"],
        ["Sand", "#D2C4A1"],
      ],
      "Bestseller",
    ],
    [
      "Senator Chocolate",
      7400,
      [
        ["Chocolate", "#4A2E20"],
        ["Tan", "#7A5540"],
      ],
    ],
    [
      "Senator Olive",
      7300,
      [
        ["Olive", "#5A6338"],
        ["Moss", "#7F8A54"],
      ],
    ],
  ],
  brocade: [],
  // kente: [],
};

const joinNames = (names: string[]) =>
  names.length <= 1
    ? (names[0] ?? "")
    : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;

export const PRODUCTS: SeedProduct[] = CATEGORIES.flatMap((category) =>
  (CATALOG[category.slug] ?? []).map(
    ([name, price, colors, badge, featured]): SeedProduct => ({
      slug: slugify(name),
      name,
      categorySlug: category.slug,
      price,
      colors: toColors(colors),
      badge: badge ?? null,
      featured: featured ?? false,
      description: `${name} in ${joinNames(colors.map((c) => c[0].toLowerCase()))}. ${category.description}`,
    }),
  ),
);
