import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { CookieBanner } from "@/components/CookieBanner";
import { ToastProvider } from "@/components/ui/Toast";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const siteUrl = rawSiteUrl.startsWith("http") ? rawSiteUrl : "https://landledger.ge";

const localeOgLocale: Record<string, string> = {
  ka: "ka_GE",
  en: "en_US",
  ru: "ru_RU",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isKa = locale === "ka";
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "LandLedger — საქართველოს საკადასტრო პლატფორმა",
      template: "%s | LandLedger",
    },
    description: isKa
      ? "იპოვე მიწის ნაკვეთის მფლობელი საკადასტრო კოდით. LandLedger აკავშირებს მიწის მყიდველებსა და მფლობელებს საქართველოში."
      : "Find land parcel owners by cadastral code. LandLedger connects land buyers and owners in Georgia.",
    authors: [{ name: "LandLedger" }],
    creator: "LandLedger",
    publisher: "LandLedger",
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } },
    openGraph: {
      type: "website",
      locale: localeOgLocale[locale] ?? "ka_GE",
      url: siteUrl,
      siteName: "LandLedger",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "LandLedger" }],
    },
    twitter: { card: "summary_large_image", images: ["/og-image.png"] },
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: { ka: `${siteUrl}/ka`, en: `${siteUrl}/en`, ru: `${siteUrl}/ru` },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "ka" | "en" | "ru")) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale} className={plusJakarta.variable}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            {children}
            <CookieBanner />
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
