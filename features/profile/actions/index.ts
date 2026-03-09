"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logError } from "@/lib/logger";
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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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

  // Message length limit — max 2000 სიმბოლო
  const cleanMessage = String(message).slice(0, 2000).trim();

  // Rate limit: 24 საათში max 3 შეტყობინება ერთ მფლობელზე
  const { data: withinLimit } = await supabase.rpc("check_contact_rate_limit", {
    p_sender_id: user.id,
    p_owner_id: ownerId,
  });
  if (!withinLimit) {
    return { error: "24 საათში მაქსიმუმ 3 შეტყობინების გაგზავნა შეიძლება ერთ მფლობელზე" };
  }

  const { data: owner } = await supabase
    .from("profiles_public")
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
  const fullMessage = cleanMessage ? `${staticText}\n\n${cleanMessage}` : staticText;

  // HTML-ი escape-ით — injection-ის თავიდან ასაცილებლად
  const escapedMessage = escapeHtml(cleanMessage);
  const escapedSenderName = escapeHtml(senderName);
  const escapedSenderContact = escapeHtml(senderContact);

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
          <strong>${escapedSenderName}</strong> დაგიკავშირდა ნაკვეთის საკითხზე.
        </p>
        ${escapedMessage ? `<blockquote style="border-left:3px solid #166534;margin:16px 0;padding:12px 16px;background:#f0fdf4;color:#374151;border-radius:4px">${escapedMessage}</blockquote>` : ""}
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
        <p style="font-size:13px;color:#6b7280">
          გამგზავნის საკონტაქტო: <strong>${escapedSenderContact}</strong>
        </p>
      </div>
    `,
  });

  await supabase.from("contact_logs").insert({
    sender_id: user.id,
    owner_id: ownerId,
    status: error ? "failed" : "sent",
    error_msg: error ? `${error.name}: ${error.message}` : null,
    message: cleanMessage || null,
  });

  if (error) {
    console.error("[sendContactMessage] resend error:", error);
    await logError("contact.send", `${error.name}: ${error.message}`, { ownerId, senderId: user.id });
    return { error: "შეტყობინება ვერ გაიგზავნა" };
  }

  return { success: true };
}

const ALLOWED_AVATAR_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB

export async function upsertProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "არ ხარ ავტორიზებული" };

  let avatar_url: string | undefined;

  const avatarFile = formData.get("avatar") as File | null;
  if (avatarFile && avatarFile.size > 0) {
    if (!ALLOWED_AVATAR_TYPES[avatarFile.type]) {
      return { error: "სურათის ფორმატი არ არის მხარდაჭერილი (JPG, PNG, WEBP, GIF)" };
    }
    if (avatarFile.size > MAX_AVATAR_SIZE) {
      return { error: "სურათი ზედმეტად დიდია (მაქს. 5MB)" };
    }

    const ext = ALLOWED_AVATAR_TYPES[avatarFile.type];
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, avatarFile, { upsert: true, contentType: avatarFile.type });

    if (uploadError) {
      await logError("profile.avatar_upload", uploadError.message, { userId: user.id });
      return { error: "სურათის ატვირთვა ვერ მოხერხდა" };
    }

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
    const msg = (e as Error).message;
    await logError("profile.upsert", msg, { userId: user.id });
    return { error: "პროფილის შენახვა ვერ მოხერხდა" };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "არ ხარ ავტორიზებული" };

  const { createClient: createAdminClient } = await import("@supabase/supabase-js");
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    await logError("account.delete", error.message, { userId: user.id });
    return { error: "ანგარიშის წაშლა ვერ მოხერხდა" };
  }

  await supabase.auth.signOut();
  redirect("/");
}
