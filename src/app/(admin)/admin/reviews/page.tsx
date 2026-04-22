import { createAdminClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Star } from "lucide-react";
import type { Review } from "@/types";
import { ReviewActions } from "./ReviewActions";

export default async function AdminReviewsPage() {
  const supabase = createAdminClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, product:products(name), profile:profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  const pending = (reviews ?? []).filter((r: Review) => !r.is_approved);
  const approved = (reviews ?? []).filter((r: Review) => r.is_approved);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary-600)] flex items-center justify-center">
          <Star className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Reviews</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{pending.length} pending approval</p>
        </div>
      </div>

      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="font-semibold text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4 inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse inline-block" />
            Pending Approval ({pending.length})
          </h2>
          <div className="flex flex-col gap-3">
            {(pending as (Review & { product?: { name: string }; profile?: { full_name: string } })[]).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-semibold mb-4">Approved Reviews ({approved.length})</h2>
        <div className="flex flex-col gap-3">
          {(approved as (Review & { product?: { name: string }; profile?: { full_name: string } })[]).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
          {approved.length === 0 && (
            <div className="card p-6 text-center text-[var(--color-text-secondary)] text-sm">No approved reviews yet</div>
          )}
        </div>
      </section>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review & { product?: { name: string }; profile?: { full_name: string } } }) {
  return (
    <div className="card p-4 flex gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <StarRating rating={review.rating} />
          <span className="text-xs text-[var(--color-text-secondary)]">by {review.profile?.full_name ?? "Unknown"}</span>
          <span className="text-xs text-[var(--color-text-muted)]">•</span>
          <span className="text-xs text-[var(--color-text-muted)]">{review.product?.name ?? "Unknown product"}</span>
          <span className="text-xs text-[var(--color-text-muted)]">•</span>
          <span className="text-xs text-[var(--color-text-muted)]">{formatDate(review.created_at)}</span>
        </div>
        {review.body && <p className="text-sm text-[var(--color-text)]">{review.body}</p>}
        {!review.is_approved && (
          <span className="badge badge-warning text-xs mt-2">Pending</span>
        )}
      </div>
      <ReviewActions reviewId={review.id} isApproved={review.is_approved} />
    </div>
  );
}
