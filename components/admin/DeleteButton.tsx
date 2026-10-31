"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

export function DeleteButton({ endpoint, name, noun = "Item", redirectTo }: { endpoint: string; name: string; noun?: string; redirectTo?: string }) {
  const router = useRouter();
  const toast = useToast();
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);

  async function remove() {
    setBusy(true);
    const res = await fetch(endpoint, { method: "DELETE" });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      toast({ title: "Couldn’t delete", description: json.error, tone: "error" });
      setArmed(false);
      return;
    }
    toast({ title: `${noun} deleted`, description: name, tone: "success" });
    if (redirectTo) router.push(redirectTo);
    router.refresh();
  }

  if (!armed) {
    return (
      <button type="button" onClick={() => setArmed(true)} aria-label={`Delete ${name}`} className="p-2 text-red-700 hover:bg-red-50">
        <Trash2 size={16} />
      </button>
    );
  }
  return (
    <span className="flex items-center gap-2 text-xs">
      <button type="button" onClick={remove} disabled={busy} className="flex items-center gap-1 bg-red-700 px-3 py-1.5 font-semibold text-white disabled:opacity-60">
        {busy && <Loader2 size={12} className="animate-spin" />} Confirm
      </button>
      <button type="button" onClick={() => setArmed(false)} className="px-2 py-1.5 font-semibold text-neutral-600 hover:underline">Cancel</button>
    </span>
  );
}
