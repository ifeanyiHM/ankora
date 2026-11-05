import { SwatchImage } from "@/components/shop/SwatchImage";
import type { BlogPostSummary } from "@/types";
import Link from "next/link";
import { formatPostDate } from "./format";

export function BlogCard({ post, priority }: { post: BlogPostSummary; priority?: boolean }) {
  const href = `/blogs/${post.slug}`;

  return (
    <article className="group">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
        <SwatchImage
          src={post.coverImage}
          pattern="adire"
          colors={["#163D2A", "#D4A017", "#ffffff"]}
          alt=""
          priority={priority}
          sizes="(min-width:1280px) 30vw, (min-width:768px) 45vw, 92vw"
          className="aspect-16/10 rounded-sm"
        />
      </Link>
      <Link href={href} className="mt-4 block xl1:mt-5">
        <p className="text-sm text-muted xl3:text-[0.95rem]">
          {formatPostDate(post.publishedAt)} · {post.readingMinutes} min read
        </p>
        <h3 className="mt-1.5 text-xl font-semibold leading-snug decoration-green decoration-2 underline-offset-4 group-hover:underline xl1:text-[1.35rem] xl3:text-2xl">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-[0.95rem] leading-relaxed text-muted xl1:text-base xl3:text-lg">
            {post.excerpt}
          </p>
        )}
      </Link>
    </article>
  );
}

export function BlogGrid({ posts }: { posts: BlogPostSummary[] }) {
  return (
    <div className="grid gap-x-5 gap-y-10 md:grid-cols-2 lg:grid-cols-3 xl1:gap-x-6 xl1:gap-y-14 xl3:gap-x-8 xl3:gap-y-16">
      {posts.map((post, i) => (
        <BlogCard key={post.id} post={post} priority={i < 3} />
      ))}
    </div>
  );
}
