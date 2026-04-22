import { createAdminClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt, cover_image")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) return { title: "Article Not Found" };
  return {
    title: `${(post as BlogPost).title} | Samui Home Clinic Pharmacy Blog`,
    description: (post as BlogPost).excerpt ?? undefined,
    openGraph: {
      images: (post as BlogPost).cover_image ? [(post as BlogPost).cover_image!] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  const p = post as BlogPost;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[var(--color-primary-600)] hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>

      {p.cover_image ? (
        <div className="rounded-2xl overflow-hidden mb-8 h-72 sm:h-96">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="rounded-2xl mb-8 h-48 bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-accent-100)] flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-[var(--color-primary-300)]" />
        </div>
      )}

      <p className="text-sm text-[var(--color-text-muted)] mb-3">{formatDate(p.published_at ?? p.created_at)}</p>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text)] leading-tight mb-4">{p.title}</h1>
      {p.excerpt && <p className="text-lg text-[var(--color-text-secondary)] mb-8 leading-relaxed border-l-4 border-[var(--color-primary-200)] pl-4">{p.excerpt}</p>}

      <div
        className="prose prose-lg max-w-none text-[var(--color-text)] leading-relaxed"
        style={{
          lineHeight: "1.85",
        }}
      >
        {p.body.split("\n\n").map((para, i) => (
          <p key={i} className="mb-4">{para}</p>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
        <Link href="/blog" className="btn-secondary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          More articles
        </Link>
      </div>
    </div>
  );
}
