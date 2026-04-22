"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function StoreError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="card p-10">
        <div className="w-14 h-14 rounded-full bg-[var(--color-error-bg)] flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-[var(--color-text)] mb-2">Something went wrong</h2>
        <p className="text-[var(--color-text-secondary)] text-sm mb-6">
          An unexpected error occurred. Please try again or browse other products.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-primary">
            Try again
          </button>
          <Link href="/shop" className="btn-secondary">
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
