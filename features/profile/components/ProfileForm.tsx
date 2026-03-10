"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormValues } from "@/features/profile/schemas";
import { upsertProfile } from "@/features/profile/actions";
import { useTransition, useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import type { Profile } from "@/features/profile/types";
import { useToast } from "@/components/ui/Toast";

/* ─── reusable field wrapper ─── */
function FieldWrapper({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-text">
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-text-faint">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

const inputCls = (hasError?: boolean) =>
  `w-full h-12 px-4 rounded-xl border ${
    hasError ? "border-danger" : "border-slate-200"
  } bg-white text-sm text-text placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`;

/* ─── privacy toggle row ─── */
function PrivacyToggle({
  label,
  hint,
  name,
  control,
}: {
  label: string;
  hint?: string;
  name: keyof ProfileFormValues & `show_${string}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <label className="flex items-center justify-between py-3 cursor-pointer group gap-4">
          <div className="min-w-0">
            <span className="block text-sm text-text group-hover:text-text transition-colors">{label}</span>
            {hint && <span className="block text-xs text-text-faint mt-0.5">{hint}</span>}
          </div>
          <div className="relative shrink-0">
            <input
              type="checkbox"
              checked={!!field.value}
              onChange={field.onChange}
              className="sr-only peer/tog"
            />
            <div className="w-10 h-5 bg-slate-200 peer-checked/tog:bg-primary rounded-full transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked/tog:translate-x-5 pointer-events-none" />
          </div>
        </label>
      )}
    />
  );
}

/* ─── section card ─── */
function Card({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          {icon}
        </div>
        <div>
          <h2 className="text-base font-semibold text-text">{title}</h2>
          <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="px-6 py-6">{children}</div>
    </div>
  );
}

/* ─── main component ─── */
export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const t = useTranslations("profileForm");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url ?? null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, control, formState: { errors, isDirty } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name ?? "",
      last_name: profile?.last_name ?? "",
      gender: profile?.gender ?? null,
      birth_date: profile?.birth_date ?? "",
      phone: profile?.phone ?? "",
      address: profile?.address ?? "",
      email: profile?.email ?? "",
      show_address: profile?.show_address ?? false,
      show_gender: profile?.show_gender ?? false,
      show_birth_date: profile?.show_birth_date ?? false,
      show_name: profile?.show_name ?? true,
      show_avatar: profile?.show_avatar ?? true,
    },
  });

  function onSubmit(values: ProfileFormValues) {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => { if (v != null && v !== "") fd.append(k, String(v)); });
    (["show_address", "show_gender", "show_birth_date", "show_name", "show_avatar"] as const).forEach(
      (key) => { fd.set(key, values[key] ? "on" : ""); }
    );
    if (avatarFile) fd.append("avatar", avatarFile);
    startTransition(async () => {
      const res = await upsertProfile(fd);
      if (res?.error) toast(res.error, "error");
    });
  }

  const canSave = (isDirty || avatarFile !== null) && !isPending;

  const initials = profile?.first_name
    ? (profile.first_name[0] + (profile.last_name?.[0] ?? "")).toUpperCase()
    : "?";

  /* completion score */
  const completionFields = [
    profile?.first_name,
    profile?.last_name,
    profile?.avatar_url,
    profile?.phone,
    profile?.email,
    profile?.gender,
  ];
  const filled = completionFields.filter(Boolean).length;
  const pct = Math.round((filled / completionFields.length) * 100);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* ── Card 1: Photo ── */}
      <Card
        icon={
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
        title={t("photoCardTitle")}
        subtitle={t("photoCardSubtitle")}
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* avatar circle */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full bg-primary text-white text-3xl font-semibold flex items-center justify-center overflow-hidden ring-4 ring-slate-100 shadow-md">
              {avatarPreview
                ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                : initials}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-dark transition-colors ring-2 ring-white"
              title={t("changePhoto")}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H7v-2a4 4 0 011.172-2.828L9 13z" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 1 * 1024 * 1024) {
                  toast("სურათი ზედმეტად დიდია — მაქს. 1MB", "error");
                  e.target.value = "";
                  return;
                }
                setAvatarFile(file);
                setAvatarPreview(URL.createObjectURL(file));
              }}
            />
          </div>

          {/* info + button */}
            <div className="text-center sm:text-left space-y-3">
              <div>
                <p className="text-sm font-medium text-text">პროფილის სურათი</p>
                <p className="text-xs text-text-faint mt-0.5">{t("photoHint")}</p>
              </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-slate-200 text-sm text-text-muted hover:border-primary/40 hover:text-primary transition-colors bg-slate-50 hover:bg-primary/5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {t("changePhoto")}
            </button>
          </div>
        </div>
      </Card>

      {/* ── Card 2: Personal Info ── */}
      <Card
        icon={
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
        title={t("personalCardTitle")}
        subtitle={t("personalCardSubtitle")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FieldWrapper label={t("firstNameLabel")} error={errors.first_name?.message} required>
            <input
              {...register("first_name")}
              type="text"
              placeholder={t("firstNamePlaceholder")}
              className={inputCls(!!errors.first_name)}
            />
          </FieldWrapper>
          <FieldWrapper label={t("lastNameLabel")} error={errors.last_name?.message} required>
            <input
              {...register("last_name")}
              type="text"
              placeholder={t("lastNamePlaceholder")}
              className={inputCls(!!errors.last_name)}
            />
          </FieldWrapper>
          <FieldWrapper label={t("genderLabel")} error={errors.gender?.message} hint={t("birthDateHint")}>
            <select {...register("gender")} className={inputCls(!!errors.gender)}>
              <option value="">{t("genderUnset")}</option>
              <option value="male">{t("genderMale")}</option>
              <option value="female">{t("genderFemale")}</option>
              <option value="other">{t("genderOther")}</option>
            </select>
          </FieldWrapper>
          <FieldWrapper label={t("birthDateLabel")} error={errors.birth_date?.message} hint={t("birthDateHint")}>
            <input
              {...register("birth_date")}
              type="date"
              className={inputCls(!!errors.birth_date)}
            />
          </FieldWrapper>
        </div>
      </Card>

      {/* ── Card 3: Contact Info ── */}
      <Card
        icon={
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        }
        title={t("contactCardTitle")}
        subtitle={t("contactCardSubtitle")}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FieldWrapper
              label={t("phoneLabel")}
              error={errors.phone?.message}
              hint={t("phoneHint")}
            >
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder={t("phonePlaceholder")}
                  className={inputCls(!!errors.phone) + " pl-10"}
                />
              </div>
            </FieldWrapper>
            <FieldWrapper
              label={t("emailLabel")}
              error={errors.email?.message}
              hint={t("emailHint")}
            >
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input
                  {...register("email")}
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  className={inputCls(!!errors.email) + " pl-10"}
                />
              </div>
            </FieldWrapper>
          </div>
          <FieldWrapper label={t("addressLabel")} error={errors.address?.message} hint={t("addressHint")}>
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                {...register("address")}
                type="text"
                placeholder={t("addressPlaceholder")}
                className={inputCls(!!errors.address) + " pl-10"}
              />
            </div>
          </FieldWrapper>

          {/* contact-required warning */}
          {(errors.phone?.message || errors.email?.message) && (
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <p className="text-sm text-amber-700">{t("contactRequired")}</p>
            </div>
          )}
        </div>
      </Card>

      {/* ── Card 4: Privacy ── */}
      <Card
        icon={
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
        title={t("privacyCardTitle")}
        subtitle={t("privacyCardSubtitle")}
      >
        {/* context banner */}
        <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-5">
          <svg className="w-4 h-4 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-text-muted leading-relaxed">
            {t("privacyExplainer")}
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          <PrivacyToggle label={t("showName")} hint={t("showNameHint")} name="show_name" control={control} />
          <PrivacyToggle label={t("showAvatar")} hint={t("showAvatarHint")} name="show_avatar" control={control} />
          <PrivacyToggle label={t("showAddress")} hint={t("showAddressHint")} name="show_address" control={control} />
          <PrivacyToggle label={t("showGender")} hint={t("showGenderHint")} name="show_gender" control={control} />
          <PrivacyToggle label={t("showBirthDate")} hint={t("showBirthDateHint")} name="show_birth_date" control={control} />
        </div>
      </Card>

      {/* ── Action bar ── */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2 pb-4">
        <button
          type="button"
          onClick={() => router.push(`/${locale}/dashboard`)}
          className="h-11 px-6 rounded-xl border border-slate-200 text-sm font-medium text-text-muted hover:border-slate-300 hover:text-text transition-colors bg-white"
        >
          {t("cancelButton")}
        </button>
        <button
          type="submit"
          disabled={!canSave}
          className="h-11 px-8 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
        >
          {isPending ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t("saving")}
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t("saveButton")}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
