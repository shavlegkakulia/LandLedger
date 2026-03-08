"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

export default function ParcelFilters({ currentUserId }: { currentUserId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) { params.set(key, value); } else { params.delete(key); }
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const mine = searchParams.get("mine") === "1";
  const hasFilters = searchParams.get("cadastral") || searchParams.get("region") || searchParams.get("municipality") || mine;

  return (
    <div className="bg-surface rounded-xl border border-border p-4 flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-[160px]">
        <label className="block text-xs font-medium text-text-muted mb-1">საკადასტრო კოდი</label>
        <input
          type="text"
          defaultValue={searchParams.get("cadastral") ?? ""}
          onChange={(e) => update("cadastral", e.target.value)}
          placeholder="01.10..."
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-border-focus"
        />
      </div>
      <div className="flex-1 min-w-[140px]">
        <label className="block text-xs font-medium text-text-muted mb-1">რეგიონი</label>
        <input
          type="text"
          defaultValue={searchParams.get("region") ?? ""}
          onChange={(e) => update("region", e.target.value)}
          placeholder="თბილისი..."
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-border-focus"
        />
      </div>
      <div className="flex-1 min-w-[140px]">
        <label className="block text-xs font-medium text-text-muted mb-1">მუნიციპალიტეტი</label>
        <input
          type="text"
          defaultValue={searchParams.get("municipality") ?? ""}
          onChange={(e) => update("municipality", e.target.value)}
          placeholder="ვაკე..."
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-border-focus"
        />
      </div>
      <div className="flex items-center gap-2 pb-0.5">
        <button
          onClick={() => update("mine", mine ? "" : "1")}
          className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
            mine
              ? "bg-primary text-white border-primary"
              : "bg-surface text-text-muted border-border hover:border-primary-muted"
          }`}
        >
          {mine ? "✓ ჩემი" : "ჩემი"}
        </button>
        {hasFilters && (
          <button
            onClick={() => router.replace(pathname)}
            className="px-3 py-2 rounded-lg text-sm text-text-faint hover:text-danger border border-border hover:border-danger-border transition-colors"
          >
            გასუფთავება
          </button>
        )}
      </div>
    </div>
  );
}
