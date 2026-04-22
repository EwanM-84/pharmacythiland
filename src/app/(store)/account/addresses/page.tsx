"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Plus, Trash2, ArrowLeft, Star } from "lucide-react";
import type { Address } from "@/types";

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ label: "", line1: "", line2: "", district: "", province: "", postal_code: "", is_default: false });

  async function loadAddresses() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth/login?next=/account/addresses"); return; }
    const { data } = await supabase.from("addresses").select("*").eq("profile_id", user.id).order("is_default", { ascending: false });
    setAddresses((data as Address[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { loadAddresses(); }, []);

  function setField(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.line1) { toast.error("Address line 1 is required"); return; }
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      if (form.is_default) {
        await (supabase as any).from("addresses").update({ is_default: false }).eq("profile_id", user.id);
      }

      const payload = {
        profile_id: user.id,
        label: form.label || null,
        line1: form.line1,
        line2: form.line2 || null,
        district: form.district || null,
        province: form.province || null,
        postal_code: form.postal_code || null,
        is_default: form.is_default,
      };
      const { error } = await (supabase as any).from("addresses").insert(payload);
      if (error) throw error;
      toast.success("Address saved!");
      setShowForm(false);
      setForm({ label: "", line1: "", line2: "", district: "", province: "", postal_code: "", is_default: false });
      loadAddresses();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this address?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Address deleted"); loadAddresses(); }
  }

  async function handleSetDefault(id: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await (supabase as any).from("addresses").update({ is_default: false }).eq("profile_id", user.id);
    await (supabase as any).from("addresses").update({ is_default: true }).eq("id", id);
    toast.success("Default address updated");
    loadAddresses();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/account" className="p-2 rounded-lg hover:bg-[var(--color-surface-secondary)] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Saved Addresses</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm py-2 px-3 flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {showForm && (
        <div className="card p-5 mb-5">
          <h2 className="font-semibold mb-4">New Address</h2>
          <form onSubmit={handleSave} className="flex flex-col gap-3">
            <Input label="Label (optional)" value={form.label} onChange={(e) => setField("label", e.target.value)} placeholder="e.g. Home, Work, Hotel" />
            <Input label="Address line 1 *" value={form.line1} onChange={(e) => setField("line1", e.target.value)} required placeholder="House / villa number, street" />
            <Input label="Address line 2" value={form.line2} onChange={(e) => setField("line2", e.target.value)} placeholder="Moo, Soi" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="District / Area" value={form.district} onChange={(e) => setField("district", e.target.value)} placeholder="Chaweng" />
              <Input label="Province" value={form.province} onChange={(e) => setField("province", e.target.value)} placeholder="Surat Thani" />
            </div>
            <Input label="Postal code" value={form.postal_code} onChange={(e) => setField("postal_code", e.target.value)} placeholder="84320" />
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.is_default} onChange={(e) => setField("is_default", e.target.checked)} className="w-4 h-4 accent-[var(--color-primary-600)]" />
              <span className="text-sm font-semibold">Set as default address</span>
            </label>
            <div className="flex gap-2 justify-end mt-1">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm py-2 px-4">Cancel</button>
              <Button type="submit" loading={saving} className="text-sm py-2 px-4">Save address</Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => <div key={i} className="card p-5 h-24 animate-pulse" />)}
        </div>
      ) : addresses.length === 0 ? (
        <div className="card p-10 text-center">
          <MapPin className="w-10 h-10 mx-auto mb-3 text-[var(--color-border-strong)]" />
          <p className="text-[var(--color-text-secondary)]">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="card p-4 flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-0.5 text-[var(--color-primary-600)] shrink-0" />
              <div className="flex-1 min-w-0">
                {addr.label && <p className="font-semibold text-sm">{addr.label}</p>}
                <p className="text-sm text-[var(--color-text)]">{addr.line1}</p>
                {addr.line2 && <p className="text-sm text-[var(--color-text-secondary)]">{addr.line2}</p>}
                {addr.district && <p className="text-sm text-[var(--color-text-secondary)]">{addr.district}{addr.province ? `, ${addr.province}` : ""}</p>}
                {addr.postal_code && <p className="text-sm text-[var(--color-text-secondary)]">{addr.postal_code}</p>}
                {addr.is_default && (
                  <span className="badge badge-primary text-xs mt-1">Default</span>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                {!addr.is_default && (
                  <button onClick={() => handleSetDefault(addr.id)} className="p-1.5 rounded text-amber-500 hover:bg-amber-50 transition-colors" title="Set as default">
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => handleDelete(addr.id)} className="p-1.5 rounded text-red-400 hover:bg-red-50 transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
