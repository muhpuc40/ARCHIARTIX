"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import { syncCartWithServer } from "@/lib/cart";

/** Reconciles the saved cart with the live catalogue and tells the shopper what changed. */
export function CartSync() {
  const toast = useToast();

  useEffect(() => {
    let alive = true;
    syncCartWithServer().then((report) => {
      if (!alive || !report) return;
      if (report.removed.length)
        toast({
          title: "Some items are no longer available",
          description: `Removed from your cart: ${report.removed.join(", ")}.`,
          tone: "error",
        });
      if (report.reduced.length)
        toast({ title: "Quantity adjusted to available stock", description: report.reduced.join(", ") });
      if (report.priceChanged.length)
        toast({ title: "Prices were updated", description: `Check the new price for: ${report.priceChanged.join(", ")}.` });
    });
    return () => {
      alive = false;
    };
  }, [toast]);

  return null;
}
