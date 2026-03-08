"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormValues } from "@/features/profile/schemas";
import { upsertProfile } from "@/features/profile/actions";
import { useTransition, useState } from "react";
import type { Profile } from "@/features/profile/types";

export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, control, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name ?? "",
      last_name: profile?.last_name ?? "",
      gender: profile?.gender ?? null,
      birth_date: profile?.birth_date ?? "",
      phone: profile?.phone ?? "",
      address: profile?.address ?? "",
      email: profile?.email ?? "",
      show_phone: profile?.show_phone ?? false,
      show_address: profile?.show_address ?? false,
      show_gender: profile?.show_gender ?? false,
      show_birth_date: profile?.show_birth_date ?? false,
      show_email: profile?.show_email ?? false,
    },
  });

  function onSubmit(values: ProfileFormValues) {
    setServerError(null);
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => { if (v != null && v !== "") fd.append(k, String(v)); });
    (["show_phone", "show_address", "show_gender", "show_birth_date", "show_email"] as const).forEach(
      (key) => { fd.set(key, values[key] ? "on" : ""); }
    );
    startTransition(async () => {
      const res = await upsertProfile(fd);
      if (res?.error) setServerError(res.error);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
      {serverError && (
        <div className="mx-6 mt-6 bg-danger-light border border-danger-border text-danger text-sm rounded-lg px-4 py-3">
          {serverError}
        </div>
      )}

      <div className="px-6 py-5 border-b border-border">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-4">სავალდებულო ინფორმაცია</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">სახელი <span className="text-danger">*</span></label>
            <input {...register("first_name")} className={inputCls(!!errors.first_name)} placeholder="გიორგი" />
            <FieldError msg={errors.first_name?.message} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">გვარი <span className="text-danger">*</span></label>
            <input {...register("last_name")} className={inputCls(!!errors.last_name)} placeholder="გიორგაძე" />
            <FieldError msg={errors.last_name?.message} />
          </div>
        </div>
      </div>

      <div className="px-6 py-5 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wide">დამატებითი ინფორმაცია</h2>
          <span className="text-xs text-text-faint">Toggle = სხვებს ჩანდეს</span>
        </div>
        <ToggleRow label="სქესი" toggleName="show_gender" error={errors.gender?.message} control={control}>
          <select {...register("gender")} className={inputCls(!!errors.gender)}>
            <option value="">— მითითება არ მაქვს —</option>
            <option value="male">მამრობითი</option>
            <option value="female">მდედრობითი</option>
            <option value="other">სხვა</option>
          </select>
        </ToggleRow>
        <ToggleRow label="დაბადების თარიღი" toggleName="show_birth_date" error={errors.birth_date?.message} control={control}>
          <input {...register("birth_date")} type="date" className={inputCls(!!errors.birth_date)} />
        </ToggleRow>
        <ToggleRow label="მობილური" toggleName="show_phone" error={errors.phone?.message} control={control}>
          <input {...register("phone")} type="tel" placeholder="+995 5XX XXX XXX" className={inputCls(!!errors.phone)} />
        </ToggleRow>
        <ToggleRow label="მისამართი" toggleName="show_address" error={errors.address?.message} control={control}>
          <input {...register("address")} type="text" placeholder="ქ. თბილისი..." className={inputCls(!!errors.address)} />
        </ToggleRow>
        <ToggleRow label="ელ-ფოსტა (საჯარო)" toggleName="show_email" error={errors.email?.message} control={control}>
          <input {...register("email")} type="email" placeholder="you@example.com" className={inputCls(!!errors.email)} />
        </ToggleRow>
      </div>

      <div className="px-6 pb-6">
        <button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-medium py-3 rounded-lg text-sm transition-colors">
          {isPending ? "შენახვა..." : "შენახვა"}
        </button>
      </div>
    </form>
  );
}

function ToggleRow({ label, toggleName, error, control, children }: {
  label: string;
  toggleName: keyof ProfileFormValues & `show_${string}`;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  children: React.ReactNode;
}) {
  return (
    <div className="p-3 rounded-xl border border-border hover:border-primary-muted transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-text mb-1.5">{label}</label>
          {children}
          {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        </div>
        <Controller
          name={toggleName}
          control={control}
          render={({ field }) => (
            <label className="flex flex-col items-center gap-1 cursor-pointer shrink-0 select-none">
              <div className="relative">
                <input type="checkbox" checked={!!field.value} onChange={field.onChange} className="sr-only peer/tog" />
                <div className="w-10 h-5 bg-border peer-checked/tog:bg-primary rounded-full transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked/tog:translate-x-5 pointer-events-none" />
              </div>
              <span className="text-xs text-text-faint whitespace-nowrap">საჯარო</span>
            </label>
          )}
        />
      </div>
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-danger">{msg}</p>;
}

function inputCls(hasError: boolean) {
  return `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors ${
    hasError ? "border-danger-border focus:ring-danger/30 bg-danger-light" : "border-border focus:ring-primary/30 focus:border-border-focus"
  }`;
}
