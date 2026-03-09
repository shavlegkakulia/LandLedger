"use client";

import { signUp } from "@/features/auth/actions";
import Link from "next/link";
import { useActionState } from "react";
import SocialButtons from "@/features/auth/components/SocialButtons";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/Button";

export default function RegisterForm() {
  const [state, action] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return (await signUp(formData)) ?? null;
    },
    null
  );

  return (
    <div className="bg-surface rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-light rounded-full mb-4">
          <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-9.894A11.958 11.958 0 0112 3c3.866 0 7.32 1.834 9.547 4.703L16 12H8l1 8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-text">რეგისტრაცია</h1>
        <p className="text-text-muted text-sm mt-1">შექმენი ანგარიში</p>
      </div>

      <form action={action} className="space-y-4">
        <ErrorBanner message={state?.error} />
        <Input label="ელ-ფოსტა" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
        <Input
          label="პაროლი" name="password" type="password" required autoComplete="new-password"
          placeholder="მინ. 8 სიმბოლო, A-z, სიმბოლო"
          hint="მინ. 8 სიმბოლო, დიდი და პატარა ასო, სპეციალური სიმბოლო"
        />
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input type="checkbox" name="terms" required className="mt-0.5 accent-primary shrink-0" />
          <span className="text-xs text-text-muted leading-relaxed">
            ვეთანხმები{" "}
            <Link href="/terms" target="_blank" className="text-primary hover:underline">გამოყენების პირობებს</Link>
            {" "}და{" "}
            <Link href="/privacy" target="_blank" className="text-primary hover:underline">კონფიდენციალურობის პოლიტიკას</Link>
          </span>
        </label>
        <SubmitButton loadingText="მიმდინარეობს...">რეგისტრაცია</SubmitButton>
      </form>

      <SocialButtons />

      <p className="text-center text-sm text-text-muted mt-6">
        უკვე გაქვს ანგარიში?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">შესვლა</Link>
      </p>
    </div>
  );
}
