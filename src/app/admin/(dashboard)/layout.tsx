import { requireAdminSession } from "@/lib/admin-auth";
import { AdminSidebar } from "@/components/admin/Sidebar";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();
  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar adminName={session.name || session.email} />
      <div className="flex-1 overflow-x-hidden">
        <main className="mx-auto max-w-6xl px-6 py-8 xl1:max-w-7xl xl1:px-10 xl1:py-10 xl2:max-w-[86rem] xl2:px-12 xl2:py-12 xl3:max-w-[96rem] xl3:px-16 xl3:py-14 xl4:max-w-[108rem] xl4:px-20 xl4:py-16">{children}</main>
      </div>
    </div>
  );
}
