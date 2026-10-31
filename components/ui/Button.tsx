import Link from "next/link";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "dark" | "outline" | "outline-light" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-[2px] font-semibold uppercase tracking-[0.12em] transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 select-none whitespace-nowrap";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-yellow text-ink hover:bg-ink hover:text-brand-yellow active:scale-[0.98]",
  dark: "bg-ink text-white hover:bg-brand-yellow hover:text-ink active:scale-[0.98]",
  outline: "border border-ink text-ink hover:bg-ink hover:text-white active:scale-[0.98]",
  "outline-light": "border border-white/70 text-white hover:bg-white hover:text-ink active:scale-[0.98]",
  ghost: "text-ink hover:bg-black/5",
  danger: "border border-red-700 text-red-700 hover:bg-red-700 hover:text-white",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[11px]",
  md: "h-12 px-7 text-xs",
  lg: "h-14 px-9 text-xs sm:text-[13px]",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type CommonProps = { variant?: ButtonVariant; size?: ButtonSize; className?: string };

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: CommonProps & React.ComponentProps<"button">) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: CommonProps & React.ComponentProps<typeof Link>) {
  return <Link className={buttonStyles({ variant, size, className })} {...props} />;
}
