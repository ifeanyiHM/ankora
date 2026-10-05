import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listCategories } from "@/lib/db/categories";
import { getProductById } from "@/lib/db/products";
import { ProductForm } from "../../ProductForm";

export const metadata: Metadata = { title: "Edit product", robots: { index: false } };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();
  const categories = listCategories();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold xl1:mb-8 xl1:text-3xl xl2:text-4xl xl3:mb-10 xl4:text-[2.6rem]">Edit {product.name}</h1>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
