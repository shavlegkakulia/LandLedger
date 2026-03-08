import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/features/auth/actions";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-9.894A11.958 11.958 0 0112 3c3.866 0 7.32 1.834 9.547 4.703L16 12H8l1 8z" />
            </svg>
            LandLedger
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-muted hidden sm:block">{user?.email}</span>
            <Link href="/profile" className="text-sm text-text-muted hover:text-primary transition-colors">პროფილი</Link>
            <form action={signOut}>
              <button type="submit" className="text-sm text-text-muted hover:text-danger transition-colors">გამოსვლა</button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
