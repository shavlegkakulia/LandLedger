"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { deleteParcel } from "@/features/parcels/actions";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { Parcel } from "@/features/parcels/types";

export function ParcelCard({ parcel, currentUserId }: { parcel: Parcel; currentUserId: string }) {
  const t = useTranslations("parcelCard");
  const locale = useLocale();
  const isOwner = parcel.user_id === currentUserId;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteParcel(parcel.id);
      setShowDeleteModal(false);
    });
  }

  return (
    <>
      <div className="group relative bg-surface rounded-2xl border border-border hover:border-primary-muted hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col">
        <Link href={`/${locale}/parcels/${parcel.id}`} className="absolute inset-0 z-0" aria-label={parcel.address} />
        <div className="px-5 pt-5 pb-4 flex-1 relative z-10 pointer-events-none">
          <div className="flex items-start justify-between gap-2 mb-3">
            <span className="inline-flex items-center bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-lg font-mono tracking-tight">
              {parcel.cadastral_code}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {parcel.area_sqm && (
                <span className="inline-flex items-center gap-1 text-xs text-text-muted bg-background border border-border px-2 py-0.5 rounded-md">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                  {parcel.area_sqm} მ²
                </span>
              )}
              {isOwner && (
                <span className="text-xs bg-badge-mine text-badge-mine-text font-medium px-2 py-0.5 rounded-md">
                  {t("mine")}
                </span>
              )}
            </div>
          </div>
          <p className="font-semibold text-text text-sm leading-snug line-clamp-2">{parcel.address}</p>
          {(parcel.region || parcel.municipality) && (
            <div className="flex items-center gap-1 mt-1.5">
              <svg className="w-3 h-3 text-text-faint shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-xs text-text-muted">{[parcel.region, parcel.municipality].filter(Boolean).join(", ")}</p>
            </div>
          )}
          {parcel.notes && <p className="text-xs text-text-faint mt-3 line-clamp-2 leading-relaxed">{parcel.notes}</p>}
        </div>

        {isOwner && (
          <div className="relative z-10 flex items-center border-t border-border bg-background/60 divide-x divide-border">
            <Link href={`/${locale}/parcels/${parcel.id}/edit`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-text-muted hover:text-primary hover:bg-primary-light transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {t("edit")}
            </Link>
            <button onClick={() => setShowDeleteModal(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-text-muted hover:text-danger hover:bg-danger-light transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {t("delete")}
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        open={showDeleteModal}
        title={t("deleteTitle")}
        description={t("deleteDesc", { code: parcel.cadastral_code, address: parcel.address })}
        confirmLabel={t("deleteConfirm")}
        cancelLabel={t("deleteCancel")}
        variant="danger"
        loading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}
