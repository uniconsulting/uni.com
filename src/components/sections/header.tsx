"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils/cn";

const nav = [
  { href: "#features", label: "Возможности" },
  { href: "#niches", label: "Ниши" },
  { href: "#demo", label: "Демо" },
  { href: "#pricing", label: "Тарифы" },
  { href: "#roi", label: "ROI" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40">
      <Container className="py-3">
        <GlassCard
          strength="strong"
          className="px-4 sm:px-5 py-3 flex items-center justify-between gap-4 rounded-full"
        >
          {/* Logo / Brand */}
          <a href="#hero" className="flex items-center gap-2">
            <div className="text-white/90 font-semibold tracking-tight">ЮНИ</div>
            <div className="hidden sm:block text-white/55 text-sm">ИИ в каждый бизнес</div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-white/75 hover:text-white/95 transition"
              >
                {n.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <GlassButton variant="secondary" className="h-11">
              Заказать звонок
            </GlassButton>
            <GlassButton variant="primary" className="h-11">
              Зарегистрироваться
            </GlassButton>
          </div>

          {/* Mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <GlassButton
              variant="ghost"
              className="h-10 px-4"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              Меню
            </GlassButton>
            <GlassButton variant="primary" className="h-10 px-4">
              Старт
            </GlassButton>
          </div>
        </GlassCard>

        {/* Mobile panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-nav"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
              className="mt-3"
            >
              <GlassCard strength="strong" className="p-4 rounded-[22px]">
                <div className="flex flex-col gap-1">
                  {nav.map((n) => (
                    <a
                      key={n.href}
                      href={n.href}
                      className={cn(
                        "py-2.5 px-3 rounded-xl text-white/80 hover:text-white transition",
                        "hover:bg-white/10",
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {n.label}
                    </a>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <GlassButton
                    variant="secondary"
                    className="w-full"
                    onClick={() => setOpen(false)}
                  >
                    Звонок
                  </GlassButton>
                  <GlassButton variant="primary" className="w-full" onClick={() => setOpen(false)}>
                    Регистрация
                  </GlassButton>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
}
