"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";

const DEBOUNCE_MS = 350;

// Georgia regions → municipalities cascade
const REGIONS: Record<string, string[]> = {
  "თბილისი": ["ისანი", "სამგორი", "ნაძალადევი", "დიდუბე", "ჩუღურეთი", "მტაწმინდა", "ვაკე", "საბურთალო", "გლდანი", "კრწანისი"],
  "კახეთი": ["თელავი", "გურჯაანი", "სიღნაღი", "ლაგოდეხი", "ყვარელი", "ახმეტა", "დედოფლისწყარო", "საგარეჯო"],
  "შიდა ქართლი": ["გორი", "ქარელი", "კასპი", "ხაშური"],
  "ქვემო ქართლი": ["რუსთავი", "გარდაბანი", "მარნეული", "ბოლნისი", "დმანისი", "თეთრიწყარო", "წალკა"],
  "მცხეთა-მთიანეთი": ["მცხეთა", "თიანეთი", "ყაზბეგი", "დუშეთი"],
  "სამცხე-ჯავახეთი": ["ახალციხე", "ბორჯომი", "ახალქალაქი", "ნინოწმინდა", "ასპინძა", "ადიგენი"],
  "გურია": ["ოზურგეთი", "ლანჩხუთი", "ჩოხატაური"],
  "სამეგრელო-ზემო სვანეთი": ["ზუგდიდი", "სენაკი", "ჩხოროწყუ", "მარტვილი", "აბაშა", "ხობი", "მესტია"],
  "იმერეთი": ["ქუთაისი", "ბაღდათი", "ვანი", "ზესტაფონი", "თერჯოლა", "სამტრედია", "საჩხერე", "ტყიბული", "ჩიატურა", "ხარაგაული", "ხონი"],
  "რაჭა-ლეჩხუმი": ["ამბროლაური", "ლენტეხი", "ონი", "ცაგერი"],
  "აჭარა": ["ბათუმი", "ქობულეთი", "ხელვაჩაური", "ხულო", "შუახევი", "კედა"],
  "აფხაზეთი": ["სოხუმი"],
};

interface FilterState {
  cadastral: string;
  region: string;
  municipality: string;
}

const XIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function ParcelFilters({ currentUserId }: { currentUserId: string }) {
  const t = useTranslations("parcelFilters");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [values, setValues] = useState<FilterState>({
    cadastral: searchParams.get("cadastral") ?? "",
    region: searchParams.get("region") ?? "",
    municipality: searchParams.get("municipality") ?? "",
  });
  const [regionOpen, setRegionOpen] = useState(false);
  const [munOpen, setMunOpen] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);
  const munRef = useRef<HTMLDivElement>(null);
  const mine = searchParams.get("mine") === "1";
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const availableMunicipalities = values.region ? (REGIONS[values.region] ?? []) : [];

  // close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) setRegionOpen(false);
      if (munRef.current && !munRef.current.contains(e.target as Node)) setMunOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  const pushParams = useCallback(
    (next: FilterState, nextMine: boolean) => {
      const params = new URLSearchParams();
      if (next.cadastral) params.set("cadastral", next.cadastral);
      if (next.region) params.set("region", next.region);
      if (next.municipality) params.set("municipality", next.municipality);
      if (nextMine) params.set("mine", "1");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname]
  );

  function handleChange(key: keyof FilterState, value: string) {
    const next: FilterState = { ...values, [key]: value };
    // cascade: region change resets municipality
    if (key === "region") next.municipality = "";
    setValues(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushParams(next, mine), DEBOUNCE_MS);
  }

  function handleSearch() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    pushParams(values, mine);
  }

  function toggleMine() { pushParams(values, !mine); }

  function clearAll() {
    setValues({ cadastral: "", region: "", municipality: "" });
    router.replace(pathname);
  }

  function clearChip(key: keyof FilterState) { handleChange(key, ""); }

  const activeChips = [
    values.cadastral && { key: "cadastral" as const, label: t("codeChip", { value: values.cadastral }) },
    values.region && { key: "region" as const, label: t("regionChip", { value: values.region }) },
    values.municipality && { key: "municipality" as const, label: t("munChip", { value: values.municipality }) },
  ].filter(Boolean) as { key: keyof FilterState; label: string }[];

  const hasFilters = activeChips.length > 0 || mine;

  return (
    <div className="space-y-2.5">
      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-2 flex flex-col sm:flex-row gap-2">
        {/* Cadastral code */}
        <div className="relative flex-[2] min-w-0">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={values.cadastral}
            onChange={(e) => handleChange("cadastral", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={t("cadastralPlaceholder")}
            className="w-full h-10 pl-9 pr-8 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-background/50"
          />
          {values.cadastral && (
            <button onClick={() => clearChip("cadastral")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-faint hover:text-text-muted transition-colors">
              <XIcon />
            </button>
          )}
        </div>

        {/* Region dropdown */}
        <div className="relative flex-1 min-w-0" ref={regionRef}>
          <button
            type="button"
            onClick={() => { setRegionOpen(v => !v); setMunOpen(false); }}
            className={`w-full h-10 px-3 text-sm border rounded-lg flex items-center justify-between gap-2 transition-colors ${
              values.region
                ? "border-primary/40 bg-primary-light text-primary font-medium"
                : "border-border bg-background/50 text-text-faint hover:border-primary/30"
            } focus:outline-none focus:ring-2 focus:ring-primary/20`}
          >
            <span className="truncate">{values.region || t("regionPlaceholder")}</span>
            <span className="flex items-center gap-1 shrink-0">
              {values.region && (
                <span onClick={(e) => { e.stopPropagation(); clearChip("region"); }} className="text-primary/60 hover:text-primary transition-colors">
                  <XIcon />
                </span>
              )}
              <svg className={`w-3.5 h-3.5 transition-transform ${regionOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
          {regionOpen && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-border rounded-xl shadow-lg z-30 py-1 max-h-56 overflow-y-auto">
              {Object.keys(REGIONS).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { handleChange("region", r); setRegionOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-primary-light hover:text-primary ${
                    values.region === r ? "bg-primary-light text-primary font-medium" : "text-text-muted"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Municipality dropdown */}
        <div className="relative flex-1 min-w-0" ref={munRef}>
          <button
            type="button"
            onClick={() => { if (availableMunicipalities.length > 0) { setMunOpen(v => !v); setRegionOpen(false); } }}
            disabled={availableMunicipalities.length === 0}
            className={`w-full h-10 px-3 text-sm border rounded-lg flex items-center justify-between gap-2 transition-colors ${
              availableMunicipalities.length === 0
                ? "border-border bg-background/30 text-text-faint cursor-not-allowed opacity-60"
                : values.municipality
                  ? "border-primary/40 bg-primary-light text-primary font-medium"
                  : "border-border bg-background/50 text-text-faint hover:border-primary/30"
            } focus:outline-none focus:ring-2 focus:ring-primary/20`}
          >
            <span className="truncate">{values.municipality || t("municipalityPlaceholder")}</span>
            <span className="flex items-center gap-1 shrink-0">
              {values.municipality && (
                <span onClick={(e) => { e.stopPropagation(); clearChip("municipality"); }} className="text-primary/60 hover:text-primary transition-colors">
                  <XIcon />
                </span>
              )}
              <svg className={`w-3.5 h-3.5 transition-transform ${munOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
          {munOpen && availableMunicipalities.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-border rounded-xl shadow-lg z-30 py-1 max-h-56 overflow-y-auto">
              {availableMunicipalities.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { handleChange("municipality", m); setMunOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-primary-light hover:text-primary ${
                    values.municipality === m ? "bg-primary-light text-primary font-medium" : "text-text-muted"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mine toggle + Search */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={toggleMine}
            className={`h-10 px-3 rounded-lg text-sm font-medium border transition-all flex items-center gap-1.5 ${
              mine
                ? "bg-primary text-white border-primary shadow-sm"
                : "border-border text-text-muted hover:border-primary/40 hover:text-primary bg-background/50"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden sm:inline">{t("mine")}</span>
          </button>

          <button
            onClick={handleSearch}
            className="h-10 px-5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden sm:inline">{t("searchButton")}</span>
          </button>
        </div>
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {mine && (
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full border border-primary/20">
              {t("mineChip")}
              <button onClick={toggleMine} className="hover:text-primary/60 transition-colors"><XIcon /></button>
            </span>
          )}
          {activeChips.map((chip) => (
            <span key={chip.key} className="inline-flex items-center gap-1.5 bg-white border border-border text-text-muted text-xs px-2.5 py-1 rounded-full shadow-sm">
              {chip.label}
              <button onClick={() => clearChip(chip.key)} className="hover:text-danger transition-colors"><XIcon /></button>
            </span>
          ))}
          <button onClick={clearAll} className="text-xs text-text-faint hover:text-danger transition-colors px-1">
            {t("clearAll")}
          </button>
        </div>
      )}
    </div>
  );
}
