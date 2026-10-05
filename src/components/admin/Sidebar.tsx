"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Shapes, ShoppingCart } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/cn";
import { LogoutButton } from "./LogoutButton";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Shapes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-ink text-white xl1:w-64 xl2:w-72 xl3:w-80 xl4:w-[22rem]">
      <div className="border-b border-white/10 px-5 py-5 xl1:px-6 xl1:py-6 xl2:px-7 xl3:px-8 xl3:py-7 xl4:px-9 xl4:py-8">
        <Logo className="xl2:scale-105 xl2:origin-left xl3:scale-110 xl4:scale-[1.15]" light />
        <p className="mt-1 text-xs text-white/50 xl1:mt-1.5 xl1:text-sm xl3:text-[0.95rem]">Admin dashboard</p>
      </div>
      <nav className="flex-1 space-y-0.5 px-3 py-4 xl1:space-y-1 xl1:px-4 xl1:py-5 xl2:px-5 xl3:px-6 xl3:py-6">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors xl1:gap-3 xl1:px-3.5 xl1:py-3 xl1:text-[0.95rem] xl2:px-4 xl3:py-3.5 xl3:text-base xl4:py-4",
                active ? "bg-green text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="size-4 xl1:size-[1.1rem] xl3:size-5" /> {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-3 xl1:p-4 xl2:p-5 xl3:p-6">
        <p className="truncate px-3 py-1 text-xs text-white/40 xl1:px-3.5 xl1:text-sm">{adminName}</p>
        <LogoutButton />
      </div>
    </aside>
  );
}
