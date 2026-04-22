"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const hasImages = images.length > 0 && images[0];

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="aspect-square rounded-2xl overflow-hidden bg-[var(--color-surface-secondary)] group relative">
        {hasImages ? (
          <Image
            src={images[selected]}
            alt={productName}
            width={600}
            height={600}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-24 h-24 text-[var(--color-border-strong)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={[
                "w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-[var(--color-surface-secondary)] border-2 transition-all",
                i === selected
                  ? "border-[var(--color-primary-500)] ring-2 ring-[var(--color-primary-200)]"
                  : "border-transparent hover:border-[var(--color-primary-300)]",
              ].join(" ")}
              aria-label={`View image ${i + 1}`}
            >
              {img && (
                <Image src={img} alt="" width={80} height={80} className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
