"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "@/lib/env";

/** Browser Supabase client (anon key). Safe to use in client components. */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
