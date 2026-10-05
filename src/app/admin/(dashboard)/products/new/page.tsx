import type { Metadata } from "next";
import { listCategories } from "@/lib/db/categories";
import { ProductForm } from "../ProductForm";

export const metadata: Metadata = { title: "Add product", robots: { index: false } };

export default function NewProductPage() {
  const categories = listCategories();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold xl1:mb-8 xl1:text-3xl xl2:text-4xl xl3:mb-10 xl4:text-[2.6rem]">Add product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
