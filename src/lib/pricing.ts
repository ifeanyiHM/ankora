import { getProductBySlug } from "@/lib/db/products";
import { getCategoryBySlug } from "@/lib/db/categories";
import { getDeliveryFee } from "@/lib/delivery";
import { clampQuantity, unitLabel } from "@/lib/catalog";
import type { NewOrderItem } from "@/lib/db/orders";

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
 * The single source of truth for what a customer owes. Always re-reads price, unit and stock
 * from the database; a cart's own numbers are never trusted for billing.
 */
export function priceOrder(items: { slug: string; quantity: number }[], state: string): PriceOrderResult {
  const lines: PricedLine[] = [];
  const adjusted: PricedLine[] = [];
  const unavailable: string[] = [];

  for (const item of items) {
    const product = getProductBySlug(item.slug);
    const category = product ? getCategoryBySlug(product.categorySlug) : null;
    if (!product || !product.active || !category) {
      unavailable.push(item.slug);
      continue;
    }
    const requested = clampQuantity(category.unit, item.quantity);
    const quantity = Math.min(requested, Math.max(0, product.stock));
    const line: PricedLine = {
      productId: product.id, slug: product.slug, name: product.name,
      unitLabel: unitLabel(category.unit, quantity || requested), price: product.price,
      quantity, lineTotal: product.price * quantity, available: quantity > 0, requestedQuantity: requested,
    };
    if (quantity < requested) adjusted.push(line);
    if (quantity > 0) lines.push(line);
  }

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const delivery = lines.length ? getDeliveryFee(state, subtotal) : 0;
  return { lines, subtotal, delivery, total: subtotal + delivery, adjusted, unavailable };
}

export const toNewOrderItems = (lines: PricedLine[]): NewOrderItem[] =>
  lines.map((l) => ({ productId: l.productId, slug: l.slug, name: l.name, unitLabel: l.unitLabel, price: l.price, quantity: l.quantity }));
