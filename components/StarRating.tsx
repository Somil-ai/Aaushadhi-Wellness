"use client";

type Props = {
  rating: number; // current value (1-5), can be fractional for display mode
  onChange?: (value: number) => void; // if provided, renders as an interactive picker
  size?: number; // px
};

export default function StarRating({ rating, onChange, size = 20 }: Props) {
  const interactive = !!onChange;

  return (
    <div className="inline-flex items-center gap-0.5" role={interactive ? "radiogroup" : undefined}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(rating);
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(star)}
            aria-label={interactive ? `Rate ${star} out of 5 stars` : undefined}
            className={interactive ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={filled ? "#D4A017" : "none"}
              stroke={filled ? "#D4A017" : "#C4C4B8"}
              strokeWidth="1.5"
            >
              <path
                d="M12 2.5l2.9 6.24 6.85.72-5.1 4.66 1.42 6.78L12 17.77l-6.07 3.13 1.42-6.78-5.1-4.66 6.85-.72L12 2.5z"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
