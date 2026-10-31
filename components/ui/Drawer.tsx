"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useRef } from "react";
import { useFocusTrap, useLockBodyScroll } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * Accessible slide-over panel: closes via X, backdrop click and Esc; traps
 * focus; locks page scroll; restores focus on close.
 */
export function Drawer({
  open,
  onClose,
  label,
  side = "right",
  className,
  children,
  tone = "light",
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  side?: "left" | "right";
  className?: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  useLockBodyScroll(open);
  useFocusTrap(panelRef, open, onClose);

  const x = side === "right" ? "100%" : "-100%";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            key="backdrop"
            className="absolute inset-0 bg-ink/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            initial={{ x }}
            animate={{ x: 0 }}
            exit={{ x }}
            transition={{ type: "tween", duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute top-0 flex h-full w-full max-w-md flex-col outline-none",
              side === "right" ? "right-0" : "left-0",
              tone === "dark" ? "bg-charcoal-deep text-white" : "bg-white text-ink",
              className,
            )}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={`Close ${label}`}
              className={cn(
                "absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border transition-colors",
                tone === "dark"
                  ? "border-white/25 text-white hover:bg-brand-yellow hover:text-ink"
                  : "border-neutral-300 text-ink hover:bg-brand-yellow",
              )}
            >
              <X size={20} />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
