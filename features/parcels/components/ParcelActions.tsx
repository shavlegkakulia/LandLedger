"use client";

import { useState } from "react";
import { ReportModal } from "./ReportModal";

export default function ParcelActions({ parcelId }: { parcelId: string }) {
  const [showReport, setShowReport] = useState(false);

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => setShowReport(true)}
          className="inline-flex items-center gap-1.5 text-xs text-text-faint hover:text-danger transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          საჩივრის შეტანა
        </button>
      </div>

      {showReport && (
        <ReportModal parcelId={parcelId} onClose={() => setShowReport(false)} />
      )}
    </>
  );
}
