"use client";

import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/slug";
import type { BlogContent, BlogPost, BlogStatus } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBlogAction, updateBlogAction, type BlogFormInput } from "./actions";
import { EMPTY_DOC, TiptapEditor } from "./TiptapEditor";

const input =
  "h-11 w-full rounded-lg border border-ink/25 bg-white px-3.5 text-[0.95rem] outline-none transition focus:border-green focus:ring-1 focus:ring-green xl1:h-12 xl1:px-4 xl1:text-base xl2:h-[3.25rem] xl3:h-14 xl3:text-lg xl4:h-[3.75rem]";
const label = "mb-1.5 block text-sm font-semibold xl1:mb-2 xl1:text-base xl3:text-lg";
const hint = "mt-1 text-xs text-muted xl1:text-sm xl3:text-[0.95rem]";

export function BlogForm({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  // An existing post's address never follows the title unless the admin edits it on purpose,
  // so fixing a typo in a live title doesn't break links that have already been shared.
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [status, setStatus] = useState<BlogStatus>(post?.status ?? "draft");
  const [content, setContent] = useState<BlogContent>(post?.content ?? EMPTY_DOC);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const form: BlogFormInput = { title, slug, excerpt, coverImage, content: JSON.stringify(content), status };
    const res = post ? await updateBlogAction(post.id, form) : await createBlogAction(form);
    if (!res.ok) {
      setError(res.error ?? "Something went wrong.");
      setSaving(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    router.push("/admin/blogs");
    router.refresh();
  }

  const coverPreview = /^https:\/\//i.test(coverImage.trim()) ? coverImage.trim() : null;

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-8 lg:grid-cols-[1fr_20rem] xl1:gap-10 xl1:grid-cols-[1fr_24rem] xl2:grid-cols-[1fr_26rem] xl3:gap-12 xl3:grid-cols-[1fr_30rem] xl4:grid-cols-[1fr_34rem]"
    >
      <div className="grid min-w-0 content-start gap-5 xl1:gap-6 xl3:gap-7">
        {error && (
          <p role="alert" className="rounded-lg border border-danger/40 bg-danger/5 p-3 text-sm text-danger xl1:p-4 xl1:text-base">
            {error}
          </p>
        )}
        <div>
          <label className={label} htmlFor="title">Title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className={input}
            maxLength={160}
            required
          />
        </div>
        <div>
          <label className={label} htmlFor="slug">Web address</label>
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-sm text-muted xl1:text-base">/blogs/</span>
            <input
              id="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              onBlur={() => setSlug((s) => slugify(s))}
              className={input}
              placeholder="made-from-the-title"
            />
          </div>
          <p className={hint}>Lowercase letters, numbers and dashes. Changing it later breaks links people have already shared.</p>
        </div>
        <div>
          <p className={label}>Content</p>
          <TiptapEditor initialContent={content} onChange={setContent} />
        </div>
        <div>
          <label className={label} htmlFor="excerpt">Summary</label>
          <textarea
            id="excerpt"
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            maxLength={300}
            className={`${input} h-auto py-2.5 xl1:py-3`}
            placeholder="Optional. Shown on blog cards and in search results. Leave blank to use the start of the post."
          />
        </div>
      </div>

      <div className="grid content-start gap-5 xl1:gap-6">
        <div className="rounded-[4px] border border-line bg-white p-5 xl1:p-6 xl3:p-7">
          <label className={label} htmlFor="status">Status</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value as BlogStatus)} className={input}>
            <option value="draft">Draft (only you can see it)</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="rounded-[4px] border border-line bg-white p-5 xl1:p-6 xl3:p-7">
          <label className={label} htmlFor="cover">Cover image URL</label>
          <input
            id="cover"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://…"
            className={input}
          />
          <p className={hint}>Optional. Leave blank to show a fabric pattern instead.</p>
          {coverPreview && (
            // Plain <img>: this is only an admin preview, and works for any host.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverPreview} alt="Cover preview" className="mt-3 aspect-video w-full rounded-sm border border-line object-cover" />
          )}
        </div>

        <Button type="submit" size="lg" disabled={saving}>
          {saving
            ? "Saving..."
            : post
              ? "Save changes"
              : status === "published"
                ? "Publish post"
                : "Save draft"}
        </Button>
      </div>
    </form>
  );
}
