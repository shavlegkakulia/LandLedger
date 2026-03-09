import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/CookieBanner";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://landledger.ge";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LandLedger — საქართველოს საკადასტრო პლატფორმა",
    template: "%s | LandLedger",
  },
  description:
    "იპოვე მიწის ნაკვეთის მფლობელი საკადასტრო კოდით. LandLedger აკავშირებს მიწის მყიდველებსა და მფლობელებს საქართველოში.",
  keywords: [
    "საკადასტრო კოდი",
    "მიწის ნაკვეთი",
    "მფლობელი",
    "cadastral",
    "Georgia land",
    "LandLedger",
    "უძრავი ქონება",
    "მიწა იყიდება",
  ],
  authors: [{ name: "LandLedger" }],
  creator: "LandLedger",
  publisher: "LandLedger",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "ka_GE",
    url: siteUrl,
    siteName: "LandLedger",
    title: "LandLedger — საქართველოს საკადასტრო პლატფორმა",
    description:
      "იპოვე მიწის ნაკვეთის მფლობელი საკადასტრო კოდით. LandLedger აკავშირებს მიწის მყიდველებსა და მფლობელებს საქართველოში.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "LandLedger" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LandLedger — საქართველოს საკადასტრო პლატფორმა",
    description: "იპოვე მიწის ნაკვეთის მფლობელი საკადასტრო კოდით.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka" className={plusJakarta.variable}>
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
