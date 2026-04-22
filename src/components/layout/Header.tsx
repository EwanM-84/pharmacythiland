"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { ShoppingCart, Search, User, Menu, X, MapPin, ChevronDown } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useRouter } from "next/navigation";
import { mockProducts, mockCategories } from "@/lib/mock-products";

const RECENT_KEY = "shc-recent";

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
    ? mockProducts
        .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 6)
    : [];

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  const handleFocus = useCallback(() => {
    setRecent(getRecent());
    setDropdownOpen(true);
  }, []);

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
      {/* ── Top bar (Amazon dark) ── */}
      <div style={{ background: "var(--color-amazon-nav)" }}>
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 h-14 flex items-center gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <span className="text-white font-black text-sm">Rx</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-bold text-sm leading-none tracking-tight">SAMUI PHARMACY</p>
              <p style={{ color: "var(--color-amazon-search-btn)", fontSize: "10px" }} className="font-medium tracking-wide">KOH SAMUI</p>
            </div>
          </Link>

          {/* Deliver to */}
          <button className="hidden md:flex items-start gap-1.5 text-white/80 hover:text-white transition-colors shrink-0 group">
            <MapPin className="w-4 h-4 mt-0.5 text-white/60 group-hover:text-white" />
            <div className="text-left leading-none">
              <p className="text-[10px] text-white/60">Deliver to</p>
              <p className="text-xs font-bold text-white">Koh Samui</p>
            </div>
          </button>

          {/* Search bar */}
          <div ref={searchRef} className="flex-1 relative max-w-3xl">
            <form onSubmit={submit} className="flex">
              <select
                className="hidden lg:block shrink-0 h-10 px-2 text-xs font-medium border-r border-gray-300 bg-gray-100 text-gray-700 rounded-l-md focus:outline-none cursor-pointer"
                defaultValue="all"
              >
                <option value="all">All</option>
                {mockCategories.slice(0, 8).map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setDropdownOpen(true); }}
                onFocus={handleFocus}
                placeholder="Search medications, vitamins, supplements…"
                className="flex-1 h-10 px-4 text-sm text-gray-900 bg-white outline-none placeholder:text-gray-400 lg:rounded-none rounded-l-md"
              />
              <button
                type="submit"
                className="h-10 px-4 rounded-r-md flex items-center justify-center transition-colors hover:brightness-95"
                style={{ background: "var(--color-amazon-search-btn)" }}
              >
                <Search className="w-5 h-5 text-gray-800" />
              </button>
            </form>

            {/* Dropdown */}
            {showDrop && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                {searchQuery.length >= 2 && results.length > 0 && (
                  <div>
                    <p className="px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">Products</p>
                    {results.map((r) => (
                      <button key={r.slug} onClick={() => pickResult(r.slug, r.name)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-gray-50 last:border-0">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                          <img src={r.images[0]} alt={r.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{r.name}</p>
                          <p className="text-xs text-gray-500">{r.category?.name}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 shrink-0">฿{r.price}</p>
                      </button>
                    ))}
                  </div>
                )}
                {searchQuery.length < 2 && recent.length > 0 && (
                  <div>
                    <p className="px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">Recent Searches</p>
                    {recent.map((term) => (
                      <button key={term} onClick={() => { setSearchQuery(term); setDropdownOpen(false); router.push(`/shop?q=${encodeURIComponent(term)}`); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left">
                        <Search className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-700">{term}</span>
                      </button>
                    ))}
                  </div>
                )}
                {searchQuery.length >= 2 && results.length === 0 && (
                  <p className="px-4 py-4 text-sm text-gray-500">No results for &quot;{searchQuery}&quot;</p>
                )}
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto shrink-0">
            <Link href="/account" className="hidden sm:flex flex-col items-start px-2 py-1 text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors">
              <span className="text-[10px]">Hello, sign in</span>
              <span className="text-xs font-bold flex items-center gap-0.5">Account <ChevronDown className="w-3 h-3" /></span>
            </Link>
            <Link href="/account/orders" className="hidden md:flex flex-col items-start px-2 py-1 text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors">
              <span className="text-[10px]">Returns</span>
              <span className="text-xs font-bold">& Orders</span>
            </Link>
            <button onClick={openCart}
              className="flex items-center gap-1.5 px-2 py-1 text-white hover:bg-white/10 rounded transition-colors relative"
              aria-label="Cart">
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-1.5 min-w-[20px] h-5 text-[11px] font-bold rounded-full flex items-center justify-center leading-none px-1"
                    style={{ background: "var(--color-amazon-orange)", color: "#111" }}>
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:block text-xs font-bold">Cart</span>
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-white hover:bg-white/10 rounded transition-colors sm:hidden">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Category nav bar ── */}
      <div style={{ background: "var(--color-amazon-nav2)" }}>
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 h-9 flex items-center gap-0 overflow-x-auto scrollbar-hide">
          <Link href="/shop" className="flex items-center gap-1 px-3 h-9 text-white text-xs font-medium hover:bg-white/10 shrink-0 transition-colors border border-transparent hover:border-white/30 rounded">
            <Menu className="w-3.5 h-3.5" /> All
          </Link>
          {mockCategories.map((cat) => (
            <Link key={cat.id} href={`/shop/${cat.slug}`}
              className="px-3 h-9 text-white text-xs font-medium hover:bg-white/10 shrink-0 transition-colors border border-transparent hover:border-white/30 rounded flex items-center whitespace-nowrap">
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="bg-white border-b border-gray-200 shadow-lg">
          <div className="max-w-[1400px] mx-auto px-4 py-3 flex flex-col gap-1">
            <form onSubmit={submit} className="flex gap-2 mb-2">
              <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…" autoFocus
                className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg text-gray-900 outline-none focus:border-blue-500" />
              <button type="submit" className="px-4 py-2.5 rounded-lg text-white text-sm font-semibold" style={{ background: "var(--color-ios-blue)" }}>
                Search
              </button>
            </form>
            {[
              { label: "All Products", href: "/shop" },
              { label: "My Account", href: "/account" },
              { label: "My Orders", href: "/account/orders" },
              { label: "Blog", href: "/blog" },
            ].map((l) => (
              <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
