"use client";

import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  error?: string;
}

export function Checkbox({ label, error, className = "", id, ...props }: CheckboxProps) {
  const checkboxId = id ?? `checkbox-${Math.random().toString(36).slice(2)}`;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={checkboxId} className="flex items-start gap-2.5 cursor-pointer group">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            id={checkboxId}
            type="checkbox"
            className="peer sr-only"
            {...props}
          />
          <div className={`w-4.5 h-4.5 w-[18px] h-[18px] rounded border-2 transition-colors
            ${error ? "border-danger" : "border-border peer-focus-visible:border-primary"}
            peer-checked:bg-primary peer-checked:border-primary
            group-hover:border-primary-muted
          `} />
          <svg
            className="absolute inset-0 w-full h-full text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none p-[3px]"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-sm text-text-muted leading-snug">{label}</span>
      </label>
      {error && <p className="text-xs text-danger ml-6">{error}</p>}
    </div>
  );
}
