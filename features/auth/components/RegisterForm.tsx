"use client";

import { signUp } from "@/features/auth/actions";
import Link from "next/link";
import { useActionState } from "react";

export default function RegisterForm() {
  const [state, action, pending] = useActionState(
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
        {state?.error && (
          <div className="bg-danger-light border border-danger-border text-danger text-sm rounded-lg px-4 py-3">
            {state.error}
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text mb-1">ელ-ფოსტა</label>
          <input
            id="email" name="email" type="email" required autoComplete="email"
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-border-focus"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text mb-1">პაროლი</label>
          <input
            id="password" name="password" type="password" required autoComplete="new-password" minLength={6}
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-border-focus"
            placeholder="მინ. 6 სიმბოლო"
          />
        </div>
        <button
          type="submit" disabled={pending}
          className="w-full bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
        >
          {pending ? "მიმდინარეობს..." : "რეგისტრაცია"}
        </button>
      </form>

      <p className="text-center text-sm text-text-muted mt-6">
        უკვე გაქვს ანგარიში?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">შესვლა</Link>
      </p>
    </div>
  );
}
