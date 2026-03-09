"use client";

import { useFormStatus } from "react-dom";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

const variantCls = {
  primary: "bg-primary hover:bg-primary-hover disabled:opacity-60 text-white",
  danger:  "bg-danger hover:bg-danger/90 disabled:opacity-60 text-white",
  ghost:   "text-text-muted hover:text-text hover:bg-background disabled:opacity-60",
  outline: "border border-border text-text-muted hover:border-primary-muted hover:text-primary disabled:opacity-60",
};

const sizeCls = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

function Spinner() {
  return (
    <svg
      className="animate-spin w-4 h-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-20"
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle
        className="opacity-80"
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="40"
        strokeDashoffset="30"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors ${variantCls[variant]} ${sizeCls[size]} ${className}`}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

// ფორმის submit ღილაკი — useFormStatus-ით pending ავტომატურად ამოიცნობს
export function SubmitButton({
  children,
  loadingText,
  variant = "primary",
  size = "md",
  className = "",
}: {
  children: React.ReactNode;
  loadingText?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      loading={pending}
      className={`w-full ${className}`}
    >
      {pending && loadingText ? loadingText : children}
    </Button>
  );
}
