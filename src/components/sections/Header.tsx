"use client";

import React, { useEffect, useMemo, useState } from "react";
import { PhoneIcon } from "@/components/icons";
import { LIQUID_ICON_ANIM } from "@/styles/liquid";

type NavItem = { label: string; href: string; chevron?: boolean };

const NAV: NavItem[] = [
  { label: "Продукт", href: "#product", chevron: true },
  { label: "Стоимость", href: "#pricing" },
  { label: "Обновления", href: "#updates" },
  { label: "О нас", href: "#about" },
];

const LINKS = {
  login: "https://uni-ai.online/register",
  start: "https://uni-ai.online/",
  telegram: "https://t.me/uniconsulting",
};

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M5.5 7.75L10 12.25L14.5 7.75"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
  
function TelegramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="2 1 28 28" fill="none" {...props}>
      <g transform="translate(-1.6 0)">
        <path
          d="M21.7 3.9L2.9 11.2c-.9.4-.9 1.6.1 1.9l4.7 1.5 1.8 5.7c.3.9 1.4 1.1 2 .4l2.6-3.2 5 3.7c.8.6 2 .1 2.2-.9l3.2-15.6c.2-1.1-.9-2-2-1.6Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M7.7 14.7l13-8.3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}

function BurgerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M5 7h14M5 12h14M5 17h14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CallModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [agree, setAgree] = useState(true);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onMouseDown={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/35 backdrop-blur-[6px]" />

      <div
        className="relative w-full max-w-[560px] rounded-[28px] border border-white/40 bg-white/70 p-5 text-[#121212] shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-[22px]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* дальше оставь твой текущий JSX модалки без изменений */}
      </div>
    </div>
  );
}

export default function Header() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);

  const nav = useMemo(() => NAV, []);

  return (
    <>
      <header className="sticky top-4 z-50">
        <div className="mx-auto max-w-[1400px] px-4">
          <div className="rounded-[999px] border border-white/40 bg-white/15 p-3 shadow-[0_12px_36px_rgba(0,0,0,0.05)] backdrop-blur-[24px]">
            <div className="flex items-center justify-between gap-3">
              {/* Left */}
              <a href="#top" className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/45 bg-white/18 shadow-[0_10px_30px_rgba(0,0,0,0.05)] backdrop-blur-[18px]">
                  <img
                    src="brand/logo.svg"
                    alt="ЮНИ.ai"
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>

                <div className="leading-tight">
                  <div className="text-[14px] font-semibold text-white">
                    ЮНИ.ai
                  </div>
                  <div className="text-[11px] text-white/80">
                    Системы для SMB с ИИ японского качества
                  </div>
                </div>
              </a>

              {/* Center */}
              <nav className="hidden md:flex items-center gap-6 text-[13px] font-semibold text-white/90">
                {nav.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="group nav-link-slow inline-flex items-center gap-1 rounded-full px-2 py-1"
                  >
                    <span className="relative">
                      {item.label}
                      <span className="absolute -bottom-[6px] left-0 h-[1px] w-0 bg-white/60 transition-all group-hover:w-full" />
                    </span>
                    {item.chevron ? (
                      <ChevronDown className="h-4 w-4 opacity-80 block translate-y-[2px]" />
                    ) : null}
                  </a>
                ))}
              </nav>

              {/* Right */}
              <div className="hidden md:flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCallOpen(true)}
                  justify-center
                  className="liquid-icon-btn grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-white/16 text-white shadow-[0_10px_28px_rgba(0,0,0,0.03)] backdrop-blur-[18px] ${LIQUID_ICON_ANIM}`"
                  aria-label="Заказать звонок"
                  title="Заказать звонок"
                >
                  <PhoneIcon className="h-6 w-6" />
                </button>

                <a
                  href={LINKS.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="liquid-icon-btn grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-white/16 text-white shadow-[0_10px_28px_rgba(0,0,0,0.03)] backdrop-blur-[18px] ${LIQUID_ICON_ANIM}`"
                  aria-label="Telegram"
                  title="Telegram"
                >
                  <TelegramIcon className="h-6 w-6" />
                </a>

                <a
                  href={LINKS.login}
                  className="lg-border inline-flex btn-login-slow h-10 place-items-center rounded-full border border-[#c73f40] bg-white/0 px-4 text-[13px] font-semibold text-[#c73f40]"
                >
                  Войти
                </a>

                <a
                  href={LINKS.start}
                  className="lg-border inline-flex btn-primary-slow h-10 place-items-center rounded-full bg-[#c73f40] px-4 text-[13px] font-semibold text-white shadow-[0_16px_42px_rgba(199,63,64,0.05)]"
                >
                  Начать бесплатно
                </a>
              </div>

              {/* Mobile */}
              <div className="md:hidden flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCallOpen(true)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-white/16 text-white backdrop-blur-[18px]"
                  aria-label="Заказать звонок"
                >
                  <PhoneIcon className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-white/16 text-white backdrop-blur-[18px]"
                  aria-label="Открыть меню"
                >
                  <BurgerIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen ? (
          <div
            className="fixed inset-0 z-[90]"
            onMouseDown={() => setMobileOpen(false)}
          >
            <div className="absolute inset-0 bg-black/35 backdrop-blur-[6px]" />
            <div
              className="absolute right-3 top-3 w-[min(92vw,420px)] rounded-[28px] border border-white/40 bg-white/18 p-4 text-white shadow-[0_12px_36px_rgba(0,0,0,0.05)] backdrop-blur-[26px]"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="text-[14px] font-semibold">Меню</div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/35 bg-white/10"
                  aria-label="Закрыть меню"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-3 grid gap-1">
                {nav.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-[16px] border border-white/25 bg-white/10 px-4 py-3 text-[14px] hover:bg-white/14"
                  >
                    <span>{item.label}</span>
                    {item.chevron ? (
                      <ChevronDown className="h-5 w-5 opacity-80" />
                    ) : (
                      <span className="opacity-70">→</span>
                    )}
                  </a>
                ))}
              </div>

              <div className="mt-4 grid gap-2">
                <a
                  href={LINKS.login}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[#c73f40] bg-white/0 px-4 text-[14px] font-semibold text-[#c73f40] hover:bg-[#c73f40]/10"
                >
                  Войти
                </a>
                <a
                  href={LINKS.start}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#c73f40] px-4 text-[14px] font-semibold text-white shadow-[0_16px_42px_rgba(199,63,64,0.05)] hover:bg-[#b43738] active:bg-[#9f2f30]"
                >
                  Начать бесплатно
                </a>

                <a
                  href={LINKS.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-3 text-[13px]"
                >
                  <TelegramIcon className="h-5 w-5" />
                  t.me/uniconsulting
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <CallModal open={callOpen} onClose={() => setCallOpen(false)} />
    </>
  );
}
