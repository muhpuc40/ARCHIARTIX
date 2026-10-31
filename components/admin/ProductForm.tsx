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
import { productSchema } from "@/lib/validators";

type Input_ = z.input<typeof productSchema>;
type Output_ = z.output<typeof productSchema>;

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: { id: string; defaults: Input_ };
}) {
  const router = useRouter();
  const toast = useToast();
  const editing = Boolean(product);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Input_, unknown, Output_>({
    resolver: zodResolver(productSchema),
    defaultValues: product?.defaults ?? {
      name: "",
      slug: "",
      description: "",
      category_id: null,
      price_bdt: 0,
      stock: 0,
      images: [],
      model_url: null,
      is_published: false,
    },
  });

  async function onSubmit(values: Output_) {
    const res = await fetch(editing ? `/api/products/${product!.id}` : "/api/products", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast({ title: editing ? "Couldn’t save" : "Couldn’t create", description: json.error, tone: "error" });
      return;
    }
    toast({ title: editing ? "Product saved" : "Product created", tone: "success" });
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6 border border-line bg-white p-6">
        <Field label="Name" htmlFor="p-name" error={errors.name?.message} required>
          <Input id="p-name" aria-invalid={!!errors.name} {...register("name")} />
        </Field>
        <Field
          label="URL slug"
          htmlFor="p-slug"
          error={errors.slug?.message}
          hint={editing ? "Changing this changes the product’s public URL." : "Leave blank to generate from the name."}
        >
          <Input id="p-slug" placeholder="e.g. oak-lounge-chair" aria-invalid={!!errors.slug} {...register("slug")} />
        </Field>
        <Field label="Description" htmlFor="p-desc" error={errors.description?.message}>
          <Textarea id="p-desc" rows={7} aria-invalid={!!errors.description} {...register("description")} />
        </Field>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-700">Images</p>
          <Controller
            control={control}
            name="images"
            render={({ field }) => <MediaUploader folder="products" value={field.value ?? []} onChange={field.onChange} />}
          />
          {errors.images && <p role="alert" className="mt-1 text-xs font-medium text-red-700">{errors.images.message ?? "Check the images."}</p>}
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-700">3D model (optional)</p>
          <p className="mb-2 text-xs text-neutral-500">Upload a .glb file — shoppers can rotate and zoom it on the product page.</p>
          <Controller
            control={control}
            name="model_url"
            render={({ field }) => (
              <MediaUploader folder="models" kind="model" max={1} value={field.value ? [field.value] : []} onChange={(urls) => field.onChange(urls[0] ?? null)} />
            )}
          />
          {errors.model_url && <p role="alert" className="mt-1 text-xs font-medium text-red-700">{errors.model_url.message ?? "Check the 3D model."}</p>}
        </div>
      </div>

      <aside className="space-y-6 self-start border border-line bg-white p-6">
        <Field label="Price (৳ BDT)" htmlFor="p-price" error={errors.price_bdt?.message} required>
          <Input id="p-price" type="number" inputMode="numeric" min={0} step={1} aria-invalid={!!errors.price_bdt} {...register("price_bdt", { valueAsNumber: true })} />
        </Field>
        <Field label="Stock" htmlFor="p-stock" error={errors.stock?.message} required>
          <Input id="p-stock" type="number" inputMode="numeric" min={0} step={1} aria-invalid={!!errors.stock} {...register("stock", { valueAsNumber: true })} />
        </Field>
        <Field label="Category" htmlFor="p-cat" error={errors.category_id?.message}>
          <Select id="p-cat" {...register("category_id", { setValueAs: (v: string) => v || null })}>
            <option value="">Uncategorised</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </Field>
        <label className="flex cursor-pointer items-start gap-3 border border-line p-4">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-[#1b1b1b]" {...register("is_published")} />
          <span className="text-sm">
            <span className="block font-semibold">Published</span>
            <span className="text-neutral-500">Visible in the shop. Untick to keep it as a draft.</span>
          </span>
        </label>
        <div className="flex flex-col gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : editing ? "Save changes" : "Create product"}
          </Button>
          <ButtonLink href="/admin/products" variant="outline">Cancel</ButtonLink>
        </div>
      </aside>
    </form>
  );
}
