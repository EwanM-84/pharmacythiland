"use client";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Shield, Truck, Star, Lock } from "lucide-react";
import { useLanguageStore } from "@/stores/languageStore";

export function Footer() {
  const { t } = useLanguageStore();

  return (
    <footer className="mt-auto" style={{ background: "#131A22", color: "#fff" }}>
      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="w-full py-3 text-white text-sm font-medium transition-colors hover:opacity-90 border-b border-white/10 text-center"
        style={{ background: "#37475A" }}>
        {t.backToTop}
      </button>

      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 border-b border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">

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
            <p className="text-sm text-gray-400 leading-relaxed mb-5">{t.footerDesc}</p>
            <div className="flex flex-col gap-2.5">
              {[
                { icon: <MapPin className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />, text: "Koh Samui, Surat Thani, Thailand 84320" },
                { icon: <Phone className="w-4 h-4 text-yellow-400 shrink-0" />, text: "+66 77 123 4567" },
                { icon: <Mail className="w-4 h-4 text-yellow-400 shrink-0" />, text: "orders@samuipharmacy.com" },
                { icon: <Clock className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />, text: t.openingHours },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-gray-400">{item.icon}{item.text}</div>
              ))}
            </div>
          </div>

          {/* Get to Know Us */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">{t.getToKnowUs}</h3>
            <ul className="flex flex-col gap-2">
              {[
                { label: t.aboutUs, href: "/about" },
                { label: t.healthBlog, href: "/blog" },
                { label: t.pharmacyTeam, href: "/team" },
                { label: t.careers, href: "/careers" },
                { label: t.press, href: "/press" },
                { label: t.community, href: "/community" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white hover:underline transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">{t.footerShop}</h3>
            <ul className="flex flex-col gap-2">
              {[
                { label: t.allProducts, href: "/shop" },
                { label: t.categories["pain-relief"], href: "/shop/pain-relief" },
                { label: t.categories["vitamins"], href: "/shop/vitamins" },
                { label: t.categories["cold-flu"], href: "/shop/cold-flu" },
                { label: t.categories["baby"], href: "/shop/baby" },
                { label: t.categories["skincare"], href: "/shop/skincare" },
                { label: t.prescriptionMedicines, href: "/shop?prescription=true" },
                { label: t.bestSellers, href: "/shop?sort=bestseller" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white hover:underline transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">{t.customerService}</h3>
            <ul className="flex flex-col gap-2">
              {[
                { label: t.myAccount, href: "/account" },
                { label: t.myOrders, href: "/account/orders" },
                { label: t.deliveryInfo, href: "/delivery" },
                { label: t.returnsRefunds, href: "/returns" },
                { label: t.clickCollect, href: "/collect" },
                { label: t.prescriptionUpload, href: "/prescription" },
                { label: t.contactUs, href: "/contact" },
                { label: t.faqs, href: "/faq" },
              ].map((l) => (
                <li key={l.href}>
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
            { icon: <Shield className="w-4 h-4 text-yellow-400" />, label: t.licensedPharmacy },
            { icon: <Lock className="w-4 h-4 text-yellow-400" />, label: t.securePayments },
            { icon: <Truck className="w-4 h-4 text-yellow-400" />, label: t.sameDayDelivery },
            { icon: <Star className="w-4 h-4 text-yellow-400" />, label: t.thaiFDA },
          ].map((trust) => (
            <div key={trust.label} className="flex items-center gap-2 text-sm text-gray-400">
              {trust.icon} {trust.label}
            </div>
          ))}
        </div>
      </div>

      {/* Payment logos row */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 border-b border-white/10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-gray-500 mr-2">{t.weAccept}</span>
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
            {[
              { label: t.privacyPolicy, href: "/privacy-policy" },
              { label: t.terms, href: "/terms-and-conditions" },
              { label: t.cookiePolicy, href: "/cookie-policy" },
              { label: t.accessibility, href: "/accessibility" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-gray-300 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
