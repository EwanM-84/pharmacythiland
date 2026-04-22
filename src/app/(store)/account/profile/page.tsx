"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User } from "lucide-react";
import type { Profile } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [form, setForm] = useState({ full_name: "", phone: "" });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login?next=/account/profile"); return; }
      setEmail(user.email ?? "");
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        const p = data as Profile;
        setForm({ full_name: p.full_name ?? "", phone: p.phone ?? "" });
      }
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");
      const { error } = await (supabase as any)
        .from("profiles")
        .update({ full_name: form.full_name, phone: form.phone || null })
        .eq("id", user.id);
      if (error) throw error;
      toast.success("Profile updated!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-8">
        <div className="card p-6 animate-pulse h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/account" className="p-2 rounded-lg hover:bg-[var(--color-surface-secondary)] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      {/* Avatar placeholder */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-700)] flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-[var(--color-text)] mb-1.5">Email address</label>
          <input
            className="input-base w-full bg-[var(--color-surface-secondary)] cursor-not-allowed"
            value={email}
            readOnly
            disabled
          />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Email cannot be changed here</p>
        </div>
        <Input
          label="Full name"
          value={form.full_name}
          onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
          placeholder="Your full name"
        />
        <Input
          label="Phone number"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          placeholder="+66 77 123 4567"
        />
        <Button type="submit" loading={saving} className="w-full mt-1">Save changes</Button>
      </form>
    </div>
  );
}
