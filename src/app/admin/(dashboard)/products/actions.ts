"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";
import { createProduct, deleteProduct, slugExists, updateProduct, type ProductInput } from "@/lib/db/products";
import { slugify } from "@/lib/slug";
import type { FabricColor, ProductBadge } from "@/types";

export interface ProductFormInput {
  name: string;
  categoryId: string;
  price: number;
  colors: FabricColor[];
  description: string;
  badge: ProductBadge | "" | null;
  featured: boolean;
  stock: number;
  active: boolean;
  mainImage: string;
  gallery: string; // newline-separated
}
export interface ActionResult { ok: boolean; error?: string; id?: string }

function toInput(form: ProductFormInput, slug: string): ProductInput {
  return {
    slug, name: form.name.trim(), categoryId: form.categoryId, price: Math.round(form.price),
    colors: form.colors.filter((c) => c.name.trim() && c.hex.trim()),
    description: form.description.trim(), badge: form.badge || null, featured: form.featured,
    stock: Math.max(0, Math.round(form.stock)), active: form.active,
    mainImage: form.mainImage.trim() || null,
    gallery: form.gallery.split("\n").map((s) => s.trim()).filter(Boolean),
  };
}

function validate(form: ProductFormInput): string | null {
  if (!form.name.trim()) return "Enter a product name.";
  if (!form.categoryId) return "Choose a fabric category.";
  if (!Number.isFinite(form.price) || form.price <= 0) return "Enter a price greater than zero.";
  if (!form.colors.some((c) => c.name.trim() && c.hex.trim())) return "Add at least one colour.";
  if (!form.description.trim()) return "Enter a description.";
  return null;
}

export async function createProductAction(form: ProductFormInput): Promise<ActionResult> {
  await requireAdminSession();
  const error = validate(form);
  if (error) return { ok: false, error };
  const slug = slugify(form.name);
  if (!slug) return { ok: false, error: "Enter a valid product name." };
  if (slugExists(slug)) return { ok: false, error: "A product with a similar name already exists. Please make the name more specific." };
  const id = createProduct(toInput(form, slug));
  revalidatePath("/admin/products");
  return { ok: true, id };
}

export async function updateProductAction(id: string, form: ProductFormInput): Promise<ActionResult> {
  await requireAdminSession();
  const error = validate(form);
  if (error) return { ok: false, error };
  const slug = slugify(form.name);
  if (!slug) return { ok: false, error: "Enter a valid product name." };
  if (slugExists(slug, id)) return { ok: false, error: "A product with a similar name already exists. Please make the name more specific." };
  updateProduct(id, toInput(form, slug));
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  return { ok: true, id };
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  await requireAdminSession();
  deleteProduct(id);
  revalidatePath("/admin/products");
  return { ok: true };
}
