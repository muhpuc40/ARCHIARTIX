import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { OrderStatusControl } from "@/components/admin/OrderStatusControl";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { formatBDT, formatDateTime, formatOrderNo, PAYMENT_LABELS } from "@/lib/format";
import type { Order } from "@/lib/types";

export const metadata = { title: "Order" };

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();

  const { data } = await supabase.from("orders").select("*, order_items(*)").eq("id", id).maybeSingle();
  if (!data) notFound();
  const o = data as Order;
  const a = o.shipping_address;

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"><ArrowLeft size={16} /> All orders</Link>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">{formatOrderNo(o.order_no)}</h1>
          <p className="text-sm text-neutral-600">Placed {formatDateTime(o.created_at)}</p>
        </div>
        <StatusBadge status={o.status} className="text-xs" />
      </header>

      <section className="border border-line bg-white p-6">
        <h2 className="mb-4 font-sans text-sm font-bold uppercase tracking-[0.12em]">Update status</h2>
        <OrderStatusControl id={o.id} status={o.status} />
      </section>

      <section className="border-l-4 border-brand-yellow bg-white p-6 text-sm">
        <h2 className="mb-3 font-sans text-sm font-bold uppercase tracking-[0.12em]">Payment to verify</h2>
        <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-4">
          <div><dt className="text-neutral-500">Method</dt><dd className="font-semibold">{PAYMENT_LABELS[o.payment_method]}</dd></div>
          <div><dt className="text-neutral-500">Paid from</dt><dd className="font-semibold">{o.payment_sender ?? "—"}</dd></div>
          <div><dt className="text-neutral-500">Transaction ID</dt><dd className="font-mono font-semibold">{o.payment_ref ?? "—"}</dd></div>
          <div><dt className="text-neutral-500">Amount due</dt><dd className="font-semibold">{formatBDT(o.total_bdt)}</dd></div>
        </dl>
        <p className="mt-3 text-xs text-neutral-500">Check the TrxID and amount in your bKash/Nagad app, then press “Confirm order”.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="border border-line bg-white">
          <h2 className="border-b border-line px-6 py-4 font-sans text-sm font-bold uppercase tracking-[0.12em]">Items</h2>
          <ul className="divide-y divide-line px-6">
            {o.order_items?.map((i) => (
              <li key={i.id} className="flex justify-between gap-4 py-3 text-sm">
                <span>{i.quantity} × {i.product_name} <span className="text-neutral-500">@ {formatBDT(i.unit_price_bdt)}</span></span>
                <span className="font-semibold">{formatBDT(i.unit_price_bdt * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="flex justify-between border-t border-line px-6 py-4 font-bold">
            <span>Total</span><span className="font-serif text-xl">{formatBDT(o.total_bdt)}</span>
          </p>
        </section>

        <section className="space-y-1 self-start border border-line bg-white p-6 text-sm">
          <h2 className="mb-3 font-sans text-sm font-bold uppercase tracking-[0.12em]">Deliver to</h2>
          <p className="font-semibold">{a.name}</p>
          <p><a href={`tel:${a.phone}`} className="underline underline-offset-2">{a.phone}</a></p>
          {o.customer_email && <p className="break-all text-neutral-600">{o.customer_email}</p>}
          <p className="pt-2">{a.address}</p>
          <p>{a.city}</p>
          {a.note && <p className="mt-3 border-l-4 border-brand-yellow bg-brand-cream p-3 text-neutral-700">{a.note}</p>}
        </section>
      </div>
    </div>
  );
}
