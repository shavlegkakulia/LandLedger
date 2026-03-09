import ParcelForm from "@/features/parcels/components/ParcelForm";
import { createParcel } from "@/features/parcels/actions";
import { BackLink } from "@/components/ui/BackLink";
import { getTranslations } from "next-intl/server";

export default async function NewParcelPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("parcelNew");

  return (
    <div className="max-w-2xl">
      <BackLink href={`/${locale}/dashboard`} title={t("title")} subtitle={t("subtitle")} />
      <ParcelForm
        action={async (formData) => {
          "use server";
          return (await createParcel(formData)) ?? undefined;
        }}
      />
    </div>
  );
}
