"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parcelSchema, type ParcelFormValues } from "@/features/parcels/schemas";
import { useTransition, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import type { Parcel } from "@/features/parcels/types";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { REGIONS, toRegionId, toMunicipalityId } from "@/features/parcels/constants";

interface SelectDropdownProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  getLabel: (id: string) => string;
  placeholder: string;
  disabled?: boolean;
  error?: string;
}

function SelectDropdown({ label, value, onChange, options, getLabel, placeholder, disabled, error }: SelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const inputCls = `w-full h-12 px-4 pr-10 text-sm rounded-xl border transition-colors bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 flex items-center justify-between text-left ${
    error ? "border-danger focus:border-danger" : "border-border focus:border-primary"
  } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/40"}`;

  return (
    <div className="space-y-1.5" ref={ref}>
      <label className="block text-sm font-medium text-text-muted">{label}</label>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen(v => !v)}
          className={inputCls}
        >
          <span className={value ? "text-text" : "text-text-faint"}>{value ? getLabel(value) : placeholder}</span>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {value && !disabled && (
              <span
                onClick={(e) => { e.stopPropagation(); onChange(""); setOpen(false); }}
                className="text-text-faint hover:text-text-muted transition-colors p-0.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            )}
            <svg className={`w-4 h-4 text-text-faint transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>

        {open && options.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-border rounded-xl shadow-lg z-30 py-1 max-h-56 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-primary-light hover:text-primary ${
                  value === opt ? "bg-primary-light text-primary font-medium" : "text-text-muted"
                }`}
              >
                {getLabel(opt)}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

interface ParcelFormProps {
  parcel?: Parcel;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}

export default function ParcelForm({ parcel, action }: ParcelFormProps) {
  const t = useTranslations("parcelForm");
  const tRegions = useTranslations("regions");
  const tMunicipalities = useTranslations("municipalities");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [pendingValues, setPendingValues] = useState<ParcelFormValues | null>(null);

  const isEdit = !!parcel;

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<ParcelFormValues>({
    resolver: zodResolver(parcelSchema),
    defaultValues: {
      cadastral_code: parcel?.cadastral_code ?? "",
      address: parcel?.address ?? "",
      area_sqm: parcel?.area_sqm?.toString() ?? "",
      region: parcel?.region ? toRegionId(parcel.region) : "",
      municipality: parcel?.municipality ? toMunicipalityId(parcel.municipality) : "",
      notes: parcel?.notes ?? "",
    },
  });

  const selectedRegion = watch("region");
  const availableMunicipalities = selectedRegion ? (REGIONS[selectedRegion] ?? []) : [];

  function onSubmit(values: ParcelFormValues) {
    if (isEdit) { setPendingValues(values); } else { doSubmit(values); }
  }

  function doSubmit(values: ParcelFormValues) {
    setServerError(null);
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => { if (v != null) fd.append(k, String(v)); });
    startTransition(async () => {
      const res = await action(fd);
      if (res?.error) setServerError(res.error);
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-5">
        <ErrorBanner message={serverError} />
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <Input label={t("cadastralCode")} required placeholder={t("cadastralPlaceholder")}
              error={errors.cadastral_code?.message} className="h-12 rounded-xl px-4" {...register("cadastral_code")} />
          </div>
          <div className="sm:col-span-2">
            <Input label={t("address")} required placeholder={t("addressPlaceholder")}
              error={errors.address?.message} className="h-12 rounded-xl px-4" {...register("address")} />
          </div>
          <Input label={t("area")} type="number" step="0.01" min="0" placeholder={t("areaPlaceholder")}
            error={errors.area_sqm?.message} className="h-12 rounded-xl px-4" {...register("area_sqm")} />

          <Controller
            name="region"
            control={control}
            render={({ field }) => (
              <SelectDropdown
                label={t("region")}
                value={field.value ?? ""}
                onChange={(v) => {
                  field.onChange(v);
                  setValue("municipality", "");
                }}
                options={Object.keys(REGIONS)}
                getLabel={(id) => tRegions(id as never)}
                placeholder={t("regionPlaceholder")}
                error={errors.region?.message}
              />
            )}
          />

          <Controller
            name="municipality"
            control={control}
            render={({ field }) => (
              <SelectDropdown
                label={t("municipality")}
                value={field.value ?? ""}
                onChange={field.onChange}
                options={availableMunicipalities}
                getLabel={(id) => tMunicipalities(id as never)}
                placeholder={t("municipalityPlaceholder")}
                disabled={availableMunicipalities.length === 0}
                error={errors.municipality?.message}
              />
            )}
          />

          <div className="sm:col-span-2">
            <Textarea label={t("notes")} rows={3} placeholder={t("notesPlaceholder")}
              error={errors.notes?.message} className="rounded-xl px-4 min-h-[7rem] py-3" {...register("notes")} />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" loading={isPending} className="w-auto">{t("save")}</Button>
          <Link href={`/${locale}/dashboard`} className="text-sm text-text-muted hover:text-text px-4 py-2.5 rounded-lg hover:bg-background transition-colors">
            {t("cancel")}
          </Link>
        </div>
      </form>

      <ConfirmModal
        open={!!pendingValues}
        title={t("confirmTitle")}
        description={t("confirmDesc")}
        confirmLabel={t("confirmSave")}
        cancelLabel={t("confirmCancel")}
        variant="primary"
        loading={isPending}
        onConfirm={() => { if (pendingValues) doSubmit(pendingValues); }}
        onCancel={() => setPendingValues(null)}
      />
    </>
  );
}
