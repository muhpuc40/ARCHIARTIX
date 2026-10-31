"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

const ERRORS: Record<string, string> = {
  forbidden: "That account doesn’t have admin access.",
  config: "The backend isn’t configured yet. Add your Supabase keys to .env.local.",
};

export function AdminLoginForm({ error }: { error?: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(error ? (ERRORS[error] ?? null) : null);
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof schema>>({ resolver: zodResolver(schema) });

  async function onSubmit({ email, password }: z.input<typeof schema>) {
    setMessage(null);
    const supabase = createClient();
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err || !data.user) {
      setMessage("Incorrect email or password.");
      return;
    }
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
    if (profile?.role !== "admin") {
      await supabase.auth.signOut();
      setMessage(ERRORS.forbidden!);
      return;
    }
    router.replace("/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {message && (
        <p role="alert" className="flex gap-3 border-l-4 border-red-600 bg-red-50 p-4 text-sm text-red-800">
          <CircleAlert size={18} className="mt-0.5 shrink-0" /> {message}
        </p>
      )}
      <Field label="Admin email" htmlFor="adm-email" error={errors.email?.message}>
        <Input id="adm-email" type="email" autoComplete="username" aria-invalid={!!errors.email} {...register("email")} />
      </Field>
      <Field label="Password" htmlFor="adm-pass" error={errors.password?.message}>
        <div className="relative">
          <Input id="adm-pass" type={show ? "text" : "password"} autoComplete="current-password" className="pr-12" aria-invalid={!!errors.password} {...register("password")} />
          <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-ink">
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : <><LogIn size={16} /> Sign in</>}
      </Button>
    </form>
  );
}
