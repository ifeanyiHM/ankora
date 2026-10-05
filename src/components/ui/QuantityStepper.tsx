"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
  size?: "sm" | "md";
}

export function QuantityStepper({ value, min, max, onChange, label, size = "md" }: Props) {
  const btn = cn(
    "grid place-items-center text-ink transition-colors hover:bg-surface-2 disabled:opacity-35 disabled:hover:bg-transparent",
    size === "sm" ? "size-8 xl1:size-9 xl3:size-10" : "size-11 xl1:size-12 xl3:size-14",
  );
  const set = (n: number) => onChange(Math.min(max, Math.max(min, n)));
  return (
    <div className={cn("inline-flex items-center rounded-full border border-ink/25", size === "sm" ? "h-8 xl1:h-9 xl3:h-10" : "h-11 xl1:h-12 xl3:h-14")} role="group" aria-label={label}>
      <button type="button" className={cn(btn, "rounded-l-full")} onClick={() => set(value - 1)} disabled={value <= min} aria-label="Decrease quantity">
        <Minus className={size === "sm" ? "size-4 xl3:size-[1.125rem]" : "size-4 xl1:size-[1.1rem] xl3:size-5"} />
      </button>
      <input
        inputMode="numeric"
        aria-label={label}
        value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
          if (!Number.isNaN(n)) set(n);
        }}
        className={cn(
          "bg-transparent text-center font-semibold tabular-nums outline-none",
          size === "sm" ? "w-8 text-sm xl1:w-9 xl3:w-10 xl3:text-base" : "w-12 xl1:w-14 xl3:w-16 xl3:text-lg",
        )}
      />
      <button type="button" className={cn(btn, "rounded-r-full")} onClick={() => set(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <Plus className={size === "sm" ? "size-4 xl3:size-[1.125rem]" : "size-4 xl1:size-[1.1rem] xl3:size-5"} />
      </button>
    </div>
  );
}
