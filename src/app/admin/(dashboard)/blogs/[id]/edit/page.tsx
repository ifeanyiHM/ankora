import { getPostById } from "@/lib/db/blog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogForm } from "../../BlogForm";

export const metadata: Metadata = {
  title: "Edit post",
  robots: { index: false },
};

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold xl1:mb-8 xl1:text-3xl xl2:text-4xl xl3:mb-10 xl4:text-[2.6rem]">
        Edit {post.title}
      </h1>
      <BlogForm post={post} />
    </div>
  );
}
