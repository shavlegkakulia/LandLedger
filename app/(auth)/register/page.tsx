import type { Metadata } from "next";
import RegisterForm from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "რეგისტრაცია",
  description: "დარეგისტრირდი LandLedger-ზე უფასოდ — განათავსე შენი მიწის ნაკვეთი და გაიგე ვინ გაინტერესებს.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return <RegisterForm />;
}
