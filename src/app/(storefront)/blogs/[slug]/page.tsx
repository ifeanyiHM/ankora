import { BlogGrid } from "@/components/blog/BlogCard";
import { formatPostDate } from "@/components/blog/format";
import { SwatchImage } from "@/components/shop/SwatchImage";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/config/site";
import { renderBlogHtml } from "@/lib/blog/content";
import { getPublishedPostBySlug, listPublishedPosts } from "@/lib/db/blog";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Post not found", robots: { index: false } };

  const image = post.coverImage ?? `${SITE.url}/ankora_og.jpeg`;

  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: `/blogs/${post.slug}` },
    openGraph: {
      type: "article",
      url: `${SITE.url}/blogs/${post.slug}`,
      siteName: SITE.name,
      locale: "en_NG",
      title: post.title,
      description: post.excerpt || undefined,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      images: [{ url: image, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || undefined,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const more = await listPublishedPosts({ limit: 3, excludeSlug: post.slug }).catch(() => []);
  // Built from the Tiptap schema on the server (see lib/blog/content.ts), so only allowed tags can appear.
  const html = renderBlogHtml(post.content);

  return (
    <>
      <article>
        <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 md:py-16 xl1:max-w-4xl xl1:py-20 xl3:max-w-5xl xl4:max-w-6xl">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-dark hover:underline xl1:text-base xl3:text-lg"
          >
            <ArrowLeft className="size-4" /> All blogs
          </Link>

          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl xl1:text-6xl xl3:text-7xl">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-muted xl1:text-base xl3:text-lg">
            <time dateTime={post.publishedAt ?? undefined}>{formatPostDate(post.publishedAt)}</time> ·{" "}
            {post.readingMinutes} min read
          </p>

          <SwatchImage
            src={post.coverImage}
            pattern="adire"
            colors={["#163D2A", "#D4A017", "#ffffff"]}
            alt={post.coverImage ? post.title : ""}
            priority
            sizes="(min-width:1280px) 900px, 100vw"
            className="mt-8 aspect-video rounded-sm xl1:mt-10"
          />

          <div className="blog-prose mt-8 xl1:mt-12" dangerouslySetInnerHTML={{ __html: html }} />

          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8 xl1:mt-20">
            <p className="font-semibold xl1:text-lg">Ready to pick your cloth?</p>
            <ButtonLink href="/shop">Shop all fabrics</ButtonLink>
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section aria-label="More from the blog" className="bg-surface-3 py-16 xl1:py-24 xl3:py-28">
          <Container>
            <h2 className="mb-8 text-2xl font-bold md:text-3xl xl1:mb-12 xl1:text-4xl xl3:text-5xl">
              More from the blog
            </h2>
            <BlogGrid posts={more} />
          </Container>
        </section>
      )}
    </>
  );
}
