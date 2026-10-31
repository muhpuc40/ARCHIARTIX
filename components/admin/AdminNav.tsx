"use client";

import { Calculator, FolderKanban, Box, GalleryHorizontal, LayoutDashboard, LogOut, Mail, Menu, MessageSquareQuote, Package, ShoppingBag, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/hero", label: "Hero images", icon: GalleryHorizontal },
  { href: "/admin/site-media", label: "Landing 3D & video", icon: Box },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/estimates", label: "Estimates", icon: Calculator },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/inquiries", label: "Inquiries", icon: Mail },
];

export function AdminNav({ name }: { name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <aside className="bg-charcoal-deep text-white lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:shrink-0">
      <div className="flex items-center justify-between px-5 py-4 lg:block lg:py-8">
        <Link href="/admin/dashboard" className="block font-serif text-2xl font-semibold tracking-[0.18em] text-white hover:text-brand-yellow">
          ARCHIAETIX
        </Link>
        <button
          type="button"
          className="p-2 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="admin-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <nav id="admin-menu" aria-label="Admin" className={cn("flex-col gap-1 px-3 pb-4 lg:flex lg:pb-0", open ? "flex" : "hidden")}>
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 border-l-4 px-4 py-3 text-sm font-semibold transition-colors",
                active ? "border-brand-yellow bg-white/10 text-brand-yellow" : "border-transparent text-white/70 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className={cn("mt-4 space-y-3 border-t border-white/10 px-6 py-5 text-xs lg:absolute lg:inset-x-0 lg:bottom-0", open ? "block" : "hidden lg:block")}>
        <p className="truncate text-white/60">Signed in as <span className="font-semibold text-white">{name}</span></p>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-brand-yellow hover:underline">View site</Link>
          <form action="/auth/signout?to=admin" method="post">
            <button type="submit" className="flex items-center gap-1.5 text-white/70 hover:text-white">
              <LogOut size={14} /> Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
