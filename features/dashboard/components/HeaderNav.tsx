"use client";

import { signOut } from "@/features/auth/actions";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function HeaderNav({ email, displayName, avatarUrl }: { email: string | undefined; displayName?: string; avatarUrl?: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const name = displayName || email || "";
  const parts = name.trim().split(/\s+/);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase() || "?";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-primary-light transition-colors group"
      >
        <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center shrink-0 overflow-hidden">
            {avatarUrl
              ? <img src={avatarUrl} alt={displayName ?? email} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              : initials}
          </div>
        <span className="text-sm text-text-muted group-hover:text-primary hidden sm:block max-w-[160px] truncate">
            {displayName || email}
          </span>
        <svg
          className={`w-4 h-4 text-text-faint transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-surface border border-border rounded-xl shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-border bg-background">
            <p className="text-xs text-text-faint">შესულია როგორც</p>
            <p className="text-sm font-medium text-text truncate mt-0.5">{displayName || email}</p>
          </div>
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:text-primary hover:bg-primary-light transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              პროფილი
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:text-primary hover:bg-primary-light transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-9.894A11.958 11.958 0 0112 3c3.866 0 7.32 1.834 9.547 4.703L16 12H8l1 8z" />
              </svg>
              ნაკვეთები
            </Link>
          </div>
          <div className="py-1 border-t border-border">
            <form action={signOut}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:text-danger hover:bg-danger-light transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                გამოსვლა
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
