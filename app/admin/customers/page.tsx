import { requireAdmin } from "@/lib/auth";
import { formatBDT, formatDate } from "@/lib/format";

export const metadata = { title: "Customers" };

type Customer = {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  role: string;
  created_at: string;
  order_count: number;
  total_spent: number;
};

export default async function AdminCustomersPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.rpc("admin_list_customers");
  const customers = (data ?? []) as Customer[];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-4xl">Customers</h1>
        <p className="mt-1 text-sm text-neutral-600">{customers.length} registered accounts</p>
      </header>
      <div className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-neutral-100 text-xs uppercase tracking-[0.1em] text-neutral-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-right">Orders</th>
              <th className="px-4 py-3 text-right">Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {customers.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-neutral-500">No customers yet.</td></tr>}
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 font-semibold">
                  {c.full_name ?? "—"}
                  {c.role === "admin" && <span className="ml-2 bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-yellow">Admin</span>}
                </td>
                <td className="px-4 py-3 text-neutral-600">{c.email ?? "—"}<span className="block text-xs">{c.phone ?? ""}</span></td>
                <td className="px-4 py-3 text-neutral-600">{formatDate(c.created_at)}</td>
                <td className="px-4 py-3 text-right">{Number(c.order_count)}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatBDT(Number(c.total_spent))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
