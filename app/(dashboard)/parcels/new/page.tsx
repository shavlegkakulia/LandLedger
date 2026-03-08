import ParcelForm from "@/features/parcels/components/ParcelForm";
import { createParcel } from "@/features/parcels/actions";
import Link from "next/link";

export default function NewParcelPage() {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-text-faint hover:text-text-muted transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text">ახალი ნაკვეთის დამატება</h1>
          <p className="text-text-muted text-sm">შეიყვანეთ საკადასტრო მონაცემები</p>
        </div>
      </div>
      <ParcelForm
        action={async (formData) => {
          "use server";
          return (await createParcel(formData)) ?? undefined;
        }}
      />
    </div>
  );
}
