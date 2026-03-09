"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parcelSchema, type ParcelFormValues } from "@/features/parcels/schemas";
import { useTransition, useState } from "react";
import Link from "next/link";
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
    if (isEdit) {
      setPendingValues(values);
    } else {
      doSubmit(values);
    }
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
            <Input
              label="საკადასტრო კოდი" required
              placeholder="01.10.01.001.001"
              error={errors.cadastral_code?.message}
              {...register("cadastral_code")}
            />
          </div>
          <div className="sm:col-span-2">
            <Input
              label="მისამართი" required
              placeholder="თბილისი, ვაკე, ი. ჭავჭავაძის გამზ. 12"
              error={errors.address?.message}
              {...register("address")}
            />
          </div>
          <Input
            label="ფართობი (მ²)"
            type="number" step="0.01" min="0"
            placeholder="მ²"
            error={errors.area_sqm?.message}
            {...register("area_sqm")}
          />
          <Input
            label="რეგიონი"
            placeholder="თბილისი"
            error={errors.region?.message}
            {...register("region")}
          />
          <Input
            label="მუნიციპალიტეტი"
            placeholder="ვაკე-საბურთალო"
            error={errors.municipality?.message}
            {...register("municipality")}
          />
          <div className="sm:col-span-2">
            <Textarea
              label="შენიშვნები"
              rows={3}
              placeholder="დამატებითი ინფორმაცია..."
              error={errors.notes?.message}
              {...register("notes")}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" loading={isPending} className="w-auto">
            შენახვა
          </Button>
          <Link href="/dashboard" className="text-sm text-text-muted hover:text-text px-4 py-2.5 rounded-lg hover:bg-background transition-colors">
            გაუქმება
          </Link>
        </div>
      </form>

      <ConfirmModal
        open={!!pendingValues}
        title="ცვლილებების შენახვა"
        description="დარწმუნებული ხარ, რომ გინდა ამ ცვლილებების შენახვა?"
        confirmLabel="შენახვა"
        cancelLabel="გაუქმება"
        variant="primary"
        loading={isPending}
        onConfirm={() => { if (pendingValues) doSubmit(pendingValues); }}
        onCancel={() => setPendingValues(null)}
      />
    </>
  );
}
