import { createClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/features/profile/actions";
import ProfileForm from "@/features/profile/components/ProfileForm";
import { BackLink } from "@/components/ui/BackLink";

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
    <div className="max-w-2xl">
      <BackLink href="/dashboard" title="პროფილი" subtitle="მართე შენი ინფო და კონფიდენციალობა" />
      <ProfileForm profile={profileWithAvatar} />
    </div>
  );
}
