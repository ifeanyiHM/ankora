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
  "aso-oke": [
    [
      "Aso Oke Burgundy",
      82000,
      [
        ["Burgundy", "#7A1B2E"],
        ["Gold", "#D4A017"],
        ["Blush", "#E8B7B0"],
      ],
    ],
    [
      "Aso Oke Champagne",
      92000,
      [
        ["Champagne", "#DCC9A0"],
        ["Bronze", "#9C7A3C"],
        ["Ivory", "#FBF6E8"],
      ],
      "New",
    ],
  ],
  adire: [],
  akwete: [],
  george: [],
  ankara: [],
  atiku: [],
  hollandais: [],
  lace: [
    [
      "French Lace Emerald",
      68000,
      [
        ["Emerald", "#0A6444"],
        ["Mint", "#CBEBD9"],
        ["Gold", "#D4A017"],
      ],
    ],
    [
      "Cord Lace Ivory",
      96000,
      [
        ["Ivory", "#F3EEDF"],
        ["Gold", "#C9A227"],
        ["Cream", "#E1D6B8"],
      ],
    ],
    [
      "Swiss Voile Lace Coral",
      58000,
      [
        ["Coral", "#E5675A"],
        ["Blush White", "#FBEDEA"],
        ["Gold", "#D4A017"],
      ],
    ],
    [
      "Aso Ebi Lace Royal Blue",
      74000,
      [
        ["Royal Blue", "#1F3DA5"],
        ["Silver", "#D5DBEA"],
        ["Gold", "#D4A017"],
      ],
      "Bestseller",
      true,
    ],
    [
      "Beaded Lace Gold",
      128000,
      [
        ["Gold", "#C69A1E"],
        ["Cream", "#F6E8B8"],
        ["Brown", "#6A4A10"],
      ],
      "New",
    ],
    [
      "Guipure Lace Burgundy",
      82000,
      [
        ["Burgundy", "#741A30"],
        ["Blush", "#F0C7C1"],
        ["Gold", "#D4A017"],
      ],
    ],
  ],
  "guinea-brocade": [
    [
      "Guinea Brocade Sky",
      8200,
      [
        ["Sky", "#7EB0E0"],
        ["White", "#EEF4FB"],
        ["Silver", "#B5C3D8"],
      ],
    ],
    [
      "Guinea Brocade Cream",
      8800,
      [
        ["Cream", "#EDE3CA"],
        ["Gold", "#C9A227"],
        ["Brown", "#8A6A30"],
      ],
    ],
    [
      "Guinea Brocade Navy",
      9200,
      [
        ["Navy", "#15224F"],
        ["Silver", "#AEB8CE"],
        ["Gold", "#D4A017"],
      ],
      "Bestseller",
      true,
    ],
    [
      "Guinea Brocade Wine",
      9600,
      [
        ["Wine", "#6A1A30"],
        ["Gold", "#D4A017"],
        ["Blush", "#DDA9A4"],
      ],
    ],
    [
      "Guinea Brocade Olive",
      8600,
      [
        ["Olive", "#5F6B36"],
        ["Cream", "#ECE4CA"],
        ["Gold", "#C9A227"],
      ],
    ],
  ],
  damask: [
    [
      "Damask Ivory",
      9500,
      [
        ["Ivory", "#F1EBDC"],
        ["Gold", "#C9A227"],
        ["Brown", "#8A6A30"],
      ],
    ],
    [
      "Damask Sapphire",
      10500,
      [
        ["Sapphire", "#14318A"],
        ["Silver", "#B9C4E4"],
        ["Gold", "#D4A017"],
      ],
    ],
    [
      "Damask Plum",
      10000,
      [
        ["Plum", "#4B1F5C"],
        ["Lilac", "#C9B0D8"],
        ["Gold", "#D4A017"],
      ],
    ],
    [
      "Damask Emerald",
      10800,
      [
        ["Emerald", "#0B5E40"],
        ["Mint", "#B8DEC9"],
        ["Gold", "#D4A017"],
      ],
      "New",
    ],
    [
      "Damask Onyx",
      11500,
      [
        ["Onyx", "#17171B"],
        ["Silver", "#B0B4BE"],
        ["Gold", "#D4A017"],
      ],
    ],
  ],
  velvet: [
    [
      "Velvet Emerald",
      12500,
      [
        ["Emerald", "#0A5D3F"],
        ["Light Emerald", "#1E8A63"],
      ],
    ],
    [
      "Velvet Burgundy",
      12500,
      [
        ["Burgundy", "#6E1730"],
        ["Ruby", "#A02748"],
      ],
      "Bestseller",
      true,
    ],
    [
      "Velvet Midnight Blue",
      13000,
      [
        ["Midnight Blue", "#101B4A"],
        ["Royal", "#2A3C8A"],
      ],
    ],
    [
      "Velvet Gold",
      15500,
      [
        ["Gold", "#B8901F"],
        ["Light Gold", "#E2BE55"],
      ],
      "New",
    ],
    [
      "Velvet Black",
      11000,
      [
        ["Black", "#121215"],
        ["Graphite", "#3A3A44"],
      ],
    ],
  ],
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
  brocade: [
    [
      "Brocade Royal Gold",
      12500,
      [
        ["Gold", "#C69A1E"],
        ["Brown", "#5E410E"],
        ["Cream", "#F4E4A8"],
      ],
      "Bestseller",
      true,
    ],
    [
      "Brocade Silver Lilac",
      11500,
      [
        ["Lilac", "#9C86C4"],
        ["Silver", "#D6D2E6"],
        ["White", "#F6F4FB"],
      ],
    ],
    [
      "Brocade Emerald",
      12000,
      [
        ["Emerald", "#0B6845"],
        ["Gold", "#D4A017"],
        ["Mint", "#BFE0CE"],
      ],
    ],
    [
      "Brocade Crimson",
      12800,
      [
        ["Crimson", "#A3162B"],
        ["Gold", "#D4A017"],
        ["Blush", "#EBB9B3"],
      ],
    ],
    [
      "Brocade Champagne",
      13500,
      [
        ["Champagne", "#DDC9A4"],
        ["Bronze", "#9A7838"],
        ["Ivory", "#FBF5E6"],
      ],
      "New",
    ],
  ],
  kente: [
    [
      "Kente Asante Gold",
      98000,
      [
        ["Gold", "#D4A017"],
        ["Red", "#B7202E"],
        ["Green", "#0B7A4C"],
        ["Black", "#16161A"],
      ],
      "Handwoven",
      true,
    ],
    [
      "Kente Ewe Rainbow",
      88000,
      [
        ["Yellow", "#F2C230"],
        ["Blue", "#1D3FA6"],
        ["Red", "#C8321F"],
        ["Green", "#0A7A4B"],
      ],
      "Handwoven",
    ],
    [
      "Kente Emerald Royal",
      104000,
      [
        ["Emerald", "#0A6444"],
        ["Gold", "#D4A017"],
        ["Purple", "#4B1F7A"],
        ["White", "#F4F1E6"],
      ],
    ],
    [
      "Kente Sunrise",
      82000,
      [
        ["Orange", "#E8731A"],
        ["Yellow", "#F2C230"],
        ["Crimson", "#A3141F"],
        ["Black", "#16161A"],
      ],
    ],
    [
      "Kente Black Gold",
      115000,
      [
        ["Black", "#141416"],
        ["Gold", "#D4A017"],
        ["Red", "#A3141F"],
        ["White", "#F4F1E6"],
      ],
      "New",
    ],
  ],
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
