import { getProductReviews, computeReviewStats } from "@/lib/strapi";
import StarRating from "./StarRating";
import ReviewForm from "./ReviewForm";

type Props = {
  productId: number;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default async function ProductReviews({ productId }: Props) {
  const reviews = await getProductReviews(productId);
  const stats = computeReviewStats(reviews);

  return (
    <div>
      {/* Summary */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {stats.count > 0 ? (
          <>
            <div className="flex items-baseline gap-2">
              <span
                className="text-3xl font-bold text-text-dark"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {stats.average}
              </span>
              <StarRating rating={stats.average} size={22} />
            </div>
            <span className="text-text-muted text-sm">
              Based on {stats.count} {stats.count === 1 ? "review" : "reviews"}
            </span>
          </>
        ) : (
          <p className="text-text-muted text-sm">
            No reviews yet — be the first to share your experience.
          </p>
        )}
      </div>

      {/* Form */}
      <div className="mb-8">
        <ReviewForm productId={productId} />
      </div>

      {/* List */}
      {reviews.length > 0 && (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div key={review.id} className="pb-5 border-b border-olive/10 last:border-0">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-olive/15 text-olive font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {initials(review.customerName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-semibold text-text-dark text-sm">
                      {review.customerName}
                    </span>
                    <span className="text-text-muted text-xs">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <StarRating rating={review.rating} size={15} />
                  <p className="text-text-dark text-sm mt-2 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
