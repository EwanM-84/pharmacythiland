import type { Metadata } from "next";
import Link from "next/link";
import { Search, Truck, Clock, Shield, Star, CheckCircle } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/store/ProductCard";
import type { Product, Category } from "@/types";

export const metadata: Metadata = {
  title: "Samui Home Clinic Pharmacy | Licensed Online Pharmacy — Koh Samui",
  description:
    "Koh Samui's premier licensed online pharmacy. Order medications, vitamins, and health products with same-day delivery across Koh Samui, Thailand.",
  openGraph: {
    title: "Samui Home Clinic Pharmacy",
    description: "Licensed medications delivered to your door on Koh Samui.",
    type: "website",
  },
};

// Category icons map
const categoryIcons: Record<string, string> = {
  "pain-relief": "💊",
  "vitamins": "🌿",
  "baby": "👶",
  "skincare": "✨",
  "first-aid": "🩹",
  "cold-flu": "🤧",
  "digestion": "🫀",
  "allergy": "🌸",
};

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(id,name,slug)")
    .eq("is_active", true)
    .gt("stock_qty", 0)
    .order("created_at", { ascending: false })
    .limit(8);
  return (data as Product[]) ?? [];
}

async function getCategories(): Promise<Category[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .is("parent_id", null)
    .order("sort_order", { ascending: true })
    .limit(8);
  return (data as Category[]) ?? [];
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div>
      {/* ---- Hero Section ---- */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-primary-500) 60%, var(--color-primary-400) 100%)",
        }}
      >
        {/* Radial depth overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at top right, rgba(255,255,255,0.12) 0%, transparent 60%)",
          }}
        />
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white/95 text-sm font-medium">Delivering across Koh Samui</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight">
              Your Health,
              <br />
              <span style={{ color: "rgba(207, 250, 254, 0.95)" }}>Delivered Fast.</span>
            </h1>
            <p className="text-lg text-white/85 mb-8 max-w-lg leading-relaxed">
              Koh Samui&apos;s premier licensed online pharmacy. Medications, vitamins and health products — delivered same day or ready for collection.
            </p>

            {/* Search bar */}
            <form action="/shop" className="flex gap-2 max-w-xl">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                <input
                  type="search"
                  name="q"
                  placeholder="Search medications, vitamins, supplements…"
                  className="w-full bg-white rounded-full pl-12 pr-4 py-4 text-[var(--color-text)] placeholder-[var(--color-text-muted)] text-base shadow-xl focus:outline-none focus:ring-2 focus:ring-white/60"
                />
              </div>
              <button
                type="submit"
                className="btn-buy-now shadow-xl whitespace-nowrap"
              >
                Search
              </button>
            </form>

            <p className="text-white/60 text-sm mt-3">
              Popular:{" "}
              <span className="text-white/85">Paracetamol, Vitamin C, Ibuprofen, Antihistamine</span>
            </p>
          </div>
        </div>
      </section>

      {/* ---- Trust Badges ---- */}
      <section className="bg-white border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { icon: <Truck className="w-5 h-5" />, title: "Same-Day Delivery", sub: "Across Koh Samui" },
              { icon: <Clock className="w-5 h-5" />, title: "Click & Collect", sub: "Ready in 30 mins" },
              { icon: <Shield className="w-5 h-5" />, title: "Licensed Pharmacy", sub: "Thai FDA registered" },
              { icon: <CheckCircle className="w-5 h-5" />, title: "Thai FDA Compliant", sub: "All products certified" },
              { icon: <Star className="w-5 h-5" />, title: "Trusted by 1,000s", sub: "5-star rated" },
            ].map((t) => (
              <div key={t.title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary-600)] flex items-center justify-center shrink-0">
                  {t.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">{t.title}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-12">
        {/* ---- Categories ---- */}
        {categories.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">Shop by Category</h2>
              <Link href="/shop" className="text-sm font-semibold text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]">
                View all →
              </Link>
            </div>
            {/* Horizontal scroll on mobile, grid on desktop */}
            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide md:grid md:grid-cols-4 lg:grid-cols-8 md:overflow-visible">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop/${cat.slug}`}
                  className="card-hover flex flex-col items-center gap-2 p-4 text-center group flex-shrink-0 min-w-[90px] md:min-w-0"
                >
                  <div className="text-3xl">{categoryIcons[cat.slug] ?? "💊"}</div>
                  <span className="text-xs font-semibold text-[var(--color-text)] leading-tight">{cat.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ---- Featured Products ---- */}
        {products.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title">New In</h2>
              <Link href="/shop" className="text-sm font-semibold text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* ---- Delivery Banner ---- */}
        <section
          className="rounded-2xl overflow-hidden p-8 sm:p-10"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-primary-100) 100%)",
          }}
        >
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-primary-900)" }}>
              Free delivery on orders over ฿500
            </h2>
            <p className="mb-5" style={{ color: "var(--color-primary-700)" }}>
              Order before 14:00 for same-day delivery across Koh Samui. Or choose Click &amp; Collect — ready in 30 minutes.
            </p>
            <Link href="/shop" className="btn-primary" style={{ display: "inline-flex" }}>
              Shop Now
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
