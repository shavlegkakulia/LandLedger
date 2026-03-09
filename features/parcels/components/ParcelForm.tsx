"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parcelSchema, type ParcelFormValues } from "@/features/parcels/schemas";
import { useTransition, useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import type { Parcel } from "@/features/parcels/types";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface ParcelFormProps {
  parcel?: Parcel;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}

export default function ParcelForm({ parcel, action }: ParcelFormProps) {
  const t = useTranslations("parcelForm");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [pendingValues, setPendingValues] = useState<ParcelFormValues | null>(null);

  const isEdit = !!parcel;

  const { register, handleSubmit, formState: { errors } } = useForm<ParcelFormValues>({
    resolver: zodResolver(parcelSchema),
    defaultValues: {
      cadastral_code: parcel?.cadastral_code ?? "",
      address: parcel?.address ?? "",
      area_sqm: parcel?.area_sqm?.toString() ?? "",
      region: parcel?.region ?? "",
      municipality: parcel?.municipality ?? "",
      notes: parcel?.notes ?? "",
    },
  });

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
              error={errors.cadastral_code?.message} {...register("cadastral_code")} />
          </div>
          <div className="sm:col-span-2">
            <Input label={t("address")} required placeholder={t("addressPlaceholder")}
              error={errors.address?.message} {...register("address")} />
          </div>
          <Input label={t("area")} type="number" step="0.01" min="0" placeholder={t("areaPlaceholder")}
            error={errors.area_sqm?.message} {...register("area_sqm")} />
          <Input label={t("region")} placeholder={t("regionPlaceholder")}
            error={errors.region?.message} {...register("region")} />
          <Input label={t("municipality")} placeholder={t("municipalityPlaceholder")}
            error={errors.municipality?.message} {...register("municipality")} />
          <div className="sm:col-span-2">
            <Textarea label={t("notes")} rows={3} placeholder={t("notesPlaceholder")}
              error={errors.notes?.message} {...register("notes")} />
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
