import { clampQuantity, unitLabel } from "@/lib/catalog";
import { getCategoryBySlug } from "@/lib/db/categories";
import type { NewOrderItem } from "@/lib/db/orders";
import { getProductBySlug } from "@/lib/db/products";
import { getDeliveryFee } from "@/lib/delivery";

export interface PricedLine {
  productId: string | null;
  slug: string;
  name: string;
  unitLabel: string;
  price: number;
  quantity: number;
  lineTotal: number;
  available: boolean;
  requestedQuantity: number;
}

export interface PriceOrderResult {
  lines: PricedLine[];
  subtotal: number;
  delivery: number;
  total: number;
  adjusted: PricedLine[];
  unavailable: string[];
}

/**
 * The single source of truth for what a customer owes.
 * Prices, units, and stock are always re-read from the database.
 */
export async function priceOrder(
  items: { slug: string; quantity: number }[],
  state: string,
): Promise<PriceOrderResult> {
  const lines: PricedLine[] = [];
  const adjusted: PricedLine[] = [];
  const unavailable: string[] = [];

  for (const item of items) {
    const product = await getProductBySlug(item.slug);
    const category = product
      ? await getCategoryBySlug(product.categorySlug)
      : null;

    if (!product || !product.active || !category) {
      unavailable.push(item.slug);
      continue;
    }

    const requested = clampQuantity(category.unit, item.quantity);
    const quantity = Math.min(requested, Math.max(0, product.stock));

    const line: PricedLine = {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      unitLabel: unitLabel(category.unit, quantity || requested),
      price: product.price,
      quantity,
      lineTotal: product.price * quantity,
      available: quantity > 0,
      requestedQuantity: requested,
    };

    if (quantity < requested) adjusted.push(line);
    if (quantity > 0) lines.push(line);
  }

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const delivery = lines.length ? getDeliveryFee(state, subtotal) : 0;

  return {
    lines,
    subtotal,
    delivery,
    total: subtotal + delivery,
    adjusted,
    unavailable,
  };
}

export const toNewOrderItems = (lines: PricedLine[]): NewOrderItem[] =>
  lines.map((line) => ({
    productId: line.productId,
    slug: line.slug,
    name: line.name,
    unitLabel: line.unitLabel,
    price: line.price,
    quantity: line.quantity,
  }));
