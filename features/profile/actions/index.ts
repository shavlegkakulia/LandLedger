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

export async function sendContactMessage({
  ownerId,
  message,
}: {
  ownerId: string;
  message: string;
}) {
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "არ ხარ ავტორიზებული" };
  if (user.id === ownerId) return { error: "საკუთარ თავს ვერ დაუკავშირდები" };

  const { data: owner } = await supabase
    .from("profiles")
    .select("first_name, last_name, email, show_email")
    .eq("id", ownerId)
    .single();

  if (!owner?.show_email || !owner?.email) {
    return { error: "მფლობელმა ელ-ფოსტა არ გაასაჯაროვა" };
  }

  const { data: sender } = await supabase
    .from("profiles")
    .select("first_name, last_name, email, phone")
    .eq("id", user.id)
    .single();

  const senderName = sender
    ? `${sender.first_name} ${sender.last_name}`.trim()
    : user.email ?? "უცნობი";

  const senderContact = [sender?.email, sender?.phone].filter(Boolean).join(" / ");
  const staticText = `LandLedger-ის გზავნილი: ${senderName} დაგიკავშირდა ნაკვეთის საკითხზე.`;
  const fullMessage = message.trim() ? `${staticText}\n\n${message.trim()}` : staticText;

  const { error } = await resend.emails.send({
    from: "LandLedger <onboarding@resend.dev>",
    to: owner.email,
    subject: `LandLedger — ${senderName} გიკავშირდება`,
    text: `${fullMessage}\n\n---\nგამგზავნის საკონტაქტო: ${senderContact}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="color:#166534;margin-bottom:4px">LandLedger</h2>
        <p style="color:#6b7280;font-size:14px;margin-top:0">საკადასტრო მონაცემების სისტემა</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
        <p style="font-size:15px;color:#111827">
          <strong>${senderName}</strong> დაგიკავშირდა ნაკვეთის საკითხზე.
        </p>
        ${message.trim() ? `<blockquote style="border-left:3px solid #166534;margin:16px 0;padding:12px 16px;background:#f0fdf4;color:#374151;border-radius:4px">${message.trim()}</blockquote>` : ""}
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
        <p style="font-size:13px;color:#6b7280">
          გამგზავნის საკონტაქტო: <strong>${senderContact}</strong>
        </p>
      </div>
    `,
  });

  await supabase.from("contact_logs").insert({
    sender_id: user.id,
    owner_id: ownerId,
    status: error ? "failed" : "sent",
    error_msg: error ? `${error.name}: ${error.message}` : null,
    message: message.trim() || null,
  });

  if (error) {
    console.error("[sendContactMessage] resend error:", error);
    return { error: "შეტყობინება ვერ გაიგზავნა" };
  }

  return { success: true };
}

export async function upsertProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "არ ხარ ავტორიზებული" };

  let avatar_url: string | undefined;

  const avatarFile = formData.get("avatar") as File | null;
  if (avatarFile && avatarFile.size > 0) {
    const ext = avatarFile.name.split(".").pop() ?? "jpg";
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, avatarFile, { upsert: true, contentType: avatarFile.type });

    if (uploadError) return { error: uploadError.message };

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    avatar_url = `${urlData.publicUrl}?t=${Date.now()}`;
  }

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
      ...(avatar_url ? { avatar_url } : {}),
    });
  } catch (e) {
    console.error("[upsertProfile] error:", (e as Error).message);
    return { error: (e as Error).message };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
