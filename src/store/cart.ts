"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

const clamp = (unit: CartItem["unit"], qty: number) => Math.min(unit.max, Math.max(unit.min, Math.floor(qty) || unit.min));

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      add: (item, quantity = item.unit.defaultQty) =>
        set((s) => {
          const existing = s.items.find((i) => i.slug === item.slug);
          const next = clamp(item.unit, (existing?.quantity ?? 0) + quantity);
          return {
            items: existing
              ? s.items.map((i) => (i.slug === item.slug ? { ...i, quantity: next } : i))
              : [...s.items, { ...item, quantity: next }],
            isOpen: true,
          };
        }),
      setQuantity: (slug, quantity) =>
        set((s) => ({ items: s.items.map((i) => (i.slug === slug ? { ...i, quantity: clamp(i.unit, quantity) } : i)) })),
      remove: (slug) => set((s) => ({ items: s.items.filter((i) => i.slug !== slug) })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    { name: "ankora-cart", version: 2, partialize: (s) => ({ items: s.items }) },
  ),
);
