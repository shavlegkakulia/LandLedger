import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LandLedger — იპოვე მიწის ნაკვეთის მფლობელი",
  description:
    "მოძებნე მიწის ნაკვეთი საკადასტრო კოდით და პირდაპირ დაუკავშირდი მფლობელს. LandLedger — საქართველოს საკადასტრო პლატფორმა.",
};

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-9.894A11.958 11.958 0 0112 3c3.866 0 7.32 1.834 9.547 4.703L16 12H8l1 8z" />
            </svg>
            LandLedger
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/contact" className="text-sm text-text-muted hover:text-primary transition-colors hidden sm:block">
              ჩვენს შესახებ
            </Link>
            {user ? (
              <Link href="/dashboard" className="text-sm bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary-dark transition-colors">
                ნაკვეთები
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm text-text-muted hover:text-primary transition-colors">შესვლა</Link>
                <Link href="/register" className="text-sm bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary-dark transition-colors">
                  რეგისტრაცია
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-light text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-9.894A11.958 11.958 0 0112 3c3.866 0 7.32 1.834 9.547 4.703L16 12H8l1 8z" />
            </svg>
            საქართველოს საკადასტრო პლატფორმა
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-text leading-tight mb-5">
            იპოვე მიწის ნაკვეთის<br />
            <span className="text-primary">მფლობელი</span> პირდაპირ
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            მოძებნე ნაკვეთი საკადასტრო კოდით, რეგიონით ან მუნიციპალიტეტით — და პირდაპირ დაუკავშირდი მფლობელს.
            მფლობელი არ ყიდის? — შეთავაზება მაინც გაუგზავნე.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={user ? "/dashboard" : "/register"}
              className="inline-flex items-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors shadow-sm"
            >
              {user ? "ნაკვეთების სია" : "უფასოდ დაიწყე"}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-border bg-white text-text-muted font-medium px-6 py-3 rounded-xl hover:border-primary-muted hover:text-primary transition-colors"
            >
              გაიგე მეტი
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <h2 className="text-center text-2xl font-bold text-text mb-10">როგორ მუშაობს</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <StepCard
              step="01"
              title="მოძებნე ნაკვეთი"
              description="შეიყვანე საკადასტრო კოდი maps.gov.ge-დან, ან გაფილტრე რეგიონით და მუნიციპალიტეტით."
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            <StepCard
              step="02"
              title="იხილე დეტალები"
              description="ნახე ნაკვეთის ფართობი, მდებარეობა და მფლობელის ინფო — ყველაფერი ერთ გვერდზე."
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            <StepCard
              step="03"
              title="დაუკავშირდი"
              description="გაუგზავნე შეტყობინება მფლობელს ელ-ფოსტით. მფლობელი თავად წყვეტს — პასუხობს თუ არა."
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
            <h2 className="text-2xl font-bold text-white mb-3">მიწის მფლობელი ხარ?</h2>
            <p className="text-primary-light text-sm max-w-xl mx-auto mb-6 leading-relaxed">
              დარეგისტრირდი და გაიგე ვინ გაინტერესებს შენი მიწით — თუნდაც გაყიდვა არ გეგმავდე.
              შეთავაზება შეიძლება ისეთი იყოს, რომ დათანხმდე.
            </p>
            <Link
              href={user ? "/dashboard" : "/register"}
              className="inline-flex items-center gap-2 bg-white text-primary font-medium px-6 py-3 rounded-xl hover:bg-primary-light transition-colors"
            >
              {user ? "ჩემი ნაკვეთები" : "უფასოდ დარეგისტრირდი"}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-text-faint">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-9.894A11.958 11.958 0 0112 3c3.866 0 7.32 1.834 9.547 4.703L16 12H8l1 8z" />
            </svg>
            © {new Date().getFullYear()} LandLedger
          </div>
          <div className="flex items-center gap-5 text-sm text-text-faint">
            <Link href="/contact" className="hover:text-primary transition-colors">ჩვენს შესახებ</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">კონტაქტი</Link>
            <Link href="/login" className="hover:text-primary transition-colors">შესვლა</Link>
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
