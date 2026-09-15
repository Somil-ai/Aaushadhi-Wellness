"use client";

type Props = {
  currentStep: 1 | 2 | 3;
};

const steps = [
  { number: 1 as const, label: "Verify Mobile" },
  { number: 2 as const, label: "Delivery Address" },
  { number: 3 as const, label: "Payment & Order" },
];

export default function StepIndicator({ currentStep }: Props) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8 md:mb-10">
      {steps.map((step, i) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;

        return (
          <div key={step.number} className="flex items-center">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`
                  w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center
                  text-sm font-bold transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-olive text-white shadow-md"
                      : isActive
                        ? "bg-olive text-white shadow-lg scale-110"
                        : "bg-parchment text-text-muted"
                  }
                `}
              >
                {isCompleted ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`
                  text-[10px] md:text-xs font-medium tracking-wide transition-colors duration-300
                  ${isActive || isCompleted ? "text-olive" : "text-text-muted"}
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line between steps */}
            {i < steps.length - 1 && (
              <div
                className={`
                  w-8 md:w-16 h-[2px] mx-2 md:mx-3 rounded-full transition-colors duration-300
                  ${isCompleted ? "bg-olive" : "bg-parchment"}
                `}
                style={{ marginBottom: "1.5rem" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
