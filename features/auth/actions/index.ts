"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logError } from "@/lib/logger";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    await logError("auth.signup", error.message, { email });
    return { error: "რეგისტრაცია ვერ მოხერხდა. სცადეთ თავიდან." };
  }

  redirect("/dashboard");
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    await logError("auth.signin", error.message, { email });
    return { error: "ელ-ფოსტა ან პაროლი არასწორია" };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function signInWithGoogle(next?: string) {
  const supabase = await createClient();
  const callbackUrl = new URL(`${SITE_URL}/auth/callback`);
  if (next) callbackUrl.searchParams.set("next", next);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callbackUrl.toString() },
  });

  if (error) {
    await logError("auth.oauth", error.message, { provider: "google" });
    return { error: "Google-ით შესვლა ვერ მოხერხდა" };
  }
  if (data.url) redirect(data.url);
}

export async function signInWithFacebook(next?: string) {
  const supabase = await createClient();
  const callbackUrl = new URL(`${SITE_URL}/auth/callback`);
  if (next) callbackUrl.searchParams.set("next", next);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo: callbackUrl.toString(),
      scopes: "email,public_profile",
    },
  });

  if (error) {
    await logError("auth.oauth", error.message, { provider: "facebook" });
    return { error: "Facebook-ით შესვლა ვერ მოხერხდა" };
  }
  if (data.url) redirect(data.url);
}
