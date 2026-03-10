import { createClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/features/profile/actions";
import ProfileForm from "@/features/profile/components/ProfileForm";
import { BackLink } from "@/components/ui/BackLink";
import { DeleteAccountButton } from "@/features/profile/components/DeleteAccountButton";
import { getTranslations } from "next-intl/server";

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const profile = await getMyProfile();
  const t = await getTranslations("profile");

  const socialAvatarUrl =
    (user?.user_metadata?.avatar_url as string | undefined) ??
    (user?.user_metadata?.picture as string | undefined) ??
    null;

  const profileWithAvatar = profile
    ? { ...profile, avatar_url: profile.avatar_url ?? socialAvatarUrl }
    : null;

  return (
    <div className="max-w-3xl space-y-8">
      <BackLink href={`/${locale}/dashboard`} title={t("title")} subtitle={t("subtitle")} />
      <ProfileForm profile={profileWithAvatar} />

      <div className="border border-danger-border rounded-2xl p-6 bg-danger-light">
        <h3 className="text-sm font-semibold text-danger mb-1">{t("dangerZone")}</h3>
        <p className="text-xs text-text-muted mb-4">{t("deleteWarning")}</p>
        <DeleteAccountButton />
      </div>
    </div>
  );
}
