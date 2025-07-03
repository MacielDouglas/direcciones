import type { ReactNode } from "react";

interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
}

const ButtonSteps = ({
  onClick,
  children,
  variant = "primary",
  className = "",
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2.5 font-medium rounded-full transition-colors flex items-center cursor-pointer disabled:cursor-no-drop gap-1 disabled:bg-tertiary-lgt disabled:dark:bg-tertiary-drk  ${
        variant === "primary"
          ? "bg-[var(--color-destaque-primary)] text-white hover:bg-[var(--color-destaque-primary)]/90"
          : "border border-[var(--color-tertiary-lgt)] dark:border-[var(--color-second-drk)] text-[var(--color-primary-drk)] dark:text-[var(--color-primary-lgt)] hover:bg-[var(--color-second-lgt)] dark:hover:bg-[var(--color-second-drk)]"
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default ButtonSteps;
