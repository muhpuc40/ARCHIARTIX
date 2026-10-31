import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { formatBDT, formatDateTime, formatOrderNo } from "@/lib/format";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { supabase } = await requireAdmin();
  const { status } = await searchParams;
  const active = ORDER_STATUSES.includes(status as OrderStatus) ? (status as OrderStatus) : undefined;

  let query = supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200);
  if (active) query = query.eq("status", active);
  const { data } = await query;
  const orders = (data ?? []) as Order[];

  const tabs: { key: string; label: string; href: string }[] = [
    { key: "", label: "All", href: "/admin/orders" },
    ...ORDER_STATUSES.map((s) => ({ key: s, label: s, href: `/admin/orders?status=${s}` })),
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-4xl">Orders</h1>
      <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.href}
            aria-current={(active ?? "") === t.key ? "page" : undefined}
            className={cn(
              "px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
              (active ?? "") === t.key ? "bg-ink text-brand-yellow" : "border border-neutral-300 bg-white hover:border-ink",
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <div className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-neutral-100 text-xs uppercase tracking-[0.1em] text-neutral-600">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Placed</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-neutral-500">No orders here yet.</td></tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3"><Link href={`/admin/orders/${o.id}`} className="font-bold hover:underline">{formatOrderNo(o.order_no)}</Link></td>
                <td className="px-4 py-3">{o.shipping_address?.name}<span className="block text-xs text-neutral-500">{o.customer_email}</span></td>
                <td className="px-4 py-3 text-neutral-600">{formatDateTime(o.created_at)}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-3 text-right font-semibold">{formatBDT(o.total_bdt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
