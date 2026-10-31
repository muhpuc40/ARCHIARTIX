import { NextResponse } from "next/server";
import { getBaseUrl, isSameOrigin } from "@/lib/http";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

/** POST only (CSRF-safe): clears the Supabase session and returns home. */
export async function POST(request: Request) {
  const base = getBaseUrl(request);
  if (!isSameOrigin(request)) return NextResponse.redirect(`${base}/`, { status: 303 });
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  const to = new URL(request.url).searchParams.get("to") === "admin" ? "/admin/login" : "/";
  return NextResponse.redirect(`${base}${to}`, { status: 303 });
}
