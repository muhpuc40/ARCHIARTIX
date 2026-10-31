import "server-only";
import type { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { isSameOrigin, jsonError } from "@/lib/http";
import { createClient } from "@/lib/supabase/server";

type Guard =
  | { ok: true; supabase: Awaited<ReturnType<typeof createClient>>; userId: string; email: string | null }
  | { ok: false; response: NextResponse };

/**
 * Guard for Route Handlers. Verifies (1) same-origin for mutations (CSRF),
 * (2) a real signed-in user, and optionally (3) the admin role — by reading
 * profiles.role on the server, never trusting anything from the client.
 */
export async function guardApi(
  request: Request,
  opts: { admin?: boolean } = {},
): Promise<Guard> {
  if (!isSupabaseConfigured) {
    return { ok: false, response: jsonError(503, "Backend is not configured yet.") };
  }
  if (request.method !== "GET" && request.method !== "HEAD" && !isSameOrigin(request)) {
    return { ok: false, response: jsonError(403, "Cross-origin request blocked.") };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, response: jsonError(401, "Please sign in.") };

  if (opts.admin) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.role !== "admin") {
      return { ok: false, response: jsonError(403, "Admins only.") };
    }
  }
  return { ok: true, supabase, userId: user.id, email: user.email ?? null };
}

/** Pulls a friendly message out of our `ARX|CODE|message` database exceptions. */
export function dbErrorMessage(error: { message?: string } | null | undefined, fallback: string) {
  const msg = error?.message ?? "";
  const m = msg.match(/ARX\|([A-Z_]+)\|(.+)$/);
  return m ? { code: m[1]!, message: m[2]! } : { code: "UNKNOWN", message: fallback };
}
