import { resolveImageUrl } from "@/lib/images";
import type { BlogContent, BlogPost, BlogPostSummary, BlogStatus } from "@/types";
import { newId, sql } from "./client";

interface SummaryRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  status: string;
  reading_minutes: number;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

interface PostRow extends SummaryRow {
  content: BlogContent;
}

const SUMMARY_COLUMNS = sql`
  id, slug, title, excerpt, cover_image, status, reading_minutes,
  published_at, created_at, updated_at
`;

const iso = (d: Date | string): string => new Date(d).toISOString();

function toSummary(r: SummaryRow): BlogPostSummary {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    coverImage: resolveImageUrl(r.cover_image),
    status: r.status as BlogStatus,
    readingMinutes: r.reading_minutes,
    publishedAt: r.published_at ? iso(r.published_at) : null,
    createdAt: iso(r.created_at),
    updatedAt: iso(r.updated_at),
  };
}

function toPost(r: PostRow): BlogPost {
  return { ...toSummary(r), content: r.content };
}

/** Published posts, newest first. */
export async function listPublishedPosts(
  opts: { limit?: number; offset?: number; excludeSlug?: string } = {},
): Promise<BlogPostSummary[]> {
  const limit = Math.max(1, Math.floor(opts.limit ?? 50));
  const offset = Math.max(0, Math.floor(opts.offset ?? 0));
  const exclude = opts.excludeSlug ?? "";

  const rows = await sql<SummaryRow[]>`
    SELECT ${SUMMARY_COLUMNS}
    FROM blog_posts
    WHERE status = 'published' AND slug <> ${exclude}
    ORDER BY published_at DESC, created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  return rows.map(toSummary);
}

export async function countPublishedPosts(): Promise<number> {
  const rows = await sql<{ n: number }[]>`
    SELECT COUNT(*)::int AS n FROM blog_posts WHERE status = 'published'
  `;
  return rows[0]?.n ?? 0;
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  const rows = await sql<PostRow[]>`
    SELECT ${SUMMARY_COLUMNS}, content
    FROM blog_posts
    WHERE slug = ${slug} AND status = 'published'
    LIMIT 1
  `;
  return rows[0] ? toPost(rows[0]) : null;
}

/** Every post, drafts included. Admin only. */
export async function listAllPosts(): Promise<BlogPostSummary[]> {
  const rows = await sql<SummaryRow[]>`
    SELECT ${SUMMARY_COLUMNS}
    FROM blog_posts
    ORDER BY updated_at DESC
  `;
  return rows.map(toSummary);
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const rows = await sql<PostRow[]>`
    SELECT ${SUMMARY_COLUMNS}, content
    FROM blog_posts
    WHERE id = ${id}
    LIMIT 1
  `;
  return rows[0] ? toPost(rows[0]) : null;
}

export interface BlogPostInput {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  content: BlogContent;
  status: BlogStatus;
  readingMinutes: number;
}

export async function createPost(input: BlogPostInput): Promise<string> {
  const id = newId();

  await sql`
    INSERT INTO blog_posts (
      id, slug, title, excerpt, cover_image, content, status,
      reading_minutes, published_at
    )
    VALUES (
      ${id},
      ${input.slug},
      ${input.title},
      ${input.excerpt},
      ${input.coverImage},
      ${sql.json(input.content as never)},
      ${input.status},
      ${input.readingMinutes},
      ${input.status === "published" ? sql`now()` : null}
    )
  `;

  return id;
}

export async function updatePost(id: string, input: BlogPostInput): Promise<void> {
  // published_at is set the first time a post goes live and then kept, so
  // unpublishing and republishing never changes the date readers see.
  await sql`
    UPDATE blog_posts
    SET
      slug = ${input.slug},
      title = ${input.title},
      excerpt = ${input.excerpt},
      cover_image = ${input.coverImage},
      content = ${sql.json(input.content as never)},
      status = ${input.status},
      reading_minutes = ${input.readingMinutes},
      published_at = CASE
        WHEN ${input.status} = 'published' THEN COALESCE(published_at, now())
        ELSE published_at
      END,
      updated_at = now()
    WHERE id = ${id}
  `;
}

export async function deletePost(id: string): Promise<void> {
  await sql`DELETE FROM blog_posts WHERE id = ${id}`;
}

export async function blogSlugExists(slug: string, excludingId?: string): Promise<boolean> {
  const rows = await sql<{ one: number }[]>`
    SELECT 1 AS one
    FROM blog_posts
    WHERE slug = ${slug} AND id <> ${excludingId ?? ""}
    LIMIT 1
  `;
  return rows.length > 0;
}
