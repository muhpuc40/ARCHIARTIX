import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl } from "@/lib/env";

let client: SupabaseClient | null = null;

export function hasServiceRole() {
  return Boolean(supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Service-role client — bypasses RLS. SERVER ONLY.
 * Never import this from a Client Component; `server-only` makes the build fail if you do.
 * Only use it for narrow, validated operations (signed upload URLs, public inquiry inserts).
 */
export function createAdminClient(): SupabaseClient {
  if (!hasServiceRole()) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }
  if (!client) {
    client = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
