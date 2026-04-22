"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Trash2, ExternalLink } from "lucide-react";
import type { BlogPost } from "@/types";

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    cover_image: "",
    is_published: false,
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("blog_posts").select("*").eq("id", params.id).single();
      if (data) {
        const p = data as BlogPost;
        setForm({
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt ?? "",
          body: p.body,
          cover_image: p.cover_image ?? "",
          is_published: p.is_published,
        });
      }
      setLoadingPost(false);
    }
    load();
  }, [params.id]);

  function set(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const payload = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || null,
        body: form.body,
        cover_image: form.cover_image || null,
        is_published: form.is_published,
        published_at: form.is_published ? new Date().toISOString() : null,
      };
      const { error } = await (supabase as any).from("blog_posts").update(payload).eq("id", params.id);
      if (error) throw error;
      toast.success("Article saved!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Permanently delete this article?")) return;
    setDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("blog_posts").delete().eq("id", params.id);
      if (error) throw error;
      toast.success("Article deleted");
      router.push("/admin/blog");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
      setDeleting(false);
    }
  }

  if (loadingPost) {
    return (
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/blog" className="p-2 rounded-lg hover:bg-[var(--color-surface-secondary)]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-8 w-48 bg-[var(--color-surface-secondary)] rounded animate-pulse" />
        </div>
        <div className="card p-6 h-64 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog" className="p-2 rounded-lg hover:bg-[var(--color-surface-secondary)] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Edit Article</h1>
        </div>
        <div className="flex gap-2">
          {form.is_published && form.slug && (
            <Link href={`/blog/${form.slug}`} target="_blank" className="p-2 rounded-lg hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] transition-colors" title="View live">
              <ExternalLink className="w-5 h-5" />
            </Link>
          )}
          <button onClick={handleDelete} disabled={deleting} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors" title="Delete article">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="card p-6 flex flex-col gap-4">
          <Input label="Title *" value={form.title} onChange={(e) => set("title", e.target.value)} required />
          <Input label="Slug *" value={form.slug} onChange={(e) => set("slug", e.target.value)} required hint={`URL: /blog/${form.slug}`} />
          <Input label="Excerpt" value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
          <Input label="Cover image URL" value={form.cover_image} onChange={(e) => set("cover_image", e.target.value)} placeholder="https://…" />
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text)] mb-1.5">Article body *</label>
            <textarea
              className="input-base w-full min-h-[300px] resize-y font-mono text-sm"
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              required
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} className="w-4 h-4 accent-[var(--color-primary-600)]" />
            <div>
              <p className="text-sm font-semibold">Published</p>
              <p className="text-xs text-[var(--color-text-secondary)]">Visible to customers</p>
            </div>
          </label>
        </div>
        <div className="flex gap-3 justify-end">
          <Link href="/admin/blog" className="btn-secondary py-2.5 px-5">Back</Link>
          <Button type="submit" loading={loading} className="py-2.5 px-6">Save changes</Button>
        </div>
      </form>
    </div>
  );
}
