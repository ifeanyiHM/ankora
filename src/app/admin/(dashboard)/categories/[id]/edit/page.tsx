import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryById } from "@/lib/db/categories";
import { CategoryForm } from "./CategoryForm";

export const metadata: Metadata = { title: "Edit category", robots: { index: false } };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = getCategoryById(id);
  if (!category) notFound();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold xl1:mb-8 xl1:text-3xl xl2:text-4xl xl3:mb-10 xl4:text-[2.6rem]">Edit {category.name}</h1>
      <CategoryForm category={category} />
    </div>
  );
}
