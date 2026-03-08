import { getMyProfile } from "@/features/profile/actions";
import ProfileForm from "@/features/profile/components/ProfileForm";
import Link from "next/link";

export default async function ProfilePage() {
  const profile = await getMyProfile();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-text-faint hover:text-text-muted transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text">პროფილი</h1>
          <p className="text-text-muted text-sm">მართე შენი ინფო და კონფიდენციალობა</p>
        </div>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}
