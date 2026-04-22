"use client";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Shield, Truck, Star, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto" style={{ background: "#131A22", color: "#fff" }}>
      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="w-full py-3 text-white text-sm font-medium transition-colors hover:opacity-90 border-b border-white/10 text-center"
        style={{ background: "#37475A" }}>
        Back to top
      </button>

      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 border-b border-white/10">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-white font-black text-sm">Rx</span>
              </div>
              <div>
                <p className="font-bold text-white text-sm leading-none">SAMUI PHARMACY</p>
                <p className="text-[10px] text-yellow-400 tracking-widest">KOH SAMUI</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Koh Samui&apos;s trusted licensed online pharmacy. Genuine medications delivered to your door or ready for collection.
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                { icon: <MapPin className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />, text: "Koh Samui, Surat Thani, Thailand 84320" },
                { icon: <Phone className="w-4 h-4 text-yellow-400 shrink-0" />, text: "+66 77 123 4567" },
                { icon: <Mail className="w-4 h-4 text-yellow-400 shrink-0" />, text: "orders@samuipharmacy.com" },
                { icon: <Clock className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />, text: "Mon–Sat 8:00–20:00 · Sun 9:00–18:00" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-gray-400">{item.icon}{item.text}</div>
              ))}
            </div>
          </div>

          {/* Get to Know Us */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Get to Know Us</h3>
            <ul className="flex flex-col gap-2">
              {[
                { label: "About Us", href: "/about" },
                { label: "Health Blog", href: "/blog" },
                { label: "Pharmacy Team", href: "/team" },
                { label: "Careers", href: "/careers" },
                { label: "Press", href: "/press" },
                { label: "Community", href: "/community" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white hover:underline transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Shop</h3>
            <ul className="flex flex-col gap-2">
              {[
                { label: "All Products", href: "/shop" },
                { label: "Pain Relief", href: "/shop/pain-relief" },
                { label: "Vitamins & Supplements", href: "/shop/vitamins" },
                { label: "Cold & Flu", href: "/shop/cold-flu" },
                { label: "Baby & Child", href: "/shop/baby" },
                { label: "Skincare", href: "/shop/skincare" },
                { label: "Prescription Medicines", href: "/shop?prescription=true" },
                { label: "Best Sellers", href: "/shop?sort=bestseller" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white hover:underline transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Customer Service</h3>
            <ul className="flex flex-col gap-2">
              {[
                { label: "My Account", href: "/account" },
                { label: "My Orders", href: "/account/orders" },
                { label: "Delivery Information", href: "/delivery" },
                { label: "Returns & Refunds", href: "/returns" },
                { label: "Click & Collect", href: "/collect" },
                { label: "Prescription Upload", href: "/prescription" },
                { label: "Contact Us", href: "/contact" },
                { label: "FAQs", href: "/faq" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white hover:underline transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 border-b border-white/10">
        <div className="flex flex-wrap gap-x-8 gap-y-3 justify-center sm:justify-start">
          {[
            { icon: <Shield className="w-4 h-4 text-yellow-400" />, label: "Licensed Pharmacy" },
            { icon: <Lock className="w-4 h-4 text-yellow-400" />, label: "Secure Payments" },
            { icon: <Truck className="w-4 h-4 text-yellow-400" />, label: "Same-Day Delivery" },
            { icon: <Star className="w-4 h-4 text-yellow-400" />, label: "Thai FDA Compliant" },
          ].map((t) => (
            <div key={t.label} className="flex items-center gap-2 text-sm text-gray-400">
              {t.icon} {t.label}
            </div>
          ))}
        </div>
      </div>

      {/* Payment logos row */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 border-b border-white/10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-gray-500 mr-2">We accept:</span>
          {["VISA", "MASTERCARD", "AMEX", "DISCOVER", "PROMPTPAY"].map((brand) => (
            <div key={brand} className="px-3 py-1 rounded border border-white/20 text-[10px] font-bold text-gray-300 bg-white/5 tracking-widest">
              {brand}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Samui Home Clinic Pharmacy Co., Ltd. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
            {["Privacy Policy", "Terms & Conditions", "Cookie Policy", "Accessibility"].map((l) => (
              <Link key={l} href={`/${l.toLowerCase().replace(/\s+/g, "-").replace("&", "and")}`} className="hover:text-gray-300 transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
