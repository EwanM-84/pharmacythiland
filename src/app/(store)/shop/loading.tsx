import { ProductCardSkeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="h-10 w-48 bg-[var(--color-surface-tertiary)] rounded-xl mb-6 animate-pulse" />
      <div className="flex gap-6">
        <div className="hidden lg:flex flex-col gap-4 w-56 shrink-0">
          <div className="card p-4 h-48 animate-pulse bg-[var(--color-surface-tertiary)]" />
          <div className="card p-4 h-24 animate-pulse bg-[var(--color-surface-tertiary)]" />
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
