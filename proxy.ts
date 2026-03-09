import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // next-intl — locale prefix handling
  // locale prefix-ს გარეშე პათები (static files, api, auth callback) — skip
  // auth callback და api — bypass ყველაფრისგან
  if (pathname.startsWith("/auth/") || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // intl middleware locale detection & redirect
  const intlResponse = intlMiddleware(request);
  // თუ intl redirect გამოაბრუნა (e.g. / → /ka) — პირდაპირ ვაბრუნებთ
  if (intlResponse.status !== 200 && intlResponse.headers.get("location")) {
    return intlResponse;
  }

  // locale-ს ამოვიღებთ pathname-დან
  const localeMatch = pathname.match(/^\/(ka|en|ru)(\/|$)/);
  const localePrefix = localeMatch ? `/${localeMatch[1]}` : "/ka";
  const pathWithoutLocale = localeMatch ? pathname.slice(localeMatch[1].length + 1) || "/" : pathname;

  let supabaseResponse = intlResponse;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isAuthPage = pathWithoutLocale === "/login" || pathWithoutLocale === "/register";
  const isOnboarding = pathWithoutLocale === "/onboarding";
  const isPublic =
    pathWithoutLocale === "/" ||
    pathWithoutLocale === "/contact" ||
    pathWithoutLocale.startsWith("/parcels/") ||
    pathWithoutLocale.startsWith("/terms") ||
    pathWithoutLocale.startsWith("/privacy") ||
    pathWithoutLocale.startsWith("/cookies") ||
    pathWithoutLocale.startsWith("/acceptable-use") ||
    pathWithoutLocale.startsWith("/disclaimer");

  // logged out — login-ზე, next param-ით რომ login-ის შემდეგ დავბრუნდეთ
  if (!user && !isAuthPage && !isPublic) {
    const url = request.nextUrl.clone();
    const nextUrl = request.nextUrl.pathname + (request.nextUrl.search || "");
    url.pathname = `${localePrefix}/login`;
    url.search = "";
    url.searchParams.set("next", nextUrl);
    return NextResponse.redirect(url);
  }

  // logged in + auth page — dashboard-ზე
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = `${localePrefix}/dashboard`;
    return NextResponse.redirect(url);
  }

  // logged in — შევამოწმოთ პროფილი
  if (user && !isOnboarding && !isAuthPage && !isPublic) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("profile_completed")
      .eq("id", user.id)
      .single();

    if (!profile?.profile_completed) {
      const url = request.nextUrl.clone();
      url.pathname = `${localePrefix}/onboarding`;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
