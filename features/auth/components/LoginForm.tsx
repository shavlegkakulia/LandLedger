"use client";

import { signIn } from "@/features/auth/actions";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import SocialButtons from "@/features/auth/components/SocialButtons";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { SubmitButton } from "@/components/ui/Button";
import { useRememberedEmail } from "@/features/auth/hooks/useRememberedEmail";

export default function LoginForm({ oauthError, next }: { oauthError?: string; next?: string }) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [rememberMe, setRememberMe] = useState(true);
  const { email: savedEmail, save: saveEmail, clear: clearEmail } = useRememberedEmail();

  const oauthErrorMessages: Record<string, string> = {
    oauth_failed: t("errorOauthFailed"),
    duplicate_email: t("errorDuplicateEmail"),
  };

  const [state, action] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const email = formData.get("email") as string;
      const remember = formData.get("rememberMe") === "1";

      if (remember && email) {
        saveEmail(email);
      } else {
        clearEmail();
      }

      return (await signIn(formData)) ?? null;
    },
    null
  );

  const errorMessage = state?.error ?? (oauthError ? (oauthErrorMessages[oauthError] ?? t("errorOauthFailed")) : null);

  return (
    <div className="bg-surface rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-light rounded-full mb-4">
          <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-9.894A11.958 11.958 0 0112 3c3.866 0 7.32 1.834 9.547 4.703L16 12H8l1 8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-text">{t("loginTitle")}</h1>
        <p className="text-text-muted text-sm mt-1">{t("loginSubtitle")}</p>
      </div>

      <form action={action} className="space-y-4">
        <ErrorBanner message={errorMessage} />
        <Input
          label={t("email")}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          defaultValue={savedEmail}
          key={savedEmail}
        />
        <Input
          label={t("password")}
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
        />
        <div className="flex items-center justify-between">
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onChange={e => setRememberMe(e.target.checked)}
            label={t("rememberMe")}
          />
        </div>
        <input type="hidden" name="rememberMe" value={rememberMe ? "1" : "0"} />
        <SubmitButton loadingText={t("loading")}>{t("loginButton")}</SubmitButton>
      </form>

      <SocialButtons next={next} />

      <p className="text-center text-sm text-text-muted mt-6">
        {t("noAccount")}{" "}
        <Link href={`/${locale}/register`} className="text-primary font-medium hover:underline">{t("registerButton")}</Link>
      </p>
    </div>
  );
}
