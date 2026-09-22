"use client";

import { useState, useEffect } from "react";
import StarRating from "./StarRating";

type PopupItem = {
  productId: number;
  productName: string;
  imageUrl: string;
};

type Props = {
  orderId: string;
  items: PopupItem[];
};

/**
 * Post-purchase review popup — appears a moment after the order confirmation
 * page loads, asking the customer to rate what they just bought. Dismissible
 * (X or "Maybe Later"), and won't nag again for the same order once
 * dismissed or submitted (tracked via localStorage, per orderId).
 */
export default function PostPurchaseReviewPopup({ orderId, items }: Props) {
  const storageKey = `review-popup-seen-${orderId}`;

  const [visible, setVisible] = useState(false);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [comments, setComments] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (items.length === 0) return;
    try {
      if (localStorage.getItem(storageKey)) return; // already dismissed/submitted before
    } catch {
      // localStorage unavailable — just show it, no persistence
    }
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, [items.length, storageKey]);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(storageKey, "1");
    } catch {
      // ignore — non-critical
    }
  };

  const handleSubmit = async () => {
    const toSubmit = items.filter((item) => (ratings[item.productId] || 0) > 0);

    if (toSubmit.length === 0) {
      setError("Please select a star rating for at least one item.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const results = await Promise.all(
        toSubmit.map((item) =>
          fetch("/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: item.productId,
              rating: ratings[item.productId],
              comment: comments[item.productId]?.trim() || "Great product!",
            }),
          }).then((r) => r.json())
        )
      );

      const anySuccess = results.some((r) => r.success);

      if (!anySuccess) {
        setError(results[0]?.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      try {
        localStorage.setItem(storageKey, "1");
      } catch {
        // ignore
      }
      setTimeout(() => setVisible(false), 2200);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-xl">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-4 right-4 text-text-muted hover:text-text-dark transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto rounded-full bg-olive/10 flex items-center justify-center mb-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5C6B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p
              className="font-bold text-text-dark"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Thanks for your feedback!
            </p>
            <p className="text-text-muted text-sm mt-1">
              Your review is pending approval.
            </p>
          </div>
        ) : (
          <>
            <h2
              className="text-lg font-bold text-text-dark mb-1 pr-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              How was your order?
            </h2>
            <p className="text-text-muted text-sm mb-5">
              Rate what you bought — it helps other customers decide.
            </p>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-start gap-3 pb-4 border-b border-olive/10 last:border-0 last:pb-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-parchment/40"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-dark truncate mb-1">
                      {item.productName}
                    </p>
                    <StarRating
                      rating={ratings[item.productId] || 0}
                      onChange={(v) =>
                        setRatings((r) => ({ ...r, [item.productId]: v }))
                      }
                      size={22}
                    />
                    {(ratings[item.productId] || 0) > 0 && (
                      <textarea
                        value={comments[item.productId] || ""}
                        onChange={(e) =>
                          setComments((c) => ({
                            ...c,
                            [item.productId]: e.target.value,
                          }))
                        }
                        placeholder="Add a comment (optional)"
                        rows={2}
                        maxLength={2000}
                        className="w-full mt-2 px-3 py-2 rounded-lg border border-olive/20 bg-white text-xs text-text-dark
                          outline-none focus:border-olive/40 focus:ring-2 focus:ring-olive/10 transition-all resize-none
                          placeholder:text-text-muted/60"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {error && <p className="text-red-500 text-xs mt-3">{error}</p>}

            <div className="flex gap-2 mt-5">
              <button
                type="button"
                onClick={dismiss}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-text-muted border border-olive/20 hover:bg-olive/5 transition-colors"
              >
                Maybe Later
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all
                  ${
                    submitting
                      ? "bg-olive/40 cursor-not-allowed"
                      : "bg-olive hover:bg-olive-light active:scale-[0.98]"
                  }`}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
