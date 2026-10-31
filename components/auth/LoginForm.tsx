"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, CircleCheck, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { createClient } from "@/lib/supabase/client";
import { safeNext } from "@/lib/utils";
import { loginEmailSchema } from "@/lib/validators";
import { z } from "zod";

const ERRORS: Record<string, string> = {
  cancelled: "Sign-in was cancelled. You can try again whenever you’re ready.",
  oauth_failed: "We couldn’t complete sign-in. Please try again.",
  missing_code: "That sign-in link is invalid or has expired. Please try again.",
  rate_limited: "Too many attempts. Please wait a minute and try again.",
  config: "Sign-in isn’t available until the site’s backend is configured.",
};

function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.5 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

export function LoginForm({ next, error }: { next: string; error?: string }) {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState<string | null>(error ? (ERRORS[error] ?? ERRORS.oauth_failed!) : null);
  const target = safeNext(next);

  const { register, handleSubmit, formState: { errors } } = useForm<z.input<typeof loginEmailSchema>>({
    resolver: zodResolver(loginEmailSchema),
  });

  const redirectTo = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(target)}`;

  async function google() {
    setBusy(true);
    setMessage(null);
    const { error: err } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectTo() },
    });
    if (err) {
      setMessage(err.message.includes("provider") ? "Google sign-in isn’t enabled in Supabase yet (see README → Google sign-in)." : ERRORS.oauth_failed!);
      setBusy(false);
    }
  }

  async function magicLink({ email }: { email: string }) {
    setBusy(true);
    setMessage(null);
    const { error: err } = await createClient().auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo() } });
    setBusy(false);
    if (err) setMessage("We couldn’t send the link. Check the address and try again.");
    else setSent(true);
  }

  if (sent) {
    return (
      <div className="space-y-4 text-center" role="status">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-yellow"><CircleCheck size={32} /></span>
        <h2 className="font-serif text-3xl">Check your inbox</h2>
        <p className="text-neutral-600">We’ve emailed you a sign-in link. Open it on this device to continue.</p>
        <Button variant="ghost" onClick={() => setSent(false)}>Use a different method</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <p role="alert" className="flex gap-3 border-l-4 border-red-600 bg-red-50 p-4 text-sm text-red-800">
          <CircleAlert size={18} className="mt-0.5 shrink-0" /> {message}
        </p>
      )}

      <button
        type="button"
        onClick={google}
        disabled={busy}
        className="flex h-14 w-full items-center justify-center gap-3 border border-neutral-300 bg-white text-sm font-semibold transition-colors hover:border-ink hover:bg-brand-cream disabled:opacity-60"
      >
        {busy ? <Loader2 size={18} className="animate-spin" /> : <GoogleLogo />} Continue with Google
      </button>

      <div className="flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-neutral-400">
        <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={handleSubmit(magicLink)} noValidate className="space-y-4">
        <Field label="Email me a sign-in link" htmlFor="login-email" error={errors.email?.message}>
          <Input id="login-email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} {...register("email")} />
        </Field>
        <Button type="submit" variant="dark" size="lg" disabled={busy} className="w-full">
          <Mail size={16} /> Send magic link
        </Button>
      </form>
      <p className="text-center text-xs text-neutral-500">No password needed. New here? An account is created automatically.</p>
    </div>
  );
}
