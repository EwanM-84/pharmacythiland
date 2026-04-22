"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, ShieldCheck, Lock, Mail, ArrowRight } from "lucide-react";
import { useLanguageStore } from "@/stores/languageStore";
import type { Lang } from "@/lib/translations";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/account";
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const { t, lang, setLang } = useLanguageStore();

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
      toast.success(t.welcomeBack);
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
    <div className="min-h-screen flex">
      {/* ── Left panel — hero image ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image src="/herox2.png" alt="" fill className="object-cover object-center" priority />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(5,15,30,0.88) 0%, rgba(8,100,140,0.60) 100%)" }} />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logoBGR.png" alt="Samui Home Clinic" style={{ height: "120px", width: "auto" }} />
          </Link>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(8,200,220,0.8)" }}>{t.licensedOnlinePharmacy}</p>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-4" style={{ fontFamily: "var(--font-display)" }}>
              {t.loginHeroTitle1}<br />{t.loginHeroTitle2}
            </h2>
            <p className="text-base mb-10" style={{ color: "rgba(255,255,255,0.65)" }}>
              {t.loginHeroSub}
            </p>
            <div className="flex flex-col gap-3">
              {[
                { icon: <ShieldCheck className="w-4 h-4" />, text: t.loginTrust1 },
                { icon: <Lock className="w-4 h-4" />, text: t.loginTrust2 },
                { icon: <ShieldCheck className="w-4 h-4" />, text: t.loginTrust3 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(8,145,178,0.25)", color: "#22d3ee" }}>
                    {item.icon}
                  </div>
                  <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>© {new Date().getFullYear()} Samui Home Clinic Pharmacy. All rights reserved.</p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12" style={{ background: "#0d1b2a" }}>
        <div className="w-full max-w-md">

          {/* Language toggle */}
          <div className="flex justify-end mb-4">
            <div className="flex rounded-lg overflow-hidden border border-white/10">
              {(["th", "en"] as Lang[]).map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className="px-3 py-1.5 text-xs font-semibold transition-colors"
                  style={{
                    background: lang === l ? "var(--color-primary-600)" : "transparent",
                    color: lang === l ? "#fff" : "rgba(255,255,255,0.4)",
                  }}>
                  {l === "th" ? "🇹🇭 TH" : "🇬🇧 EN"}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logoBGR.png" alt="Samui Home Clinic" style={{ height: "80px", width: "auto" }} />
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>{t.welcomeBack}</h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{t.signInSub}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
                {t.emailAddress}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.3)" }} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  autoComplete="email"
                  placeholder={t.emailPlaceholder}
                  className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#ffffff",
                    fontFamily: "var(--font-sans)",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(8,145,178,0.7)"; e.target.style.boxShadow = "0 0 0 3px rgba(8,145,178,0.15)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {t.passwordLabel}
                </label>
                <Link href="/auth/forgot-password" className="text-xs font-medium transition-colors" style={{ color: "var(--color-primary-400)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#22d3ee"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-primary-400)"; }}>
                  {t.forgotPassword}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.3)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 text-sm rounded-xl outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#ffffff",
                    fontFamily: "var(--font-sans)",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(8,145,178,0.7)"; e.target.style.boxShadow = "0 0 0 3px rgba(8,145,178,0.15)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"; }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm text-white transition-all mt-2"
              style={{ background: loading ? "rgba(8,145,178,0.5)" : "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)", boxShadow: loading ? "none" : "0 4px 24px rgba(8,145,178,0.4)" }}
              onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 32px rgba(8,145,178,0.6)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = loading ? "none" : "0 4px 24px rgba(8,145,178,0.4)"; }}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><span>{t.signIn}</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              {t.noAccount}{" "}
              <Link href="/auth/register" className="font-semibold transition-colors" style={{ color: "var(--color-primary-400)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#22d3ee"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-primary-400)"; }}>
                {t.createAccount}
              </Link>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            {[
              t.thaiFDALicensed,
              t.sslSecured,
              t.pdpaCompliant,
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" style={{ color: "rgba(8,145,178,0.7)" }} />
                <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
