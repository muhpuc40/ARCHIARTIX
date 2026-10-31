import { EstimateStatusControl } from "@/components/admin/EstimateStatusControl";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { FLAT_STATUSES } from "@/lib/estimate";
import type { EstimateStatus } from "@/lib/types";

export const metadata = { title: "Estimates" };

type Row = {
  id: string; space_kind: string; flat_status: string; size_sqft: number | null;
  rooms: { name: string; count: number }[]; addons: { room: string; items: string[] }[];
  package: string; name: string; phone: string; email: string | null; note: string | null;
  status: EstimateStatus; created_at: string;
};

export default async function AdminEstimatesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("estimates").select("*").order("created_at", { ascending: false }).limit(200);
  const items = (data ?? []) as Row[];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-4xl">Estimates</h1>
        <p className="mt-1 text-sm text-neutral-600">Plans submitted through the “Make your plan” section.</p>
      </header>
      {items.length === 0 ? (
        <p className="border border-dashed border-neutral-300 py-20 text-center text-neutral-500">No estimate requests yet.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((e) => (
            <li key={e.id} className="border border-line bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{e.name} <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">{e.package} package</span></p>
                  <p className="text-sm text-neutral-600">
                    <a href={`tel:${e.phone}`} className="underline underline-offset-2">{e.phone}</a>
                    {e.email && <> · <a href={`mailto:${e.email}`} className="underline underline-offset-2">{e.email}</a></>}
                  </p>
                  <p className="text-xs text-neutral-500">{formatDateTime(e.created_at)}</p>
                </div>
                <div className="flex items-center gap-3"><StatusBadge status={e.status} /><EstimateStatusControl id={e.id} status={e.status} /></div>
              </div>
              <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                <div><dt className="text-neutral-500">Space</dt><dd className="font-semibold">{e.space_kind}</dd></div>
                <div><dt className="text-neutral-500">Flat status</dt><dd className="font-semibold">{FLAT_STATUSES.find((f) => f.id === e.flat_status)?.label ?? e.flat_status}{e.size_sqft ? ` · ${e.size_sqft} sq ft` : ""}</dd></div>
                <div className="sm:col-span-2"><dt className="text-neutral-500">Rooms</dt><dd className="font-semibold">{e.rooms.map((r) => `${r.count} × ${r.name}`).join(", ")}</dd></div>
                {e.addons.length > 0 && (
                  <div className="sm:col-span-2">
                    <dt className="text-neutral-500">Add-ons</dt>
                    <dd><ul className="list-disc pl-5">{e.addons.map((a) => <li key={a.room}><strong>{a.room}:</strong> {a.items.join(", ")}</li>)}</ul></dd>
                  </div>
                )}
                {e.note && <div className="sm:col-span-2"><dt className="text-neutral-500">Note</dt><dd className="border-l-4 border-brand-yellow bg-brand-cream p-3">{e.note}</dd></div>}
              </dl>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
