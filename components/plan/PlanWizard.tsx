"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CircleCheck, Loader2, Minus, Plus, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import {
  addonSetFor,
  FLAT_STATUSES,
  PACKAGES,
  ROTATING_WORDS,
  roomPresetsFor,
  type FlatStatusId,
  type PackageId,
} from "@/lib/estimate";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import { estimateSchema } from "@/lib/validators";

type Cat = { id: string; name: string; slug: string };

const detailsSchema = estimateSchema.pick({ name: true, phone: true, email: true, note: true, website: true });
type DetailsIn = z.input<typeof detailsSchema>;
type DetailsOut = z.output<typeof detailsSchema>;

const STEPS = ["Welcome", "Size & rooms", "Add-ons", "Package", "Your details"] as const;

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % ROTATING_WORDS.length), 2200);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="relative inline-block min-w-[3ch] align-bottom text-brand-yellow-deep">
      <AnimatePresence mode="wait">
        <motion.span
          key={ROTATING_WORDS[i]}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.3 }}
          className="inline-block"
        >
          {ROTATING_WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Counter({ label, value, onChange, max = 30 }: { label: string; value: number; onChange: (n: number) => void; max?: number }) {
  return (
    <div className={cn("flex items-center justify-between gap-4 border p-4 transition-colors", value > 0 ? "border-ink bg-brand-cream" : "border-line bg-white")}>
      <span className="font-semibold">{label}</span>
      <div className="flex items-center gap-3" role="group" aria-label={`${label} count`}>
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))} disabled={value === 0} aria-label={`Fewer ${label}`} className="grid h-9 w-9 place-items-center border border-ink transition-colors hover:bg-ink hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit">
          <Minus size={16} />
        </button>
        <span className="w-6 text-center font-bold tabular-nums" aria-live="polite">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`More ${label}`} className="grid h-9 w-9 place-items-center border border-ink bg-brand-yellow transition-colors hover:bg-ink hover:text-brand-yellow disabled:opacity-30">
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

export function PlanWizard({ categories }: { categories: Cat[] }) {
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [flat, setFlat] = useState<FlatStatusId | null>(null);
  const [size, setSize] = useState("");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [custom, setCustom] = useState<{ name: string; count: number }[]>([]);
  const [customName, setCustomName] = useState("");
  const [customCount, setCustomCount] = useState(1);
  const [addons, setAddons] = useState<Record<string, string[]>>({});
  const [pkg, setPkg] = useState<PackageId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const category = categories.find((c) => c.id === categoryId) ?? null;
  const presets = useMemo(() => roomPresetsFor(category), [category]);

  const rooms = useMemo(() => {
    const fromPresets = presets.map((p) => ({ name: p.name, count: counts[p.name] ?? 0 })).filter((r) => r.count > 0);
    return [...fromPresets, ...custom.filter((c) => c.count > 0)];
  }, [presets, counts, custom]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<DetailsIn, unknown, DetailsOut>({
    resolver: zodResolver(detailsSchema),
    defaultValues: { name: "", phone: "", email: "", note: "", website: "" },
  });

  function go(to: number) {
    setDir(to > step ? 1 : -1);
    setError(null);
    setStep(to);
  }

  function next() {
    if (step === 0 && !category) return setError("Please choose where you need the design.");
    if (step === 1) {
      if (!flat) return setError("Select your flat status.");
      if (rooms.length === 0) return setError("Add at least one room.");
    }
    if (step === 3 && !pkg) return setError("Pick a package to continue.");
    go(step + 1);
  }

  function addCustom() {
    const name = customName.trim();
    if (name.length < 2) return setError("Give the space a name, e.g. “Prayer room”.");
    if (custom.some((c) => c.name.toLowerCase() === name.toLowerCase()) || presets.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      return setError("That room is already in the list — change its count instead.");
    }
    setError(null);
    setCustom((c) => [...c, { name, count: customCount }]);
    setCustomName("");
    setCustomCount(1);
  }

  const toggleAddon = (room: string, item: string) =>
    setAddons((a) => {
      const cur = a[room] ?? [];
      return { ...a, [room]: cur.includes(item) ? cur.filter((x) => x !== item) : [...cur, item] };
    });

  const addonPayload = rooms.map((r) => ({ room: r.name, items: addons[r.name] ?? [] })).filter((a) => a.items.length > 0);
  const pkgName = PACKAGES.find((p) => p.id === pkg)?.name ?? "";
  const flatLabel = FLAT_STATUSES.find((f) => f.id === flat)?.label ?? "";

  async function submit(d: DetailsOut) {
    if (!category || !flat || !pkg) return;
    try {
      const sizeNum = Number(size.replace(/[^\d]/g, ""));
      const res = await fetch("/api/estimates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          space_kind: category.name,
          flat_status: flat,
          size_sqft: sizeNum > 0 ? sizeNum : null,
          rooms,
          addons: addonPayload,
          package: pkg,
          ...d,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "We couldn’t send your plan.");
      go(5);
    } catch (e) {
      toast({ title: "Not sent", description: (e as Error).message, tone: "error" });
    }
  }

  const summaryText = `Hi ARCHIARTIX, I just made a plan on your website.\nSpace: ${category?.name}\nStatus: ${flatLabel}${size ? `\nSize: ${size} sqft` : ""}\nRooms: ${rooms.map((r) => `${r.count} × ${r.name}`).join(", ")}\nPackage: ${pkgName}`;

  return (
    <section id="plan" className="bg-brand-cream py-16 sm:py-20" aria-labelledby="plan-title">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-700">
            <span className="h-px w-8 bg-ink" aria-hidden /> Make your plan <span className="h-px w-8 bg-ink" aria-hidden />
          </p>
          <h2 id="plan-title" className="text-3xl leading-tight sm:text-5xl">
            Get your estimate for <RotatingWord />
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-neutral-600">Answer a few quick questions — it takes about a minute. We’ll prepare a plan and call you.</p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl border border-line bg-white shadow-xl">
          {/* horizontal stepper */}
          {step < 5 && (
            <ol className="flex overflow-x-auto border-b border-line px-2 py-5 sm:px-6" aria-label="Progress">
              {STEPS.map((label, i) => {
                const done = i < step;
                const current = i === step;
                return (
                  <li key={label} className="flex min-w-[92px] flex-1 items-center">
                    <button
                      type="button"
                      onClick={() => done && go(i)}
                      disabled={!done}
                      aria-current={current ? "step" : undefined}
                      className="group flex flex-1 flex-col items-center gap-2 disabled:cursor-default"
                    >
                      <span className={cn("grid h-9 w-9 place-items-center rounded-full border-2 text-sm font-bold transition-colors", done ? "border-ink bg-ink text-brand-yellow" : current ? "border-ink bg-brand-yellow" : "border-neutral-300 text-neutral-400")}>
                        {done ? <Check size={16} /> : i + 1}
                      </span>
                      <span className={cn("whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.12em] sm:text-[11px]", current ? "text-ink" : "text-neutral-400")}>{label}</span>
                    </button>
                    {i < STEPS.length - 1 && <span className={cn("mb-6 h-0.5 w-full min-w-4 flex-1 transition-colors", done ? "bg-ink" : "bg-neutral-200")} aria-hidden />}
                  </li>
                );
              })}
            </ol>
          )}

          <div className="relative min-h-[380px] overflow-hidden p-6 sm:p-10">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                initial={{ opacity: 0, x: 40 * dir }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 * dir }}
                transition={{ duration: 0.28 }}
              >
                {step === 0 && (
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl">Welcome! Where do you need the design?</h3>
                    <p className="mt-2 text-sm text-neutral-600">Choose the kind of space.</p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="radiogroup" aria-label="Type of space">
                      {categories.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          role="radio"
                          aria-checked={categoryId === c.id}
                          onClick={() => { setCategoryId(c.id); setError(null); }}
                          className={cn("group relative border-2 p-6 text-left transition-all", categoryId === c.id ? "border-ink bg-brand-yellow" : "border-line hover:-translate-y-0.5 hover:border-ink hover:shadow-lg")}
                        >
                          <span className="font-serif text-xl">{c.name}</span>
                          {categoryId === c.id && <CircleCheck size={20} className="absolute right-4 top-4" aria-hidden />}
                        </button>
                      ))}
                      {categories.length === 0 && <p className="text-sm text-neutral-500">No categories yet — add some in the database.</p>}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl">Size &amp; rooms</h3>
                      <p className="mt-2 text-sm text-neutral-600">Tell us about the space.</p>
                    </div>
                    <fieldset>
                      <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-700">Flat status</legend>
                      <div className="grid gap-3 sm:grid-cols-3" role="radiogroup">
                        {FLAT_STATUSES.map((f) => (
                          <button key={f.id} type="button" role="radio" aria-checked={flat === f.id} onClick={() => { setFlat(f.id); setError(null); }}
                            className={cn("border-2 p-4 text-left transition-colors", flat === f.id ? "border-ink bg-brand-yellow" : "border-line hover:border-ink")}>
                            <span className="block font-semibold">{f.label}</span>
                            <span className="text-xs text-neutral-600">{f.hint}</span>
                          </button>
                        ))}
                      </div>
                    </fieldset>
                    <Field label="Approximate size (sq ft)" htmlFor="plan-size" hint="Optional">
                      <Input id="plan-size" inputMode="numeric" placeholder="e.g. 1450" value={size} onChange={(e) => setSize(e.target.value.replace(/[^\d]/g, "").slice(0, 7))} className="max-w-xs" />
                    </Field>
                    <fieldset>
                      <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-700">Rooms</legend>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {presets.map((p) => (
                          <Counter key={p.name} label={p.name} value={counts[p.name] ?? 0} onChange={(n) => { setCounts((c) => ({ ...c, [p.name]: n })); setError(null); }} />
                        ))}
                        {custom.map((c) => (
                          <div key={c.name} className="flex items-stretch gap-2">
                            <div className="flex-1"><Counter label={c.name} value={c.count} onChange={(n) => setCustom((list) => list.map((x) => (x.name === c.name ? { ...x, count: n } : x)))} /></div>
                            <button type="button" onClick={() => setCustom((list) => list.filter((x) => x.name !== c.name))} aria-label={`Remove ${c.name}`} className="grid w-10 place-items-center border border-line text-neutral-500 hover:border-red-600 hover:text-red-600"><X size={16} /></button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 flex flex-wrap items-end gap-3 border border-dashed border-neutral-300 p-4">
                        <Field label="Add another space" htmlFor="plan-custom" className="min-w-[200px] flex-1">
                          <Input id="plan-custom" placeholder="e.g. Prayer room, Study, Store room" value={customName} onChange={(e) => setCustomName(e.target.value.slice(0, 40))} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }} />
                        </Field>
                        <div className="flex items-center gap-2" role="group" aria-label="Count">
                          <button type="button" onClick={() => setCustomCount((n) => Math.max(1, n - 1))} aria-label="Decrease" className="grid h-12 w-10 place-items-center border border-ink hover:bg-ink hover:text-white"><Minus size={16} /></button>
                          <span className="w-6 text-center font-bold tabular-nums">{customCount}</span>
                          <button type="button" onClick={() => setCustomCount((n) => Math.min(30, n + 1))} aria-label="Increase" className="grid h-12 w-10 place-items-center border border-ink bg-brand-yellow hover:bg-ink hover:text-brand-yellow"><Plus size={16} /></button>
                        </div>
                        <Button variant="dark" onClick={addCustom}><Plus size={16} /> Add</Button>
                      </div>
                    </fieldset>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl">Add-ons</h3>
                      <p className="mt-2 text-sm text-neutral-600">Optional extras for the rooms you picked. Skip anything you don’t need.</p>
                    </div>
                    {rooms.map((r) => (
                      <fieldset key={r.name} className="border border-line p-5">
                        <legend className="px-2 font-semibold">{r.name}{r.count > 1 ? ` × ${r.count}` : ""}</legend>
                        <div className="mt-2 grid gap-3 sm:grid-cols-2">
                          {addonSetFor(r.name, presets).map((item) => {
                            const on = (addons[r.name] ?? []).includes(item);
                            return (
                              <label key={item} className={cn("flex cursor-pointer items-center gap-3 border p-3 text-sm transition-colors", on ? "border-ink bg-brand-yellow" : "border-line hover:border-ink")}>
                                <input type="checkbox" checked={on} onChange={() => toggleAddon(r.name, item)} className="h-4 w-4 accent-[#1b1b1b]" />
                                {item}
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>
                    ))}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl">Pick your package</h3>
                      <p className="mt-2 text-sm text-neutral-600">You can change this later — we’ll talk through it with you.</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3" role="radiogroup" aria-label="Package">
                      {PACKAGES.map((p) => (
                        <button key={p.id} type="button" role="radio" aria-checked={pkg === p.id} onClick={() => { setPkg(p.id); setError(null); }}
                          className={cn("relative flex flex-col border-2 p-6 text-left transition-all", pkg === p.id ? "border-ink bg-brand-yellow shadow-lg" : "border-line hover:-translate-y-0.5 hover:border-ink")}>
                          {"popular" in p && p.popular && <span className="absolute -top-3 left-6 inline-flex items-center gap-1 bg-ink px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-yellow"><Sparkles size={12} /> Most popular</span>}
                          <span className="font-serif text-2xl">{p.name}</span>
                          <span className="mt-1 text-sm text-neutral-700">{p.tagline}</span>
                          <ul className="mt-5 space-y-2 text-sm">
                            {p.features.map((f) => <li key={f} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0" />{f}</li>)}
                          </ul>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <form id="plan-details" onSubmit={handleSubmit(submit)} noValidate className="space-y-6">
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl">Basic details</h3>
                      <p className="mt-2 text-sm text-neutral-600">So we know who to call. {rooms.length} space type{rooms.length === 1 ? "" : "s"} · {pkgName} package · {category?.name}.</p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field label="Your name" htmlFor="plan-name" error={errors.name?.message} required>
                        <Input id="plan-name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
                      </Field>
                      <Field label="Mobile number" htmlFor="plan-phone" error={errors.phone?.message} required hint="e.g. 01712345678">
                        <Input id="plan-phone" type="tel" inputMode="tel" autoComplete="tel" aria-invalid={!!errors.phone} {...register("phone")} />
                      </Field>
                    </div>
                    <Field label="Email" htmlFor="plan-email" error={errors.email?.message} hint="Optional">
                      <Input id="plan-email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
                    </Field>
                    <Field label="Anything else we should know?" htmlFor="plan-note" error={errors.note?.message} hint="Optional">
                      <Textarea id="plan-note" rows={3} {...register("note")} />
                    </Field>
                    <div className="absolute -left-[9999px]" aria-hidden>
                      <label htmlFor="plan-website">Website</label>
                      <input id="plan-website" tabIndex={-1} autoComplete="off" {...register("website")} />
                    </div>
                  </form>
                )}

                {step === 5 && (
                  <div className="py-6 text-center" role="status">
                    <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-yellow"><CircleCheck size={40} /></span>
                    <h3 className="mt-6 font-serif text-3xl sm:text-4xl">Thank you!</h3>
                    <p className="mx-auto mt-3 max-w-md text-neutral-600">We’ve received your plan and will contact you soon.</p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                      <a href={whatsappLink(summaryText)} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center bg-[#25D366] px-7 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90">Chat on WhatsApp</a>
                      <Button variant="outline" onClick={() => { setStep(0); setDir(1); setCategoryId(null); setFlat(null); setSize(""); setCounts({}); setCustom([]); setAddons({}); setPkg(null); }}>Start another plan</Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {step < 5 && (
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line bg-neutral-50 px-6 py-5 sm:px-10">
              <div className="min-h-5 text-sm font-medium text-red-700" role="alert">{error}</div>
              <div className="ml-auto flex gap-3">
                {step > 0 && <Button variant="outline" onClick={() => go(step - 1)}><ArrowLeft size={16} /> Back</Button>}
                {step < 4 ? (
                  <Button onClick={next}>{step === 2 ? "Continue" : "Next"} <ArrowRight size={16} /></Button>
                ) : (
                  <Button type="submit" form="plan-details" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : <>Send my plan <ArrowRight size={16} /></>}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
