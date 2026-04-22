"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { ShoppingCart, Search, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
];

const RECENT_SEARCHES_KEY = "shc-recent-searches";

interface SearchResult {
  name: string;
  slug: string;
  images: string[];
  price: number;
}

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(term: string) {
  const existing = getRecentSearches().filter((s) => s !== term);
  const updated = [term, ...existing].slice(0, 5);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
}

function removeRecentSearch(term: string) {
  const updated = getRecentSearches().filter((s) => s !== term);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
}

function formatPrice(price: number) {
  return `฿${price.toLocaleString("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const { totalItems, openCart } = useCartStore();
  const cartCount = totalItems();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchResults = useCallback(
    async (q: string) => {
      if (q.length < 2) {
        setSearchResults([]);
        setSearching(false);
        return;
      }
      setSearching(true);
      const { data } = await supabase
        .from("products")
        .select("name, slug, images, price")
        .eq("is_active", true)
        .ilike("name", `%${q}%`)
        .limit(6);
      setSearchResults((data as SearchResult[]) ?? []);
      setSearching(false);
    },
    [supabase]
  );

  function handleSearchInput(value: string) {
    setSearchQuery(value);
    setDropdownOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchResults(value), 300);
  }

  function handleSearchFocus() {
    setRecentSearches(getRecentSearches());
    setDropdownOpen(true);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setDropdownOpen(false);
      setSearchQuery("");
      setSearchOpen(false);
    }
  }

  function handleResultClick(slug: string, name: string) {
    saveRecentSearch(name);
    router.push(`/product/${slug}`);
    setDropdownOpen(false);
    setSearchQuery("");
    setSearchOpen(false);
  }

  function handleRemoveRecent(e: React.MouseEvent, term: string) {
    e.stopPropagation();
    removeRecentSearch(term);
    setRecentSearches(getRecentSearches());
  }

  const showDropdown =
    dropdownOpen && (searchResults.length > 0 || recentSearches.length > 0 || searchQuery.length >= 2);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 mr-2">
            <div className="w-10 h-10 relative">
              <Image
                src="/logo.png"
                alt="Samui Home Clinic Pharmacy"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span
                className="font-semibold text-[var(--color-text)] text-sm tracking-wide"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "0.07em" }}
              >
                SAMUI HOME CLINIC
              </span>
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: "var(--color-primary-600)" }}
              >
                Pharmacy
              </span>
            </div>
          </Link>

          {/* Search bar (desktop) */}
          <div ref={searchRef} className="flex-1 hidden md:flex items-center max-w-xl relative">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onFocus={handleSearchFocus}
                  placeholder="Search medications, vitamins…"
                  className={cn(
                    "w-full rounded-full pl-10 pr-4 py-2.5 text-sm outline-none transition-all",
                    "bg-[var(--color-surface-secondary)] border border-[var(--color-border)]",
                    "text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]",
                    "focus:bg-white focus:border-[var(--color-primary-400)] focus:ring-2 focus:ring-[var(--color-primary-200)]"
                  )}
                />
              </div>
            </form>

            {/* Autocomplete dropdown */}
            {showDropdown && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-lg border border-[var(--color-border)] py-2 z-50 max-h-96 overflow-y-auto">
                {searchQuery.length >= 2 && searchResults.length > 0 && (
                  <>
                    <div className="px-3 py-1.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Results
                    </div>
                    {searchResults.map((result) => (
                      <button
                        key={result.slug}
                        onClick={() => handleResultClick(result.slug, result.name)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--color-surface-secondary)] transition-colors text-left"
                      >
                        <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-[var(--color-surface-tertiary)] shrink-0">
                          {result.images?.[0] && (
                            <Image src={result.images[0]} alt={result.name} fill className="object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--color-text)] truncate">{result.name}</p>
                          <p className="text-xs text-[var(--color-primary-600)] font-semibold">
                            {formatPrice(result.price)}
                          </p>
                        </div>
                      </button>
                    ))}
                    {searching && (
                      <p className="px-4 py-2.5 text-sm text-[var(--color-text-muted)]">Searching…</p>
                    )}
                  </>
                )}
                {searchQuery.length < 2 && recentSearches.length > 0 && (
                  <>
                    <div className="px-3 py-1.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                      Recent
                    </div>
                    {recentSearches.map((term) => (
                      <div
                        key={term}
                        className="flex items-center gap-2 px-3 py-2.5 hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
                        onClick={() => {
                          setSearchQuery(term);
                          handleSearchInput(term);
                        }}
                      >
                        <Search className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" />
                        <span className="flex-1 text-sm text-[var(--color-text)]">{term}</span>
                        <button
                          onClick={(e) => handleRemoveRecent(e, term)}
                          className="p-1 rounded-full hover:bg-[var(--color-surface-tertiary)] text-[var(--color-text-muted)]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </>
                )}
                {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
                  <p className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
                    No results for &quot;{searchQuery}&quot;
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Nav (desktop) */}
          <nav className="hidden lg:flex items-center gap-1 ml-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)] rounded-full transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)] transition-colors md:hidden"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/account"
              className="p-2.5 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)] transition-colors hidden sm:flex"
              aria-label="My account"
            >
              <User className="w-5 h-5" />
            </Link>

            <button
              onClick={openCart}
              className="p-2.5 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)] transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] text-[10px] font-bold rounded-full flex items-center justify-center leading-none px-0.5 text-white bg-[var(--color-primary-500)]">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2.5 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)] transition-colors lg:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <form onSubmit={handleSearchSubmit} className="pb-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medications, vitamins…"
                autoFocus
                className="w-full rounded-full pl-10 pr-4 py-2.5 text-sm bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary-400)] focus:ring-2 focus:ring-[var(--color-primary-200)]"
              />
            </div>
          </form>
        )}

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="pb-3 border-t border-[var(--color-border)] pt-3 lg:hidden flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-700)] rounded-xl transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-700)] rounded-xl transition-colors"
            >
              My Account
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
