import type { Metadata } from "next";
import RegisterForm from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return <RegisterForm />;
}
