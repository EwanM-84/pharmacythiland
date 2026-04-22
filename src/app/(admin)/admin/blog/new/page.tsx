"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    cover_image: "",
    is_published: false,
  });

  function set(field: string, value: string | boolean) {
    setForm((f) => {
      const updated = { ...f, [field]: value };
      if (field === "title" && typeof value === "string") {
        updated.slug = slugify(value);
      }
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.body || !form.slug) {
      toast.error("Title, slug, and body are required");
      return;
    }
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
      const { data, error } = await (supabase as any).from("blog_posts").insert(payload).select("id").single();
      if (error) throw error;
      toast.success("Article created!");
      router.push(`/admin/blog/${data.id}/edit`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create article";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/blog" className="p-2 rounded-lg hover:bg-[var(--color-surface-secondary)] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">New Article</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="card p-6 flex flex-col gap-4">
          <Input label="Title *" value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="e.g. How to Stay Healthy in Koh Samui" />
          <Input label="Slug *" value={form.slug} onChange={(e) => set("slug", e.target.value)} required hint="URL: /blog/your-slug" />
          <Input label="Excerpt" value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Short summary shown in article listings" />
          <Input label="Cover image URL" value={form.cover_image} onChange={(e) => set("cover_image", e.target.value)} placeholder="https://…" />
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text)] mb-1.5">Article body *</label>
            <textarea
              className="input-base w-full min-h-[300px] resize-y font-mono text-sm"
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              placeholder="Write your article here… (Markdown supported)"
              required
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} className="w-4 h-4 accent-[var(--color-primary-600)]" />
            <div>
              <p className="text-sm font-semibold">Publish immediately</p>
              <p className="text-xs text-[var(--color-text-secondary)]">Uncheck to save as draft</p>
            </div>
          </label>
        </div>
        <div className="flex gap-3 justify-end">
          <Link href="/admin/blog" className="btn-secondary py-2.5 px-5">Cancel</Link>
          <Button type="submit" loading={loading} className="py-2.5 px-6">Create article</Button>
        </div>
      </form>
    </div>
  );
}
