import { ButtonLink } from "@/components/ui/Button";
import { listAllPosts } from "@/lib/db/blog";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DeleteBlogButton } from "./DeleteBlogButton";

export const metadata: Metadata = {
  title: "Blogs",
  robots: { index: false },
};

const cell = "px-4 py-3 xl1:px-5 xl1:py-4 xl2:px-6 xl3:px-7 xl3:py-5";
const dateFmt = new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" });

export default async function AdminBlogsPage() {
  const posts = await listAllPosts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between xl1:mb-8 xl2:mb-10 xl3:mb-12">
        <h1 className="text-2xl font-bold xl1:text-3xl xl2:text-4xl xl4:text-[2.6rem]">
          Blogs{" "}
          <span className="text-lg font-normal text-muted xl1:text-xl xl3:text-2xl">
            ({posts.length})
          </span>
        </h1>
        <ButtonLink href="/admin/blogs/new">
          <Plus className="size-4" /> New post
        </ButtonLink>
      </div>

      <div className="overflow-x-auto rounded-sm border border-line bg-white">
        <table className="w-full text-sm xl1:text-base xl3:text-[1.05rem]">
          <thead className="bg-surface text-left text-muted">
            <tr>
              <th className={`${cell} font-medium`}>Title</th>
              <th className={`${cell} font-medium`}>Status</th>
              <th className={`${cell} font-medium`}>Published</th>
              <th className={`${cell} font-medium`}>Last edited</th>
              <th className={cell} />
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-line">
                <td className={cell}>
                  <Link href={`/admin/blogs/${p.id}/edit`} className="font-semibold hover:underline">
                    {p.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted xl1:text-sm">/blogs/{p.slug}</p>
                </td>
                <td className={cell}>
                  {p.status === "published" ? (
                    <span className="rounded-full bg-green-tint px-2.5 py-1 text-xs font-semibold text-green-dark xl1:px-3 xl1:py-1.5 xl1:text-sm">
                      Published
                    </span>
                  ) : (
                    <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-muted xl1:px-3 xl1:py-1.5 xl1:text-sm">
                      Draft
                    </span>
                  )}
                </td>
                <td className={`${cell} text-muted`}>
                  {p.publishedAt ? dateFmt.format(new Date(p.publishedAt)) : "—"}
                </td>
                <td className={`${cell} text-muted`}>{dateFmt.format(new Date(p.updatedAt))}</td>
                <td className={cell}>
                  <div className="flex items-center justify-end gap-3">
                    {p.status === "published" && (
                      <Link
                        href={`/blogs/${p.slug}`}
                        target="_blank"
                        className="text-sm font-semibold text-green-dark hover:underline xl1:text-base"
                      >
                        View
                      </Link>
                    )}
                    <DeleteBlogButton id={p.id} title={p.title} />
                  </div>
                </td>
              </tr>
            ))}
            {!posts.length && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted xl1:py-14">
                  No posts yet. Write your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
