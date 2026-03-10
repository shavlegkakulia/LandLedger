import { createClient } from "@/lib/supabase/server";
import type { Profile, ProfileUpdate, PublicProfile } from "@/features/profile/types";

export async function findMyProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export async function findPublicProfileById(userId: string): Promise<PublicProfile | null> {
  const supabase = await createClient();
  // profiles_public view — show_* flags DB-დონეზე enforce-ს (rls_fixes.sql)
  const { data } = await supabase
    .from("profiles_public")
    .select("id, first_name, last_name, avatar_url, gender, birth_date, address, show_name, show_avatar, show_address, show_gender, show_birth_date")
    .eq("id", userId)
    .single();

  return data;
}

export async function updateProfileById(userId: string, payload: ProfileUpdate): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...payload }, { onConflict: "id" });

  if (error) throw new Error(error.message);
}
