"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export type SegOption<T extends string> = { value: T; label: string };

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: SegOption<T>[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-white/25 bg-[var(--glass-bg)] " +
          "backdrop-blur-[var(--blur-glass)] p-1 shadow-glass-soft",
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative h-10 px-4 rounded-full text-sm transition duration-300 ease-out",
              active ? "text-white" : "text-white/75 hover:text-white/90",
            )}
          >
            {active ? (
              <motion.span
                layoutId="seg-indicator"
                className="absolute inset-0 rounded-full bg-white/18 border border-white/22"
                transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              />
            ) : null}
            <span className="relative">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
