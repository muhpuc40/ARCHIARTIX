"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type UIState = {
  menuOpen: boolean;
  cartOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const UIContext = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const value = useMemo(
    () => ({ menuOpen, cartOpen, openMenu, closeMenu, openCart, closeCart }),
    [menuOpen, cartOpen, openMenu, closeMenu, openCart, closeCart],
  );
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}
