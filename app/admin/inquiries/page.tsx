import { InquiryStatusControl } from "@/components/admin/InquiryStatusControl";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import type { Inquiry } from "@/lib/types";

export const metadata = { title: "Inquiries" };

export default async function AdminInquiriesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(200);
  const items = (data ?? []) as Inquiry[];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-4xl">Inquiries</h1>
        <p className="mt-1 text-sm text-neutral-600">Messages and quote requests from the website.</p>
      </header>
      {items.length === 0 ? (
        <p className="border border-dashed border-neutral-300 py-20 text-center text-neutral-500">No inquiries yet.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((i) => (
            <li key={i.id} className="border border-line bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{i.name} <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">{i.kind === "quote" ? "Quote request" : "Contact"}</span></p>
                  <p className="text-sm text-neutral-600">
                    <a href={`mailto:${i.email}`} className="underline underline-offset-2">{i.email}</a>
                    {i.phone && <> · <a href={`tel:${i.phone}`} className="underline underline-offset-2">{i.phone}</a></>}
                    {i.service && <> · {i.service}</>}
                  </p>
                  <p className="text-xs text-neutral-500">{formatDateTime(i.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={i.status} />
                  <InquiryStatusControl id={i.id} status={i.status} />
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap border-l-4 border-brand-yellow bg-brand-cream p-4 text-sm leading-relaxed">{i.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
