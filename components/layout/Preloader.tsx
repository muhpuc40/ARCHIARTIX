"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useLockBodyScroll } from "@/lib/hooks";

const KEY = "arx-preloaded";
const listeners = new Set<() => void>();

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getSnapshot = () => {
  try {
    return window.sessionStorage.getItem(KEY) === "1";
  } catch {
    return true; // storage blocked: never trap the visitor behind a preloader
  }
};
// On the server the preloader is rendered, so first paint is covered (no content flash).
const getServerSnapshot = () => false;

function markSeen() {
  try {
    window.sessionStorage.setItem(KEY, "1");
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

/** Full-screen logo preloader — shown once per browser session. */
export function Preloader() {
  const seen = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const reduce = useReducedMotion();
  const [exiting, setExiting] = useState(false);
  const total = reduce ? 700 : 2300;

  useLockBodyScroll(!seen);

  useEffect(() => {
    if (seen) return;
    const t1 = window.setTimeout(() => setExiting(true), total);
    const t2 = window.setTimeout(markSeen, total + 700);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [seen, total]);

  if (seen) return null;

  return (
    <motion.div
      id="preloader"
      role="dialog"
      aria-modal="true"
      aria-label="Loading ARCHIAETIX"
      className="blueprint-bg fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      animate={{ clipPath: exiting ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 0% 0%)" }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <motion.div
          animate={reduce ? undefined : { scale: [1, 1.025, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/brand/logo-light.png"
            alt="ARCHIAETIX — Art Meets Architecture"
            width={1076}
            height={703}
            priority
            className="h-auto w-[min(72vw,360px)]"
          />
        </motion.div>
      </motion.div>

      <motion.span
        aria-hidden
        className="mt-8 block h-px w-[min(60vw,260px)] origin-left bg-brand-yellow"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: total / 1000 - 0.2, ease: "easeInOut" }}
      />

      <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10" aria-hidden>
        <motion.div
          className="h-full bg-brand-yellow"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: total / 1000, ease: [0.65, 0, 0.35, 1] }}
        />
      </div>
    </motion.div>
  );
}
