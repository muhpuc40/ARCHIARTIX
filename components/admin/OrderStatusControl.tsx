"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { ORDER_TRANSITIONS, type OrderStatus } from "@/lib/types";

const labels: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirm order",
  shipped: "Mark shipped",
  delivered: "Mark delivered",
  cancelled: "Cancel order",
};

export function OrderStatusControl({ id, status }: { id: string; status: OrderStatus }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState<OrderStatus | null>(null);
  const next = ORDER_TRANSITIONS[status];

  async function move(to: OrderStatus) {
    if (to === "cancelled" && !window.confirm("Cancel this order? Stock will be returned to the shop.")) return;
    setBusy(to);
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: to }),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) {
      toast({ title: "Couldn’t update", description: json.error, tone: "error" });
      return;
    }
    toast({ title: `Order ${to}`, tone: "success" });
    router.refresh();
  }

  if (next.length === 0) return <p className="text-sm text-neutral-500">This order is {status} — no further changes.</p>;

  return (
    <div className="flex flex-wrap gap-3">
      {next.map((to) => (
        <Button key={to} size="sm" variant={to === "cancelled" ? "danger" : "primary"} disabled={busy !== null} onClick={() => move(to)}>
          {busy === to && <Loader2 size={14} className="animate-spin" />} {labels[to]}
        </Button>
      ))}
    </div>
  );
}
