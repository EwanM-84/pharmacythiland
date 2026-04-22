import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Truck, Clock, Shield, ChevronRight, Zap, Star, Tag, Package } from "lucide-react";
import { mockCategories, getBestSellers, getFeaturedProducts } from "@/lib/mock-products";
import { ProductCard } from "@/components/store/ProductCard";

export const metadata: Metadata = {
  title: "Samui Home Clinic Pharmacy | Licensed Online Pharmacy — Koh Samui",
  description: "Koh Samui's premier licensed online pharmacy. Same-day delivery of medications, vitamins and health products across Koh Samui, Thailand.",
};

const categoryIcons: Record<string, string> = {
  "pain-relief": "💊", vitamins: "🌿", "cold-flu": "🤧", skincare: "✨",
  digestion: "🫀", heart: "❤️", diabetes: "🩺", antibiotics: "💉",
  baby: "👶", "eye-ear": "👁️", allergy: "🌸", sleep: "🌙",
};

const heroSlides = [
  {
    badge: "New Season Essentials",
    title: "Up to 35% off Vitamins & Supplements",
    sub: "Stock up on immune-boosting vitamins. Limited time deal — while stocks last.",
    cta: "Shop Vitamins",
    href: "/shop/vitamins",
    from: "#0F4C81",
    to: "#1A6FA8",
    accent: "#FFD814",
  },
  {
    badge: "Same-Day Delivery",
    title: "Pain Relief, Delivered Fast",
    sub: "Order before 2pm for same-day delivery across Koh Samui. Free over ฿500.",
    cta: "Shop Pain Relief",
    href: "/shop/pain-relief",
    from: "#1B4332",
    to: "#2D6A4F",
    accent: "#FFD814",
  },
  {
    badge: "Prescription Service",
    title: "Licensed Pharmacy — Online",
    sub: "Upload your prescription and receive your medication at your door. FDA registered.",
    cta: "Upload Prescription",
    href: "/shop?prescription=true",
    from: "#4A1942",
    to: "#7B2D8B",
    accent: "#FFD814",
  },
];

const deals = [
  { label: "Today's Deals", href: "/shop", icon: <Tag className="w-4 h-4" /> },
  { label: "Best Sellers", href: "/shop?sort=bestseller", icon: <Star className="w-4 h-4" /> },
  { label: "New Arrivals", href: "/shop?sort=newest", icon: <Package className="w-4 h-4" /> },
  { label: "Express Delivery", href: "/shop", icon: <Zap className="w-4 h-4" /> },
];

export default function HomePage() {
  const bestSellers = getBestSellers(8);
  const featured = getFeaturedProducts(8);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-surface-secondary)" }}>

      {/* ── Hero Banner (Amazon-style full-width) ── */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${heroSlides[0].from} 0%, ${heroSlides[0].to} 100%)` }}>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-white/5 translate-y-1/2 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-14 sm:py-20 lg:py-24 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 text-xs font-bold uppercase tracking-widest"
              style={{ background: "rgba(255,216,20,0.15)", color: "#FFD814", border: "1px solid rgba(255,216,20,0.3)" }}>
              <Zap className="w-3.5 h-3.5" />
              {heroSlides[0].badge}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
              {heroSlides[0].title}
            </h1>
            <p className="text-base sm:text-lg text-white/75 mb-8 leading-relaxed max-w-lg">
              {heroSlides[0].sub}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={heroSlides[0].href}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all hover:brightness-95 active:scale-97"
                style={{ background: "#FFD814", color: "#111", border: "1px solid #C8960C", boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}>
                {heroSlides[0].cta} <ChevronRight className="w-4 h-4" />
              </Link>
              <Link href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white border border-white/30 hover:bg-white/10 transition-colors">
                Browse All Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick category pills ── */}
      <section className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {deals.map((d) => (
            <Link key={d.label} href={d.href}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
              {d.icon}{d.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Trust badges ── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Truck className="w-5 h-5 text-blue-600" />, title: "Same-Day Delivery", sub: "Order before 2pm" },
              { icon: <Clock className="w-5 h-5 text-blue-600" />, title: "Click & Collect", sub: "Ready in 30 minutes" },
              { icon: <Shield className="w-5 h-5 text-blue-600" />, title: "Licensed Pharmacy", sub: "Thai FDA registered" },
              { icon: <Star className="w-5 h-5 text-blue-600" />, title: "5-Star Rated", sub: "10,000+ happy customers" },
            ].map((t) => (
              <div key={t.title} className="flex items-center gap-3 py-1">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">{t.icon}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.title}</p>
                  <p className="text-xs text-gray-500">{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10">

        {/* ── Shop by Category ── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Shop by Category</h2>
            <Link href="/shop" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {mockCategories.map((cat) => (
              <Link key={cat.id} href={`/shop/${cat.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-3 flex flex-col items-center gap-1.5 text-center hover:border-blue-400 hover:shadow-md transition-all group">
                <div className="text-3xl sm:text-2xl">{categoryIcons[cat.slug] ?? "💊"}</div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-gray-700 leading-tight group-hover:text-blue-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Deal of the Day Banner ── */}
        <section className="grid md:grid-cols-3 gap-4">
          {[
            { bg: "linear-gradient(135deg,#FF6B6B,#EE0979)", title: "Pain Relief Sale", sub: "Up to 30% off", href: "/shop/pain-relief", emoji: "💊" },
            { bg: "linear-gradient(135deg,#2193b0,#6dd5ed)", title: "Vitamin Bundle", sub: "Buy 2, Get 1 Free", href: "/shop/vitamins", emoji: "🌿" },
            { bg: "linear-gradient(135deg,#f7971e,#ffd200)", title: "Baby Essentials", sub: "Free delivery", href: "/shop/baby", emoji: "👶" },
          ].map((card) => (
            <Link key={card.title} href={card.href}
              className="rounded-2xl overflow-hidden p-6 flex items-center justify-between group hover:scale-[1.01] transition-transform cursor-pointer"
              style={{ background: card.bg, minHeight: "120px" }}>
              <div>
                <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">{card.sub}</p>
                <p className="text-white text-xl font-extrabold leading-tight">{card.title}</p>
                <p className="text-white/70 text-xs mt-1 flex items-center gap-1 group-hover:text-white transition-colors">
                  Shop now <ChevronRight className="w-3.5 h-3.5" />
                </p>
              </div>
              <div className="text-6xl opacity-90">{card.emoji}</div>
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
            <Link href="/shop" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ── Secondary hero (smaller, side-by-side) ── */}
        <section className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl overflow-hidden relative" style={{ background: "linear-gradient(135deg,#1D3557,#457B9D)", minHeight: "180px" }}>
            <div className="p-8">
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-2">Prescription Service</p>
              <h3 className="text-white text-2xl font-extrabold leading-tight mb-3">Prescription Medicines<br/>Delivered to Your Door</h3>
              <Link href="/shop?prescription=true"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:brightness-95"
                style={{ background: "#FFD814", color: "#111", border: "1px solid #C8960C" }}>
                Shop Prescription Meds <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="absolute right-4 bottom-4 text-7xl opacity-20">💉</div>
          </div>
          <div className="rounded-2xl overflow-hidden relative" style={{ background: "linear-gradient(135deg,#134E4A,#0D9488)", minHeight: "180px" }}>
            <div className="p-8">
              <p className="text-teal-200 text-xs font-semibold uppercase tracking-widest mb-2">Today Only</p>
              <h3 className="text-white text-2xl font-extrabold leading-tight mb-3">Free Delivery on<br/>Orders Over ฿500</h3>
              <Link href="/shop"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:brightness-95"
                style={{ background: "#FFD814", color: "#111", border: "1px solid #C8960C" }}>
                Start Shopping <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="absolute right-4 bottom-4 text-7xl opacity-20">🚚</div>
          </div>
        </section>

        {/* ── New In / Featured ── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <h2 className="section-title">New In</h2>
              <span className="badge badge-primary text-[11px]">Just Landed</span>
            </div>
            <Link href="/shop" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ── Why Us ── */}
        <section className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="section-title text-center mb-8">Why Samui Home Clinic Pharmacy?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: "🏥", title: "Licensed & Regulated", desc: "Thai FDA registered. All products are genuine, certified and legally dispensed." },
              { emoji: "⚡", title: "Same-Day Delivery", desc: "Order before 2pm for same-day delivery across Koh Samui. 3-hour guaranteed." },
              { emoji: "💬", title: "Pharmacist Advice", desc: "Chat with our qualified pharmacists online 7 days a week, 8am–8pm." },
              { emoji: "🔒", title: "Secure & Private", desc: "256-bit SSL encryption. Your health data is completely private and secure." },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl">{item.emoji}</div>
                <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
