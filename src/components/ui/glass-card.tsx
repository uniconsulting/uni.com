import * as React from "react";
import { cn } from "@/lib/utils/cn";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  strength?: "default" | "strong";
};

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(function GlassCard(
  { className, strength = "default", ...props },
  ref,
) {
  const base =
    "rounded-[var(--radius-card)] border border-[color:var(--glass-border)] backdrop-blur-[var(--blur-glass)]";
  const fill =
    strength === "strong" ? "bg-[var(--glass-bg-strong)] shadow-glass" : "bg-[var(--glass-bg)] shadow-glass-soft";

  return <div ref={ref} className={cn(base, fill, className)} {...props} />;
});
