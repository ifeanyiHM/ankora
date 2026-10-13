"use client";

import { Button } from "@/components/ui/Button";
import type { Category } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateCategoryAction } from "../../actions";

const input =
  "h-11 w-full rounded-lg border border-ink/25 bg-white px-3.5 text-[0.95rem] outline-none transition focus:border-green focus:ring-1 focus:ring-green xl1:h-12 xl1:px-4 xl1:text-base xl2:h-[3.25rem] xl3:h-14 xl3:text-lg";
const label =
  "mb-1.5 block text-sm font-semibold xl1:mb-2 xl1:text-base xl3:text-lg";

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
  const [images, setImages] = useState(() => {
    const value: unknown = category.images;

    if (Array.isArray(value)) {
      return value
        .filter((url): url is string => typeof url === "string")
        .join("\n");
    }

    if (typeof value === "string") {
      try {
        const parsed: unknown = JSON.parse(value);

        if (Array.isArray(parsed)) {
          return parsed
            .filter((url): url is string => typeof url === "string")
            .join("\n");
        }
      } catch {
        // Ignore invalid JSON and start with an empty image list.
      }
    }

    return "";
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await updateCategoryAction(category.id, {
      name,
      tagline,
      description,
      origin,
      material,
      width,
      care,
      uses: uses.split("\n"),
      image: image || null,
      images: images
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean),
    });
    if (!res.ok) {
      setError(res.error ?? "Something went wrong.");
      setSaving(false);
      return;
    }
    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid max-w-2xl gap-5 xl1:max-w-3xl xl1:gap-6 xl2:max-w-208 xl3:max-w-4xl xl3:gap-7 xl4:max-w-5xl"
    >
      <div>
        <label className={label} htmlFor="name">
          Name
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={input}
          required
        />
      </div>
      <div>
        <label className={label} htmlFor="tagline">
          Tagline
        </label>
        <input
          id="tagline"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          className={input}
          required
        />
      </div>
      <div>
        <label className={label} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${input} h-auto py-2.5 xl1:py-3`}
          required
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-3 xl1:gap-6 xl3:gap-7">
        <div>
          <label className={label} htmlFor="origin">
            Origin
          </label>
          <input
            id="origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className={input}
          />
        </div>
        <div>
          <label className={label} htmlFor="material">
            Material
          </label>
          <input
            id="material"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className={input}
          />
        </div>
        <div>
          <label className={label} htmlFor="width">
            Width
          </label>
          <input
            id="width"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className={input}
          />
        </div>
      </div>
      <div>
        <label className={label} htmlFor="care">
          Care
        </label>
        <input
          id="care"
          value={care}
          onChange={(e) => setCare(e.target.value)}
          className={input}
        />
      </div>
      <div>
        <label className={label} htmlFor="uses">
          Typical uses (one per line)
        </label>
        <textarea
          id="uses"
          rows={4}
          value={uses}
          onChange={(e) => setUses(e.target.value)}
          className={`${input} h-auto py-2.5 xl1:py-3`}
        />
      </div>
      <div>
        <label className={label} htmlFor="image">
          Category image URL
        </label>
        <input
          id="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://... (leave blank for generated swatch)"
          className={input}
        />
      </div>

      <div>
        <label className={label} htmlFor="images">
          Category image URLs (one per line)
        </label>

        <textarea
          id="images"
          rows={5}
          value={images}
          onChange={(e) => setImages(e.target.value)}
          placeholder={
            "https://example.com/image-1.jpg\nhttps://example.com/image-2.jpg"
          }
          className={`${input} h-auto py-2.5 xl1:py-3`}
        />

        <p className="mt-1.5 text-sm text-muted">
          Add multiple image URLs. Each category can have its own collection.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-danger/40 bg-danger/5 p-3 text-sm text-danger xl1:p-4 xl1:text-base"
        >
          {error}
        </p>
      )}
      <Button type="submit" size="lg" className="w-fit" disabled={saving}>
        {saving ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
