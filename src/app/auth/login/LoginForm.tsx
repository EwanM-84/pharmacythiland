"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/account";
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;
      toast.success("Welcome back!");
      router.push(next);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
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
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Sign in</h1>
          <p className="text-[var(--color-text-secondary)] mt-1 text-sm">Welcome back!</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email address"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
            <div className="flex justify-end">
              <Link href="/auth/forgot-password" className="text-sm text-[var(--color-primary-600)] hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" loading={loading} className="w-full mt-2">
              Sign in
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--color-text-secondary)] mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-semibold text-[var(--color-primary-600)] hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
