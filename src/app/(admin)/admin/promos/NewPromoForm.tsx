"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewPromoForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: "",
    min_order: "",
    uses_remaining: "",
    expires_at: "",
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.code || !form.discount_value) {
      toast.error("Code and discount value are required");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const payload = {
        code: form.code.toUpperCase(),
        discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value),
        min_order: form.min_order ? parseFloat(form.min_order) : null,
        uses_remaining: form.uses_remaining ? parseInt(form.uses_remaining, 10) : null,
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      };
      const { error } = await (supabase as any).from("promo_codes").insert(payload);
      if (error) throw error;
      toast.success("Promo code created!");
      setForm({ code: "", discount_type: "percentage", discount_value: "", min_order: "", uses_remaining: "", expires_at: "" });
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create promo";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input label="Code" value={form.code} onChange={(e) => set("code", e.target.value)} placeholder="SAVE20" hint="Will be uppercased" required />
      <div>
        <label className="block text-sm font-semibold text-[var(--color-text)] mb-1.5">Discount type</label>
        <select
          className="input-base w-full"
          value={form.discount_type}
          onChange={(e) => set("discount_type", e.target.value)}
        >
          <option value="percentage">Percentage (%)</option>
          <option value="fixed">Fixed amount (฿)</option>
        </select>
      </div>
      <Input
        label={form.discount_type === "percentage" ? "Discount %" : "Discount (฿)"}
        type="number"
        min="0"
        step={form.discount_type === "percentage" ? "1" : "0.01"}
        max={form.discount_type === "percentage" ? "100" : undefined}
        value={form.discount_value}
        onChange={(e) => set("discount_value", e.target.value)}
        required
      />
      <Input label="Min. order value (฿)" type="number" min="0" step="1" value={form.min_order} onChange={(e) => set("min_order", e.target.value)} hint="Leave blank for no minimum" />
      <Input label="Max uses" type="number" min="1" step="1" value={form.uses_remaining} onChange={(e) => set("uses_remaining", e.target.value)} hint="Leave blank for unlimited" />
      <Input label="Expires at" type="datetime-local" value={form.expires_at} onChange={(e) => set("expires_at", e.target.value)} hint="Leave blank — never expires" />
      <Button type="submit" loading={loading} className="w-full mt-1">Create code</Button>
    </form>
  );
}
