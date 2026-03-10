"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import type { PublicProfile } from "@/features/profile/types";
import ContactModal from "@/features/parcels/components/ContactModal";

interface Props {
  owner: PublicProfile;
  isOwner: boolean;
}

const GENDER_LABELS: Record<string, string> = {
  male: "მამრობითი",
  female: "მდედრობითი",
  other: "სხვა",
};

export default function OwnerCard({ owner, isOwner }: Props) {
  const t = useTranslations("ownerCard");
  const locale = useLocale();
  const [showContact, setShowContact] = useState(false);

  const ownerName = owner.show_name
    ? `${owner.first_name ?? ""} ${owner.last_name ?? ""}`.trim() || t("anonymous")
    : t("anonymous");
  const initials = owner.show_name && owner.first_name
    ? `${owner.first_name[0]}${owner.last_name?.[0] ?? ""}`.toUpperCase()
    : "?";
  const avatarUrl = owner.show_avatar ? owner.avatar_url : null;

  // public info items — only show_* = true ones
  const publicInfo: { icon: React.ReactNode; label: string; value: string }[] = [];

  if (owner.show_address && owner.address) {
    publicInfo.push({
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: t("address"),
      value: owner.address,
    });
  }

  if (owner.show_gender && owner.gender) {
    publicInfo.push({
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      label: t("gender"),
      value: GENDER_LABELS[owner.gender] ?? owner.gender,
    });
  }

  if (owner.show_birth_date && owner.birth_date) {
    publicInfo.push({
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      label: t("birthDate"),
      value: owner.birth_date.slice(0, 10).split("-").reverse().join("."),
    });
  }

  const hasPublicInfo = publicInfo.length > 0;

  return (
    <>
      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        {/* header */}
        <div className="px-5 py-4 border-b border-border bg-background flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-muted">{t("owner")}</h2>
          {isOwner && (
            <Link href={`/${locale}/profile`} className="text-xs text-primary hover:underline">
              {t("editProfile")}
            </Link>
          )}
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* avatar + name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white text-sm font-semibold flex items-center justify-center shrink-0 overflow-hidden">
              {avatarUrl
                ? <img src={avatarUrl} alt={ownerName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                : initials}
            </div>
            <div>
              <p className="font-semibold text-text">{ownerName}</p>
              {isOwner && <p className="text-xs text-text-faint">{t("myParcel")}</p>}
            </div>
          </div>

          {/* public info */}
          {!isOwner && hasPublicInfo && (
            <div className="space-y-1.5 border-t border-border pt-3">
              {publicInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-2 text-sm">
                  <span className="text-text-faint mt-0.5 shrink-0">{item.icon}</span>
                  <span className="text-text-muted">{item.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* no public info notice */}
          {!isOwner && !hasPublicInfo && (
            <div className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-background border border-border">
              <svg className="w-4 h-4 text-text-faint shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-sm text-text-faint">{t("noContact")}</p>
            </div>
          )}

          {/* contact button — always visible for non-owners */}
          {!isOwner && (
            <button
              type="button"
              onClick={() => setShowContact(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              {t("contact")}
            </button>
          )}
        </div>
      </div>

      {showContact && (
        <ContactModal ownerId={owner.id} ownerName={ownerName} onClose={() => setShowContact(false)} />
      )}
    </>
  );
}
