import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HeaderNav from "@/features/dashboard/components/HeaderNav";

export const metadata: Metadata = {
  title: "კონტაქტი",
  description: "დაგვიკავშირდით LandLedger-ის გუნდს. კითხვები, წინადადებები ან თანამშრომლობა.",
  openGraph: {
    title: "კონტაქტი | LandLedger",
    description: "დაგვიკავშირდით LandLedger-ის გუნდს.",
    url: "https://landledger.ge/contact",
  },
  alternates: { canonical: "https://landledger.ge/contact" },
};


export default async function ContactPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = user ? await supabase
    .from("profiles")
    .select("first_name, last_name, avatar_url")
    .eq("id", user.id)
    .single() : { data: null };

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name ?? ""}`.trim()
    : (user?.user_metadata?.full_name as string | undefined)
      ?? (user?.user_metadata?.name as string | undefined)
      ?? user?.email
      ?? "";

  const avatarUrl = profile?.avatar_url
    ?? (user?.user_metadata?.avatar_url as string | undefined)
    ?? (user?.user_metadata?.picture as string | undefined)
    ?? null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 font-semibold text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-9.894A11.958 11.958 0 0112 3c3.866 0 7.32 1.834 9.547 4.703L16 12H8l1 8z" />
            </svg>
            LandLedger
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <HeaderNav email={user.email} displayName={displayName} avatarUrl={avatarUrl} />
            ) : (
              <>
                <Link href="/login" className="text-sm text-text-muted hover:text-primary transition-colors">შესვლა</Link>
                <Link href="/register" className="text-sm bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary-dark transition-colors">რეგისტრაცია</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-5">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-text mb-3">დაგვიკავშირდით</h1>
          <p className="text-text-muted max-w-xl mx-auto">
            კითხვები, წინადადებები ან თანამშრომლობა — მზად ვართ მოვისმინოთ.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* About */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
            <h2 className="text-lg font-bold text-text mb-5">ჩვენს შესახებ</h2>
            <div className="space-y-4 text-sm text-text-muted leading-relaxed">
              <p>
                ჩვენი პლატფორმა შექმნილია იმისთვის, რომ მიწის ნაკვეთების პოტენციური მყიდველები და მფლობელები ერთმანეთთან მარტივად და უსაფრთხოდ დააკავშიროს.
              </p>
              <p>
                ხშირად მიწის ნაკვეთი ოფიციალურად არ არის გაყიდვაში, თუმცა ბევრ მფლობელს შეუძლია განიხილოს შეთავაზება, თუ პირობები მისთვის საინტერესოა. სწორედ ამ იდეაზეა აგებული ჩვენი სერვისი — ჩვენ ვაძლევთ ადამიანებს შესაძლებლობას იპოვონ კონკრეტული მიწის ნაკვეთი და პირდაპირ დაუკავშირდნენ მის მფლობელს ინტერესის გამოსახატად.
              </p>
              <p>
                ჩვენს საიტზე შეგიძლიათ მოძებნოთ მიწის ნაკვეთები ქალაქის, რეგიონის ან საკადასტრო კოდის მიხედვით. როდესაც იპოვით თქვენთვის საინტერესო ნაკვეთს, შეგიძლიათ მარტივად გაუგზავნოთ შეტყობინება მის მფლობელს.
              </p>
              <p>
                პლატფორმა შექმნილია ისე, რომ მიწის მფლობელების პირადი მონაცემები დაცული იყოს. მყიდველები ვერ ხედავენ მფლობელების პირად დეტალებს — კომუნიკაცია იწყება მხოლოდ შეტყობინების გაგზავნით, ხოლო შემდგომი კონტაქტი მთლიანად მფლობელის გადაწყვეტილებაზეა დამოკიდებული.
              </p>
              <p>
                თუ თქვენ ეძებთ მიწას კონკრეტულ ადგილას, ან უბრალოდ გსურთ შეამოწმოთ რა შესაძლებლობები არსებობს — ჩვენი პლატფორმა სწორედ ამისთვის არის შექმნილი.
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-colors"
              >
                უფასოდ დარეგისტრირდი
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <ContactCard
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              label="ელ-ფოსტა"
              value="info@landledger.ge"
              href="mailto:info@landledger.ge"
            />
            <ContactCard
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              }
              label="ტელეფონი"
              value="+995 555 00 00 00"
              href="tel:+995555000000"
            />
            <ContactCard
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.253h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                </svg>
              }
              label="Facebook"
              value="LandLedger Georgia"
              href="https://facebook.com/landledger"
            />
            <ContactCard
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              }
              label="Instagram"
              value="@landledger.ge"
              href="https://instagram.com/landledger.ge"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-text-faint">© {new Date().getFullYear()} LandLedger. ყველა უფლება დაცულია.</p>
        </div>
      </footer>
    </div>
  );
}

function ContactCard({ icon, label, value, href }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="flex items-center gap-4 bg-white rounded-2xl border border-border shadow-sm p-5 hover:border-primary-muted hover:shadow-md transition-all group"
    >
      <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-xs text-text-faint mb-0.5">{label}</p>
        <p className="text-sm font-medium text-text group-hover:text-primary transition-colors">{value}</p>
      </div>
      <svg className="w-4 h-4 text-text-faint ml-auto group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}
