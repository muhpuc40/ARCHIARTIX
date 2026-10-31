"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { profileSchema } from "@/lib/validators";
import { z } from "zod";

type Values = z.input<typeof profileSchema>;

export function ProfileForm({ defaults }: { defaults: { full_name: string; phone: string } }) {
  const toast = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaults,
  });

  async function onSubmit(values: Values) {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) toast({ title: "Details saved", tone: "success" });
    else toast({ title: "Couldn’t save", description: json.error, tone: "error" });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <Field label="Full name" htmlFor="pf-name" error={errors.full_name?.message} required>
        <Input id="pf-name" autoComplete="name" aria-invalid={!!errors.full_name} {...register("full_name")} />
      </Field>
      <Field label="Mobile number" htmlFor="pf-phone" error={errors.phone?.message} hint="Used to confirm deliveries">
        <Input id="pf-phone" type="tel" inputMode="tel" autoComplete="tel" aria-invalid={!!errors.phone} {...register("phone")} />
      </Field>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : "Save details"}
      </Button>
    </form>
  );
}
