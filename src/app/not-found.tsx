import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Samui Home Clinic Pharmacy",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-secondary)] px-4">
      <div className="text-center max-w-md">
        <div
          className="text-[8rem] font-extrabold leading-none mb-4"
          style={{
            color: "var(--color-primary-200)",
            fontFamily: "var(--font-display)",
          }}
        >
          404
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-3">
          Page not found
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
          Let&apos;s get you back on track. The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop" className="btn-primary">
            Browse Products
          </Link>
          <Link href="/" className="btn-secondary">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
