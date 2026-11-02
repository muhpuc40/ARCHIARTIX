"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import type { z } from "zod";
import { inquirySchema } from "@/lib/validators";
import { cn } from "@/lib/utils";

type InquiryIn = z.input<typeof inquirySchema>;
type InquiryInput = z.output<typeof inquirySchema>;

const SERVICES = [
  "Interior design",
  "Architectural design",
  "Turnkey execution",
  "3D / VR walkthrough",
  "Collection / product enquiry",
  "Something else",
];

/** Contact + quote form. Posts to /api/inquiries (validated again on the server). */
export function ContactForm({ defaultKind = "contact", defaultService = "" }: { defaultKind?: "contact" | "quote"; defaultService?: string }) {
  const toast = useToast();
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryIn, unknown, InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { kind: defaultKind, name: "", email: "", phone: "", service: defaultService, message: "", website: "" },
  });
  const kind = useWatch({ control, name: "kind" });

  async function onSubmit(values: InquiryInput) {
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Something went wrong. Please try again.");
      setDone(true);
      reset();
    } catch (e) {
      toast({ title: "Couldn’t send your message", description: (e as Error).message, tone: "error" });
    }
  }

  if (done) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 border border-line bg-brand-cream p-10 text-center" role="status">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-yellow"><CircleCheck size={32} /></span>
        <h3 className="font-serif text-3xl">Thank you — we’ve got it.</h3>
        <p className="max-w-sm text-neutral-600">Our team will reply within one working day. For anything urgent, message us on WhatsApp.</p>
        <Button variant="outline" onClick={() => setDone(false)}>Send another message</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6" aria-label="Contact form">
      <div className="grid grid-cols-2 gap-px bg-line p-px" role="radiogroup" aria-label="Type of enquiry">
        {(["contact", "quote"] as const).map((k) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={kind === k}
            onClick={() => setValue("kind", k)}
            className={cn(
              "h-12 text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
              kind === k ? "bg-ink text-brand-yellow" : "bg-white text-ink hover:bg-brand-cream",
            )}
          >
            {k === "contact" ? "General enquiry" : "Request a quote"}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name" error={errors.name?.message} required>
          <Input id="name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email?.message} required>
          <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
        </Field>
        <Field label="Phone / WhatsApp" htmlFor="phone" error={errors.phone?.message} hint="Optional — e.g. 01712345678">
          <Input id="phone" type="tel" autoComplete="tel" inputMode="tel" aria-invalid={!!errors.phone} {...register("phone")} />
        </Field>
        <Field label="I’m interested in" htmlFor="service" error={errors.service?.message}>
          <Select id="service" {...register("service")}>
            <option value="">Select a service…</option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
            {defaultService && !SERVICES.includes(defaultService) && <option value={defaultService}>{defaultService}</option>}
          </Select>
        </Field>
      </div>

      <Field label="Tell us about your project" htmlFor="message" error={errors.message?.message} required hint="Location, size, timeline and budget range help us reply faster.">
        <Textarea id="message" rows={6} aria-invalid={!!errors.message} {...register("message")} />
      </Field>

      {/* honeypot — hidden from people, irresistible to bots */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Sending…</> : <><Send size={16} /> Send message</>}
      </Button>
    </form>
  );
}
