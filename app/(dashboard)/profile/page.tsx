import { createClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/features/profile/actions";
import ProfileForm from "@/features/profile/components/ProfileForm";
import { BackLink } from "@/components/ui/BackLink";
import { DeleteAccountButton } from "@/features/profile/components/DeleteAccountButton";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const profile = await getMyProfile();

  const socialAvatarUrl =
    (user?.user_metadata?.avatar_url as string | undefined) ??
    (user?.user_metadata?.picture as string | undefined) ??
    null;

  const profileWithAvatar = profile
    ? { ...profile, avatar_url: profile.avatar_url ?? socialAvatarUrl }
    : null;

  return (
    <div className="max-w-2xl space-y-8">
      <BackLink href="/dashboard" title="პროფილი" subtitle="მართე შენი ინფო და კონფიდენციალობა" />
      <ProfileForm profile={profileWithAvatar} />

      {/* GDPR — Danger Zone */}
      <div className="border border-danger-border rounded-xl p-5 bg-danger-light">
        <h3 className="text-sm font-semibold text-danger mb-1">Danger Zone</h3>
        <p className="text-xs text-text-muted mb-4">
          ანგარიშის წაშლა შეუქცევადია. ყველა მონაცემი, ნაკვეთი და ისტორია სამუდამოდ წაიშლება.
        </p>
        <DeleteAccountButton />
      </div>
    </div>
  );
}
