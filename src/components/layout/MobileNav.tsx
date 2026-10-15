"use client";

import { Logo } from "@/components/brand/Logo";
import type { Category } from "@/types";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SearchForm } from "./SearchForm";

export function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const link =
    "group flex items-center justify-between rounded-xl px-3.5 py-3 text-[0.95rem] text-ink transition-colors duration-200 hover:bg-[#E8EFEA] hover:text-[#163D2A]";

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-surface-2 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-6" strokeWidth={1.7} />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="overlay fixed inset-0 z-50 bg-[#102318]/50 backdrop-blur-[2px]" />

        <Dialog.Content
          aria-describedby={undefined}
          className="drawer-left fixed inset-y-0 left-0 z-50 flex w-[88%] max-w-95 flex-col overflow-hidden bg-white shadow-2xl outline-none"
        >
          {/* Header */}
          <div className="flex min-h-19 shrink-0 items-center justify-between border-b border-green/10 px-5">
            <Dialog.Title asChild>
              <div className="flex items-center">
                <Logo />
              </div>
            </Dialog.Title>

            <Dialog.Close
              className="grid size-10 place-items-center rounded-full border border-green/10 text-ink transition-colors hover:bg-green-tint hover:text-green"
              aria-label="Close menu"
            >
              <X className="size-5" strokeWidth={1.7} />
            </Dialog.Close>
          </div>

          {/* Scrollable navigation */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-8 pt-5">
            <SearchForm />

            {/* Fabrics */}
            <section className="mt-8">
              <div className="mb-2 flex items-center justify-between px-3">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-green/55">
                  Explore fabrics
                </p>

                <Link
                  href="/shop"
                  onClick={close}
                  className="text-xs font-semibold text-green transition-opacity hover:opacity-65"
                >
                  View all
                </Link>
              </div>

              <ul className="space-y-0.5">
                <li>
                  <Link href="/shop" onClick={close} className={link}>
                    <span className="font-semibold">All fabrics</span>
                    <ArrowRight className="size-4 text-green/60 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>

                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/category/${category.slug}`}
                      onClick={close}
                      className={link}
                    >
                      <span>{category.name}</span>
                      <ChevronRight className="size-4 text-ink/35 transition-transform group-hover:translate-x-0.5 group-hover:text-green" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* Ankora links */}
            <section className="mt-8 border-t border-green/10 pt-6">
              <p className="mb-2 px-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-green/55">
                Ankora
              </p>

              <ul className="space-y-0.5">
                <li>
                  <Link href="/about" onClick={close} className={link}>
                    <span>About us</span>
                    <ChevronRight className="size-4 text-ink/35" />
                  </Link>
                </li>

                <li>
                  <Link href="/delivery" onClick={close} className={link}>
                    <span>Delivery information</span>
                    <ChevronRight className="size-4 text-ink/35" />
                  </Link>
                </li>

                <li>
                  <Link href="/track-order" onClick={close} className={link}>
                    <span>Track your order</span>
                    <ChevronRight className="size-4 text-ink/35" />
                  </Link>
                </li>
              </ul>
            </section>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-green/10 bg-[#F7F9F7] px-5 py-4">
            <p className="text-xs leading-relaxed text-green/65">
              Nigerian fabrics, thoughtfully selected.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
