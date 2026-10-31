import { AlertTriangle, Banknote, Calculator, Mail, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { formatBDT, formatDateTime, formatOrderNo } from "@/lib/format";
import type { Order } from "@/lib/types";

export const metadata = { title: "Dashboard" };

type Stats = {
  products: number;
  published_products: number;
  orders: number;
  pending_orders: number;
  revenue_bdt: number;
  new_inquiries: number;
  new_estimates: number;
  low_stock: number;
};

export default async function DashboardPage() {
  const { supabase } = await requireAdmin();
  const [{ data: stats }, { data: recent }] = await Promise.all([
    supabase.rpc("admin_dashboard_stats"),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(6),
  ]);
  const s = (stats ?? {}) as Partial<Stats>;
  const orders = (recent ?? []) as Order[];

  const cards = [
    { label: "Revenue (excl. cancelled)", value: formatBDT(s.revenue_bdt ?? 0), icon: Banknote, href: "/admin/orders" },
    { label: "Orders", value: `${s.orders ?? 0}`, sub: `${s.pending_orders ?? 0} pending`, icon: ShoppingBag, href: "/admin/orders?status=pending" },
    { label: "Products", value: `${s.products ?? 0}`, sub: `${s.published_products ?? 0} published`, icon: Package, href: "/admin/products" },
    { label: "New inquiries", value: `${s.new_inquiries ?? 0}`, icon: Mail, href: "/admin/inquiries" },
    { label: "New estimates", value: `${s.new_estimates ?? 0}`, icon: Calculator, href: "/admin/estimates" },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-4xl">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-600">A quick look at the studio today.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(({ label, value, sub, icon: Icon, href }) => (
          <Link key={label} href={href} className="group border border-line bg-white p-5 transition-shadow hover:shadow-lg">
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-xs font-semibold uppercase tracking-[0.12em]">{label}</span>
              <Icon size={18} className="text-brand-yellow-deep" />
            </div>
            <p className="mt-3 font-serif text-3xl font-bold">{value}</p>
            {sub && <p className="text-xs text-neutral-500">{sub}</p>}
          </Link>
        ))}
      </div>

      {(s.low_stock ?? 0) > 0 && (
        <Link href="/admin/products?stock=low" className="flex items-center gap-3 border border-brand-yellow-deep bg-brand-yellow-soft px-5 py-4 text-sm font-semibold">
          <AlertTriangle size={18} /> {s.low_stock} published {s.low_stock === 1 ? "product is" : "products are"} low on stock (3 or fewer)
        </Link>
      )}

      <section className="border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-sans text-base font-bold">Recent orders</h2>
          <Link href="/admin/orders" className="text-xs font-semibold uppercase tracking-[0.12em] underline-offset-4 hover:underline">View all</Link>
        </div>
        {orders.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-neutral-500">No orders yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/admin/orders/${o.id}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm hover:bg-neutral-50">
                  <span>
                    <span className="font-bold">{formatOrderNo(o.order_no)}</span>
                    <span className="ml-3 text-neutral-500">{o.shipping_address?.name} · {formatDateTime(o.created_at)}</span>
                  </span>
                  <span className="flex items-center gap-4">
                    <StatusBadge status={o.status} />
                    <span className="font-semibold">{formatBDT(o.total_bdt)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
