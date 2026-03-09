"use client";

import { useState, useTransition } from "react";
import { deleteAccount } from "@/features/profile/actions";

export function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteAccount();
    });
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-sm text-danger hover:text-red-700 transition-colors"
      >
        ანგარიშის წაშლა
      </button>
    );
  }

  return (
    <div className="bg-danger-light border border-danger-border rounded-xl p-4 space-y-3">
      <div className="flex items-start gap-2">
        <svg className="w-5 h-5 text-danger shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-danger">ანგარიშის სამუდამო წაშლა</p>
          <p className="text-xs text-text-muted mt-0.5">
            ეს ოპერაცია შეუქცევადია. წაიშლება პროფილი, ყველა ნაკვეთი და ყველა მონაცემი.
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setConfirming(false)}
          className="flex-1 py-2 rounded-lg border border-border text-sm text-text-muted hover:bg-white transition-colors"
        >
          გაუქმება
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="flex-1 py-2 rounded-lg bg-danger text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? "იშლება..." : "კი, წაშლა"}
        </button>
      </div>
    </div>
  );
}
