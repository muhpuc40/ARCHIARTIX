"use client";

import { useEffect, useRef } from "react";

const EDITABLE = "input, textarea, select, [contenteditable=''], [contenteditable='true']";

/**
 * Site-wide pointer polish:
 *  • a circle "ball" trails behind the normal mouse cursor (desktop / fine pointers only);
 *  • the browser right-click menu is blocked everywhere except inside text fields.
 * Touch devices keep their normal behaviour (no ball).
 */
export function CursorBall() {
  const ball = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onContext = (e: MouseEvent) => {
      if (!(e.target instanceof Element) || !e.target.closest(EDITABLE)) e.preventDefault();
    };
    document.addEventListener("contextmenu", onContext);

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const el = ball.current;
    if (!el || !fine.matches) return () => document.removeEventListener("contextmenu", onContext);

    let x = -100, y = -100, tx = -100, ty = -100;
    let visible = false, raf = 0;

    const paint = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      el.style.opacity = visible ? "1" : "0";
      raf = Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1 ? requestAnimationFrame(paint) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        x = tx;
        y = ty;
      }
      visible = true;
      kick();
    };
    const onLeave = () => { visible = false; kick(); };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ball}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-6 w-6 rounded-full border-2 border-ink bg-brand-yellow/90 opacity-0 shadow-[0_0_0_1px_rgba(255,255,255,0.7)] transition-opacity duration-200"
    />
  );
}
