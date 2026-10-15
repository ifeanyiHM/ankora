"use client";

import { SORT_OPTIONS, type SortKey } from "@/lib/catalog-utils";
import { cn } from "@/lib/cn";
import {
  ArrowDownAZ,
  ArrowDownWideNarrow,
  ArrowUpDown,
  Check,
  ChevronDown,
  Clock3,
  Sparkles,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SORT_ICONS: Record<string, typeof Sparkles> = {
  featured: Sparkles,
  "price-asc": ArrowDownWideNarrow,
  "price-desc": ArrowDownAZ,
  newest: Clock3,
};

export function SortSelect({ value }: { value: SortKey }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectedOption =
    SORT_OPTIONS.find((option) => option.value === value) ?? SORT_OPTIONS[0];

  const SelectedIcon = SORT_ICONS[value] ?? ArrowUpDown;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (open) {
      const selectedIndex = SORT_OPTIONS.findIndex(
        (option) => option.value === value,
      );

      requestAnimationFrame(() => {
        optionRefs.current[selectedIndex]?.focus();
      });
    }
  }, [open, value]);

  const selectOption = (nextValue: SortKey) => {
    const next = new URLSearchParams(params.toString());

    if (nextValue === "featured") {
      next.delete("sort");
    } else {
      next.set("sort", nextValue);
    }

    const query = next.toString();

    setOpen(false);

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const handleOptionKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowDown") {
      nextIndex = (index + 1) % SORT_OPTIONS.length;
    } else if (event.key === "ArrowUp") {
      nextIndex = (index - 1 + SORT_OPTIONS.length) % SORT_OPTIONS.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = SORT_OPTIONS.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      optionRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="relative z-20 flex shrink-0 items-center gap-2.5 xl1:gap-3"
    >
      <span className="hidden text-sm font-medium text-muted sm:inline xl1:text-base">
        Sort by
      </span>

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="fabric-sort-options"
        onClick={() => setOpen((previous) => !previous)}
        onKeyDown={(event) => {
          if (
            event.key === "ArrowDown" ||
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(
          "group flex h-11 min-w-46 items-center gap-2.5 rounded-full border bg-white px-3.5 text-left shadow-[0_2px_8px_rgba(22,61,42,0.04)] transition-all duration-200 sm:min-w-50 xl1:h-12 xl1:min-w-56 xl1:px-4 xl3:h-13 xl3:min-w-60",
          open
            ? "border-green ring-4 ring-[#163D2A]/10"
            : "border-green/20 hover:border-green/50 hover:shadow-[0_4px_14px_rgba(22,61,42,0.08)]",
        )}
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-green-tint text-green xl1:size-8">
          <SelectedIcon className="size-3.5 xl1:size-4" />
        </span>

        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-green xl1:text-base">
          {selectedOption.label}
        </span>

        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-green/65 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "absolute right-0 top-[calc(100%+0.625rem)] w-full min-w-52 origin-top-right rounded-2xl border border-green/10 bg-white p-2 shadow-[0_16px_48px_rgba(15,35,24,0.14)] transition-all duration-200",
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-2 scale-[0.98] opacity-0",
        )}
      >
        <div className="px-3 pb-2 pt-1.5">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-green/50">
            Arrange fabrics
          </p>
        </div>

        <div id="fabric-sort-options" role="listbox" aria-label="Sort fabrics">
          {SORT_OPTIONS.map((option, index) => {
            const OptionIcon = SORT_ICONS[option.value] ?? ArrowUpDown;
            const selected = option.value === value;

            return (
              <button
                key={option.value}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                type="button"
                role="option"
                aria-selected={selected}
                tabIndex={open ? 0 : -1}
                onClick={() => selectOption(option.value)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-150",
                  selected
                    ? "bg-green-tint text-green"
                    : "text-[#292F2A] hover:bg-[#F5F7F5]",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                    selected
                      ? "bg-green text-white"
                      : "bg-[#F3F5F3] text-green/65",
                  )}
                >
                  <OptionIcon className="size-4" />
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-sm",
                      selected ? "font-semibold" : "font-medium",
                    )}
                  >
                    {option.label}
                  </span>
                </span>

                {selected && <Check className="size-4 shrink-0 text-green" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
