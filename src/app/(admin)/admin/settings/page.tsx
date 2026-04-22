"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";

interface SettingsForm {
  fee: string;
  free_over: string;
  estimated_hours: string;
  collect_address: string;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [form, setForm] = useState<SettingsForm>({
    fee: "100",
    free_over: "500",
    estimated_hours: "2",
    collect_address: "",
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("delivery_settings").select("*").limit(1).single();
      if (data) {
        setSettingsId(data.id);
        setForm({
          fee: String(data.fee ?? 100),
          free_over: String(data.free_over ?? 500),
          estimated_hours: String(data.estimated_hours ?? 2),
          collect_address: data.collect_address ?? "",
        });
      }
    }
    load();
  }, []);

  function set(field: keyof SettingsForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const payload = {
        fee: parseFloat(form.fee),
        free_over: form.free_over ? parseFloat(form.free_over) : null,
        estimated_hours: parseInt(form.estimated_hours, 10),
        collect_address: form.collect_address || null,
      };
      if (settingsId) {
        const { error } = await (supabase as any).from("delivery_settings").update(payload).eq("id", settingsId);
        if (error) throw error;
      } else {
        const { data, error } = await (supabase as any).from("delivery_settings").insert(payload).select("id").single();
        if (error) throw error;
        setSettingsId(data.id);
      }
      toast.success("Settings saved!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary-600)] flex items-center justify-center">
          <Settings className="w-5 h-5" />
        </div>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="card p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wide">Delivery</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Delivery fee (฿)"
              type="number"
              min="0"
              step="1"
              value={form.fee}
              onChange={(e) => set("fee", e.target.value)}
              hint="Flat fee applied at checkout"
            />
            <Input
              label="Free delivery over (฿)"
              type="number"
              min="0"
              step="1"
              value={form.free_over}
              onChange={(e) => set("free_over", e.target.value)}
              hint="Leave blank to disable"
            />
          </div>
          <Input
            label="Estimated delivery time (hours)"
            type="number"
            min="1"
            step="1"
            value={form.estimated_hours}
            onChange={(e) => set("estimated_hours", e.target.value)}
            hint="Shown to customers at checkout"
          />
        </div>

        <div className="card p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-[var(--color-text-secondary)] text-xs uppercase tracking-wide">Click & Collect</h2>
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text)] mb-1.5">Collection address</label>
            <textarea
              className="input-base w-full min-h-[80px] resize-y"
              value={form.collect_address}
              onChange={(e) => set("collect_address", e.target.value)}
              placeholder="e.g. 123 Moo 4, Chaweng Beach Road, Koh Samui 84320"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={loading} className="py-2.5 px-6">Save settings</Button>
        </div>
      </form>
    </div>
  );
}
