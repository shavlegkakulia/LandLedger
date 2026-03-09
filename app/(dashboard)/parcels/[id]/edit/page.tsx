import ParcelForm from "@/features/parcels/components/ParcelForm";
import { getParcel, updateParcel } from "@/features/parcels/actions";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/ui/BackLink";

export default async function EditParcelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let parcel;
  try { parcel = await getParcel(id); }
  catch { notFound(); }

  return (
    <div className="max-w-2xl">
      <BackLink href="/dashboard" title="ნაკვეთის რედაქტირება" subtitle={parcel.cadastral_code} />
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
