import { createClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/features/profile/actions";
import ProfileForm from "@/features/profile/components/ProfileForm";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Profile } from "@/features/profile/types";

export default async function OnboardingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const profile = await getMyProfile();
  const t = await getTranslations("onboarding");

  if (profile?.profile_completed) redirect(`/${locale}/dashboard`);

  const socialAvatarUrl =
    (user?.user_metadata?.avatar_url as string | undefined) ??
    (user?.user_metadata?.picture as string | undefined) ??
    null;

  const profileWithAvatar: Profile | null = profile
    ? { ...profile, avatar_url: profile.avatar_url ?? socialAvatarUrl }
    : ({ avatar_url: socialAvatarUrl } as Parameters<typeof ProfileForm>[0]["profile"]);

  /* completion score */
  const completionFields = [
    profileWithAvatar?.first_name,
    profileWithAvatar?.last_name,
    profileWithAvatar?.avatar_url,
    profileWithAvatar?.phone,
    profileWithAvatar?.email,
    profileWithAvatar?.gender,
  ];
  const filled = completionFields.filter(Boolean).length;
  const pct = Math.round((filled / completionFields.length) * 100);
  const initials = profileWithAvatar?.first_name
    ? (profileWithAvatar.first_name[0] + (profileWithAvatar.last_name?.[0] ?? "")).toUpperCase()
    : "?";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-slate-50 flex flex-col items-center px-4 py-10">
      {/* logo */}
      <a href={`/${locale}`} className="flex items-center gap-2 mb-10 select-none">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-9.894A11.958 11.958 0 0112 3c3.866 0 7.32 1.834 9.547 4.703L16 12H8l1 8z" />
          </svg>
        </div>
        <span className="text-base font-bold text-text tracking-tight">LandLedger</span>
      </a>

      {/* header card */}
      <div className="w-full max-w-3xl mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* avatar */}
            <div className="w-16 h-16 rounded-full bg-primary text-white text-xl font-semibold flex items-center justify-center overflow-hidden ring-4 ring-green-50 shrink-0 shadow">
              {profileWithAvatar?.avatar_url
                ? <img src={profileWithAvatar.avatar_url} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                : initials}
            </div>

            {/* text + progress */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div>
                <h1 className="text-xl font-bold text-text">{t("welcome")}</h1>
                <p className="text-sm text-text-muted mt-1">
                  {t("subtitle")}
                </p>
              </div>

              {/* progress bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-faint">პროფილის სისრულე</span>
                  <span className="text-xs font-semibold text-primary">{pct}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* form */}
      <div className="w-full max-w-3xl">
        <ProfileForm profile={profileWithAvatar} />
      </div>
    </div>
  );
}
