import { Camera, X } from "lucide-react";
import type { ReactNode } from "react";
// import { ReactNode } from "react";

interface InputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  className?: string;
}

export const Input = ({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: InputProps) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`bg-[var(--color-second-lgt)] dark:bg-[var(--color-second-drk)] border border-[var(--color-tertiary-lgt)] dark:border-[var(--color-tertiary-drk)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-destaque-primary)] focus:border-transparent ${className}`}
  />
);

interface SelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
}

export const Select = ({ name, value, onChange, children }: SelectProps) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    className="bg-[var(--color-second-lgt)] dark:bg-[var(--color-second-drk)] border border-[var(--color-tertiary-lgt)] dark:border-[var(--color-tertiary-drk)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-destaque-primary)] focus:border-transparent appearance-none"
  >
    {children}
  </select>
);

interface ToggleProps {
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

export const Toggle = ({ name, checked, onChange, label }: ToggleProps) => (
  <div className="flex items-center justify-between pt-2">
    <label className="text-sm font-medium text-[var(--color-destaque-second)] dark:text-[var(--color-tertiary-lgt)]">
      {label}
    </label>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-11 border border-destaque-primary h-6 bg-[var(--color-tertiary-lgt)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-destaque-primary)] rounded-full peer dark:bg-[var(--color-tertiary-drk)] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--color-tertiary-lgt)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-[var(--color-tertiary-drk)] peer-checked:bg-[var(--color-destaque-primary)]"></div>
    </label>
  </div>
);

interface FileUploadProps {
  photo: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export const FileUpload = ({ photo, onChange, onRemove }: FileUploadProps) => (
  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[var(--color-tertiary-lgt)] dark:border-[var(--color-tertiary-drk)] border-dashed rounded-lg cursor-pointer bg-[var(--color-second-lgt)] dark:bg-[var(--color-second-drk)] hover:bg-[var(--color-tertiary-lgt)] dark:hover:bg-[var(--color-tertiary-drk)] transition-colors">
    {photo ? (
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={URL.createObjectURL(photo)}
          alt="Preview"
          className="max-h-full max-w-full object-contain rounded-md"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 bg-[var(--color-tertiary-drk)]/80 text-white rounded-full p-1"
        >
          <X size={16} />
        </button>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <Camera
          className="mb-2 text-[var(--color-destaque-second)] dark:text-[var(--color-tertiary-lgt)]"
          size={24}
        />
        <p className="text-sm text-[var(--color-destaque-second)] dark:text-[var(--color-tertiary-lgt)]">
          Clique para enviar uma foto
        </p>
      </div>
    )}
    <input
      type="file"
      onChange={onChange}
      className="hidden"
      accept="image/*"
    />
  </label>
);

interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export const Button = ({
  onClick,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) => (
  <button
    onClick={onClick}
    className={`px-6 py-2.5 font-medium rounded-full transition-colors flex items-center gap-1 ${
      variant === "primary"
        ? "bg-[var(--color-destaque-primary)] text-white hover:bg-[var(--color-destaque-primary)]/90"
        : "border border-[var(--color-tertiary-lgt)] dark:border-[var(--color-tertiary-drk)] text-[var(--color-primary-drk)] dark:text-[var(--color-primary-lgt)] hover:bg-[var(--color-second-lgt)] dark:hover:bg-[var(--color-second-drk)]"
    } ${className}`}
  >
    {children}
  </button>
);
