import type { InputHTMLAttributes } from "react";

type AuthFieldProps = {
  label: string;
  id: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function AuthField({
  label,
  id,
  error,
  className = "",
  ...props
}: AuthFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-body-sm font-semibold text-on-surface">
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-lg border bg-surface-container-lowest text-on-surface px-3 py-2.5 text-body-sm outline-none transition-all placeholder:text-on-surface-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/10 ${
          error ? "border-error" : "border-outline-variant"
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="text-body-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
