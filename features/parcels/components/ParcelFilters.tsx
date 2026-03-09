"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useRef, useState, useEffect } from "react";

const DEBOUNCE_MS = 350;

interface FilterState {
  cadastral: string;
  region: string;
  municipality: string;
}

export default function ParcelFilters({ currentUserId }: { currentUserId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [values, setValues] = useState<FilterState>({
    cadastral: searchParams.get("cadastral") ?? "",
    region: searchParams.get("region") ?? "",
    municipality: searchParams.get("municipality") ?? "",
  });

  const mine = searchParams.get("mine") === "1";
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    const next = { ...values, [key]: value };
    setValues(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushParams(next, mine), DEBOUNCE_MS);
  }

  function toggleMine() {
    pushParams(values, !mine);
  }

  function clearAll() {
    setValues({ cadastral: "", region: "", municipality: "" });
    router.replace(pathname);
  }

  function clearChip(key: keyof FilterState) {
    handleChange(key, "");
  }

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  const activeChips = [
    values.cadastral && { key: "cadastral" as const, label: `კოდი: ${values.cadastral}` },
    values.region && { key: "region" as const, label: `რეგიონი: ${values.region}` },
    values.municipality && { key: "municipality" as const, label: `მუნ.: ${values.municipality}` },
  ].filter(Boolean) as { key: keyof FilterState; label: string }[];

  const hasFilters = activeChips.length > 0 || mine;

  return (
    <div className="space-y-2">
      <div className="bg-surface rounded-2xl border border-border p-4">
        {/* ზედა რიგი — search inputs */}
        <div className="flex flex-wrap gap-3 items-end">
          {/* საკადასტრო კოდი */}
          <div className="flex-[2] min-w-[180px]">
            <label className="block text-xs font-medium text-text-muted mb-1.5">საკადასტრო კოდი</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={values.cadastral}
                onChange={(e) => handleChange("cadastral", e.target.value)}
                placeholder="01.10.01..."
                className="w-full pl-9 pr-8 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-border-focus transition-colors"
              />
              {values.cadastral && (
                <button onClick={() => clearChip("cadastral")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-faint hover:text-text transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* რეგიონი */}
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-text-muted mb-1.5">რეგიონი</label>
            <div className="relative">
              <input
                type="text"
                value={values.region}
                onChange={(e) => handleChange("region", e.target.value)}
                placeholder="თბილისი..."
                className="w-full px-3 pr-8 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-border-focus transition-colors"
              />
              {values.region && (
                <button onClick={() => clearChip("region")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-faint hover:text-text transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* მუნიციპალიტეტი */}
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-text-muted mb-1.5">მუნიციპალიტეტი</label>
            <div className="relative">
              <input
                type="text"
                value={values.municipality}
                onChange={(e) => handleChange("municipality", e.target.value)}
                placeholder="ვაკე..."
                className="w-full px-3 pr-8 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-border-focus transition-colors"
              />
              {values.municipality && (
                <button onClick={() => clearChip("municipality")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-faint hover:text-text transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* ჩემი toggle */}
          <div className="flex items-end gap-2 pb-0">
            <button
              onClick={toggleMine}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                mine
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-surface text-text-muted border-border hover:border-primary-muted hover:text-primary"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              ჩემი
              {mine && (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex items-center gap-2 flex-wrap px-1">
          <span className="text-xs text-text-faint">ფილტრი:</span>
          {mine && (
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
              ჩემი
              <button onClick={toggleMine} className="hover:text-primary/60 transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {activeChips.map((chip) => (
            <span key={chip.key} className="inline-flex items-center gap-1.5 bg-background border border-border text-text-muted text-xs px-2.5 py-1 rounded-full">
              {chip.label}
              <button onClick={() => clearChip(chip.key)} className="hover:text-danger transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          <button
            onClick={clearAll}
            className="text-xs text-text-faint hover:text-danger transition-colors ml-1"
          >
            ყველას გასუფთავება
          </button>
        </div>
      )}
    </div>
  );
}
