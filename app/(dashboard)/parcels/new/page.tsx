import ParcelForm from "@/features/parcels/components/ParcelForm";
import { createParcel } from "@/features/parcels/actions";
import { BackLink } from "@/components/ui/BackLink";

export default function NewParcelPage() {
  return (
    <div className="max-w-2xl">
      <BackLink href="/dashboard" title="ახალი ნაკვეთის დამატება" subtitle="შეიყვანეთ საკადასტრო მონაცემები" />
      <ParcelForm
        action={async (formData) => {
          "use server";
          return (await createParcel(formData)) ?? undefined;
        }}
      />
    </div>
  );
}
