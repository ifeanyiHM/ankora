"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { SearchForm } from "./SearchForm";
import type { Category } from "@/types";

export function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const link = "block rounded-lg px-3 py-2.5 text-[1.05rem] hover:bg-surface-2";
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="grid size-11 place-items-center rounded-full hover:bg-surface-2 lg:hidden" aria-label="Open menu">
        <Menu className="size-6" strokeWidth={1.8} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay fixed inset-0 z-50 bg-ink/50" />
        <Dialog.Content aria-describedby={undefined} className="drawer-left fixed inset-y-0 left-0 z-50 flex w-[88%] max-w-sm flex-col bg-white">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <Dialog.Title asChild><span><Logo /></span></Dialog.Title>
            <Dialog.Close className="grid size-10 place-items-center rounded-full hover:bg-surface-2" aria-label="Close menu"><X className="size-5" /></Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <SearchForm />
            <p className="mb-1 mt-6 px-3 text-sm font-semibold text-muted">Fabrics</p>
            <ul>
              <li><Link href="/shop" onClick={close} className={`${link} font-semibold`}>All fabrics</Link></li>
              {categories.map((c) => (
                <li key={c.slug}><Link href={`/category/${c.slug}`} onClick={close} className={link}>{c.name}</Link></li>
              ))}
            </ul>
            <p className="mb-1 mt-6 px-3 text-sm font-semibold text-muted">Ankora</p>
            <ul>
              <li><Link href="/about" onClick={close} className={link}>About</Link></li>
              <li><Link href="/delivery" onClick={close} className={link}>Delivery</Link></li>
              <li><Link href="/track-order" onClick={close} className={link}>Track order</Link></li>
            </ul>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
