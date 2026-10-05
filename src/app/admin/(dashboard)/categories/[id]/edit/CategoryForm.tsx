"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Category } from "@/types";
import { updateCategoryAction } from "../../actions";

const input = "h-11 w-full rounded-lg border border-ink/25 bg-white px-3.5 text-[0.95rem] outline-none transition focus:border-green focus:ring-1 focus:ring-green xl1:h-12 xl1:px-4 xl1:text-base xl2:h-[3.25rem] xl3:h-14 xl3:text-lg";
const label = "mb-1.5 block text-sm font-semibold xl1:mb-2 xl1:text-base xl3:text-lg";

export function CategoryForm({ category }: { category: Category }) {
  const router = useRouter();
  const [name, setName] = useState(category.name);
  const [tagline, setTagline] = useState(category.tagline);
  const [description, setDescription] = useState(category.description);
  const [origin, setOrigin] = useState(category.origin);
  const [material, setMaterial] = useState(category.material);
  const [width, setWidth] = useState(category.width);
  const [care, setCare] = useState(category.care);
  const [uses, setUses] = useState(category.uses.join("\n"));
  const [image, setImage] = useState(category.image ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await updateCategoryAction(category.id, {
      name, tagline, description, origin, material, width, care,
      uses: uses.split("\n"), image: image || null,
    });
    if (!res.ok) { setError(res.error ?? "Something went wrong."); setSaving(false); return; }
    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-2xl gap-5 xl1:max-w-3xl xl1:gap-6 xl2:max-w-[52rem] xl3:max-w-4xl xl3:gap-7 xl4:max-w-5xl">
      <div><label className={label} htmlFor="name">Name</label><input id="name" value={name} onChange={(e) => setName(e.target.value)} className={input} required /></div>
      <div><label className={label} htmlFor="tagline">Tagline</label><input id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} className={input} required /></div>
      <div><label className={label} htmlFor="description">Description</label><textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={`${input} h-auto py-2.5 xl1:py-3`} required /></div>
      <div className="grid gap-5 sm:grid-cols-3 xl1:gap-6 xl3:gap-7">
        <div><label className={label} htmlFor="origin">Origin</label><input id="origin" value={origin} onChange={(e) => setOrigin(e.target.value)} className={input} /></div>
        <div><label className={label} htmlFor="material">Material</label><input id="material" value={material} onChange={(e) => setMaterial(e.target.value)} className={input} /></div>
        <div><label className={label} htmlFor="width">Width</label><input id="width" value={width} onChange={(e) => setWidth(e.target.value)} className={input} /></div>
      </div>
      <div><label className={label} htmlFor="care">Care</label><input id="care" value={care} onChange={(e) => setCare(e.target.value)} className={input} /></div>
      <div><label className={label} htmlFor="uses">Typical uses (one per line)</label><textarea id="uses" rows={4} value={uses} onChange={(e) => setUses(e.target.value)} className={`${input} h-auto py-2.5 xl1:py-3`} /></div>
      <div><label className={label} htmlFor="image">Category image URL</label><input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://... (leave blank for generated swatch)" className={input} /></div>
      {error && <p role="alert" className="rounded-lg border border-danger/40 bg-danger/5 p-3 text-sm text-danger xl1:p-4 xl1:text-base">{error}</p>}
      <Button type="submit" size="lg" className="w-fit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
    </form>
  );
}
