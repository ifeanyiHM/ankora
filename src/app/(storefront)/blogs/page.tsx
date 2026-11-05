import { BlogGrid } from "@/components/blog/BlogCard";
import { Container } from "@/components/ui/Container";
import { countPublishedPosts, listPublishedPosts } from "@/lib/db/blog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 9;

export const metadata: Metadata = {
  title: "Blogs",
  description: "Guides, stories and updates from Ankora.",
  alternates: { canonical: "/blogs" },
};

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const total = await countPublishedPosts();
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(pageCount, Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1));
  const posts = await listPublishedPosts({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE });

  const pageHref = (n: number) => (n === 1 ? "/blogs" : `/blogs?page=${n}`);
  const pill =
    "inline-flex size-10 items-center justify-center rounded-full border border-line text-ink transition hover:bg-surface-2 xl1:size-11";

  return (
    <Container className="py-12 md:py-16 xl1:py-24">
      <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl xl1:text-7xl xl3:text-8xl">
        Blogs
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted xl1:mt-6 xl1:text-xl xl3:text-2xl">
        Guides, stories and updates from Ankora.
      </p>

      <div className="mt-10 xl1:mt-14 xl3:mt-20">
        {posts.length > 0 ? (
          <BlogGrid posts={posts} />
        ) : (
          <p className="rounded-sm border border-line bg-surface p-10 text-center text-muted xl1:text-lg">
            No posts yet. Check back soon.
          </p>
        )}
      </div>

      {pageCount > 1 && (
        <nav aria-label="Blog pagination" className="mt-12 flex items-center justify-center gap-3 xl1:mt-16">
          {page > 1 ? (
            <Link href={pageHref(page - 1)} aria-label="Previous page" className={pill}>
              <ChevronLeft className="size-4" />
            </Link>
          ) : (
            <span aria-hidden className={`${pill} opacity-35`}>
              <ChevronLeft className="size-4" />
            </span>
          )}
          <span className="text-sm text-muted xl1:text-base">
            Page {page} of {pageCount}
          </span>
          {page < pageCount ? (
            <Link href={pageHref(page + 1)} aria-label="Next page" className={pill}>
              <ChevronRight className="size-4" />
            </Link>
          ) : (
            <span aria-hidden className={`${pill} opacity-35`}>
              <ChevronRight className="size-4" />
            </span>
          )}
        </nav>
      )}
    </Container>
  );
}
