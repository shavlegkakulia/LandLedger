import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { HeroSearch } from "@/features/landing/HeroSearch";

export const metadata: Metadata = {
  title: "LandLedger — მოძებნე მიწის ნაკვეთი და დაუკავშირდი მფლობელს",
  description:
    "მოძებნე მიწის ნაკვეთი საკადასტრო კოდით, ქალაქით ან რეგიონით და პირდაპირ დაუტოვე შეტყობინება მფლობელს. LandLedger — საქართველოს საკადასტრო პლატფორმა.",
};

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-9.894A11.958 11.958 0 0112 3c3.866 0 7.32 1.834 9.547 4.703L16 12H8l1 8z" />
            </svg>
            <span className="text-lg font-bold tracking-tight">LandLedger</span>
          </div>
          <nav className="flex items-center gap-4">
            <a href="#how-it-works" className="text-sm text-text-muted hover:text-primary transition-colors hidden sm:block">
              როგორ მუშაობს
            </a>
            <Link href="/contact" className="text-sm text-text-muted hover:text-primary transition-colors hidden sm:block">
              ჩვენს შესახებ
            </Link>
            {user ? (
              <Link href="/dashboard" className="text-sm bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary-hover transition-colors">
                ნაკვეთები
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm text-text-muted hover:text-primary transition-colors">შესვლა</Link>
                <Link href="/register" className="text-sm bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary-hover transition-colors">
                  რეგისტრაცია
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-light text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-9.894A11.958 11.958 0 0112 3c3.866 0 7.32 1.834 9.547 4.703L16 12H8l1 8z" />
            </svg>
            საქართველოს საკადასტრო პლატფორმა
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-text leading-tight mb-5">
            მოძებნე ნებისმიერი მიწის ნაკვეთი<br />
            და <span className="text-primary">დაუტოვე მესიჯი</span> მის მფლობელს
          </h1>

          <p className="text-text-muted text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            მოძებნე ნაკვეთი საკადასტრო კოდით, ქალაქით ან რეგიონით.
            დატოვე შეტყობინება მფლობელისთვის — შესაძლოა ის მზად იყოს კარგი შეთავაზების მოსასმენად.
          </p>

          {/* Search Input */}
          <HeroSearch />

          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <Link
              href={user ? "/dashboard" : "/register"}
              className="inline-flex items-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-xl hover:bg-primary-hover transition-colors shadow-sm"
            >
              მოძებნე ნაკვეთი
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 border border-border bg-white text-text-muted font-medium px-6 py-3 rounded-xl hover:border-primary-muted hover:text-primary transition-colors"
            >
              ნახე როგორ მუშაობს
            </a>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-text-faint">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              მფლობელების პირადი ინფო დაცულია
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              კომუნიკაცია იწყება მხოლოდ შეტყობინებით
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              სრულიად უფასო
            </span>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="max-w-6xl mx-auto px-4 pb-20">
          <h2 className="text-center text-2xl font-bold text-text mb-3">როგორ მუშაობს</h2>
          <p className="text-center text-text-muted text-sm mb-10 max-w-lg mx-auto">
            სამი მარტივი ნაბიჯი — ნაკვეთის პოვნიდან მფლობელთან კონტაქტამდე
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <StepCard
              step="01"
              title="მოძებნე ნაკვეთი"
              description="მოძებნე მიწის ნაკვეთი ქალაქის, რეგიონის ან საკადასტრო კოდის მიხედვით."
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            <StepCard
              step="02"
              title="იხილე ინფორმაცია"
              description="ნახე ნაკვეთის მდებარეობა, ზომა და სხვა საჯარო ინფორმაცია."
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            <StepCard
              step="03"
              title="დაუტოვე შეტყობინება"
              description="გაუგზავნე მესიჯი მფლობელს და დატოვე შენი საკონტაქტო ინფო — სურვილის შემთხვევაში ის დაგიკავშირდება."
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
          </div>
        </section>

        {/* CTA for owners */}
        <section className="bg-primary">
          <div className="max-w-6xl mx-auto px-4 py-16 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">მიწა ოფიციალურად არ იყიდება?</h2>
            <p className="text-green-100 text-sm max-w-xl mx-auto mb-2 leading-relaxed">
              ბევრი მიწის ნაკვეთი ბაზარზე არ არის გამოტანილი,
              მაგრამ მფლობელები ხშირად მზად არიან განიხილონ კარგი შეთავაზება.
            </p>
            <p className="text-green-100 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
              ჩვენი პლატფორმა სწორედ ამისთვის არსებობს —
              რომ თქვენ შეძლოთ მათთან პირდაპირ დაკავშირება.
            </p>
            <Link
              href={user ? "/dashboard" : "/register"}
              className="inline-flex items-center gap-2 bg-white text-primary font-medium px-6 py-3 rounded-xl hover:bg-primary-light transition-colors"
            >
              მოძებნე ნაკვეთი
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-text-faint">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-9.894A11.958 11.958 0 0112 3c3.866 0 7.32 1.834 9.547 4.703L16 12H8l1 8z" />
              </svg>
              © {new Date().getFullYear()} LandLedger
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-text-faint">
              <a href="#how-it-works" className="hover:text-primary transition-colors">როგორ მუშაობს</a>
              <Link href="/contact" className="hover:text-primary transition-colors">კონტაქტი</Link>
              <Link href="/login" className="hover:text-primary transition-colors">შესვლა</Link>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-text-faint border-t border-border pt-4">
            <Link href="/terms" className="hover:text-primary transition-colors">გამოყენების პირობები</Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-primary transition-colors">კონფიდენციალურობა</Link>
            <span>·</span>
            <Link href="/cookies" className="hover:text-primary transition-colors">Cookie პოლიტიკა</Link>
            <span>·</span>
            <Link href="/acceptable-use" className="hover:text-primary transition-colors">გამოყენების წესები</Link>
            <span>·</span>
            <Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StepCard({ step, title, description, icon }: {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
          {icon}
        </div>
        <span className="text-3xl font-black text-border leading-none">{step}</span>
      </div>
      <h3 className="font-semibold text-text mt-4 mb-2">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed">{description}</p>
    </div>
  );
}
