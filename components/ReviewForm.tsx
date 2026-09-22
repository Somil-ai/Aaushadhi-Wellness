"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import StarRating from "./StarRating";

type Props = {
  productId: number;
  onSubmitted?: () => void;
};

export default function ReviewForm({ productId, onSubmitted }: Props) {
  const { customer, login } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!customer) {
      login(() => {
        // After login, let them pick up where they left off.
      });
      return;
    }

    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a short comment.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment: comment.trim() }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      setRating(0);
      setComment("");
      onSubmitted?.();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 rounded-xl bg-olive/10 border border-olive/20 text-sm text-text-dark">
        <p className="font-semibold mb-0.5">Thanks for your review!</p>
        <p className="text-text-muted">
          It&apos;ll appear here once our team approves it.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-xl border border-olive/15 bg-white/60">
      <h3
        className="text-base font-bold text-text-dark mb-3"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Write a review
      </h3>

      {!customer ? (
        <div className="text-sm text-text-muted">
          <button
            type="button"
            onClick={() => login()}
            className="text-olive font-semibold underline underline-offset-2"
          >
            Log in
          </button>{" "}
          to share your experience with this product.
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-text-dark uppercase tracking-wider mb-1.5">
              Your Rating
            </label>
            <StarRating rating={rating} onChange={setRating} size={26} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-dark uppercase tracking-wider mb-1.5">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setError("");
              }}
              rows={3}
              maxLength={2000}
              placeholder="What did you like or dislike about this product?"
              className="w-full px-4 py-3 rounded-xl border border-olive/20 bg-white/80 text-sm text-text-dark
                outline-none focus:border-olive/40 focus:ring-2 focus:ring-olive/10 transition-all
                placeholder:text-text-muted/60 resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all
              ${
                submitting
                  ? "bg-olive/40 text-white/60 cursor-not-allowed"
                  : "bg-olive text-white hover:bg-olive-light active:scale-[0.98]"
              }`}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}
    </div>
  );
}
