"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, CircleCheck, Copy, Loader2, Lock, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { SmartImage } from "@/components/ui/SmartImage";
import { useToast } from "@/components/ui/Toast";
import { cart, cartTotal, useCartItems } from "@/lib/cart";
import { formatBDT, formatOrderNo } from "@/lib/format";
import { siteConfig, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  BD_DISTRICTS,
  checkPaymentFields,
  paymentFields,
  shippingSchema,
} from "@/lib/validators";
import { z } from "zod";

const checkoutSchema = shippingSchema
  .extend(paymentFields)
  .superRefine(checkPaymentFields);
type FormValues = z.input<typeof checkoutSchema>;
type Output = z.output<typeof checkoutSchema>;

const METHODS = [
  {
    id: "bkash",
    label: "BKASH",
    name: "bKash",
    color: "#E2136E",
    number: siteConfig.payments.bkash,
  },
  {
    id: "nagad",
    label: "NAGAD",
    name: "Nagad",
    color: "#F6921E",
    number: siteConfig.payments.nagad,
  },
  {
    id: "cod",
    label: "CASH ON DELIVERY",
    name: "Cash on Delivery",
    color: "#1B1B1B",
    number: "",
  },
] as const;

function CopyNumber({ number }: { number: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(number).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        });
      }}
      className="inline-flex items-center gap-1.5 border border-ink/30 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-ink hover:text-white">
      {copied ? <Check size={14} /> : <Copy size={14} />}{" "}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function CheckoutForm({
  defaultName = "",
  defaultPhone = "",
  backendReady,
}: {
  defaultName?: string;
  defaultPhone?: string;
  backendReady: boolean;
}) {
  const items = useCartItems();
  const toast = useToast();
  const router = useRouter();
  const [placed, setPlaced] = useState<{
    order_no: number;
    total_bdt: number;
    method: string;
  } | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues, unknown, Output>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: defaultName,
      phone: defaultPhone,
      address: "",
      city: "",
      note: "",
      method: "bkash",
      sender: defaultPhone,
      trx_id: "",
    },
  });
  const method = useWatch({ control, name: "method" });
  const selected = METHODS.find((m) => m.id === method) ?? METHODS[0];

  async function onSubmit({ method, sender, trx_id, ...shipping }: Output) {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((l) => ({
            product_id: l.productId,
            quantity: l.qty,
          })),
          shipping,
          payment:
            method === "cod"
              ? { method, sender: "", trx_id: "" }
              : { method, sender, trx_id },
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) router.push("/login?next=/checkout");
        throw new Error(json.error ?? "We couldn't place your order.");
      }
      cart.clear();
      setPlaced({ ...json.order, method });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      toast({
        title: "Order not placed",
        description: (e as Error).message,
        tone: "error",
      });
    }
  }

  if (placed) {
    return (
      <div
        className="mx-auto max-w-xl border border-line bg-brand-cream p-10 text-center"
        role="status">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-yellow">
          <CircleCheck size={40} />
        </span>
        <h2 className="mt-6 font-serif text-4xl">Order placed!</h2>
        <p className="mt-3 text-lg">
          Your order number is <strong>{formatOrderNo(placed.order_no)}</strong>{" "}
          · {formatBDT(placed.total_bdt)}
        </p>
        <p className="mt-3 text-neutral-600">
          {placed.method === "cod"
            ? "Thank you! We’ll call you shortly to confirm delivery. Please keep the cash ready — the delivery charge is added on delivery."
            : "Thank you! We’ll verify your payment and call you shortly to confirm delivery. The delivery charge is confirmed on that call."}{" "}
          You can track the status in your orders.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/account/orders">View my orders</ButtonLink>
          <ButtonLink href="/shop" variant="outline">
            Keep shopping
          </ButtonLink>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 border border-dashed border-neutral-300 py-20 text-center">
        <p className="font-serif text-3xl">Your cart is empty</p>
        <ButtonLink href="/shop">Browse the shop</ButtonLink>
      </div>
    );
  }

  const waText = `Hi ARCHIARTIX, I'd like to order:\n${items.map((l) => `• ${l.qty} × ${l.name} — ${formatBDT(l.price * l.qty)}`).join("\n")}\nTotal: ${formatBDT(cartTotal(items))}`;

  return (
    <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
      {backendReady ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-8"
          aria-label="Checkout">
          <fieldset className="space-y-6">
            <legend className="mb-2 font-serif text-2xl">
              Delivery details
            </legend>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field
                label="Recipient name"
                htmlFor="co-name"
                error={errors.name?.message}
                required>
                <Input
                  id="co-name"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
              </Field>
              <Field
                label="Mobile number"
                htmlFor="co-phone"
                error={errors.phone?.message}
                required
                hint="e.g. 01712345678">
                <Input
                  id="co-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-invalid={!!errors.phone}
                  {...register("phone")}
                />
              </Field>
            </div>
            <Field
              label="Full address"
              htmlFor="co-address"
              error={errors.address?.message}
              required>
              <Input
                id="co-address"
                autoComplete="street-address"
                placeholder="House, road, area"
                aria-invalid={!!errors.address}
                {...register("address")}
              />
            </Field>
            <Field
              label="District"
              htmlFor="co-city"
              error={errors.city?.message}
              required>
              <Select
                id="co-city"
                aria-invalid={!!errors.city}
                {...register("city")}>
                <option value="">Select district…</option>
                {BD_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </Field>
            <Field
              label="Delivery note"
              htmlFor="co-note"
              error={errors.note?.message}
              hint="Optional — landmarks, preferred time">
              <Textarea id="co-note" rows={3} {...register("note")} />
            </Field>
          </fieldset>

          <fieldset className="space-y-5">
            <legend className="mb-2 font-serif text-2xl">Payment</legend>
            <div
              className="grid gap-3 sm:grid-cols-3"
              role="radiogroup"
              aria-label="Payment method">
              {METHODS.map((m) => (
                <label
                  key={m.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 border-2 p-4 transition-colors",
                    method === m.id
                      ? "border-ink bg-brand-cream"
                      : "border-line hover:border-neutral-400",
                  )}>
                  <input
                    type="radio"
                    value={m.id}
                    className="sr-only"
                    {...register("method")}
                  />
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-md text-sm font-bold text-white"
                    style={{ background: m.color }}
                    aria-hidden>
                    {m.id === "cod" ? "৳" : m.label[0]}
                  </span>
                  <span className="text-sm font-bold leading-tight tracking-wide">
                    {m.label}
                  </span>
                  {method === m.id && (
                    <CircleCheck
                      size={18}
                      className="ml-auto shrink-0"
                      aria-hidden
                    />
                  )}
                </label>
              ))}
            </div>
            {errors.method && (
              <p role="alert" className="text-xs font-medium text-red-700">
                {errors.method.message}
              </p>
            )}

            <p className="flex items-start gap-2 bg-brand-yellow/25 px-4 py-3 text-sm font-medium">
              <Truck size={18} className="mt-0.5 shrink-0" aria-hidden />
              <span>
                <strong>Delivery charge applicable.</strong> It depends on your
                district and is not included in the total above — we confirm the
                exact amount by phone before dispatch.
              </span>
            </p>

            {method === "cod" ? (
              <div className="space-y-2 border-l-4 border-ink bg-neutral-50 p-5 text-sm text-neutral-700">
                <p className="font-semibold text-ink">Cash on Delivery</p>
                <p>
                  Pay <strong>{formatBDT(cartTotal(items))}</strong> plus the
                  delivery charge in cash when your order arrives. Nothing to
                  pay now — we’ll call to confirm your order first.
                </p>
              </div>
            ) : (
              <>
                <div
                  className="space-y-3 border-l-4 bg-neutral-50 p-5 text-sm"
                  style={{ borderColor: selected.color }}>
                  <p className="font-semibold">
                    How to pay with {selected.name}
                  </p>
                  <ol className="list-decimal space-y-1 pl-5 text-neutral-700">
                    <li>
                      Open the {selected.name} app and choose{" "}
                      <strong>Send Money</strong>.
                    </li>
                    <li>
                      Send <strong>{formatBDT(cartTotal(items))}</strong> to
                      this personal number:
                      <span className="mt-2 flex flex-wrap items-center gap-3">
                        <strong className="font-mono text-lg tracking-wide">
                          {selected.number}
                        </strong>
                        <CopyNumber number={selected.number} />
                      </span>
                    </li>
                    <li>
                      Copy the <strong>Transaction ID (TrxID)</strong> from the
                      confirmation SMS and enter it below.
                    </li>
                  </ol>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field
                    label={`${selected.name} number you paid from`}
                    htmlFor="co-sender"
                    error={errors.sender?.message}
                    required
                    hint="The account that sent the money">
                    <Input
                      id="co-sender"
                      type="tel"
                      inputMode="tel"
                      placeholder="01XXXXXXXXX"
                      aria-invalid={!!errors.sender}
                      {...register("sender")}
                    />
                  </Field>
                  <Field
                    label="Transaction ID (TrxID)"
                    htmlFor="co-trx"
                    error={errors.trx_id?.message}
                    required
                    hint="e.g. 8N7A6D5EE1">
                    <Input
                      id="co-trx"
                      autoCapitalize="characters"
                      autoComplete="off"
                      className="uppercase"
                      aria-invalid={!!errors.trx_id}
                      {...register("trx_id")}
                    />
                  </Field>
                </div>
              </>
            )}
          </fieldset>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Placing order…
              </>
            ) : (
              <>
                <Lock size={16} /> Place order · {formatBDT(cartTotal(items))}
              </>
            )}
          </Button>
        </form>
      ) : (
        <div className="space-y-5 border-t-4 border-brand-yellow bg-brand-cream p-8">
          <h2 className="font-serif text-2xl">
            Online ordering isn’t connected yet
          </h2>
          <p className="text-neutral-700">
            The store backend (Supabase) hasn’t been configured, so orders can’t
            be saved. You can still send this order to us on WhatsApp.
          </p>
          <a
            href={whatsappLink(waText)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center bg-ink px-8 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-brand-yellow hover:text-ink">
            Send order on WhatsApp
          </a>
        </div>
      )}

      <aside className="h-fit border border-line p-8 lg:sticky lg:top-28">
        <h2 className="font-sans text-xs font-bold uppercase tracking-[0.24em]">
          Your order
        </h2>
        <ul className="mt-6 divide-y divide-line">
          {items.map((l) => (
            <li key={l.productId} className="flex gap-4 py-4">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-brand-cream">
                <SmartImage
                  src={l.image}
                  alt={l.name}
                  seed={l.slug}
                  tone="light"
                  sizes="56px"
                />
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-semibold">{l.name}</p>
                <p className="text-neutral-600">Qty {l.qty}</p>
              </div>
              <p className="text-sm font-semibold">
                {formatBDT(l.price * l.qty)}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-baseline justify-between border-t border-ink/15 pt-5">
          <span className="text-sm font-semibold uppercase tracking-[0.14em]">
            Total
          </span>
          <span className="font-serif text-3xl font-bold">
            {formatBDT(cartTotal(items))}
          </span>
        </div>
        <p className="mt-3 text-xs text-neutral-600">
          <strong>Delivery charge applicable</strong> — confirmed by phone
          before dispatch.{" "}
          <Link href="/cart" className="underline">
            Edit cart
          </Link>
        </p>
      </aside>
    </div>
  );
}
