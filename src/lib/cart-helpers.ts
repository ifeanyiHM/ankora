import type { CartItem } from "@/types";

/** Pure, client-safe totals: the cart's own display numbers. The server re-prices at checkout. */
export const cartSubtotal = (items: CartItem[]): number => items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const cartCount = (items: CartItem[]): number => items.reduce((sum, i) => sum + i.quantity, 0);
