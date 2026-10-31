import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { updateSession } from "@/lib/supabase/session";

/**
 * Next.js 16 "proxy" (formerly middleware).
 *  - refreshes the Supabase session on every request that carries one
 *  - /account/*, /checkout  → must be signed in
 *  - /admin/*               → must be signed in AND profiles.role = 'admin' (login page: /admin/login)
 * Server components and route handlers re-verify independently (requireAdmin()).
 */
const PROTECTED = ["/account", "/checkout", "/admin"];

function hasAuthCookie(request: NextRequest) {
  return request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.includes("auth-token"));
}

function redirectTo(request: NextRequest, pathname: string, search = "", from?: NextResponse) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = search;
  const res = NextResponse.redirect(url);
  // keep any refreshed auth cookies
  from?.cookies.getAll().forEach((c) => res.cookies.set(c));
  return res;
}

export async function proxy(request: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const isAdminLogin = pathname === "/admin/login";
  const isProtected = !isAdminLogin && PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/");
  const loginPath = isAdminArea ? "/admin/login" : "/login";
  const cookiePresent = hasAuthCookie(request);

  if (!cookiePresent && !isProtected) return NextResponse.next();

  if (!cookiePresent && isProtected) {
    return isAdminArea
      ? redirectTo(request, loginPath)
      : redirectTo(request, loginPath, `?next=${encodeURIComponent(`${pathname}${search}`)}`);
  }

  const { supabase, user, getResponse } = await updateSession(request);
  const response = getResponse();

  if (isProtected && !user) {
    return isAdminArea
      ? redirectTo(request, loginPath, "", response)
      : redirectTo(request, loginPath, `?next=${encodeURIComponent(`${pathname}${search}`)}`, response);
  }

  if (user && isAdminArea && !isAdminLogin) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.role !== "admin") {
      return redirectTo(request, "/admin/login", "?error=forbidden", response);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|icons/|brand/|videos/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|mp4|webm|txt|xml)$).*)",
  ],
};
