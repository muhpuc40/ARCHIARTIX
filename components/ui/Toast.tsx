"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "error";
type ToastItem = { id: number; title: string; description?: string; tone: Tone };
type ToastInput = Omit<ToastItem, "id" | "tone"> & { tone?: Tone };

const ToastContext = createContext<{ toast: (t: ToastInput) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: number) => setItems((prev) => prev.filter((t) => t.id !== id)), []);
  const toast = useCallback(
    (t: ToastInput) => {
      const id = ++counter.current;
      setItems((prev) => [...prev.slice(-3), { ...t, id, tone: t.tone ?? "default" }]);
      window.setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );
  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[90] flex flex-col items-center gap-3 px-4 sm:inset-x-auto sm:right-6 sm:items-end"
        role="region"
        aria-label="Notifications"
        aria-live="polite"
      >
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "pointer-events-auto flex w-full max-w-sm items-start gap-3 border-l-4 bg-ink p-4 text-white shadow-2xl",
                t.tone === "error" ? "border-red-500" : "border-brand-yellow",
              )}
            >
              <span className={cn("mt-0.5", t.tone === "error" ? "text-red-400" : "text-brand-yellow")}>
                {t.tone === "success" ? <CircleCheck size={18} /> : t.tone === "error" ? <CircleAlert size={18} /> : <Info size={18} />}
              </span>
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-semibold">{t.title}</p>
                {t.description && <p className="mt-0.5 text-white/70">{t.description}</p>}
              </div>
              <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss notification" className="text-white/60 hover:text-white">
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx.toast;
}
