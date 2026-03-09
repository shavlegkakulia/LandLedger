"use client";

import { signInWithFacebook, signInWithGoogle } from "@/features/auth/actions";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function SocialButtons() {
  const t = useTranslations("auth");
  const [loadingFb, setLoadingFb] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFacebook() {
    setLoadingFb(true); setError(null);
    const res = await signInWithFacebook();
    if (res?.error) { setError(res.error); setLoadingFb(false); }
  }

  async function handleGoogle() {
    setLoadingGoogle(true); setError(null);
    const res = await signInWithGoogle();
    if (res?.error) { setError(res.error); setLoadingGoogle(false); }
  }

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-surface px-3 text-text-faint">{t("orContinueWith")}</span>
        </div>
      </div>

      {error && <p className="mt-3 text-xs text-danger text-center">{error}</p>}

      <div className="mt-4 space-y-2">
        <button type="button" onClick={handleGoogle} disabled={loadingGoogle || loadingFb}
          className="w-full flex items-center justify-center gap-3 border border-border hover:border-[#4285F4] bg-surface hover:bg-[#4285F4]/5 disabled:opacity-60 text-text font-medium py-2.5 rounded-lg text-sm transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {loadingGoogle ? t("loading") : t("continueWithGoogle")}
        </button>

        <button type="button" onClick={handleFacebook} disabled={loadingFb || loadingGoogle}
          className="w-full flex items-center justify-center gap-3 border border-border hover:border-[#1877F2] bg-surface hover:bg-[#1877F2]/5 disabled:opacity-60 text-text font-medium py-2.5 rounded-lg text-sm transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.253h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
          </svg>
          {loadingFb ? t("loading") : t("continueWithFacebook")}
        </button>
      </div>
    </div>
  );
}
