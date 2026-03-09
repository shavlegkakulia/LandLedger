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

  try {
    await insertParcel({
      user_id: user.id,
      cadastral_code: formData.get("cadastral_code") as string,
      address: formData.get("address") as string,
      area_sqm: formData.get("area_sqm") ? Number(formData.get("area_sqm")) : null,
      region: (formData.get("region") as string) || null,
      municipality: (formData.get("municipality") as string) || null,
      notes: (formData.get("notes") as string) || null,
    });
  } catch (e) {
    const msg = (e as Error).message;
    await logError("parcel.create", msg, { userId: user.id, cadastral_code: formData.get("cadastral_code") });
    return { error: msg };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateParcel(id: string, formData: FormData) {
  try {
    await updateParcelById(id, {
      cadastral_code: formData.get("cadastral_code") as string,
      address: formData.get("address") as string,
      area_sqm: formData.get("area_sqm") ? Number(formData.get("area_sqm")) : null,
      region: (formData.get("region") as string) || null,
      municipality: (formData.get("municipality") as string) || null,
      notes: (formData.get("notes") as string) || null,
    });
  } catch (e) {
    const msg = (e as Error).message;
    await logError("parcel.update", msg, { parcelId: id });
    return { error: msg };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteParcel(id: string) {
  try {
    await deleteParcelById(id);
  } catch (e) {
    const msg = (e as Error).message;
    await logError("parcel.delete", msg, { parcelId: id });
    return { error: msg };
  }

  revalidatePath("/dashboard");
}

// ნახვის ჩაწერა — საკუთარი ნახვა არ ითვლება
export async function recordParcelView(parcelId: string, ownerId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id === ownerId) return;

  try {
    await upsertParcelView(parcelId, user.id);
  } catch {
    // view ჩაწერა არ არის კრიტიკული — silent fail
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

  const { error } = await supabase.from("parcel_reports").insert({
    reporter_id: user.id,
    parcel_id: parcelId,
    reason,
    details: details || null,
  });

  if (error) {
    await logError("parcel.report", error.message, { parcelId, userId: user.id });
    return { error: "საჩივარი ვერ გაიგზავნა" };
  }

  return { success: true };
}
