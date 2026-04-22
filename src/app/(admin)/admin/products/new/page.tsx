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

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    sku: "",
    barcode: "",
    short_description: "",
    description: "",
    price: "",
    cost_price: "",
    compare_price: "",
    stock_qty: "0",
    low_stock_threshold: "10",
    category_id: "",
    tags: "",
    requires_prescription: false,
    is_active: true,
  });

  function set(field: string, value: string | boolean) {
    setForm((f) => {
      const updated = { ...f, [field]: value };
      if (field === "name" && typeof value === "string") {
        updated.slug = slugify(value);
      }
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price || !form.slug) {
      toast.error("Name, slug, and price are required");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const payload = {
        name: form.name,
        slug: form.slug,
        sku: form.sku || null,
        barcode: form.barcode || null,
        short_description: form.short_description || null,
        description: form.description || null,
        price: parseFloat(form.price),
        cost_price: form.cost_price ? parseFloat(form.cost_price) : null,
        compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
        stock_qty: parseInt(form.stock_qty, 10),
        low_stock_threshold: parseInt(form.low_stock_threshold, 10),
        category_id: form.category_id || null,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        requires_prescription: form.requires_prescription,
        is_active: form.is_active,
        images: [],
      };
      const { data, error } = await (supabase as any).from("products").insert(payload).select("id").single();
      if (error) throw error;
      toast.success("Product created!");
      router.push(`/admin/products/${data.id}/edit`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create product";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="p-2 rounded-lg hover:bg-[var(--color-surface-secondary)] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="card p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wide">Basic Info</h2>
          <Input label="Product name *" value={form.name} onChange={(e) => set("name", e.target.value)} required />
          <Input label="Slug *" value={form.slug} onChange={(e) => set("slug", e.target.value)} required hint="Used in URL: /product/your-slug" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="SKU" value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="e.g. PCTML-500" />
            <Input label="Barcode" value={form.barcode} onChange={(e) => set("barcode", e.target.value)} placeholder="EAN / UPC" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text)] mb-1.5">Short description</label>
            <input
              className="input-base w-full"
              value={form.short_description}
              onChange={(e) => set("short_description", e.target.value)}
              placeholder="One-line summary shown on product cards"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text)] mb-1.5">Full description</label>
            <textarea
              className="input-base w-full min-h-[120px] resize-y"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Full product description, dosage, ingredients…"
            />
          </div>
        </div>

        <div className="card p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wide">Pricing</h2>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Price (฿) *" type="number" min="0" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} required placeholder="0.00" />
            <Input label="Cost price (฿)" type="number" min="0" step="0.01" value={form.cost_price} onChange={(e) => set("cost_price", e.target.value)} placeholder="0.00" hint="Used for margin %" />
            <Input label="Compare price (฿)" type="number" min="0" step="0.01" value={form.compare_price} onChange={(e) => set("compare_price", e.target.value)} placeholder="RRP / was-price" />
          </div>
        </div>

        <div className="card p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wide">Inventory</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Stock quantity" type="number" min="0" value={form.stock_qty} onChange={(e) => set("stock_qty", e.target.value)} />
            <Input label="Low stock alert at" type="number" min="0" value={form.low_stock_threshold} onChange={(e) => set("low_stock_threshold", e.target.value)} />
          </div>
        </div>

        <div className="card p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wide">Organisation</h2>
          <Input label="Tags" value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="paracetamol, pain-relief, otc" hint="Comma-separated" />
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.requires_prescription} onChange={(e) => set("requires_prescription", e.target.checked)} className="w-4 h-4 accent-[var(--color-primary-600)]" />
              <div>
                <p className="text-sm font-semibold">Requires prescription</p>
                <p className="text-xs text-[var(--color-text-secondary)]">Customer must upload a photo at checkout</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} className="w-4 h-4 accent-[var(--color-primary-600)]" />
              <div>
                <p className="text-sm font-semibold">Active (visible in shop)</p>
                <p className="text-xs text-[var(--color-text-secondary)]">Uncheck to hide from customers</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Link href="/admin/products" className="btn-secondary py-2.5 px-5">Cancel</Link>
          <Button type="submit" loading={loading} className="py-2.5 px-6">Create product</Button>
        </div>
      </form>
    </div>
  );
}
