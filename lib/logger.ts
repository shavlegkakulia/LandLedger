"use server";

import { createClient } from "@/lib/supabase/server";

type LogAction =
  | "auth.signup"
  | "auth.signin"
  | "auth.signout"
  | "auth.oauth"
  | "profile.upsert"
  | "account.delete"
  | "parcel.create"
  | "parcel.update"
  | "parcel.delete"
  | "parcel.report"
  | "contact.send";

export async function logError(
  action: LogAction,
  errorMsg: string,
  metadata?: Record<string, unknown>
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from("activity_logs").insert({
      user_id: user?.id ?? null,
      action,
      status: "error",
      error_msg: errorMsg,
      metadata: metadata ?? null,
    });
  } catch (e) {
    // logging-ი კრიტიკული არ არის — silent fail
    console.error("[logError] failed to write log:", e);
  }
}
