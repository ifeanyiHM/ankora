import type { Metadata } from "next";
import { BlogForm } from "../BlogForm";

export const metadata: Metadata = {
  title: "New post",
  robots: { index: false },
};

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold xl1:mb-8 xl1:text-3xl xl2:text-4xl xl3:mb-10 xl4:text-[2.6rem]">
        New post
      </h1>
      <BlogForm />
    </div>
  );
}
