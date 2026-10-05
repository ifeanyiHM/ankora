"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";
import { updateCategory, type CategoryUpdateInput } from "@/lib/db/categories";

export interface ActionResult { ok: boolean; error?: string }

export async function updateCategoryAction(id: string, input: CategoryUpdateInput): Promise<ActionResult> {
  await requireAdminSession();
  if (!input.name.trim()) return { ok: false, error: "Enter a category name." };
  if (!input.tagline.trim() || !input.description.trim()) return { ok: false, error: "Enter a tagline and description." };
  updateCategory(id, {
    ...input,
    name: input.name.trim(), tagline: input.tagline.trim(), description: input.description.trim(),
    origin: input.origin.trim(), material: input.material.trim(), width: input.width.trim(), care: input.care.trim(),
    uses: input.uses.map((u) => u.trim()).filter(Boolean),
    image: input.image?.trim() || null,
  });
  revalidatePath("/admin/categories");
  revalidatePath(`/admin/categories/${id}/edit`);
  return { ok: true };
}
