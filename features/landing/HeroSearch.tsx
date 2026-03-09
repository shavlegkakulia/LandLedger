"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function HeroSearch({
  locale,
  placeholder,
  buttonText,
}: {
  locale: string;
  placeholder: string;
  buttonText: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/${locale}/dashboard?cadastral=${encodeURIComponent(q)}`);
    } else {
      router.push(`/${locale}/dashboard`);
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-6">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-3 rounded-xl border border-border bg-white text-text placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-sm text-sm"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-xl hover:bg-primary-hover transition-colors shadow-sm whitespace-nowrap"
      >
        {buttonText}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  );
}
