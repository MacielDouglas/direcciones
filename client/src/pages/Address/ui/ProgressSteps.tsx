import type { ReactNode } from "react";

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  children: ReactNode;
}

export const ProgressSteps = ({
  currentStep,
  totalSteps,
  children,
}: ProgressStepsProps) => {
  return (
    <div className="mb-8">
      <div className="overflow-hidden rounded-full bg-[var(--color-tertiary-lgt)] dark:bg-[var(--color-tertiary-drk)]">
        <div
          className="h-2 rounded-full bg-[var(--color-destaque-primary)] transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>

      <ol className="mt-4 grid grid-cols-4 text-sm font-medium text-[var(--color-destaque-second)] dark:text-[var(--color-tertiary-lgt)]">
        {children}
      </ol>
    </div>
  );
};

interface StepProps {
  active: boolean;
  children: ReactNode;
}

export const Step = ({ active, children }: StepProps) => (
  <li
    className={`flex items-center justify-center ${
      active ? "text-[var(--color-destaque-primary)]" : ""
    }`}
  >
    {children}
  </li>
);
