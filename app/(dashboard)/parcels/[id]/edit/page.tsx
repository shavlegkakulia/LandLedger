import ParcelForm from "@/features/parcels/components/ParcelForm";
import { getParcel, updateParcel } from "@/features/parcels/actions";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditParcelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let parcel;
  try { parcel = await getParcel(id); }
  catch { notFound(); }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-text-faint hover:text-text-muted transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text">ნაკვეთის რედაქტირება</h1>
          <p className="text-text-muted text-sm font-mono">{parcel.cadastral_code}</p>
        </div>
      </div>
      <ParcelForm
        parcel={parcel}
        action={async (formData) => {
          "use server";
          return (await updateParcel(id, formData)) ?? undefined;
        }}
      />
    </div>
  );
}
