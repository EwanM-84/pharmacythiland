"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to send reset email");
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
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Reset password</h1>
          <p className="text-[var(--color-text-secondary)] mt-1 text-sm">Enter your email and we&apos;ll send a reset link</p>
        </div>

        {sent ? (
          <div className="card p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-success-bg)] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-bold text-lg mb-2">Check your email</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </p>
            <Link href="/auth/login" className="text-sm text-[var(--color-primary-600)] font-semibold hover:underline">
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="card p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                <Button type="submit" loading={loading} className="w-full mt-2">
                  Send reset link
                </Button>
              </form>
            </div>
            <p className="text-center text-sm text-[var(--color-text-secondary)] mt-5">
              <Link href="/auth/login" className="font-semibold text-[var(--color-primary-600)] hover:underline flex items-center justify-center gap-1">
                <ArrowLeft className="w-3 h-3" />
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
