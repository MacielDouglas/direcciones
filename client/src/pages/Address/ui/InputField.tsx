import { useEffect, useRef } from "react";

interface InputFieldProps {
  label?: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error?: string;
  type?: string;
  maxLength?: number;
  placeholder?: string;
  isTextarea?: boolean;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

const InputField = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  maxLength,
  placeholder = "",
  isTextarea = false,
  className = "",
  required = false,
  disabled = false,
}: InputFieldProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (isTextarea && textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // expand
    }
  }, [value, isTextarea]);

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-semibold text-gray-600 mb-1"
        >
          {label}
        </label>
      )}

      {isTextarea ? (
        <textarea
          id={name}
          name={name}
          ref={textareaRef}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={2}
          className={`resize-none overflow-hidden w-full bg-second-lgt dark:bg-second-drk border border-tertiary-lgt dark:border-tertiary-drk rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-destaque-primary focus:border-transparent ${className}`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          disabled={disabled}
          className={`w-full bg-second-lgt dark:bg-second-drk border border-tertiary-lgt dark:border-tertiary-drk rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-destaque-primary focus:border-transparent ${className}`}
        />
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
