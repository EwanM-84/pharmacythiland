"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  ShoppingCart, Search, User, Menu, X, ChevronDown,
  Pill, Leaf, Thermometer, Sparkles, Activity, Heart,
  Droplets, ShieldPlus, Baby, Eye, Flower2, Moon
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useRouter } from "next/navigation";
import { mockProducts, mockCategories } from "@/lib/mock-products";

const RECENT_KEY = "shc-recent";

const categoryIcons: Record<string, React.ReactNode> = {
  "pain-relief":  <Pill className="w-3.5 h-3.5" />,
  "vitamins":     <Leaf className="w-3.5 h-3.5" />,
  "cold-flu":     <Thermometer className="w-3.5 h-3.5" />,
  "skincare":     <Sparkles className="w-3.5 h-3.5" />,
  "digestion":    <Activity className="w-3.5 h-3.5" />,
  "heart":        <Heart className="w-3.5 h-3.5" />,
  "diabetes":     <Droplets className="w-3.5 h-3.5" />,
  "antibiotics":  <ShieldPlus className="w-3.5 h-3.5" />,
  "baby":         <Baby className="w-3.5 h-3.5" />,
  "eye-ear":      <Eye className="w-3.5 h-3.5" />,
  "allergy":      <Flower2 className="w-3.5 h-3.5" />,
  "sleep":        <Moon className="w-3.5 h-3.5" />,
};

function getRecent(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
}
function saveRecent(term: string) {
  const updated = [term, ...getRecent().filter((s) => s !== term)].slice(0, 6);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { totalItems, openCart } = useCartStore();
  const cartCount = totalItems();

  const results = searchQuery.length >= 2
    ? mockProducts.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6)
    : [];

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  const handleFocus = useCallback(() => { setRecent(getRecent()); setDropdownOpen(true); }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    saveRecent(searchQuery.trim());
    router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    setDropdownOpen(false);
    setSearchQuery("");
  }

  function pickResult(slug: string, name: string) {
    saveRecent(name);
    router.push(`/product/${slug}`);
    setDropdownOpen(false);
    setSearchQuery("");
  }

  const showDrop = dropdownOpen && (results.length > 0 || (searchQuery.length < 2 && recent.length > 0));

  return (
    <header className="sticky top-0 z-40">
      {/* ── Main bar ── */}
      <div className="bg-white" style={{ boxShadow: "0 1px 0 var(--color-border)" }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">

          {/* Logo */}
          <Link href="/" className="shrink-0 group mr-2 transition-opacity hover:opacity-90">
            <Image src="/logo.png" alt="Samui Home Clinic" width={130} height={84}
              className="rounded-xl"
              priority />
          </Link>

          {/* Search */}
          <div ref={searchRef} className="flex-1 hidden md:flex items-center max-w-2xl relative">
            <form onSubmit={submit} className="w-full">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--color-text-tertiary)" }} />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setDropdownOpen(true); }}
                  onFocus={handleFocus}
                  placeholder="Search medications, vitamins, supplements…"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all"
                  style={{
                    background: "var(--color-surface-secondary)",
                    border: "1.5px solid var(--color-border)",
                    color: "var(--color-text)",
                    fontFamily: "var(--font-sans)",
                  }}
                  onFocusCapture={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--color-primary-500)"; (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(8,145,178,0.15)"; }}
                  onBlurCapture={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--color-border)"; (e.target as HTMLInputElement).style.boxShadow = "none"; }}
                />
              </div>
            </form>

            {showDrop && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl overflow-hidden z-50"
                style={{ boxShadow: "var(--shadow-modal)", border: "1px solid var(--color-border)" }}>
                {searchQuery.length >= 2 && results.length > 0 && (
                  <>
                    <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: "var(--color-text-tertiary)", background: "var(--color-surface-secondary)", borderBottom: "1px solid var(--color-border)" }}>
                      Products
                    </p>
                    {results.map((r) => (
                      <button key={r.slug} onClick={() => pickResult(r.slug, r.name)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                        style={{ borderBottom: "1px solid var(--color-border)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface-secondary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0" style={{ background: "var(--color-surface-tertiary)" }}>
                          <img src={r.images[0]} alt={r.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: "var(--color-text)", fontFamily: "var(--font-sans)" }}>{r.name}</p>
                          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{r.category?.name}</p>
                        </div>
                        <p className="text-sm font-bold shrink-0" style={{ color: "var(--color-primary-700)" }}>฿{r.price}</p>
                      </button>
                    ))}
                  </>
                )}
                {searchQuery.length < 2 && recent.length > 0 && (
                  <>
                    <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: "var(--color-text-tertiary)", background: "var(--color-surface-secondary)", borderBottom: "1px solid var(--color-border)" }}>
                      Recent
                    </p>
                    {recent.map((term) => (
                      <button key={term} onClick={() => { setSearchQuery(term); setDropdownOpen(false); router.push(`/shop?q=${encodeURIComponent(term)}`); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface-secondary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                        <Search className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--color-text-tertiary)" }} />
                        <span className="text-sm" style={{ color: "var(--color-text)", fontFamily: "var(--font-sans)" }}>{term}</span>
                      </button>
                    ))}
                  </>
                )}
                {searchQuery.length >= 2 && results.length === 0 && (
                  <p className="px-4 py-4 text-sm" style={{ color: "var(--color-text-tertiary)", fontFamily: "var(--font-sans)" }}>
                    No results for &quot;{searchQuery}&quot;
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Nav (desktop) */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-2">
            {[{ label: "Shop", href: "/shop" }, { label: "Blog", href: "/blog" }].map((l) => (
              <Link key={l.label} href={l.href}
                className="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-primary-700)"; (e.currentTarget as HTMLElement).style.background = "var(--color-primary-50)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Mobile search toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2.5 rounded-xl transition-colors md:hidden"
              style={{ color: "var(--color-text-secondary)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-surface-secondary)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              <Search className="w-5 h-5" />
            </button>

            <Link href="/account" className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors text-sm font-medium"
              style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-surface-secondary)"; (e.currentTarget as HTMLElement).style.color = "var(--color-primary-700)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)"; }}>
              <User className="w-5 h-5" />
              <span className="hidden lg:block">Account <ChevronDown className="w-3 h-3 inline" /></span>
            </Link>

            <button onClick={openCart}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors relative text-sm font-medium"
              style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-surface-secondary)"; (e.currentTarget as HTMLElement).style.color = "var(--color-primary-700)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)"; }}>
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-1.5 min-w-[18px] h-[18px] text-[10px] font-bold rounded-full flex items-center justify-center leading-none px-0.5 text-white"
                    style={{ background: "var(--color-primary-600)" }}>
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:block">Cart</span>
            </button>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2.5 rounded-xl transition-colors lg:hidden"
              style={{ color: "var(--color-text-secondary)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-surface-secondary)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div style={{ borderTop: "1px solid var(--color-border)" }}>
            <div className="max-w-[1400px] mx-auto px-4 py-3 flex flex-col gap-1">
              <form onSubmit={submit} className="flex gap-2 mb-2">
                <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…" autoFocus
                  className="flex-1 px-4 py-2.5 text-sm rounded-xl outline-none"
                  style={{ background: "var(--color-surface-secondary)", border: "1.5px solid var(--color-border)", fontFamily: "var(--font-sans)" }} />
                <button type="submit" className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: "var(--color-primary-600)" }}>
                  Search
                </button>
              </form>
              {[{ label: "All Products", href: "/shop" }, { label: "My Account", href: "/account" }, { label: "My Orders", href: "/account/orders" }, { label: "Blog", href: "/blog" }].map((l) => (
                <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium rounded-xl transition-colors"
                  style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)" }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Category nav ── */}
      <div style={{ background: "var(--color-surface-secondary)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-10 flex items-center gap-0 overflow-x-auto scrollbar-hide">
          {mockCategories.map((cat) => (
            <Link key={cat.id} href={`/shop/${cat.slug}`}
              className="flex items-center gap-1.5 px-3 h-10 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors rounded-md"
              style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-primary-700)"; (e.currentTarget as HTMLElement).style.background = "var(--color-primary-50)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              <span style={{ color: "var(--color-primary-500)" }}>{categoryIcons[cat.slug]}</span>
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
