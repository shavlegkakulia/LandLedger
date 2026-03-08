import { getMyProfile } from "@/features/profile/actions";
import ProfileForm from "@/features/profile/components/ProfileForm";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const profile = await getMyProfile();

  console.log("[onboarding] profile:", JSON.stringify(profile));

  if (profile?.profile_completed) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-primary-muted flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-surface rounded-full shadow mb-3">
            <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text">კეთილი იყოს შენი მობრძანება!</h1>
          <p className="text-text-muted text-sm mt-1">მთავარ გვერდზე გადასასვლელად შეავსე პროფილი</p>
        </div>
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
