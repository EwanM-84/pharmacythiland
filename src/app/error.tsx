"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-secondary)] px-4">
      <div className="card p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--color-error-bg)] flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-[var(--color-text)] mb-2">Something went wrong</h1>
        <p className="text-[var(--color-text-secondary)] text-sm mb-6">
          We&apos;re sorry — an unexpected error occurred. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-secondary">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
