import { getParcel, recordParcelView, getUniqueViewCount } from "@/features/parcels/actions";
import { getPublicProfile } from "@/features/profile/actions";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { PublicProfile } from "@/features/profile/types";
import OwnerCard from "@/features/parcels/components/OwnerCard";

export default async function ParcelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let parcel;
  try { parcel = await getParcel(id); }
  catch { notFound(); }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === parcel.user_id;
  const owner = await getPublicProfile(parcel.user_id);

  void recordParcelView(parcel.id, parcel.user_id);

  const viewCount = isOwner ? await getUniqueViewCount(parcel.id) : null;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-text-faint hover:text-text-muted transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-text">ნაკვეთის დეტალები</h1>
            {isOwner && <span className="text-xs bg-badge-mine text-badge-mine-text px-2 py-0.5 rounded-full">ჩემი</span>}
          </div>
          <p className="text-text-muted text-sm font-mono">{parcel.cadastral_code}</p>
        </div>
        {isOwner && (
          <Link href={`/parcels/${parcel.id}/edit`} className="text-sm text-text-muted hover:text-primary border border-border hover:border-primary-muted px-3 py-1.5 rounded-lg transition-colors">
            რედაქტირება
          </Link>
        )}
      </div>

      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-background">
          <h2 className="text-sm font-semibold text-text-muted">საკადასტრო მონაცემები</h2>
        </div>
        <dl className="divide-y divide-border">
          <Row label="საკადასტრო კოდი" value={parcel.cadastral_code} mono />
          <Row label="მისამართი" value={parcel.address} />
          {parcel.region && <Row label="რეგიონი" value={parcel.region} />}
          {parcel.municipality && <Row label="მუნიციპალიტეტი" value={parcel.municipality} />}
          {parcel.area_sqm && <Row label="ფართობი" value={`${parcel.area_sqm} მ²`} />}
          {parcel.notes && <Row label="შენიშვნა" value={parcel.notes} />}
          <Row label="დამატების თარიღი" value={new Date(parcel.created_at).toLocaleDateString("ka-GE", { year: "numeric", month: "long", day: "numeric" })} />
        </dl>
        {isOwner && viewCount !== null && (
          <div className="px-5 py-3 border-t border-border bg-primary-light flex items-center gap-2">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-sm text-primary font-medium">
              {viewCount} უნიკალური {viewCount === 1 ? "ნახვა" : "ნახვა"}
            </span>
          </div>
        )}
      </div>

      {owner && <OwnerCard owner={owner} isOwner={isOwner} />}
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="px-5 py-3 flex gap-4">
      <dt className="text-sm text-text-muted w-36 shrink-0">{label}</dt>
      <dd className={`text-sm text-text font-medium ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}
