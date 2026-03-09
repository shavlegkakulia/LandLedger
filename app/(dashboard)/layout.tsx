import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import HeaderNav from "@/features/dashboard/components/HeaderNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
    <div className="min-h-screen bg-background">
      <header className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-9.894A11.958 11.958 0 0112 3c3.866 0 7.32 1.834 9.547 4.703L16 12H8l1 8z" />
            </svg>
            LandLedger
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="text-sm text-text-faint hover:text-text-muted transition-colors hidden sm:block">კონტაქტი</Link>
            <HeaderNav email={user?.email} displayName={displayName} avatarUrl={avatarUrl} />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
