import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { HeroSearch } from "@/features/landing/HeroSearch";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  return {
    title: "LandLedger — " + t("ctaMain"),
    description: t("subtitle"),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return <HomePageClient locale={locale} isLoggedIn={!!user} />;
}

function HomePageClient({ locale, isLoggedIn }: { locale: string; isLoggedIn: boolean }) {
  const t = useTranslations();
  const nav = useTranslations("nav");
  const hero = useTranslations("hero");
  const how = useTranslations("howItWorks");
  const cta = useTranslations("cta");
  const footer = useTranslations("footer");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <header className="bg-white/70 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-9.894A11.958 11.958 0 0112 3c3.866 0 7.32 1.834 9.547 4.703L16 12H8l1 8z" />
            </svg>
            <span className="text-lg font-bold tracking-tight">LandLedger</span>
          </div>
          <nav className="flex items-center gap-3">
            <a href="#how-it-works" className="text-sm text-text-muted hover:text-primary transition-colors hidden sm:block">
              {nav("howItWorks")}
            </a>
            <Link href={`/${locale}/contact`} className="text-sm text-text-muted hover:text-primary transition-colors hidden sm:block">
              {nav("about")}
            </Link>
            {isLoggedIn ? (
              <Link href={`/${locale}/dashboard`} className="text-sm bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary-hover transition-colors">
                {nav("parcels")}
              </Link>
            ) : (
              <>
                <Link href={`/${locale}/login`} className="text-sm text-text-muted hover:text-primary transition-colors">{nav("login")}</Link>
                <Link href={`/${locale}/register`} className="text-sm bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary-hover transition-colors">
                  {nav("register")}
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-light text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-9.894A11.958 11.958 0 0112 3c3.866 0 7.32 1.834 9.547 4.703L16 12H8l1 8z" />
            </svg>
            {hero("badge")}
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-text leading-tight mb-5">
            {hero("title")}<br />
            და <span className="text-primary">{hero("titleHighlight")}</span> {hero("titleSuffix")}
          </h1>

          <p className="text-text-muted text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            {hero("subtitle")}
          </p>

          <HeroSearch locale={locale} placeholder={hero("searchPlaceholder")} buttonText={hero("searchButton")} />

          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <Link href={isLoggedIn ? `/${locale}/dashboard` : `/${locale}/register`}
              className="inline-flex items-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-xl hover:bg-primary-hover transition-colors shadow-sm">
              {hero("ctaMain")}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a href="#how-it-works"
              className="inline-flex items-center gap-2 border border-border bg-white text-text-muted font-medium px-6 py-3 rounded-xl hover:border-primary-muted hover:text-primary transition-colors">
              {hero("ctaSecondary")}
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-text-faint">
            {[
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", key: "trustPrivacy" },
              { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", key: "trustMessage" },
              { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", key: "trustFree" },
            ].map(({ icon, key }) => (
              <span key={key} className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
                {hero(key as Parameters<typeof hero>[0])}
              </span>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="max-w-6xl mx-auto px-4 pb-20">
          <h2 className="text-center text-2xl font-bold text-text mb-3">{how("title")}</h2>
          <p className="text-center text-text-muted text-sm mb-10 max-w-lg mx-auto">{how("subtitle")}</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {([
              { step: "01", titleKey: "step1Title", descKey: "step1Desc", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
              { step: "02", titleKey: "step2Title", descKey: "step2Desc", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              { step: "03", titleKey: "step3Title", descKey: "step3Desc", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
            ] as const).map(({ step, titleKey, descKey, icon }) => (
              <div key={step} className="bg-white rounded-2xl border border-border shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                    </svg>
                  </div>
                  <span className="text-3xl font-black text-border leading-none">{step}</span>
                </div>
                <h3 className="font-semibold text-text mt-4 mb-2">{how(titleKey)}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{how(descKey)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-primary">
          <div className="max-w-6xl mx-auto px-4 py-16 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">{cta("title")}</h2>
            <p className="text-green-100 text-sm max-w-xl mx-auto mb-2 leading-relaxed">{cta("text1")}</p>
            <p className="text-green-100 text-sm max-w-xl mx-auto mb-8 leading-relaxed">{cta("text2")}</p>
            <Link href={isLoggedIn ? `/${locale}/dashboard` : `/${locale}/register`}
              className="inline-flex items-center gap-2 bg-white text-primary font-medium px-6 py-3 rounded-xl hover:bg-primary-light transition-colors">
              {cta("button")}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

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
              <a href="#how-it-works" className="hover:text-primary transition-colors">{nav("howItWorks")}</a>
              <Link href={`/${locale}/contact`} className="hover:text-primary transition-colors">{nav("contact")}</Link>
              <Link href={`/${locale}/login`} className="hover:text-primary transition-colors">{nav("login")}</Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border pt-4">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-text-faint">
              <Link href={`/${locale}/terms`} className="hover:text-primary transition-colors">{footer("terms")}</Link>
              <span>·</span>
              <Link href={`/${locale}/privacy`} className="hover:text-primary transition-colors">{footer("privacy")}</Link>
              <span>·</span>
              <Link href={`/${locale}/cookies`} className="hover:text-primary transition-colors">{footer("cookies")}</Link>
              <span>·</span>
              <Link href={`/${locale}/acceptable-use`} className="hover:text-primary transition-colors">{footer("acceptableUse")}</Link>
              <span>·</span>
              <Link href={`/${locale}/disclaimer`} className="hover:text-primary transition-colors">{footer("disclaimer")}</Link>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </footer>
    </div>
  );
}
