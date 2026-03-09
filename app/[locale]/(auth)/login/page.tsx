import type { Metadata } from "next";
import LoginForm from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  return <LoginForm oauthError={error} />;
}
