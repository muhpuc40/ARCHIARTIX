import { NextResponse } from "next/server";
import { getBaseUrl, getClientIp } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/utils";

/**
 * OAuth / magic-link landing route. Exchanges the `code` for a session cookie.
 *  - `next` is validated (same-origin relative paths only → no open redirects)
 *  - cancelled consent / provider errors return to /login with a friendly message
 *  - ensures a profiles row exists (fallback if the signup trigger missed)
 */
export async function GET(request: Request) {
  const base = getBaseUrl(request);
  const url = new URL(request.url);
  const next = safeNext(url.searchParams.get("next"));
  const fail = (reason: string) => NextResponse.redirect(`${base}/login?error=${reason}&next=${encodeURIComponent(next)}`);

  if (!isSupabaseConfigured) return fail("config");

  const limit = rateLimit(`auth-callback:${getClientIp(request)}`, 20, 60_000);
  if (!limit.ok) return fail("rate_limited");

  const providerError = url.searchParams.get("error");
  if (providerError) return fail(providerError === "access_denied" ? "cancelled" : "oauth_failed");

  const code = url.searchParams.get("code");
  if (!code) return fail("missing_code");

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return fail("oauth_failed");

  // Fallback profile creation (the DB trigger normally does this).
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: existing } = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle();
    if (!existing) {
      const meta = user.user_metadata ?? {};
      await supabase.from("profiles").insert({ id: user.id, full_name: meta.full_name ?? meta.name ?? null, role: "customer" });
    }
  }

  return NextResponse.redirect(`${base}${next}`);
}
