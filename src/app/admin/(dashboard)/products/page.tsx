import { ButtonLink } from "@/components/ui/Button";
import { listCategories } from "@/lib/db/categories";
import { listProducts, listProductsByCategory } from "@/lib/db/products";
import { formatNaira } from "@/lib/format";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CategoryFilterChips } from "./CategoryFilterChips";
import { DeleteProductButton } from "./DeleteProductButton";

export const metadata: Metadata = {
  title: "Products",
  robots: { index: false },
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const categories = listCategories();
  const activeCategory = categories.find((c) => c.slug === category);
  const products = activeCategory
    ? listProductsByCategory(activeCategory.slug)
    : listProducts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between xl1:mb-8 xl2:mb-10 xl3:mb-12">
        <h1 className="text-2xl font-bold xl1:text-3xl xl2:text-4xl xl4:text-[2.6rem]">
          Products{" "}
          <span className="text-lg font-normal text-muted xl1:text-xl xl3:text-2xl">
            ({products.length})
          </span>
        </h1>
        <ButtonLink href="/admin/products/new">
          <Plus className="size-4" /> Add product
        </ButtonLink>
      </div>

      <CategoryFilterChips
        categories={categories}
        activeSlug={activeCategory?.slug}
        basePath="/admin/products"
      />

      <div className="overflow-x-auto rounded-[4px] border border-line bg-white">
        <table className="w-full text-sm xl1:text-base xl3:text-[1.05rem]">
          <thead className="bg-surface text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">
                Product
              </th>
              <th className="px-4 py-3 font-medium xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">
                Category
              </th>
              <th className="px-4 py-3 text-right font-medium xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">
                Price
              </th>
              <th className="px-4 py-3 text-right font-medium xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">
                Stock
              </th>
              <th className="px-4 py-3 font-medium xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">
                Status
              </th>
              <th className="px-4 py-3 xl1:px-5 xl3:px-7" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-line">
                <td className="px-4 py-3 xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="font-semibold hover:underline"
                  >
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-3 xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5 text-muted">
                  {p.categoryName}
                </td>
                <td className="px-4 py-3 text-right xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">
                  {formatNaira(p.price)}
                </td>
                <td className="px-4 py-3 text-right xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">
                  {p.stock}
                </td>
                <td className="px-4 py-3 xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">
                  {!p.active ? (
                    <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-muted xl1:px-3 xl1:py-1.5 xl1:text-sm">
                      Hidden
                    </span>
                  ) : p.stock <= 0 ? (
                    <span className="rounded-full bg-danger/10 px-2.5 py-1 text-xs font-semibold text-danger xl1:px-3 xl1:py-1.5 xl1:text-sm">
                      Sold out
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-tint px-2.5 py-1 text-xs font-semibold text-green-dark xl1:px-3 xl1:py-1.5 xl1:text-sm">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">
                  <DeleteProductButton id={p.id} name={p.name} />
                </td>
              </tr>
            ))}
            {!products.length && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-muted xl1:py-14"
                >
                  {activeCategory
                    ? `No products in ${activeCategory.name} yet.`
                    : "No products yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// import type { Metadata } from "next";
// import Link from "next/link";
// import { Plus } from "lucide-react";
// import { ButtonLink } from "@/components/ui/Button";
// import { listProducts } from "@/lib/db/products";
// import { formatNaira } from "@/lib/format";
// import { DeleteProductButton } from "./DeleteProductButton";

// export const metadata: Metadata = { title: "Products", robots: { index: false } };

// export default function AdminProductsPage() {
//   const products = listProducts();

//   return (
//     <div>
//       <div className="mb-6 flex items-center justify-between xl1:mb-8 xl2:mb-10 xl3:mb-12">
//         <h1 className="text-2xl font-bold xl1:text-3xl xl2:text-4xl xl4:text-[2.6rem]">Products <span className="text-lg font-normal text-muted xl1:text-xl xl3:text-2xl">({products.length})</span></h1>
//         <ButtonLink href="/admin/products/new"><Plus className="size-4" /> Add product</ButtonLink>
//       </div>

//       <div className="overflow-x-auto rounded-[4px] border border-line bg-white">
//         <table className="w-full text-sm xl1:text-base xl3:text-[1.05rem]">
//           <thead className="bg-surface text-left text-muted">
//             <tr><th className="px-4 py-3 font-medium xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">Product</th><th className="px-4 py-3 font-medium xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">Category</th><th className="px-4 py-3 text-right font-medium xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">Price</th><th className="px-4 py-3 text-right font-medium xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">Stock</th><th className="px-4 py-3 font-medium xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">Status</th><th className="px-4 py-3 xl1:px-5 xl3:px-7" /></tr>
//           </thead>
//           <tbody>
//             {products.map((p) => (
//               <tr key={p.id} className="border-t border-line">
//                 <td className="px-4 py-3 xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5"><Link href={`/admin/products/${p.id}/edit`} className="font-semibold hover:underline">{p.name}</Link></td>
//                 <td className="px-4 py-3 xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5 text-muted">{p.categoryName}</td>
//                 <td className="px-4 py-3 text-right xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">{formatNaira(p.price)}</td>
//                 <td className="px-4 py-3 text-right xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">{p.stock}</td>
//                 <td className="px-4 py-3 xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5">
//                   {!p.active ? <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-muted xl1:px-3 xl1:py-1.5 xl1:text-sm">Hidden</span>
//                     : p.stock <= 0 ? <span className="rounded-full bg-danger/10 px-2.5 py-1 text-xs font-semibold text-danger xl1:px-3 xl1:py-1.5 xl1:text-sm">Sold out</span>
//                     : <span className="rounded-full bg-green-tint px-2.5 py-1 text-xs font-semibold text-green-dark xl1:px-3 xl1:py-1.5 xl1:text-sm">Active</span>}
//                 </td>
//                 <td className="px-4 py-3 xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5"><DeleteProductButton id={p.id} name={p.name} /></td>
//               </tr>
//             ))}
//             {!products.length && <tr><td colSpan={6} className="px-4 py-10 text-center text-muted xl1:py-14">No products yet.</td></tr>}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
