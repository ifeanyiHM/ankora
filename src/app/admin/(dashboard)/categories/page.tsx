import type { Metadata } from "next";
import Link from "next/link";
import { listCategories } from "@/lib/db/categories";
import { listProducts } from "@/lib/db/products";

export const metadata: Metadata = { title: "Categories", robots: { index: false } };

export default function AdminCategoriesPage() {
  const categories = listCategories();
  const products = listProducts();
  const countFor = (slug: string) => products.filter((p) => p.categorySlug === slug).length;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold xl1:text-3xl xl2:text-4xl xl4:text-[2.6rem]">Categories</h1>
      <p className="mb-6 text-muted xl1:mb-8 xl1:text-lg xl3:mb-10 xl3:text-xl">The 14 fabric families. Edit their copy, specs and image; new categories aren&apos;t added here since products depend on them.</p>
      <div className="overflow-hidden rounded-[4px] border border-line bg-white">
        <table className="w-full text-sm xl1:text-base xl3:text-[1.05rem]">
          <thead className="bg-surface text-left text-muted"><tr><th className="px-4 py-3 font-medium xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">Category</th><th className="px-4 py-3 font-medium xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">Sold by</th><th className="px-4 py-3 text-right font-medium xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">Products</th><th className="px-4 py-3 xl1:px-5 xl3:px-7" /></tr></thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t border-line">
                <td className="px-4 py-3 xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5 font-semibold">{c.name}</td>
                <td className="px-4 py-3 xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5 text-muted">{c.unit.name}</td>
                <td className="px-4 py-3 text-right xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">{countFor(c.slug)}</td>
                <td className="px-4 py-3 text-right xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5"><Link href={`/admin/categories/${c.id}/edit`} className="font-semibold text-green-dark hover:underline">Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
