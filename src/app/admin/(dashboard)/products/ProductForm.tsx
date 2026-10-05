"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatNaira } from "@/lib/format";
import type { Category, FabricColor, Product, ProductBadge } from "@/types";
import { createProductAction, updateProductAction, type ProductFormInput } from "./actions";

const input = "h-11 w-full rounded-lg border border-ink/25 bg-white px-3.5 text-[0.95rem] outline-none transition focus:border-green focus:ring-1 focus:ring-green xl1:h-12 xl1:px-4 xl1:text-base xl2:h-[3.25rem] xl3:h-14 xl3:text-lg xl4:h-[3.75rem]";
const label = "mb-1.5 block text-sm font-semibold xl1:mb-2 xl1:text-base xl3:text-lg";
const BADGES: (ProductBadge | "")[] = ["", "Bestseller", "New", "Handwoven"];

export function ProductForm({ categories, product }: { categories: Category[]; product?: Product }) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [categoryId, setCategoryId] = useState(product ? categories.find((c) => c.slug === product.categorySlug)?.id ?? "" : categories[0]?.id ?? "");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [colors, setColors] = useState<FabricColor[]>(product?.colors.length ? product.colors : [{ name: "", hex: "#008751" }]);
  const [description, setDescription] = useState(product?.description ?? "");
  const [badge, setBadge] = useState<ProductBadge | "">(product?.badge ?? "");
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [stock, setStock] = useState(product?.stock ?? 25);
  const [active, setActive] = useState(product?.active ?? true);
  const [mainImage, setMainImage] = useState(product?.images[0] ?? "");
  const [gallery, setGallery] = useState(product?.images.slice(1).join("\n") ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const setColor = (i: number, patch: Partial<FabricColor>) => setColors((cs) => cs.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const form: ProductFormInput = { name, categoryId, price, colors, description, badge, featured, stock, active, mainImage, gallery };
    const res = product ? await updateProductAction(product.id, form) : await createProductAction(form);
    if (!res.ok) {
      setError(res.error ?? "Something went wrong.");
      setSaving(false);
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_20rem] xl1:gap-10 xl1:grid-cols-[1fr_24rem] xl2:grid-cols-[1fr_26rem] xl3:gap-12 xl3:grid-cols-[1fr_30rem] xl4:grid-cols-[1fr_34rem]">
      <div className="grid gap-5 xl1:gap-6 xl3:gap-7">
        <div>
          <label className={label} htmlFor="name">Product name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} className={input} required />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl1:gap-6 xl3:gap-7">
          <div>
            <label className={label} htmlFor="category">Fabric category</label>
            <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={input} required>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="price">Price (₦ per {categories.find((c) => c.id === categoryId)?.unit.name ?? "unit"})</label>
            <input id="price" type="number" min={1} value={price} onChange={(e) => setPrice(Number(e.target.value))} className={input} required />
            <p className="mt-1 text-xs text-muted xl1:text-sm xl3:text-[0.95rem]">{formatNaira(price || 0)}</p>
          </div>
        </div>
        <div>
          <label className={label} htmlFor="description">Description</label>
          <textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={`${input} h-auto py-2.5 xl1:py-3`} required />
        </div>
        <div>
          <p className={label}>Colours</p>
          <div className="grid gap-2 xl1:gap-2.5 xl3:gap-3">
            {colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2 xl1:gap-3">
                <input type="color" value={c.hex} onChange={(e) => setColor(i, { hex: e.target.value })} className="h-11 w-11 shrink-0 cursor-pointer rounded-lg border border-ink/25 p-1 xl1:h-12 xl1:w-12 xl3:h-14 xl3:w-14" />
                <input value={c.name} onChange={(e) => setColor(i, { name: e.target.value })} placeholder="Colour name" className={input} />
                <button type="button" onClick={() => setColors((cs) => cs.filter((_, idx) => idx !== i))} className="grid size-11 shrink-0 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-danger xl1:size-12 xl3:size-14" aria-label="Remove colour"><Trash2 className="size-4 xl1:size-[1.1rem] xl3:size-5" /></button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setColors((cs) => [...cs, { name: "", hex: "#008751" }])} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-green-dark hover:underline xl1:mt-3 xl1:text-base xl3:text-lg"><Plus className="size-4 xl1:size-[1.1rem]" /> Add colour</button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl1:gap-6 xl3:gap-7">
          <div>
            <label className={label} htmlFor="mainImage">Main image URL</label>
            <input id="mainImage" value={mainImage} onChange={(e) => setMainImage(e.target.value)} placeholder="https://... (leave blank for generated swatch)" className={input} />
          </div>
          <div>
            <label className={label} htmlFor="badge">Badge</label>
            <select id="badge" value={badge} onChange={(e) => setBadge(e.target.value as ProductBadge | "")} className={input}>
              {BADGES.map((b) => <option key={b} value={b}>{b || "None"}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={label} htmlFor="gallery">Extra photo URLs (one per line)</label>
          <textarea id="gallery" rows={3} value={gallery} onChange={(e) => setGallery(e.target.value)} className={`${input} h-auto py-2.5 xl1:py-3`} />
        </div>
      </div>

      <div className="grid content-start gap-5 xl1:gap-6">
        <div className="rounded-[4px] border border-line bg-white p-5 xl1:p-6 xl3:p-7">
          <div>
            <label className={label} htmlFor="stock">Stock</label>
            <input id="stock" type="number" min={0} value={stock} onChange={(e) => setStock(Number(e.target.value))} className={input} required />
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm font-medium xl1:mt-5 xl1:gap-2.5 xl1:text-base xl3:text-lg">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="size-4 accent-green xl1:size-[1.1rem] xl3:size-5" /> Feature on homepage
          </label>
          <label className="mt-3 flex items-center gap-2 text-sm font-medium xl1:mt-4 xl1:gap-2.5 xl1:text-base xl3:text-lg">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="size-4 accent-green xl1:size-[1.1rem] xl3:size-5" /> Visible in store
          </label>
        </div>
        {error && <p role="alert" className="rounded-lg border border-danger/40 bg-danger/5 p-3 text-sm text-danger xl1:p-4 xl1:text-base">{error}</p>}
        <Button type="submit" size="lg" disabled={saving}>{saving ? "Saving..." : product ? "Save changes" : "Create product"}</Button>
      </div>
    </form>
  );
}
