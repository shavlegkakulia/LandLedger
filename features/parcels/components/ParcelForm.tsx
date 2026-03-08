"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parcelSchema, type ParcelFormValues } from "@/features/parcels/schemas";
import { useTransition, useState } from "react";
import Link from "next/link";
import type { Parcel } from "@/features/parcels/types";

interface ParcelFormProps {
  parcel?: Parcel;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}

export default function ParcelForm({ parcel, action }: ParcelFormProps) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

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
    setServerError(null);
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => { if (v != null) fd.append(k, String(v)); });
    startTransition(async () => {
      const res = await action(fd);
      if (res?.error) setServerError(res.error);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-5">
      {serverError && (
        <div className="bg-danger-light border border-danger-border text-danger text-sm rounded-lg px-4 py-3">
          {serverError}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-text mb-1">საკადასტრო კოდი <span className="text-danger">*</span></label>
          <input {...register("cadastral_code")} className={inputCls(!!errors.cadastral_code)} placeholder="01.10.01.001.001" />
          <FieldError msg={errors.cadastral_code?.message} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-text mb-1">მისამართი <span className="text-danger">*</span></label>
          <input {...register("address")} className={inputCls(!!errors.address)} placeholder="თბილისი, ვაკე, ი. ჭავჭავაძის გამზ. 12" />
          <FieldError msg={errors.address?.message} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">ფართობი (მ²)</label>
          <input {...register("area_sqm")} type="number" step="0.01" min="0" className={inputCls(!!errors.area_sqm)} placeholder="მ²" />
          <FieldError msg={errors.area_sqm?.message} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">რეგიონი</label>
          <input {...register("region")} className={inputCls(!!errors.region)} placeholder="თბილისი" />
          <FieldError msg={errors.region?.message} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">მუნიციპალიტეტი</label>
          <input {...register("municipality")} className={inputCls(!!errors.municipality)} placeholder="ვაკე-საბურთალო" />
          <FieldError msg={errors.municipality?.message} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-text mb-1">შენიშვნები</label>
          <textarea {...register("notes")} rows={3} className={inputCls(!!errors.notes) + " resize-none"} placeholder="დამატებითი ინფორმაცია..." />
          <FieldError msg={errors.notes?.message} />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={isPending} className="bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors">
          {isPending ? "შენახვა..." : "შენახვა"}
        </button>
        <Link href="/dashboard" className="text-sm text-text-muted hover:text-text px-4 py-2.5 rounded-lg hover:bg-background transition-colors">
          გაუქმება
        </Link>
      </div>
    </form>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-danger">{msg}</p>;
}

function inputCls(hasError: boolean) {
  return `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors ${
    hasError ? "border-danger-border focus:ring-danger/30 bg-danger-light" : "border-border focus:ring-primary/30 focus:border-border-focus"
  }`;
}
