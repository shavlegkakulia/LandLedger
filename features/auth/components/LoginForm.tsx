"use client";

import { signIn } from "@/features/auth/actions";
import Link from "next/link";
import { useActionState } from "react";
import SocialButtons from "@/features/auth/components/SocialButtons";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/Button";

const oauthErrorMessages: Record<string, string> = {
  oauth_failed: "ავტორიზაცია ვერ მოხერხდა. სცადე თავიდან.",
  duplicate_email: "ამ ელ-ფოსტით უკვე არსებობს ანგარიში. შედი ელ-ფოსტა/პაროლით, ან წაშალე ძველი ანგარიში.",
};

export default function LoginForm({ oauthError }: { oauthError?: string }) {
  const [state, action] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return (await signIn(formData)) ?? null;
    },
    null
  );

  const errorMessage = state?.error ?? (oauthError ? (oauthErrorMessages[oauthError] ?? "ავტორიზაცია ვერ მოხერხდა.") : null);

  return (
    <div className="bg-surface rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-light rounded-full mb-4">
          <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-9.894A11.958 11.958 0 0112 3c3.866 0 7.32 1.834 9.547 4.703L16 12H8l1 8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-text">შესვლა</h1>
        <p className="text-text-muted text-sm mt-1">LandLedger — საკადასტრო მონაცემების სისტემა</p>
      </div>

      <form action={action} className="space-y-4">
        <ErrorBanner message={errorMessage} />
        <Input label="ელ-ფოსტა" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
        <Input label="პაროლი" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" />
        <SubmitButton loadingText="მიმდინარეობს...">შესვლა</SubmitButton>
      </form>

      <SocialButtons />

      <p className="text-center text-sm text-text-muted mt-6">
        ანგარიში არ გაქვს?{" "}
        <Link href="/register" className="text-primary font-medium hover:underline">დარეგისტრირდი</Link>
      </p>
    </div>
  );
}
