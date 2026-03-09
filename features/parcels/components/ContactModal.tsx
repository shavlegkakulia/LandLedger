"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { sendContactMessage } from "@/features/profile/actions";

interface Props {
  ownerId: string;
  ownerName: string;
  hasEmail: boolean;
  onClose: () => void;
}

export default function ContactModal({ ownerId, ownerName, hasEmail, onClose }: Props) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose();
  }

  function handleSend() {
    setError(null);
    startTransition(async () => {
      const res = await sendContactMessage({ ownerId, message });
      if (res?.error) { setError(res.error); return; }
      setSuccess(true);
    });
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div className="bg-surface rounded-2xl border border-border shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-base font-semibold text-text">დაუკავშირდი მფლობელს</h2>
            <p className="text-xs text-text-faint mt-0.5">{ownerName}</p>
          </div>
          <button onClick={onClose} className="text-text-faint hover:text-text transition-colors p-1 rounded-lg hover:bg-background">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="px-6 py-8 text-center">
            <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-semibold text-text">გაიგზავნა!</p>
            <p className="text-sm text-text-faint mt-1">შეტყობინება წარმატებით გაიგზავნა მფლობელის ელ-ფოსტაზე</p>
            <button onClick={onClose} className="mt-4 text-sm text-primary hover:underline">დახურვა</button>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4">
            {!hasEmail ? (
              <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-background border border-border">
                <svg className="w-5 h-5 text-text-faint shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-sm text-text-faint">მფლობელმა ელ-ფოსტა არ გაასაჯაროვა</p>
              </div>
            ) : (
              <>
                {/* Info */}
                <div className="flex items-start gap-3 py-3 px-4 rounded-xl bg-primary-light border border-primary/10">
                  <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-primary">
                    შეტყობინება გაიგზავნება მფლობელის ელ-ფოსტაზე. შენი საკონტაქტო ინფო ავტომატურად დაერთვება.
                  </p>
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-medium text-text-muted mb-1.5 block">
                    შეტყობინება <span className="text-text-faint font-normal">(არასავალდებულო)</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder="დაწერე შეტყობინება..."
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none transition"
                  />
                  <p className="text-xs text-text-faint mt-1">
                    ავტომატურად ეგზავნება: <span className="italic">&quot;[შენი სახელი] დაგიკავშირდა ნაკვეთის საკითხზე.&quot;</span>
                  </p>
                </div>

                {error && (
                  <div className="bg-danger-light border border-danger/20 rounded-xl px-4 py-2.5">
                    <p className="text-sm text-danger">{error}</p>
                  </div>
                )}
              </>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-text-muted hover:bg-background transition-colors"
              >
                გაუქმება
              </button>
              {hasEmail && (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      იგზავნება...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      გაგზავნა
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
