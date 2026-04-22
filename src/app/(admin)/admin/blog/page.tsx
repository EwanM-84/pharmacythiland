import { createAdminClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { BookOpen, Plus } from "lucide-react";
import type { BlogPost } from "@/types";
import Link from "next/link";

export default async function AdminBlogPage() {
  const supabase = createAdminClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary-600)] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold">Blog</h1>
        </div>
        <Link href="/admin/blog/new" className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Article
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {(posts as BlogPost[])?.map((post) => (
          <Link
            key={post.id}
            href={`/admin/blog/${post.id}/edit`}
            className="card-hover p-4 flex items-center gap-4"
          >
            {post.cover_image && (
              <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-[var(--color-surface-secondary)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{post.title}</p>
              {post.excerpt && <p className="text-sm text-[var(--color-text-secondary)] truncate">{post.excerpt}</p>}
              <p className="text-xs text-[var(--color-text-muted)] mt-1">{formatDate(post.created_at)}</p>
            </div>
            <div className="shrink-0">
              <span className={`badge text-xs ${post.is_published ? "badge-success" : "badge-gray"}`}>
                {post.is_published ? "Published" : "Draft"}
              </span>
            </div>
          </Link>
        ))}
        {(!posts || posts.length === 0) && (
          <div className="card p-10 text-center text-[var(--color-text-secondary)]">
            No articles yet. <Link href="/admin/blog/new" className="text-[var(--color-primary-600)] font-semibold hover:underline">Create your first one →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
