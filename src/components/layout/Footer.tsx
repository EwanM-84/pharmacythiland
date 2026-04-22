import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="text-white mt-auto" style={{ background: "var(--color-primary-900)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 relative shrink-0">
                <Image src="/logo.png" alt="Samui Home Clinic Pharmacy" fill className="object-contain" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm tracking-wide" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}>
                  SAMUI HOME CLINIC
                </p>
                <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--color-accent-300)" }}>Pharmacy</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Koh Samui&apos;s trusted online pharmacy. Licensed medications delivered to your door or ready for collection.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-[var(--color-accent-300)] uppercase tracking-wide">Shop</h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "All Products", href: "/shop" },
                { label: "Prescription Medicines", href: "/shop?prescription=true" },
                { label: "Vitamins & Supplements", href: "/shop/vitamins" },
                { label: "Baby & Child", href: "/shop/baby" },
                { label: "Skincare", href: "/shop/skincare" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-[var(--color-accent-300)] uppercase tracking-wide">Help</h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "My Orders", href: "/account/orders" },
                { label: "Delivery Info", href: "/delivery" },
                { label: "Click & Collect", href: "/collect" },
                { label: "Health Blog", href: "/blog" },
                { label: "Contact Us", href: "/contact" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-[var(--color-accent-300)] uppercase tracking-wide">Contact</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 text-[var(--color-primary-500)] shrink-0" />
                <span>Koh Samui, Surat Thani, Thailand 84320</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-[var(--color-primary-500)] shrink-0" />
                <a href="tel:+66771234567" className="hover:text-white transition-colors">+66 77 123 4567</a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-[var(--color-primary-500)] shrink-0" />
                <a href="mailto:orders@samuihomeclinicpharmacy.com" className="hover:text-white transition-colors">orders@samuihomeclinicpharmacy.com</a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <Clock className="w-4 h-4 mt-0.5 text-[var(--color-primary-500)] shrink-0" />
                <span>Mon–Sat 8:00 – 20:00<br />Sun 9:00 – 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust badges */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            {[
              "Licensed Pharmacy",
              "Thai FDA Compliant",
              "Secure Payments",
              "Same-Day Delivery",
              "Click & Collect",
            ].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-xs text-gray-400">
                <div className="w-5 h-5 rounded-full bg-[var(--color-primary-600)] flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Samui Home Clinic Pharmacy. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
