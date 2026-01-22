"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
};

export function GlassButton({
  className,
  variant = "secondary",
  size = "md",
  type = "button",
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-full select-none whitespace-nowrap " +
    "transition duration-300 ease-out active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none";

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
  }[size];

  const variants: Record<Variant, string> = {
    primary:
      "bg-accent text-accent-fg shadow-glass-soft hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-white/30",
    secondary:
      "bg-[var(--glass-bg)] text-white/90 border border-white/25 backdrop-blur-[var(--blur-glass)] " +
      "hover:bg-[var(--glass-bg-strong)] hover:border-white/30",
    ghost: "bg-transparent text-white/90 hover:bg-white/10",
  };

  return <button type={type} className={cn(base, sizes, variants[variant], className)} {...props} />;
}
