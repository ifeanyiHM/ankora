"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";

/** Keeps the cart in sync across browser tabs. */
export function CartSync() {
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "ankora-cart") void useCart.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return null;
}
