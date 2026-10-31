"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, ShoppingBag, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUI } from "@/components/providers/UIProvider";
import { ButtonLink } from "@/components/ui/Button";
import { cartCount, useCartItems } from "@/lib/cart";
import { navItems, type NavItem } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/use-auth";

function isActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const active = isActive(pathname, item.href);
  const hasChildren = Boolean(item.children?.length);

  return (
    <li
      className="relative"
      onMouseEnter={() => hasChildren && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
      <div className="flex items-center">
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          className={cn(
            "relative px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:text-brand-yellow",
            active && "text-brand-yellow",
          )}>
          {item.label}
          {active && (
            <motion.span
              layoutId="nav-underline"
              className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-brand-yellow"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </Link>
        {hasChildren && (
          <button
            type="button"
            aria-label={`${item.label} submenu`}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="-ml-1.5 grid h-8 w-6 place-items-center text-white/80 hover:text-brand-yellow">
            <ChevronDown
              size={14}
              className={cn(
                "transition-transform duration-300",
                open && "rotate-180",
              )}
            />
          </button>
        )}
      </div>

      <AnimatePresence>
        {hasChildren && open && (
          <motion.ul
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full z-50 w-64 border-t-2 border-brand-yellow bg-charcoal-deep p-2 shadow-2xl">
            {item.children!.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  onClick={() => setOpen(false)}
                  className="group block px-4 py-3 transition-colors hover:bg-white/5">
                  <span className="block text-sm font-semibold text-white group-hover:text-brand-yellow">
                    {c.label}
                  </span>
                  {c.description && (
                    <span className="mt-0.5 block text-xs text-white/50">
                      {c.description}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { openMenu, openCart } = useUI();
  const items = useCartItems();
  const count = cartCount(items);
  const auth = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-ink/92 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md"
          : "bg-gradient-to-b from-ink/70 to-transparent",
      )}>
      <div
        className={cn(
          "mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 transition-all duration-500 sm:px-8 lg:px-10",
          scrolled ? "h-[68px]" : "h-24",
        )}>
        <Link
          href="/"
          aria-label="ARCHIARTIX — home"
          className="relative block shrink-0">
          <span
            className={cn(
              "relative block transition-all duration-500",
              scrolled
                ? "h-11 w-[67px]"
                : "h-14 w-[86px] sm:h-[64px] sm:w-[98px]",
            )}>
            <Image
              src="/brand/logo-light.png"
              alt="ARCHIARTIX — Art Meets Architecture"
              fill
              priority
              sizes="100px"
              className="object-contain object-left"
            />
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink key={item.label} item={item} pathname={pathname} />
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <ButtonLink
            href="/contact?type=quote#quote"
            size="sm"
            className="hidden xl:inline-flex">
            Get a Quote
          </ButtonLink>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
            className="relative grid h-11 w-11 place-items-center rounded-full text-white transition-colors hover:bg-white/10 hover:text-brand-yellow">
            <ShoppingBag size={21} />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand-yellow px-1 text-[10px] font-bold text-ink">
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <Link
            href={auth.signedIn ? "/account" : "/login"}
            aria-label={auth.signedIn ? "My account" : "Sign in"}
            className="hidden h-11 w-11 place-items-center rounded-full text-white transition-colors hover:bg-white/10 hover:text-brand-yellow sm:grid">
            <UserRound size={21} />
          </Link>

          <button
            type="button"
            onClick={openMenu}
            aria-label="Open menu"
            aria-haspopup="dialog"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white transition-colors hover:border-brand-yellow hover:bg-brand-yellow hover:text-ink">
            <Menu size={21} />
          </button>
        </div>
      </div>
    </header>
  );
}
