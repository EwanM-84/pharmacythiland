"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Truck, Clock, Shield, ChevronRight, Zap, Star, Tag, Package,
  Pill, Leaf, Thermometer, Sparkles, Activity, Heart,
  Droplets, ShieldPlus, Baby, Eye, Flower2, Moon
} from "lucide-react";
import type { Category, Product } from "@/types";
import { ProductCard } from "@/components/store/ProductCard";
import { useLanguageStore } from "@/stores/languageStore";

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

interface Props {
  categories: Category[];
  bestSellers: Product[];
  featured: Product[];
  trending: Product[];
  favorites: Product[];
  staffPicks: Product[];
  seasonal: Product[];
}

export function HomePageContent({ categories, bestSellers, featured, trending, favorites, staffPicks, seasonal }: Props) {
  const { t } = useLanguageStore();

  function SectionHeader({ title, badge, badgeClass = "badge-orange" }: { title: string; badge?: string; badgeClass?: string }) {
    return (
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="section-title">{title}</h2>
          {badge && <span className={`badge ${badgeClass} text-xs font-bold`}>{badge}</span>}
        </div>
        <Link href="/shop" className="text-sm font-semibold flex items-center gap-1 shrink-0" style={{ color: "var(--color-primary-600)" }}>
          {t.seeAll} <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  function ProductGrid({ products }: { products: Product[] }) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-surface-secondary)" }}>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: "clamp(260px, 55vw, 580px)" }}>
        <Image src="/herox2.png" alt="" fill className="object-cover object-center" priority />
        <div className="absolute inset-0" style={{ background: "rgba(5,15,30,0.82)" }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logoBGR.png" alt="Samui Home Clinic"
          className="relative z-20"
          style={{ height: "clamp(180px, 40vw, 520px)", width: "auto" }} />
      </section>

      {/* ── Quick filter pills ── */}
      <section style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)", boxShadow: "var(--shadow-xs)" }}>
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-2.5 flex gap-2 justify-between overflow-x-auto scrollbar-hide">
          {[
            { label: t.todaysDeals, href: "/shop", icon: <Tag className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> },
            { label: t.bestSellers, href: "/shop", icon: <Star className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> },
            { label: t.newArrivals, href: "/shop", icon: <Package className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> },
            { label: t.expressDelivery, href: "/shop", icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> },
          ].map((d) => (
            <Link key={d.label} href={d.href}
              className="pill-hover flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap border min-h-[40px]"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
              {d.icon}{d.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Trust badges ── */}
      <section style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: <Truck className="w-5 h-5" style={{ color: "var(--color-primary-600)" }} />, title: t.sameDay, sub: t.orderBefore },
              { icon: <Clock className="w-5 h-5" style={{ color: "var(--color-primary-600)" }} />, title: t.clickCollect, sub: t.readyIn30 },
              { icon: <Shield className="w-5 h-5" style={{ color: "var(--color-primary-600)" }} />, title: t.licensedPharmacy, sub: t.thaiFDA },
              { icon: <Star className="w-5 h-5" style={{ color: "var(--color-primary-600)" }} />, title: t.fiveStar, sub: t.happyCustomers },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-2 sm:gap-3 py-1">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--color-surface-tertiary)" }}>
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold truncate" style={{ color: "var(--color-text)", fontFamily: "var(--font-sans)" }}>{item.title}</p>
                  <p className="text-[10px] sm:text-xs truncate" style={{ color: "var(--color-text-tertiary)" }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-6 sm:py-8 flex flex-col gap-8 sm:gap-12">

        {/* ── Categories ── */}
        <section>
          <SectionHeader title={t.shopByCategory} />
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2 sm:gap-3">
            {categories.slice(0, 7).map((cat) => (
              <Link key={cat.id} href={`/shop/${cat.slug}`}
                className="cat-card-hover rounded-xl p-3 sm:p-3.5 flex flex-col items-center gap-2 text-center group"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--color-surface-tertiary)", color: "var(--color-primary-600)" }}>
                  {categoryIcons[cat.slug] ?? <Pill className="w-5 h-5" />}
                </div>
                <span className="text-[11px] sm:text-[13px] font-semibold leading-tight"
                  style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)" }}>
                  {t.categories[cat.slug as keyof typeof t.categories] ?? cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Deal banners ── */}
        <section className="grid md:grid-cols-3 gap-3 sm:gap-4">
          {[
            { bg: "linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)", title: t.painReliefSale, sub: t.upTo30, href: "/shop/pain-relief", icon: <Pill className="w-12 h-12 sm:w-16 sm:h-16 opacity-20" /> },
            { bg: "linear-gradient(135deg, var(--color-primary-800) 0%, var(--color-primary-500) 100%)", title: t.vitaminBundle, sub: t.buy2get1, href: "/shop/vitamins", icon: <Leaf className="w-12 h-12 sm:w-16 sm:h-16 opacity-20" /> },
            { bg: "linear-gradient(135deg, #d97706 0%, #fbbf24 100%)", title: t.babyEssentials, sub: t.freeDelivery, href: "/shop/baby", icon: <Baby className="w-12 h-12 sm:w-16 sm:h-16 opacity-20" /> },
          ].map((card) => (
            <Link key={card.title} href={card.href}
              className="deal-card-hover rounded-2xl overflow-hidden p-5 sm:p-6 flex items-center justify-between"
              style={{ background: card.bg, minHeight: "110px", boxShadow: "var(--shadow-card-hover)" }}>
              <div>
                <p className="text-white/75 text-xs font-bold uppercase tracking-widest mb-1">{card.sub}</p>
                <p className="text-white text-lg sm:text-xl font-extrabold leading-tight" style={{ fontFamily: "var(--font-display)" }}>{card.title}</p>
                <p className="text-white/70 text-xs mt-2 flex items-center gap-1">{t.shopNow} <ChevronRight className="w-3.5 h-3.5" /></p>
              </div>
              <div className="text-white">{card.icon}</div>
            </Link>
          ))}
        </section>

        {/* ── Best Sellers ── */}
        <section>
          <SectionHeader title={t.bestSellers} badge={t.topRated} badgeClass="badge-orange" />
          <ProductGrid products={bestSellers} />
        </section>

        {/* ── Secondary banners ── */}
        <section className="grid md:grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-2xl overflow-hidden relative"
            style={{ background: "linear-gradient(135deg, var(--color-primary-950) 0%, var(--color-primary-800) 100%)", minHeight: "160px", boxShadow: "var(--shadow-card-hover)" }}>
            <div className="p-5 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#fff" }}>{t.prescriptionService}</p>
              <h3 className="text-xl sm:text-2xl font-extrabold leading-tight mb-4" style={{ fontFamily: "var(--font-display)", color: "#fff" }}>
                {t.prescriptionMeds.split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
              </h3>
              <Link href="/shop?prescription=true"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold hover:brightness-95 transition-all"
                style={{ background: "var(--color-primary-500)", color: "#fff" }}>
                {t.shopPrescriptionMeds} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="absolute right-6 bottom-6 opacity-10 text-white hidden sm:block"><ShieldPlus className="w-28 h-28" /></div>
          </div>
          <div className="rounded-2xl overflow-hidden relative"
            style={{ background: "linear-gradient(135deg, var(--color-primary-800) 0%, var(--color-primary-600) 100%)", minHeight: "160px", boxShadow: "var(--shadow-card-hover)" }}>
            <div className="p-5 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--color-primary-200)" }}>{t.todayOnly}</p>
              <h3 className="text-white text-xl sm:text-2xl font-extrabold leading-tight mb-4" style={{ fontFamily: "var(--font-display)" }}>
                {t.freeDeliveryOver.split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
              </h3>
              <Link href="/shop"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold hover:brightness-95 transition-all"
                style={{ background: "var(--color-primary-500)", color: "#fff" }}>
                {t.startShopping} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="absolute right-6 bottom-6 opacity-10 text-white hidden sm:block"><Truck className="w-28 h-28" /></div>
          </div>
        </section>

        {/* ── New In ── */}
        <section>
          <SectionHeader title={t.newIn} badge={t.justLanded} badgeClass="badge-primary" />
          <ProductGrid products={featured} />
        </section>

        {/* ── Trending Now ── */}
        <section>
          <SectionHeader title={t.trendingNow} badge={t.hot} badgeClass="badge-orange" />
          <ProductGrid products={trending} />
        </section>

        {/* ── Members promo ── */}
        <section className="rounded-2xl overflow-hidden relative p-5 sm:p-8 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #0f766e 0%, #0891b2 100%)", minHeight: "130px", boxShadow: "var(--shadow-card-hover)" }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>{t.membersOnly}</p>
            <h3 className="text-white text-xl sm:text-2xl font-extrabold leading-tight mb-3" style={{ fontFamily: "var(--font-display)" }}>
              {t.signUpSave.split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
            </h3>
            <Link href="/shop" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold hover:brightness-95 transition-all" style={{ background: "#fff", color: "#0f766e" }}>
              {t.joinFree} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="hidden md:block opacity-15 text-white"><Star className="w-36 h-36" /></div>
        </section>

        {/* ── Customer Favorites ── */}
        <section>
          <SectionHeader title={t.customerFavorites} badge={t.topRatedBadge} badgeClass="badge-primary" />
          <ProductGrid products={favorites} />
        </section>

        {/* ── Staff Picks ── */}
        <section>
          <SectionHeader title={t.staffPicks} badge={t.pharmacistRecommended} badgeClass="badge-gray" />
          <ProductGrid products={staffPicks} />
        </section>

        {/* ── Seasonal Essentials ── */}
        <section>
          <SectionHeader title={t.seasonalEssentials} badge={t.rightNow} badgeClass="badge-primary" />
          <ProductGrid products={seasonal} />
        </section>

        {/* ── Why Us ── */}
        <section className="rounded-2xl p-6 sm:p-10"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border-strong)", boxShadow: "0 4px 24px rgba(8,145,178,0.10)" }}>
          <h2 className="section-title text-center mb-8">{t.whyUs}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Shield className="w-6 h-6" />, title: t.licensed, desc: t.licensedDesc },
              { icon: <Zap className="w-6 h-6" />, title: t.sameDay, desc: t.sameDayDesc },
              { icon: <Heart className="w-6 h-6" />, title: t.pharmacistAdvice, desc: t.pharmacistAdviceDesc },
              { icon: <ShieldPlus className="w-6 h-6" />, title: t.secure, desc: t.secureDesc },
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
  );
}
