"use client";
import { useSyncExternalStore } from "react";

const noop = () => () => {};
/** false during SSR and the first client render, true afterwards. Avoids hydration mismatches for persisted state. */
export const useMounted = (): boolean => useSyncExternalStore(noop, () => true, () => false);
