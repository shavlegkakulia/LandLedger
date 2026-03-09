"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

function fieldCls(hasError: boolean) {
  return `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors ${
    hasError
      ? "border-danger-border focus:ring-danger/30 bg-danger-light"
      : "border-border focus:ring-primary/30 focus:border-border-focus"
  }`;
}

export function Input({ label, error, hint, required, className = "", type, ...props }: InputProps) {
  const t = useTranslations("legal");
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-text">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={resolvedType}
          className={`${fieldCls(!!error)} ${isPassword ? "pr-10" : ""} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-text-muted transition-colors"
            aria-label={showPassword ? t("passwordHide") : t("passwordShow")}
          >
            {showPassword ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
      {!error && hint && <p className="text-xs text-text-faint">{hint}</p>}
    </div>
  );
}

export function Textarea({ label, error, hint, required, className = "", ...props }: TextareaProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-text">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <textarea className={`${fieldCls(!!error)} resize-none ${className}`} {...props} />
      {error && <p className="text-xs text-danger">{error}</p>}
      {!error && hint && <p className="text-xs text-text-faint">{hint}</p>}
    </div>
  );
}

export { fieldCls };
