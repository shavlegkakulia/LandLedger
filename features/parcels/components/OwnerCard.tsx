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

export default function OwnerCard({ owner, isOwner }: Props) {
  const t = useTranslations("ownerCard");
  const locale = useLocale();
  const [showContact, setShowContact] = useState(false);
  const ownerName = `${owner.first_name} ${owner.last_name}`.trim();
  const canContact = !isOwner && (owner.show_email || owner.show_phone);

  return (
    <>
      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-background flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-muted">{t("owner")}</h2>
          {isOwner && (
            <Link href={`/${locale}/profile`} className="text-xs text-primary hover:underline">
              {t("editProfile")}
            </Link>
          )}
        </div>

        <div className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white text-sm font-semibold flex items-center justify-center shrink-0">
              {ownerName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-text">{ownerName}</p>
              {isOwner && <p className="text-xs text-text-faint">{t("myParcel")}</p>}
            </div>
          </div>

          {!isOwner && (
            <div className="mt-4">
              {canContact ? (
                <button type="button" onClick={() => setShowContact(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  {t("contact")}
                </button>
              ) : (
                <div className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-background border border-border">
                  <svg className="w-4 h-4 text-text-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-sm text-text-faint">{t("noContact")}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showContact && (
        <ContactModal ownerId={owner.id} ownerName={ownerName} hasEmail={!!owner.show_email && !!owner.email} onClose={() => setShowContact(false)} />
      )}
    </>
  );
}
