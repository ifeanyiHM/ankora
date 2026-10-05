"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/admin/logout-action";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => { await logoutAction(); router.push("/admin/login"); router.refresh(); }}
      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white xl1:gap-3 xl1:px-3.5 xl1:py-3 xl1:text-[0.95rem] xl3:text-base"
    >
      <LogOut className="size-4 xl1:size-[1.1rem]" /> Sign out
    </button>
  );
}
