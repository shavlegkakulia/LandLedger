"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_LABELS: Record<string, string> = {
  ka: "ქᲐᲠ",
  en: "ENG",
  ru: "РУС",
};

const LOCALE_FLAGS: Record<string, string> = {
  ka: "🇬🇪",
  en: "🇬🇧",
  ru: "🇷🇺",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: string) {
    // pathname-დან ამჟამინდელი locale-ს ამოვიღებთ და ვანაცვლებთ
    const segments = pathname.split("/");
    if (routing.locales.includes(segments[1] as "ka" | "en" | "ru")) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    router.push(segments.join("/") || "/");
  }

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map(loc => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`text-xs px-2 py-1 rounded-lg transition-colors ${
            locale === loc
              ? "bg-primary text-white font-medium"
              : "text-text-faint hover:text-text-muted hover:bg-border"
          }`}
          title={LOCALE_FLAGS[loc]}
        >
          {LOCALE_FLAGS[loc]} {LOCALE_LABELS[loc]}
        </button>
      ))}
    </div>
  );
}
