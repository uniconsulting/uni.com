"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";

export function Modal({
  open,
  onOpenChange,
  title,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onMouseDown={() => onOpenChange(false)}
      />
      <div className="absolute inset-0 grid place-items-center p-4">
        <GlassCard
          strength="strong"
          className={cn("w-full max-w-[680px] p-5 sm:p-6", className)}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              {title ? <div className="text-white/90 text-lg font-semibold">{title}</div> : null}
            </div>
            <GlassButton variant="ghost" className="h-9 px-3" onClick={() => onOpenChange(false)}>
              Закрыть
            </GlassButton>
          </div>

          <div className="mt-4">{children}</div>
        </GlassCard>
      </div>
    </div>,
    document.body,
  );
}
