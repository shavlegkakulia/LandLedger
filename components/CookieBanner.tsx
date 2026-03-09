"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_KEY = "ll_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto bg-white border border-border rounded-2xl shadow-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text mb-1">Cookies</p>
            <p className="text-xs text-text-muted leading-relaxed">
              ვიყენებთ cookies-ს ავტორიზაციისა და სერვისის გაუმჯობესებისთვის.{" "}
              <Link href="/cookies" className="text-primary hover:underline">
                Cookie პოლიტიკა
              </Link>
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={decline}
            className="flex-1 py-2 rounded-xl border border-border text-xs text-text-muted hover:bg-background transition-colors"
          >
            მხოლოდ აუცილებელი
          </button>
          <button
            onClick={accept}
            className="flex-1 py-2 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary-hover transition-colors"
          >
            ყველას მიღება
          </button>
        </div>
      </div>
    </div>
  );
}
