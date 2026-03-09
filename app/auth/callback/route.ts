import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const error = searchParams.get("error");

  if (error) {
    const errorDescription = searchParams.get("error_description") ?? "";
    const isDuplicateEmail = errorDescription.toLowerCase().includes("multiple accounts") || errorDescription.toLowerCase().includes("same email");
    const errorKey = isDuplicateEmail ? "duplicate_email" : "oauth_failed";
    return NextResponse.redirect(`${origin}/login?error=${errorKey}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      // next უნდა იყოს შიდა URL (XSS/redirect hijacking-ის თავიდან ასაცილებლად)
      const redirectTo = next && next.startsWith("/") ? next : "/dashboard";
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
