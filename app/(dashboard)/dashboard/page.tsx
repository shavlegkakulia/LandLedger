import { getParcels } from "@/features/parcels/actions";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { deleteParcel } from "@/features/parcels/actions";
import type { Parcel } from "@/features/parcels/types";
import ParcelFilters from "@/features/parcels/components/ParcelFilters";
import { getMyProfile } from "@/features/profile/actions";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ mine?: string; region?: string; municipality?: string; cadastral?: string; page?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const profile = await getMyProfile();
  if (!profile?.profile_completed) redirect("/onboarding");

  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const { data: parcels, total, totalPages, pageSize } = await getParcels({
    mine: params.mine === "1",
    region: params.region,
    municipality: params.municipality,
    cadastral: params.cadastral,
    page,
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">ნაკვეთები</h1>
          <p className="text-text-muted text-sm mt-0.5">სულ: {total} ნაკვეთი</p>
        </div>
        <Link href="/parcels/new" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          ნაკვეთის დამატება
        </Link>
      </div>

      <ParcelFilters currentUserId={user?.id ?? ""} />

      {parcels.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-dashed border-border">
          <svg className="w-12 h-12 text-text-faint mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-9.894A11.958 11.958 0 0112 3c3.866 0 7.32 1.834 9.547 4.703L16 12H8l1 8z" />
          </svg>
          <p className="text-text-muted font-medium">ნაკვეთი ვერ მოიძებნა</p>
          <p className="text-text-faint text-sm mt-1">სცადე ფილტრის გასუფთავება</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {parcels.map((parcel) => (
            <ParcelCard key={parcel.id} parcel={parcel} currentUserId={user?.id ?? ""} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <PaginationBar page={page} totalPages={totalPages} total={total} pageSize={pageSize} searchParams={params} />
      )}
    </div>
  );
}

function PaginationBar({ page, totalPages, total, pageSize, searchParams }: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  searchParams: Record<string, string | undefined>;
}) {
  const buildUrl = (p: number) => {
    const params = new URLSearchParams();
    if (searchParams.mine) params.set("mine", searchParams.mine);
    if (searchParams.region) params.set("region", searchParams.region);
    if (searchParams.municipality) params.set("municipality", searchParams.municipality);
    if (searchParams.cadastral) params.set("cadastral", searchParams.cadastral);
    params.set("page", String(p));
    return `/dashboard?${params.toString()}`;
  };

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-sm text-text-muted">{from}–{to} / {total}</p>
      <div className="flex items-center gap-1">
        <Link
          href={buildUrl(page - 1)}
          aria-disabled={page === 1}
          className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
            page === 1
              ? "border-border text-text-faint pointer-events-none"
              : "border-border text-text-muted hover:border-primary-muted hover:text-primary"
          }`}
        >
          ←
        </Link>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-text-faint text-sm">…</span>
          ) : (
            <Link
              key={p}
              href={buildUrl(p)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                p === page
                  ? "bg-primary text-white border-primary"
                  : "border-border text-text-muted hover:border-primary-muted hover:text-primary"
              }`}
            >
              {p}
            </Link>
          )
        )}
        <Link
          href={buildUrl(page + 1)}
          aria-disabled={page === totalPages}
          className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
            page === totalPages
              ? "border-border text-text-faint pointer-events-none"
              : "border-border text-text-muted hover:border-primary-muted hover:text-primary"
          }`}
        >
          →
        </Link>
      </div>
    </div>
  );
}

function ParcelCard({ parcel, currentUserId }: { parcel: Parcel; currentUserId: string }) {
  const isOwner = parcel.user_id === currentUserId;
  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 bg-primary-light text-primary text-xs font-medium px-2.5 py-1 rounded-full font-mono">
          {parcel.cadastral_code}
        </span>
        <div className="flex items-center gap-1.5">
          {parcel.area_sqm && <span className="text-xs text-text-muted">{parcel.area_sqm} მ²</span>}
          {isOwner && <span className="text-xs bg-badge-mine text-badge-mine-text px-2 py-0.5 rounded-full">ჩემი</span>}
        </div>
      </div>
      <div>
        <p className="font-medium text-text text-sm leading-snug">{parcel.address}</p>
        {(parcel.region || parcel.municipality) && (
          <p className="text-xs text-text-muted mt-0.5">{[parcel.region, parcel.municipality].filter(Boolean).join(", ")}</p>
        )}
      </div>
      {parcel.notes && (
        <p className="text-xs text-text-muted bg-background rounded-lg px-3 py-2 line-clamp-2">{parcel.notes}</p>
      )}
      <div className="flex items-center gap-2 pt-1 border-t border-border mt-auto">
        <Link href={`/parcels/${parcel.id}`} className="flex-1 text-center text-xs font-medium text-text-muted hover:text-primary py-1.5 rounded-md hover:bg-primary-light transition-colors">
          დეტალები
        </Link>
        {isOwner && (
          <>
            <Link href={`/parcels/${parcel.id}/edit`} className="flex-1 text-center text-xs font-medium text-text-muted hover:text-primary py-1.5 rounded-md hover:bg-primary-light transition-colors">
              რედაქტირება
            </Link>
            <form action={async () => { "use server"; await deleteParcel(parcel.id); }} className="flex-1">
              <button type="submit" className="w-full text-xs font-medium text-text-muted hover:text-danger py-1.5 rounded-md hover:bg-danger-light transition-colors">
                წაშლა
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
