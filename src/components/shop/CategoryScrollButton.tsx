"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

export function CategoryScrollButtons() {
  const scrollCategories = (direction: -1 | 1) => {
    document.getElementById("fabric-category-list")?.scrollBy({
      top: direction * 220,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => scrollCategories(-1)}
        aria-label="Scroll categories up"
        className="grid size-7 place-items-center rounded-full border border-ink/15 text-ink transition hover:bg-surface-2 xl1:size-8"
      >
        <ChevronUp className="size-3.5 xl1:size-4" />
      </button>

      <button
        type="button"
        onClick={() => scrollCategories(1)}
        aria-label="Scroll categories down"
        className="grid size-7 place-items-center rounded-full border border-ink/15 text-ink transition hover:bg-surface-2 xl1:size-8"
      >
        <ChevronDown className="size-3.5 xl1:size-4" />
      </button>
    </div>
  );
}
