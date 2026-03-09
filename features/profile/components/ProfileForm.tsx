"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormValues } from "@/features/profile/schemas";
import { upsertProfile } from "@/features/profile/actions";
import { useTransition, useState, useRef } from "react";
import type { Profile } from "@/features/profile/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { fieldCls } from "@/components/ui/Input";

export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url ?? null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const file = avatarFile;
    if (file) fd.append("avatar", file);
    startTransition(async () => {
      const res = await upsertProfile(fd);
      if (res?.error) setServerError(res.error);
    });
  }

  const initials = profile?.first_name
    ? (profile.first_name[0] + (profile.last_name?.[0] ?? "")).toUpperCase()
    : "?";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="mx-6 mt-6">
        <ErrorBanner message={serverError} />
      </div>

      {/* Avatar */}
      <div className="px-6 pt-6 pb-4 border-b border-border flex items-center gap-5">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full bg-primary text-white text-2xl font-semibold flex items-center justify-center overflow-hidden ring-2 ring-border">
            {avatarPreview
              ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              : initials}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center shadow hover:bg-primary-dark transition-colors"
            title="სურათის შეცვლა"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setAvatarFile(file);
                setAvatarPreview(URL.createObjectURL(file));
              }
            }}
          />
        </div>
        <div>
          <p className="text-sm font-medium text-text">პროფილის სურათი</p>
          <p className="text-xs text-text-faint mt-0.5">JPG, PNG ან GIF. მაქს. 2MB</p>
        </div>
      </div>

      <div className="px-6 py-5 border-b border-border">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-4">სავალდებულო ინფორმაცია</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="სახელი" required placeholder="გიორგი" error={errors.first_name?.message} {...register("first_name")} />
          <Input label="გვარი" required placeholder="გიორგაძე" error={errors.last_name?.message} {...register("last_name")} />
        </div>
      </div>

      <div className="px-6 py-5 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wide">დამატებითი ინფორმაცია</h2>
          <span className="text-xs text-text-faint">Toggle = სხვებს ჩანდეს</span>
        </div>
        <ToggleRow label="სქესი" toggleName="show_gender" error={errors.gender?.message} control={control}>
          <select {...register("gender")} className={fieldCls(!!errors.gender)}>
            <option value="">— მითითება არ მაქვს —</option>
            <option value="male">მამრობითი</option>
            <option value="female">მდედრობითი</option>
            <option value="other">სხვა</option>
          </select>
        </ToggleRow>
        <ToggleRow label="დაბადების თარიღი" toggleName="show_birth_date" error={errors.birth_date?.message} control={control}>
          <input {...register("birth_date")} type="date" className={fieldCls(!!errors.birth_date)} />
        </ToggleRow>
        <ToggleRow label="მობილური *" toggleName="show_phone" error={errors.phone?.message} control={control}>
          <input {...register("phone")} type="tel" placeholder="+995 5XX XXX XXX" className={fieldCls(!!errors.phone)} />
        </ToggleRow>
        <ToggleRow label="მისამართი" toggleName="show_address" error={errors.address?.message} control={control}>
          <input {...register("address")} type="text" placeholder="ქ. თბილისი..." className={fieldCls(!!errors.address)} />
        </ToggleRow>
        <ToggleRow label="ელ-ფოსტა (საჯარო) *" toggleName="show_email" error={errors.email?.message} control={control}>
          <input {...register("email")} type="email" placeholder="you@example.com" className={fieldCls(!!errors.email)} />
        </ToggleRow>
        {(errors.phone?.message === "ტელეფონი ან ელ-ფოსტა — ერთ-ერთი სავალდებულოა (სხვებმა რომ დაგიკავშირდნენ)" || errors.email?.message === "ტელეფონი ან ელ-ფოსტა — ერთ-ერთი სავალდებულოა (სხვებმა რომ დაგიკავშირდნენ)") && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
            <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-sm text-amber-700">ტელეფონი ან ელ-ფოსტა — ერთ-ერთი სავალდებულოა, სხვებმა რომ დაგიკავშირდნენ.</p>
          </div>
        )}
      </div>

      <div className="px-6 pb-6">
        <Button type="submit" loading={isPending}>
          შენახვა
        </Button>
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
