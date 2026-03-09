import { getParcels } from "@/features/parcels/actions";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ParcelFilters from "@/features/parcels/components/ParcelFilters";
import { getMyProfile } from "@/features/profile/actions";
import { redirect } from "next/navigation";
import { ParcelCard } from "@/features/parcels/components/ParcelCard";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ mine?: string; region?: string; municipality?: string; cadastral?: string; page?: string }>;
}

export default async function DashboardPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const t = await getTranslations("dashboard");

  const profile = await getMyProfile();
  if (!profile?.profile_completed) redirect(`/${locale}/onboarding`);

  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const { data: parcels, total, totalPages, pageSize } = await getParcels({
    mine: sp.mine === "1",
    region: sp.region,
    municipality: sp.municipality,
    cadastral: sp.cadastral,
    page,
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">{t("title")}</h1>
          <p className="text-text-muted text-sm mt-0.5">{t("title")}: {total}</p>
        </div>
        <Link href={`/${locale}/parcels/new`} className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t("addParcel")}
        </Link>
      </div>

      <ParcelFilters currentUserId={user?.id ?? ""} />

      {parcels.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-dashed border-border">
          <svg className="w-12 h-12 text-text-faint mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-9.894A11.958 11.958 0 0112 3c3.866 0 7.32 1.834 9.547 4.703L16 12H8l1 8z" />
          </svg>
          <p className="text-text-muted font-medium">{t("noResults")}</p>
          <p className="text-text-faint text-sm mt-1">{t("noResultsDesc")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {parcels.map((parcel) => (
            <ParcelCard key={parcel.id} parcel={parcel} currentUserId={user?.id ?? ""} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <PaginationBar page={page} totalPages={totalPages} total={total} pageSize={pageSize} searchParams={sp} locale={locale} />
      )}
    </div>
  );
}

function PaginationBar({ page, totalPages, total, pageSize, searchParams, locale }: {
  page: number; totalPages: number; total: number; pageSize: number;
  searchParams: Record<string, string | undefined>; locale: string;
}) {
  const buildUrl = (p: number) => {
    const params = new URLSearchParams();
    if (searchParams.mine) params.set("mine", searchParams.mine);
    if (searchParams.region) params.set("region", searchParams.region);
    if (searchParams.municipality) params.set("municipality", searchParams.municipality);
    if (searchParams.cadastral) params.set("cadastral", searchParams.cadastral);
    params.set("page", String(p));
    return `/${locale}/dashboard?${params.toString()}`;
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
        <Link href={buildUrl(page - 1)} aria-disabled={page === 1}
          className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${page === 1 ? "border-border text-text-faint pointer-events-none" : "border-border text-text-muted hover:border-primary-muted hover:text-primary"}`}>
          ←
        </Link>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-text-faint text-sm">…</span>
          ) : (
            <Link key={p} href={buildUrl(p)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${p === page ? "bg-primary text-white border-primary" : "border-border text-text-muted hover:border-primary-muted hover:text-primary"}`}>
              {p}
            </Link>
          )
        )}
        <Link href={buildUrl(page + 1)} aria-disabled={page === totalPages}
          className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${page === totalPages ? "border-border text-text-faint pointer-events-none" : "border-border text-text-muted hover:border-primary-muted hover:text-primary"}`}>
          →
        </Link>
      </div>
    </div>
  );
}
