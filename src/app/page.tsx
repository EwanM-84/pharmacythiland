import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Truck, Clock, Shield, ChevronRight, Zap, Star, Tag, Package,
  Pill, Leaf, Thermometer, Sparkles, Activity, Heart,
  Droplets, ShieldPlus, Baby, Eye, Flower2, Moon
} from "lucide-react";
import { mockCategories, getBestSellers, getFeaturedProducts } from "@/lib/mock-products";
import { ProductCard } from "@/components/store/ProductCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/store/CartDrawer";

export const metadata: Metadata = {
  title: "Samui Home Clinic Pharmacy | Licensed Online Pharmacy — Koh Samui",
  description: "Koh Samui's premier licensed online pharmacy. Same-day delivery of medications, vitamins and health products across Koh Samui, Thailand.",
};

const categoryIcons: Record<string, React.ReactNode> = {
  "pain-relief": <Pill className="w-5 h-5" />,
  vitamins:      <Leaf className="w-5 h-5" />,
  "cold-flu":    <Thermometer className="w-5 h-5" />,
  skincare:      <Sparkles className="w-5 h-5" />,
  digestion:     <Activity className="w-5 h-5" />,
  heart:         <Heart className="w-5 h-5" />,
  diabetes:      <Droplets className="w-5 h-5" />,
  antibiotics:   <ShieldPlus className="w-5 h-5" />,
  baby:          <Baby className="w-5 h-5" />,
  "eye-ear":     <Eye className="w-5 h-5" />,
  allergy:       <Flower2 className="w-5 h-5" />,
  sleep:         <Moon className="w-5 h-5" />,
};

export default function HomePage() {
  const bestSellers = getBestSellers(8);
  const featured = getFeaturedProducts(8);

  return (
    <>
      <Header />
      <CartDrawer />
      <main className="flex-1">
        <div className="min-h-screen" style={{ background: "var(--color-surface-secondary)" }}>

          {/* ── Hero ── */}
          <section className="relative overflow-hidden">
            {/* Background photo */}
            <Image src="/header.png" alt="" fill className="object-cover object-center" priority />
            {/* Dark overlay — darker on left so text is readable */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(10,37,64,0.85) 0%, rgba(10,37,64,0.55) 50%, rgba(10,37,64,0.15) 100%)" }} />
            {/* Logo sitting on top of hero photo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logoBGR.png" alt="Samui Home Clinic"
              className="absolute hidden lg:block z-20"
              style={{ height: "900px", width: "900px", left: "-60px", top: "50%", transform: "translateY(-50%)" }} />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-20 sm:py-28 relative z-10" style={{ minHeight: "420px" }}>
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-5 text-xs font-bold uppercase tracking-widest"
                  style={{ background: "rgba(8,145,178,0.25)", color: "var(--color-primary-200)", border: "1px solid rgba(8,145,178,0.4)" }}>
                  <Zap className="w-3.5 h-3.5" /> New Season Essentials
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4"
                  style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}>
                  Up to 35% off Vitamins &amp; Supplements
                </h1>
                <p className="text-base sm:text-lg mb-8 leading-relaxed max-w-lg" style={{ color: "rgba(255,255,255,0.75)" }}>
                  Stock up on immune-boosting vitamins. Limited time deal — while stocks last.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/shop/vitamins"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:brightness-110"
                    style={{ background: "var(--color-primary-500)", boxShadow: "0 4px 16px rgba(8,145,178,0.4)" }}>
                    Shop Vitamins <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link href="/shop"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white border border-white/30 hover:bg-white/10 transition-colors">
                    Browse All Products
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ── Quick filter pills ── */}
          <section style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)", boxShadow: "var(--shadow-xs)" }}>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
              {[
                { label: "Today's Deals", href: "/shop", icon: <Tag className="w-4 h-4" /> },
                { label: "Best Sellers", href: "/shop", icon: <Star className="w-4 h-4" /> },
                { label: "New Arrivals", href: "/shop", icon: <Package className="w-4 h-4" /> },
                { label: "Express Delivery", href: "/shop", icon: <Zap className="w-4 h-4" /> },
              ].map((d) => (
                <Link key={d.label} href={d.href}
                  className="pill-hover flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
                  {d.icon}{d.label}
                </Link>
              ))}
            </div>
          </section>

          {/* ── Trust badges ── */}
          <section style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: <Truck className="w-5 h-5" style={{ color: "var(--color-primary-600)" }} />, title: "Same-Day Delivery", sub: "Order before 2pm" },
                  { icon: <Clock className="w-5 h-5" style={{ color: "var(--color-primary-600)" }} />, title: "Click & Collect", sub: "Ready in 30 minutes" },
                  { icon: <Shield className="w-5 h-5" style={{ color: "var(--color-primary-600)" }} />, title: "Licensed Pharmacy", sub: "Thai FDA registered" },
                  { icon: <Star className="w-5 h-5" style={{ color: "var(--color-primary-600)" }} />, title: "5-Star Rated", sub: "10,000+ happy customers" },
                ].map((t) => (
                  <div key={t.title} className="flex items-center gap-3 py-1">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "var(--color-surface-tertiary)" }}>
                      {t.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--color-text)", fontFamily: "var(--font-sans)" }}>{t.title}</p>
                      <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>{t.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-12">

            {/* ── Categories ── */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="section-title">Shop by Category</h2>
                <Link href="/shop" className="text-sm font-semibold flex items-center gap-1"
                  style={{ color: "var(--color-primary-600)" }}>
                  See all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
                {mockCategories.map((cat) => (
                  <Link key={cat.id} href={`/shop/${cat.slug}`}
                    className="cat-card-hover rounded-xl p-3 flex flex-col items-center gap-2 text-center group"
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      boxShadow: "var(--shadow-card)",
                    }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: "var(--color-surface-tertiary)", color: "var(--color-primary-600)" }}>
                      {categoryIcons[cat.slug] ?? <Pill className="w-5 h-5" />}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-semibold leading-tight"
                      style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)" }}>
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* ── Deal banners ── */}
            <section className="grid md:grid-cols-3 gap-4">
              {[
                { bg: "linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)", title: "Pain Relief Sale", sub: "Up to 30% off", href: "/shop/pain-relief", icon: <Pill className="w-16 h-16 opacity-20" /> },
                { bg: "linear-gradient(135deg, var(--color-primary-800) 0%, var(--color-primary-500) 100%)", title: "Vitamin Bundle", sub: "Buy 2, Get 1 Free", href: "/shop/vitamins", icon: <Leaf className="w-16 h-16 opacity-20" /> },
                { bg: "linear-gradient(135deg, #d97706 0%, #fbbf24 100%)", title: "Baby Essentials", sub: "Free delivery", href: "/shop/baby", icon: <Baby className="w-16 h-16 opacity-20" /> },
              ].map((card) => (
                <Link key={card.title} href={card.href}
                  className="deal-card-hover rounded-2xl overflow-hidden p-6 flex items-center justify-between"
                  style={{ background: card.bg, minHeight: "120px", boxShadow: "var(--shadow-card-hover)" }}>
                  <div>
                    <p className="text-white/75 text-xs font-bold uppercase tracking-widest mb-1">{card.sub}</p>
                    <p className="text-white text-xl font-extrabold leading-tight" style={{ fontFamily: "var(--font-display)" }}>{card.title}</p>
                    <p className="text-white/70 text-xs mt-2 flex items-center gap-1">Shop now <ChevronRight className="w-3.5 h-3.5" /></p>
                  </div>
                  <div className="text-white">{card.icon}</div>
                </Link>
              ))}
            </section>

            {/* ── Best Sellers ── */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <h2 className="section-title">Best Sellers</h2>
                  <span className="badge badge-orange text-xs font-bold">#1 Top Rated</span>
                </div>
                <Link href="/shop" className="text-sm font-semibold flex items-center gap-1"
                  style={{ color: "var(--color-primary-600)" }}>
                  See all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>

            {/* ── Secondary banners ── */}
            <section className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden relative"
                style={{ background: "linear-gradient(135deg, var(--color-primary-950) 0%, var(--color-primary-800) 100%)", minHeight: "200px", boxShadow: "var(--shadow-card-hover)" }}>
                <div className="p-8">
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--color-primary-300)" }}>Prescription Service</p>
                  <h3 className="text-white text-2xl font-extrabold leading-tight mb-4"
                    style={{ fontFamily: "var(--font-display)" }}>
                    Prescription Medicines<br />Delivered to Your Door
                  </h3>
                  <Link href="/shop?prescription=true"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold hover:brightness-95 transition-all"
                    style={{ background: "var(--color-primary-500)", color: "#fff" }}>
                    Shop Prescription Meds <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="absolute right-6 bottom-6 opacity-10" style={{ color: "white" }}>
                  <ShieldPlus className="w-28 h-28" />
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden relative"
                style={{ background: "linear-gradient(135deg, var(--color-primary-800) 0%, var(--color-primary-600) 100%)", minHeight: "200px", boxShadow: "var(--shadow-card-hover)" }}>
                <div className="p-8">
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--color-primary-200)" }}>Today Only</p>
                  <h3 className="text-white text-2xl font-extrabold leading-tight mb-4"
                    style={{ fontFamily: "var(--font-display)" }}>
                    Free Delivery on<br />Orders Over ฿500
                  </h3>
                  <Link href="/shop"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold hover:brightness-95 transition-all"
                    style={{ background: "var(--color-primary-500)", color: "#fff" }}>
                    Start Shopping <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="absolute right-6 bottom-6 opacity-10 text-white">
                  <Truck className="w-28 h-28" />
                </div>
              </div>
            </section>

            {/* ── New In ── */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <h2 className="section-title">New In</h2>
                  <span className="badge badge-primary text-[11px]">Just Landed</span>
                </div>
                <Link href="/shop" className="text-sm font-semibold flex items-center gap-1"
                  style={{ color: "var(--color-primary-600)" }}>
                  See all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {featured.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>

            {/* ── Why Us ── */}
            <section className="rounded-2xl p-8 sm:p-10"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-strong)",
                boxShadow: "0 4px 24px rgba(8,145,178,0.10), 0 1px 4px rgba(0,0,0,0.06)",
              }}>
              <h2 className="section-title text-center mb-8">Why Samui Home Clinic Pharmacy?</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: <Shield className="w-6 h-6" />, title: "Licensed & Regulated", desc: "Thai FDA registered. All products are genuine, certified and legally dispensed." },
                  { icon: <Zap className="w-6 h-6" />, title: "Same-Day Delivery", desc: "Order before 2pm for same-day delivery across Koh Samui. 3-hour guaranteed." },
                  { icon: <Heart className="w-6 h-6" />, title: "Pharmacist Advice", desc: "Chat with our qualified pharmacists online 7 days a week, 8am–8pm." },
                  { icon: <ShieldPlus className="w-6 h-6" />, title: "Secure & Private", desc: "256-bit SSL encryption. Your health data is completely private and secure." },
                ].map((item) => (
                  <div key={item.title} className="flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: "var(--color-surface-tertiary)", color: "var(--color-primary-600)" }}>
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-sm" style={{ color: "var(--color-text)", fontFamily: "var(--font-sans)" }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
