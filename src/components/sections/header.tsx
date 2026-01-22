"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";
import { GlassButton } from "@/components/ui/glass-button";
import { cn } from "@/lib/utils/cn";

const nav = [
  { id: "features", label: "Возможности" },
  { id: "niches", label: "Ниши" },
  { id: "demo", label: "Демо" },
  { id: "pricing", label: "Тарифы" },
  { id: "roi", label: "ROI" },
  { id: "faq", label: "FAQ" },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Header() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40">
      <div className="backdrop-blur-[var(--blur-glass)] bg-white/6 border-b border-white/10">
        <Container className="py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="text-white/90 font-semibold tracking-tight">ЮНИ</div>

            <nav className="hidden md:flex items-center gap-6">
              {nav.map((n) => (
                <button
                  key={n.id}
                  className="text-white/80 hover:text-white/95 transition"
                  onClick={() => scrollToId(n.id)}
                >
                  {n.label}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <GlassButton variant="ghost">Войти</GlassButton>
              <GlassButton variant="primary">Начать бесплатно</GlassButton>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <GlassButton variant="ghost" className="h-10 px-4" onClick={() => setOpen((v) => !v)}>
                Меню
              </GlassButton>
              <GlassButton variant="primary" className="h-10 px-4">
                Старт
              </GlassButton>
            </div>
          </div>

          <div
            className={cn(
              "md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out",
              open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0",
            )}
          >
            <div className="pt-3 pb-2 flex flex-col gap-2">
              {nav.map((n) => (
                <button
                  key={n.id}
                  className="text-left text-white/85 hover:text-white transition py-2"
                  onClick={() => {
                    setOpen(false);
                    scrollToId(n.id);
                  }}
                >
                  {n.label}
                </button>
              ))}
              <div className="pt-2 flex gap-2">
                <GlassButton variant="ghost" className="w-full">
                  Войти
                </GlassButton>
                <GlassButton variant="primary" className="w-full">
                  Начать
                </GlassButton>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
