"use client";

import { useState, useTransition } from "react";
import { reportParcel } from "@/features/parcels/actions";

const REASONS = [
  { value: "spam", label: "სპამი ან განმეორებადი შეტყობინება" },
  { value: "fake", label: "ყალბი ან არასწორი ინფორმაცია" },
  { value: "offensive", label: "შეურაცხმყოფელი შინაარსი" },
  { value: "fraud", label: "თაღლითური განცხადება" },
  { value: "other", label: "სხვა მიზეზი" },
];

export function ReportModal({ parcelId, onClose }: { parcelId: string; onClose: () => void }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!reason) { setError("გთხოვთ, აირჩიოთ მიზეზი"); return; }
    setError(null);
    startTransition(async () => {
      const res = await reportParcel(parcelId, reason, details);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(true);
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="font-semibold text-text">საჩივრის შეტანა</h2>
          </div>
          <button onClick={onClose} className="text-text-faint hover:text-text transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-medium text-text mb-1">საჩივარი მიღებულია</p>
            <p className="text-sm text-text-muted mb-4">მადლობა! განვიხილავთ უახლოეს დროში.</p>
            <button onClick={onClose} className="text-sm bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary-hover transition-colors">
              დახურვა
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              <label className="block text-sm font-medium text-text mb-2">
                საჩივრის მიზეზი <span className="text-danger">*</span>
              </label>
              {REASONS.map(r => (
                <label key={r.value} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="reason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={() => setReason(r.value)}
                    className="accent-primary"
                  />
                  <span className="text-sm text-text-muted group-hover:text-text transition-colors">{r.label}</span>
                </label>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-text mb-1.5">
                დამატებითი ინფო <span className="text-text-faint">(სურვილისამებრ)</span>
              </label>
              <textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="მოკლედ აღწერეთ პრობლემა..."
                className="w-full px-3 py-2.5 border border-border rounded-xl text-sm text-text placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              />
            </div>

            {error && (
              <div className="mb-3 text-xs text-danger bg-danger-light border border-danger-border rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm text-text-muted hover:bg-background transition-colors"
              >
                გაუქმება
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isPending ? "იგზავნება..." : "საჩივრის გაგზავნა"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
