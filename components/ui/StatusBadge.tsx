import { cn } from "@/lib/utils";
import type { EstimateStatus, InquiryStatus, OrderStatus } from "@/lib/types";

const styles: Record<string, string> = {
  pending: "border border-brand-yellow-deep bg-brand-yellow-soft text-ink",
  confirmed: "bg-brand-yellow text-ink",
  shipped: "bg-charcoal text-white",
  delivered: "bg-ink text-brand-yellow",
  cancelled: "border border-neutral-300 bg-neutral-100 text-neutral-500 line-through",
  new: "bg-brand-yellow text-ink",
  read: "border border-neutral-300 bg-white text-neutral-700",
  replied: "bg-ink text-brand-yellow",
  contacted: "border border-neutral-300 bg-white text-neutral-700",
  won: "bg-ink text-brand-yellow",
  lost: "border border-neutral-300 bg-neutral-100 text-neutral-500",
  archived: "border border-neutral-300 bg-neutral-100 text-neutral-500",
};

export function StatusBadge({ status, className }: { status: OrderStatus | InquiryStatus | EstimateStatus | string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
        styles[status] ?? styles.read,
        className,
      )}
    >
      {status}
    </span>
  );
}
