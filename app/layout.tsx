import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LandLedger",
  description: "მიწის ნაკვეთების საკადასტრო მონაცემების მართვის სისტემა",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka">
      <body>{children}</body>
    </html>
  );
}
