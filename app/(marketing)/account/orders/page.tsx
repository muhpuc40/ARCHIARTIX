import { PackageOpen } from "lucide-react";
import { PageHeader } from "@/components/marketing/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { requireUser } from "@/lib/auth";
import { formatBDT, formatDateTime, formatOrderNo, PAYMENT_LABELS } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/types";

export const metadata = pageMetadata({ title: "My orders", description: "Your ARCHIAETIX order history.", path: "/account/orders", noindex: true });
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const user = await requireUser("/account/orders");
  const supabase = await createClient();
  // RLS guarantees a customer can only ever read their own rows; the filter is belt-and-braces.
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const orders = (data ?? []) as Order[];

  return (
    <>
      <PageHeader title="My orders" crumbs={[{ name: "Account", href: "/account" }, { name: "Orders", href: "/account/orders" }]} compact />
      <section className="py-12 sm:py-16">
        <Container className="space-y-6">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center gap-5 border border-dashed border-neutral-300 py-24 text-center">
              <PackageOpen size={44} className="text-neutral-400" />
              <p className="font-serif text-3xl">No orders yet</p>
              <ButtonLink href="/shop">Start shopping</ButtonLink>
            </div>
          ) : (
            orders.map((o) => (
              <article key={o.id} className="border border-line">
                <header className="flex flex-wrap items-center justify-between gap-4 bg-brand-cream px-6 py-4">
                  <div>
                    <h2 className="font-sans text-lg font-bold">{formatOrderNo(o.order_no)}</h2>
                    <p className="text-xs text-neutral-600">{formatDateTime(o.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={o.status} />
                    <span className="font-serif text-xl font-bold">{formatBDT(o.total_bdt)}</span>
                  </div>
                </header>
                <ul className="divide-y divide-line px-6">
                  {o.order_items?.map((i) => (
                    <li key={i.id} className="flex justify-between gap-4 py-3 text-sm">
                      <span>{i.quantity} × {i.product_name}</span>
                      <span className="font-semibold">{formatBDT(i.unit_price_bdt * i.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <p className="border-t border-line px-6 py-4 text-xs text-neutral-600">
                  Deliver to: {o.shipping_address.name}, {o.shipping_address.address}, {o.shipping_address.city} · {o.shipping_address.phone} · {o.payment_method === "cod" ? "Cash on Delivery" : `Paid via ${PAYMENT_LABELS[o.payment_method]}`}{o.payment_ref ? ` (TrxID ${o.payment_ref})` : ""}{o.status === "pending" ? (o.payment_method === "cod" ? " · awaiting confirmation" : " · payment being verified") : ""} · delivery charge applicable
                </p>
              </article>
            ))
          )}
        </Container>
      </section>
    </>
  );
}
