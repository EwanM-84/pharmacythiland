"use client";

import { Check } from "lucide-react";

interface CheckoutStepsProps {
  currentStep: 1 | 2 | 3 | 4;
}

const STEPS = [
  { label: "Cart", step: 1 },
  { label: "Delivery", step: 2 },
  { label: "Payment", step: 3 },
  { label: "Confirmed", step: 4 },
];

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-center gap-0">
        {STEPS.map((s, idx) => {
          const isCompleted = s.step < currentStep;
          const isActive = s.step === currentStep;
          const isFuture = s.step > currentStep;

          return (
            <div key={s.step} className="flex items-center">
              {/* Step circle + label */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={[
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                    isCompleted
                      ? "bg-[var(--color-primary-600)] text-white"
                      : isActive
                      ? "bg-[var(--color-primary-500)] text-white ring-4 ring-[var(--color-primary-100)]"
                      : "bg-[var(--color-surface-tertiary)] text-[var(--color-text-muted)]",
                  ].join(" ")}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.step}
                </div>
                <span
                  className={[
                    "text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap",
                    isActive
                      ? "text-[var(--color-primary-600)]"
                      : isCompleted
                      ? "text-[var(--color-text-secondary)]"
                      : "text-[var(--color-text-muted)]",
                  ].join(" ")}
                >
                  {s.label}
                </span>
              </div>

              {/* Connector line (not after last step) */}
              {idx < STEPS.length - 1 && (
                <div
                  className={[
                    "h-0.5 w-12 sm:w-20 mx-1 mb-4 rounded-full transition-all",
                    s.step < currentStep
                      ? "bg-[var(--color-primary-500)]"
                      : "bg-[var(--color-border)]",
                  ].join(" ")}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
