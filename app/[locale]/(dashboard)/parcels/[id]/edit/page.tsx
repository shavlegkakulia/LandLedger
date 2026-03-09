import ParcelForm from "@/features/parcels/components/ParcelForm";
import { getParcel, updateParcel } from "@/features/parcels/actions";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/ui/BackLink";
import { getTranslations } from "next-intl/server";

export default async function EditParcelPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;
  const t = await getTranslations("parcelDetail");
  let parcel;
  try { parcel = await getParcel(id); }
  catch { notFound(); }

  return (
    <div className="max-w-2xl">
      <BackLink href={`/${locale}/dashboard`} title={t("editParcel")} subtitle={parcel.cadastral_code} />
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
