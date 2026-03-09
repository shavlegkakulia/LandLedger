"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logError } from "@/lib/logger";
import {
  findManyParcels,
  findParcelById,
  insertParcel,
  updateParcelById,
  deleteParcelById,
  upsertParcelView,
  countUniqueViews,
} from "@/features/parcels/repository";
import { parcelSchema } from "@/features/parcels/schemas";
import type { ParcelFilters } from "@/features/parcels/types";

export async function getParcels(filters?: ParcelFilters) {
  return findManyParcels(filters);
}

export async function getParcel(id: string) {
  return findParcelById(id);
}

export async function createParcel(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "არ ხარ ავტორიზებული" };

  const parsed = parcelSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "შეყვანილი მონაცემები არასწორია" };
  }

  try {
    await insertParcel({
      user_id: user.id,
      cadastral_code: parsed.data.cadastral_code,
      address: parsed.data.address,
      area_sqm: parsed.data.area_sqm ? Number(parsed.data.area_sqm) : null,
      region: parsed.data.region || null,
      municipality: parsed.data.municipality || null,
      notes: parsed.data.notes || null,
    });
  } catch (e) {
    const msg = (e as Error).message;
    await logError("parcel.create", msg, { userId: user.id, cadastral_code: parsed.data.cadastral_code });
    return { error: "ნაკვეთის შენახვა ვერ მოხერხდა" };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateParcel(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "არ ხარ ავტორიზებული" };

  const parsed = parcelSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "შეყვანილი მონაცემები არასწორია" };
  }

  try {
    await updateParcelById(id, user.id, {
      cadastral_code: parsed.data.cadastral_code,
      address: parsed.data.address,
      area_sqm: parsed.data.area_sqm ? Number(parsed.data.area_sqm) : null,
      region: parsed.data.region || null,
      municipality: parsed.data.municipality || null,
      notes: parsed.data.notes || null,
    });
  } catch (e) {
    const msg = (e as Error).message;
    await logError("parcel.update", msg, { parcelId: id, userId: user.id });
    return { error: "ნაკვეთის განახლება ვერ მოხერხდა" };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteParcel(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "არ ხარ ავტორიზებული" };

  try {
    await deleteParcelById(id, user.id);
  } catch (e) {
    const msg = (e as Error).message;
    await logError("parcel.delete", msg, { parcelId: id, userId: user.id });
    return { error: "ნაკვეთის წაშლა ვერ მოხერხდა" };
  }

  revalidatePath("/dashboard");
}

export async function recordParcelView(parcelId: string, ownerId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id === ownerId) return;

  try {
    await upsertParcelView(parcelId, user.id);
  } catch {
    // view ჩაწერა კრიტიკული არ არის — silent fail
  }
}

export async function getUniqueViewCount(parcelId: string): Promise<number> {
  try {
    return await countUniqueViews(parcelId);
  } catch {
    return 0;
  }
}

export async function reportParcel(parcelId: string, reason: string, details?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "არ ხარ ავტორიზებული" };

  const cleanReason = String(reason).slice(0, 50);
  const cleanDetails = details ? String(details).slice(0, 500) : null;

  const { error } = await supabase.from("parcel_reports").insert({
    reporter_id: user.id,
    parcel_id: parcelId,
    reason: cleanReason,
    details: cleanDetails,
  });

  if (error) {
    await logError("parcel.report", error.message, { parcelId, userId: user.id });
    return { error: "საჩივარი ვერ გაიგზავნა" };
  }

  return { success: true };
}
