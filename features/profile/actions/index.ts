"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  findMyProfile,
  findPublicProfileById,
  updateProfileById,
} from "@/features/profile/repository";

export async function getMyProfile() {
  return findMyProfile();
}

export async function getPublicProfile(userId: string) {
  return findPublicProfileById(userId);
}

export async function upsertProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "არ ხარ ავტორიზებული" };

  try {
    await updateProfileById(user.id, {
      first_name: (formData.get("first_name") as string) || "",
      last_name: (formData.get("last_name") as string) || "",
      gender: (formData.get("gender") as "male" | "female" | "other") || null,
      birth_date: (formData.get("birth_date") as string) || null,
      phone: (formData.get("phone") as string) || null,
      address: (formData.get("address") as string) || null,
      email: (formData.get("email") as string) || user.email,
      show_phone: formData.get("show_phone") === "on",
      show_address: formData.get("show_address") === "on",
      show_gender: formData.get("show_gender") === "on",
      show_birth_date: formData.get("show_birth_date") === "on",
      show_email: formData.get("show_email") === "on",
      profile_completed: true,
    });
  } catch (e) {
    console.error("[upsertProfile] error:", (e as Error).message);
    return { error: (e as Error).message };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
