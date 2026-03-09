import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import HeaderNav from "@/features/dashboard/components/HeaderNav";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getTranslations } from "next-intl/server";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const t = await getTranslations({ locale, namespace: "footer" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, avatar_url")
    .eq("id", user?.id ?? "")
    .single();

  const avatarUrl = profile?.avatar_url
    ?? (user?.user_metadata?.avatar_url as string | undefined)
    ?? (user?.user_metadata?.picture as string | undefined)
    ?? null;

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name ?? ""}`.trim()
    : (user?.user_metadata?.full_name as string | undefined)
      ?? (user?.user_metadata?.name as string | undefined)
      ?? user?.email
      ?? "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2 text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-9.894A11.958 11.958 0 0112 3c3.866 0 7.32 1.834 9.547 4.703L16 12H8l1 8z" />
            </svg>
            <span className="text-lg font-bold tracking-tight">LandLedger</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/contact`} className="text-sm text-text-faint hover:text-text-muted transition-colors hidden sm:block">
              {nav("contact")}
            </Link>
            <HeaderNav email={user?.email} displayName={displayName} avatarUrl={avatarUrl} locale={locale} />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">{children}</main>
      <footer className="border-t border-border py-5 mt-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-text-faint">
            <Link href={`/${locale}/terms`} className="hover:text-primary transition-colors">{t("terms")}</Link>
            <span>·</span>
            <Link href={`/${locale}/privacy`} className="hover:text-primary transition-colors">{t("privacy")}</Link>
            <span>·</span>
            <Link href={`/${locale}/cookies`} className="hover:text-primary transition-colors">{t("cookies")}</Link>
            <span>·</span>
            <Link href={`/${locale}/disclaimer`} className="hover:text-primary transition-colors">{t("disclaimer")}</Link>
            <span>·</span>
            <Link href={`/${locale}/contact`} className="hover:text-primary transition-colors">{nav("contact")}</Link>
          </div>
          <LanguageSwitcher />
        </div>
      </footer>
    </div>
  );
}
