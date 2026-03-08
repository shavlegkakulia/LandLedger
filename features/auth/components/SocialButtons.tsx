"use client";

import { signInWithFacebook } from "@/features/auth/actions";
import { useState } from "react";

export default function SocialButtons() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFacebook() {
    setLoading(true);
    setError(null);
    const res = await signInWithFacebook();
    if (res?.error) { setError(res.error); setLoading(false); }
  }

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-surface px-3 text-text-faint">ან გააგრძელე</span>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-xs text-danger text-center">{error}</p>
      )}

      <div className="mt-4 space-y-2">
        <button
          type="button"
          onClick={handleFacebook}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-border hover:border-[#1877F2] bg-surface hover:bg-[#1877F2]/5 disabled:opacity-60 text-text font-medium py-2.5 rounded-lg text-sm transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.253h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
          </svg>
          {loading ? "მიმდინარეობს..." : "Facebook-ით გაგრძელება"}
        </button>
      </div>
    </div>
  );
}
