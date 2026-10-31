"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  max,
  onChange,
  size = "md",
  label = "Quantity",
}: {
  value: number;
  max: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
  label?: string;
}) {
  const btn = cn(
    "grid place-items-center text-ink transition-colors hover:bg-brand-yellow disabled:opacity-35 disabled:hover:bg-transparent",
    size === "sm" ? "h-8 w-8" : "h-11 w-11",
  );
  return (
    <div
      className={cn("inline-flex items-center border border-neutral-300", size === "sm" ? "h-8" : "h-11")}
      role="group"
      aria-label={label}
    >
      <button type="button" className={btn} onClick={() => onChange(value - 1)} aria-label="Decrease quantity">
        <Minus size={size === "sm" ? 14 : 16} />
      </button>
      <output
        className={cn("select-none text-center font-semibold tabular-nums", size === "sm" ? "w-7 text-xs" : "w-10 text-sm")}
        aria-live="polite"
      >
        {value}
      </output>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus size={size === "sm" ? 14 : 16} />
      </button>
    </div>
  );
}
