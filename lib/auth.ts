import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

/** Verified user for the current request (validated with the Auth server). */
export const getUser = cache(async () => {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
});

/**
 * The user's profile row. If the signup trigger ever missed (e.g. the user
 * pre-dates the schema), a customer profile is created here as a fallback.
 */
export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await getUser();
  if (!user) return null;
  const supabase = await createClient();

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (data) return data as Profile;

  const meta = user.user_metadata ?? {};
  const { data: created } = await supabase
    .from("profiles")
    .insert({ id: user.id, full_name: meta.full_name ?? meta.name ?? null, role: "customer" })
    .select("*")
    .maybeSingle();
  return (created as Profile | null) ?? null;
});

/** Redirects to /login unless a user is signed in. */
export async function requireUser(next: string) {
  if (!isSupabaseConfigured) redirect("/login?error=config");
  const user = await getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}

/**
 * Server-side admin gate. Layouts do not re-run on client navigation, so call
 * this at the top of EVERY admin page as well as in the layout.
 * Not signed in → /admin/login. Signed in but not an admin → home page.
 */
export async function requireAdmin() {
  if (!isSupabaseConfigured) redirect("/admin/login?error=config");
  const user = await getUser();
  if (!user) redirect("/admin/login");
  const profile = await getProfile();
  if (profile?.role !== "admin") redirect("/admin/login?error=forbidden");
  const supabase = await createClient();
  return { user, profile, supabase };
}
