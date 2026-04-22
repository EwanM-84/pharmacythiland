"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.name, phone: form.phone },
        },
      });
      if (error) throw error;
      toast.success("Account created! Please check your email to confirm.");
      router.push("/account");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-secondary)] px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 relative">
              <Image src="/logo.png" alt="Samui Home Clinic Pharmacy" fill className="object-contain" />
            </div>
            <div className="text-left">
              <p className="font-semibold tracking-wide" style={{ color: "var(--color-primary-900)", fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}>SAMUI HOME CLINIC</p>
              <p className="text-xs uppercase tracking-[0.16em]" style={{ color: "var(--color-primary-600)" }}>Pharmacy</p>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Create account</h1>
          <p className="text-[var(--color-text-secondary)] mt-1 text-sm">Start ordering from Samui&apos;s top pharmacy</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Full name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              placeholder="John Smith"
            />
            <Input
              label="Email address"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
              placeholder="you@example.com"
            />
            <Input
              label="Phone (optional)"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="+66 77 123 4567"
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
              placeholder="Min. 8 characters"
              hint="At least 8 characters"
            />
            <Button type="submit" loading={loading} className="w-full mt-2">
              Create account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--color-text-secondary)] mt-5">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-[var(--color-primary-600)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
