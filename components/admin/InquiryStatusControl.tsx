"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import type { InquiryStatus } from "@/lib/types";

const OPTIONS: InquiryStatus[] = ["new", "read", "replied", "archived"];

export function InquiryStatusControl({ id, status }: { id: string; status: InquiryStatus }) {
  const router = useRouter();
  const toast = useToast();
  const [value, setValue] = useState(status);
  const [busy, setBusy] = useState(false);

  async function change(next: InquiryStatus) {
    const prev = value;
    setValue(next);
    setBusy(true);
    const res = await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    if (!res.ok) {
      setValue(prev);
      toast({ title: "Couldn’t update", tone: "error" });
      return;
    }
    router.refresh();
  }

  return (
    <select
      value={value}
      disabled={busy}
      onChange={(e) => change(e.target.value as InquiryStatus)}
      aria-label="Inquiry status"
      className="h-9 rounded-[2px] border border-neutral-300 bg-white px-2 text-xs font-semibold uppercase tracking-wider"
    >
      {OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
