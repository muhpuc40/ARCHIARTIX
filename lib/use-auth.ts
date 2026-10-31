"use client";

import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

type AuthState = { loading: boolean; signedIn: boolean; name: string | null; email: string | null };

/** Lightweight client-side auth status for the header (keeps pages statically renderable). */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    loading: isSupabaseConfigured,
    signedIn: false,
    name: null,
    email: null,
  });

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    let alive = true;

    const apply = (user: { email?: string | null; user_metadata?: Record<string, unknown> } | null) => {
      if (!alive) return;
      setState({
        loading: false,
        signedIn: Boolean(user),
        email: user?.email ?? null,
        name: (user?.user_metadata?.full_name as string | undefined) ?? (user?.user_metadata?.name as string | undefined) ?? null,
      });
    };

    supabase.auth.getUser().then(({ data }) => apply(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => apply(session?.user ?? null));
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
