import { getParcel, recordParcelView, getUniqueViewCount } from "@/features/parcels/actions";
import { getPublicProfile } from "@/features/profile/actions";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { PublicProfile } from "@/features/profile/types";

export default async function ParcelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let parcel;
  try { parcel = await getParcel(id); }
  catch { notFound(); }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === parcel.user_id;
  const owner = await getPublicProfile(parcel.user_id);

  // view ჩაწერა async — არ ვაყოვნებთ page render-ს
  void recordParcelView(parcel.id, parcel.user_id);

  // view count მხოლოდ მფლობელს ვუჩვენებთ
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

      {owner && <OwnerCard owner={owner} isOwner={isOwner} viewCount={viewCount} />}
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

function OwnerCard({ owner, isOwner, viewCount }: { owner: PublicProfile; isOwner: boolean; viewCount: number | null }) {
  const fields = [
    { label: "სქესი", value: owner.gender === "male" ? "მამრობითი" : owner.gender === "female" ? "მდედრობითი" : owner.gender === "other" ? "სხვა" : null, show: owner.show_gender },
    { label: "დაბადების თარიღი", value: owner.birth_date ? new Date(owner.birth_date).toLocaleDateString("ka-GE") : null, show: owner.show_birth_date },
    { label: "მობილური", value: owner.phone, show: owner.show_phone },
    { label: "მისამართი", value: owner.address, show: owner.show_address },
    { label: "ელ-ფოსტა", value: owner.email, show: owner.show_email },
  ].filter((f) => (isOwner ? true : f.show) && f.value);

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-background flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-muted">მფლობელი</h2>
        {isOwner && <Link href="/profile" className="text-xs text-primary hover:underline">პროფილის რედაქტირება</Link>}
      </div>
      <div className="px-5 py-4">
        <p className="font-semibold text-text">{owner.first_name} {owner.last_name}</p>
        {fields.length > 0 ? (
          <dl className="mt-3 space-y-2">
            {fields.map((f) => (
              <div key={f.label} className="flex gap-4">
                <dt className="text-sm text-text-muted w-36 shrink-0">{f.label}</dt>
                <dd className="text-sm text-text">{f.value}</dd>
              </div>
            ))}
          </dl>
        ) : !isOwner && (
          <p className="text-sm text-text-faint mt-2">მფლობელმა დამატებითი ინფო არ გაასაჯაროვა</p>
        )}
      </div>
    </div>
  );
}
