"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { testimonialSchema } from "@/lib/validators";

type In = z.input<typeof testimonialSchema>;
type Out = z.output<typeof testimonialSchema>;

export function TestimonialForm({ id, defaults }: { id?: string; defaults?: In }) {
  const router = useRouter();
  const toast = useToast();
  const editing = Boolean(id);
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<In, unknown, Out>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: defaults ?? { name: "", role: "", location: "", quote: "", rating: 5, avatar_url: null, is_published: true, sort_order: 0 },
  });

  async function onSubmit(values: Out) {
    const res = await fetch(editing ? `/api/testimonials/${id}` : "/api/testimonials", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast({ title: "Couldn’t save", description: json.error, tone: "error" });
      return;
    }
    toast({ title: editing ? "Testimonial saved" : "Testimonial added", tone: "success" });
    router.push("/admin/testimonials");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6 border border-line bg-white p-6">
        <Field label="Client name" htmlFor="t-name" error={errors.name?.message} required>
          <Input id="t-name" aria-invalid={!!errors.name} {...register("name")} />
        </Field>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Role / project type" htmlFor="t-role" error={errors.role?.message} hint="e.g. Apartment owner">
            <Input id="t-role" {...register("role")} />
          </Field>
          <Field label="Location" htmlFor="t-loc" error={errors.location?.message} hint="e.g. Dhanmondi, Dhaka">
            <Input id="t-loc" {...register("location")} />
          </Field>
        </div>
        <Field label="Testimonial" htmlFor="t-quote" error={errors.quote?.message} required>
          <Textarea id="t-quote" rows={6} aria-invalid={!!errors.quote} {...register("quote")} />
        </Field>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-700">Photo (optional)</p>
          <Controller
            control={control}
            name="avatar_url"
            render={({ field }) => (
              <MediaUploader folder="testimonials" max={1} value={field.value ? [field.value] : []} onChange={(urls) => field.onChange(urls[0] ?? null)} />
            )}
          />
        </div>
      </div>
      <aside className="space-y-6 self-start border border-line bg-white p-6">
        <Field label="Rating" htmlFor="t-rating" error={errors.rating?.message}>
          <Select id="t-rating" {...register("rating", { valueAsNumber: true })}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"★".repeat(n)} ({n})</option>)}
          </Select>
        </Field>
        <Field label="Display order" htmlFor="t-order" error={errors.sort_order?.message} hint="Lower numbers show first">
          <Input id="t-order" type="number" min={0} step={1} {...register("sort_order", { valueAsNumber: true })} />
        </Field>
        <label className="flex cursor-pointer items-start gap-3 border border-line p-4">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-[#1b1b1b]" {...register("is_published")} />
          <span className="text-sm"><span className="block font-semibold">Published</span><span className="text-neutral-500">Show on the home page.</span></span>
        </label>
        <div className="flex flex-col gap-3">
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : editing ? "Save changes" : "Add testimonial"}</Button>
          <ButtonLink href="/admin/testimonials" variant="outline">Cancel</ButtonLink>
        </div>
      </aside>
    </form>
  );
}
