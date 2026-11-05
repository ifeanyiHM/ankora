import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { listPublishedPosts } from "@/lib/db/blog";
import { BlogGrid } from "./BlogCard";

/**
 * Latest posts, shown on the homepage just above the footer. Renders nothing until at least one post
 * is published, and never lets a blog problem (e.g. the table not created yet) break the homepage.
 */
export async function HomeBlogSection() {
  const posts = await listPublishedPosts({ limit: 3 }).catch((error) => {
    console.error("Could not load blog posts for the homepage:", error);
    return [];
  });

  if (posts.length === 0) return null;

  return (
    <section
      id="blogs"
      aria-label="From the blog"
      className="py-16 xl1:py-24 xl2:py-28 xl3:py-32 xl4:py-40"
    >
      <Container>
        <SectionHeading
          title="From the blog"
          description="Guides, stories and updates from Ankora."
          href="/blogs"
          linkLabel="Read all blogs"
          className="border-0"
        />
        <BlogGrid posts={posts} />
      </Container>
    </section>
  );
}
