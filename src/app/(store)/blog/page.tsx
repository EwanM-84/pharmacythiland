import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const metadata = {
  title: "Health Blog | Samui Home Clinic Pharmacy",
  description: "Health tips, pharmacy news and wellness advice from Samui Home Clinic Pharmacy.",
};

export default async function BlogPage() {
  const supabase = createAdminClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--color-text)] mb-2">Health Blog</h1>
        <p className="text-[var(--color-text-secondary)]">Health tips, pharmacy news and wellness advice from our team.</p>
      </div>

      {(!posts || posts.length === 0) ? (
        <div className="card p-16 text-center">
          <BookOpen className="w-10 h-10 mx-auto text-[var(--color-text-muted)] mb-3" />
          <p className="text-[var(--color-text-secondary)]">No articles yet — check back soon!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(posts as BlogPost[]).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="card-hover overflow-hidden group"
            >
              {post.cover_image ? (
                <div className="h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-44 bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-accent-100)] flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-[var(--color-primary-300)]" />
                </div>
              )}
              <div className="p-4">
                <p className="text-xs text-[var(--color-text-muted)] mb-1.5">{formatDate(post.published_at ?? post.created_at)}</p>
                <h2 className="font-bold text-[var(--color-text)] leading-snug mb-2 line-clamp-2">{post.title}</h2>
                {post.excerpt && (
                  <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">{post.excerpt}</p>
                )}
                <p className="text-sm font-semibold text-[var(--color-primary-600)] mt-3 group-hover:underline">Read more →</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
