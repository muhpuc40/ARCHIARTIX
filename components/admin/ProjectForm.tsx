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
import type { Category } from "@/lib/types";
import { projectSchema } from "@/lib/validators";

type In = z.input<typeof projectSchema>;
type Out = z.output<typeof projectSchema>;

const numberOrNull = (v: unknown) => (v === "" || v === null || v === undefined || Number.isNaN(Number(v)) ? null : Number(v));

export function ProjectForm({ categories, project }: { categories: Category[]; project?: { id: string; defaults: In } }) {
  const router = useRouter();
  const toast = useToast();
  const editing = Boolean(project);
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<In, unknown, Out>({
    resolver: zodResolver(projectSchema),
    defaultValues: project?.defaults ?? { title: "", slug: "", category_id: null, description: "", location: "", year: null, area_sqft: null, images: [], featured: false },
  });

  async function onSubmit(values: Out) {
    const res = await fetch(editing ? `/api/projects/${project!.id}` : "/api/projects", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast({ title: "Couldn’t save", description: json.error, tone: "error" });
      return;
    }
    toast({ title: editing ? "Project saved" : "Project created", tone: "success" });
    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6 border border-line bg-white p-6">
        <Field label="Title" htmlFor="pr-title" error={errors.title?.message} required>
          <Input id="pr-title" aria-invalid={!!errors.title} {...register("title")} />
        </Field>
        <Field label="URL slug" htmlFor="pr-slug" error={errors.slug?.message} hint={editing ? "Changing this changes the project’s public URL." : "Leave blank to generate from the title."}>
          <Input id="pr-slug" {...register("slug")} />
        </Field>
        <Field label="Description" htmlFor="pr-desc" error={errors.description?.message}>
          <Textarea id="pr-desc" rows={7} {...register("description")} />
        </Field>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-700">Photos</p>
          <Controller control={control} name="images" render={({ field }) => <MediaUploader folder="projects" max={20} value={field.value ?? []} onChange={field.onChange} />} />
        </div>
      </div>
      <aside className="space-y-6 self-start border border-line bg-white p-6">
        <Field label="Category" htmlFor="pr-cat" error={errors.category_id?.message}>
          <Select id="pr-cat" {...register("category_id", { setValueAs: (v: string) => v || null })}>
            <option value="">Uncategorised</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </Field>
        <Field label="Location" htmlFor="pr-loc" error={errors.location?.message}>
          <Input id="pr-loc" placeholder="e.g. Khulshi, Chattogram" {...register("location")} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Year" htmlFor="pr-year" error={errors.year?.message}>
            <Input id="pr-year" type="number" inputMode="numeric" {...register("year", { setValueAs: numberOrNull })} />
          </Field>
          <Field label="Area (sq ft)" htmlFor="pr-area" error={errors.area_sqft?.message}>
            <Input id="pr-area" type="number" inputMode="numeric" {...register("area_sqft", { setValueAs: numberOrNull })} />
          </Field>
        </div>
        <label className="flex cursor-pointer items-start gap-3 border border-line p-4">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-[#1b1b1b]" {...register("featured")} />
          <span className="text-sm"><span className="block font-semibold">Featured</span><span className="text-neutral-500">Show on the home page.</span></span>
        </label>
        <div className="flex flex-col gap-3">
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : editing ? "Save changes" : "Create project"}</Button>
          <ButtonLink href="/admin/projects" variant="outline">Cancel</ButtonLink>
        </div>
      </aside>
    </form>
  );
}
