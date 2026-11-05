"use server";

import { requireAdminSession } from "@/lib/admin-auth";
import {
  blogContentToText,
  excerptSourceText,
  hasImage,
  makeExcerpt,
  readingMinutes,
  validateBlogContent,
} from "@/lib/blog/content";
import {
  blogSlugExists,
  createPost,
  deletePost,
  updatePost,
  type BlogPostInput,
} from "@/lib/db/blog";
import { resolveImageUrl } from "@/lib/images";
import { slugify } from "@/lib/slug";
import type { BlogStatus } from "@/types";
import { revalidatePath } from "next/cache";

export interface BlogFormInput {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  /**
   * `JSON.stringify(editor.getJSON())`. Sent as a string on purpose: Tiptap's attribute objects have no
   * prototype, which React's server-action serializer can't carry across as real objects.
   * Parsed and validated on the server.
   */
  content: string;
  status: BlogStatus;
}

export interface ActionResult {
  ok: boolean;
  error?: string;
  id?: string;
}

type Built = { ok: true; input: BlogPostInput } | { ok: false; error: string };

async function build(form: BlogFormInput, excludingId?: string): Promise<Built> {
  const title = form.title.trim();
  if (!title) return { ok: false, error: "Enter a title." };
  if (title.length > 160) return { ok: false, error: "Keep the title under 160 characters." };

  const slug = slugify(form.slug.trim() || title);
  if (!slug) return { ok: false, error: "Enter a valid title or web address." };
  if (await blogSlugExists(slug, excludingId)) {
    return { ok: false, error: `The web address "${slug}" is already used by another post. Change the title or the address.` };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(form.content);
  } catch {
    return { ok: false, error: "The post content could not be read. Try reloading the editor." };
  }
  const checked = validateBlogContent(parsed);
  if (!checked.ok) return { ok: false, error: checked.error };

  const text = blogContentToText(checked.content);
  if (form.status === "published" && !text && !hasImage(checked.content)) {
    return { ok: false, error: "Write something before publishing." };
  }

  const coverImage = form.coverImage.trim();
  if (coverImage && !resolveImageUrl(coverImage)) {
    return {
      ok: false,
      error:
        "The cover image must be a full https:// URL from an allowed image host (see src/config/image-hosts.ts).",
    };
  }

  const excerpt = form.excerpt.trim() || makeExcerpt(excerptSourceText(checked.content));
  if (excerpt.length > 300) return { ok: false, error: "Keep the summary under 300 characters." };

  return {
    ok: true,
    input: {
      slug,
      title,
      excerpt,
      coverImage: coverImage || null,
      content: checked.content,
      status: form.status === "published" ? "published" : "draft",
      readingMinutes: readingMinutes(text),
    },
  };
}

function revalidateBlog() {
  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
  revalidatePath("/blogs/[slug]", "page");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
}

export async function createBlogAction(form: BlogFormInput): Promise<ActionResult> {
  await requireAdminSession();

  const built = await build(form);
  if (!built.ok) return built;

  const id = await createPost(built.input);
  revalidateBlog();
  return { ok: true, id };
}

export async function updateBlogAction(id: string, form: BlogFormInput): Promise<ActionResult> {
  await requireAdminSession();

  const built = await build(form, id);
  if (!built.ok) return built;

  await updatePost(id, built.input);
  revalidateBlog();
  revalidatePath(`/admin/blogs/${id}/edit`);
  return { ok: true, id };
}

export async function deleteBlogAction(id: string): Promise<ActionResult> {
  await requireAdminSession();

  await deletePost(id);
  revalidateBlog();
  return { ok: true };
}
