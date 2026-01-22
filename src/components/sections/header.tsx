"use client";

import { useEffect, useMemo, useState } from "react";

type NavItem = { label: string; href: string; chevron?: boolean };

function IconChevronDown(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className} aria-hidden="true">
      <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPhone(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className} aria-hidden="true">
      <path
        d="M22 16.9v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.62a2 2 0 0 1-.45 2.11L8.1 9.6a16 16 0 0 0 6.3 6.3l1.15-1.17a2 2 0 0 1 2.11-.45c.84.29 1.72.5 2.62.62A2 2 0 0 1 22 16.9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTelegram(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className} aria-hidden="true">
      <path
        d="M21.8 4.6 19 20.3c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.4 9.9-9c.4-.4-.1-.7-.7-.3L6.1 13.3 1.5 11.9c-1-.3-1-1 .2-1.5L20.4 3.5c.9-.4 1.6.2 1.4 1.1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMenu(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconX(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className} aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function WhaleMark() {
  // Минималистичная “иконка” (пока без внешних ассетов), в духе знака.
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-10 w-10">
      <path
        d="M10 27c2.5 7.5 10.5 12 19 9 4.5-1.6 7.7-5 9.5-8.7.7-1.4-.8-2.8-2.2-2.1-2.8 1.3-6.6 2-10.6 1.4-6.2-.9-11.3-3.8-13.7-7.2-.7-1-2.3-.9-2.8.2-.8 1.7-.7 4.1.8 7.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M34.5 18.5c.6-2.8 2.2-5.2 4.6-6.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="27.5" cy="22.2" r="1.2" fill="currentColor" />
    </svg>
  );
}

export default function Header() {
  const nav: NavItem[] = useMemo(
    () => [
      { label: "Продукт", href: "#product", chevron: true },
      { label: "Стоимость", href: "#pricing" },
      { label: "Обновления", href: "#updates" },
      { label: "О нас", href: "#about" },
    ],
    []
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 pt-4 md:pt-6">
      <div className="mx-auto max-w-[1240px] px-4">
        <div className="glass rounded-full">
          <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
            {/* Left */}
            <a href="/" className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white/55 text-[#121212] ring-1 ring-white/50">
                <WhaleMark />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[15px] font-semibold tracking-tight text-[#121212]">
                  ЮНИ.ai
                </span>
                <span className="hidden text-[11px] text-[#667085] sm:block">
                  Системы для SMB с ИИ японского качества
                </span>
              </span>
            </a>

            {/* Center nav (desktop) */}
            <nav className="hidden items-center gap-1 md:flex">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="group inline-flex items-center gap-1 rounded-full px-4 py-2 text-[13px] font-medium text-[#121212]/80 transition hover:bg-white/45 hover:text-[#121212] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c73f40]/40"
                >
                  <span>{item.label}</span>
                  {item.chevron ? (
                    <IconChevronDown className="h-4 w-4 text-[#121212]/55 transition group-hover:text-[#121212]/80" />
                  ) : null}
                </a>
              ))}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* round icons (desktop) */}
              <div className="hidden items-center gap-2 md:flex">
                <a
                  href="tel:+79995555555"
                  aria-label="Позвонить"
                  className="glass-soft grid h-10 w-10 place-items-center rounded-full text-[#121212]/80 transition hover:bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c73f40]/40"
                >
                  <IconPhone className="h-5 w-5" />
                </a>
                <a
                  href="https://t.me/uni_consultant"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Telegram"
                  className="glass-soft grid h-10 w-10 place-items-center rounded-full text-[#121212]/80 transition hover:bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c73f40]/40"
                >
                  <IconTelegram className="h-5 w-5" />
                </a>
              </div>

              {/* buttons (desktop) */}
              <div className="hidden items-center gap-2 md:flex">
                <a
                  href="https://uni-ai.online/register"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[#c73f40] bg-white/35 px-4 text-[13px] font-semibold text-[#c73f40] transition hover:bg-[rgba(199,63,64,0.10)] active:bg-[rgba(199,63,64,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c73f40]/40"
                >
                  Войти
                </a>
                <a
                  href="https://uni-ai.online/"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-[#c73f40] px-5 text-[13px] font-semibold text-white shadow-[0_10px_30px_rgba(199,63,64,0.22)] transition hover:bg-[#b43738] active:bg-[#9f2f30] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/55"
                >
                  Начать бесплатно
                </a>
              </div>

              {/* mobile: primary + burger */}
              <div className="flex items-center gap-2 md:hidden">
                <a
                  href="https://uni-ai.online/"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-[#c73f40] px-4 text-[13px] font-semibold text-white shadow-[0_10px_30px_rgba(199,63,64,0.22)] transition hover:bg-[#b43738] active:bg-[#9f2f30] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/55"
                >
                  Старт
                </a>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  aria-label="Открыть меню"
                  className="glass-soft grid h-10 w-10 place-items-center rounded-full text-[#121212]/85 transition hover:bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c73f40]/40"
                >
                  <IconMenu className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {open ? (
          <div className="md:hidden">
            <div
              className="fixed inset-0 z-50 bg-black/35"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <div className="fixed left-0 right-0 top-4 z-50 px-4">
              <div className="glass rounded-[28px] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white/55 text-[#121212] ring-1 ring-white/50">
                      <WhaleMark />
                    </span>
                    <div className="leading-tight">
                      <div className="text-[14px] font-semibold text-[#121212]">ЮНИ.ai</div>
                      <div className="text-[11px] text-[#667085]">Системы для SMB с ИИ японского качества</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Закрыть меню"
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/40 text-[#121212]/85 transition hover:bg-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c73f40]/40"
                  >
                    <IconX className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4 space-y-1">
                  {nav.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-[18px] bg-white/35 px-4 py-3 text-[14px] font-semibold text-[#121212] transition hover:bg-white/55"
                    >
                      <span>{item.label}</span>
                      {item.chevron ? <IconChevronDown className="h-4 w-4 text-[#121212]/60" /> : null}
                    </a>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <a
                    href="https://uni-ai.online/register"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[#c73f40] bg-white/35 text-[13px] font-semibold text-[#c73f40] transition hover:bg-[rgba(199,63,64,0.10)]"
                  >
                    Войти
                  </a>
                  <a
                    href="https://uni-ai.online/"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[#c73f40] text-[13px] font-semibold text-white transition hover:bg-[#b43738] active:bg-[#9f2f30]"
                  >
                    Начать бесплатно
                  </a>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <a
                    href="tel:+79995555555"
                    className="glass-soft flex h-11 flex-1 items-center justify-center gap-2 rounded-full text-[13px] font-semibold text-[#121212]/85 transition hover:bg-white/70"
                  >
                    <IconPhone className="h-5 w-5" />
                    Позвонить
                  </a>
                  <a
                    href="https://t.me/uni_consultant"
                    target="_blank"
                    rel="noreferrer"
                    className="glass-soft flex h-11 flex-1 items-center justify-center gap-2 rounded-full text-[13px] font-semibold text-[#121212]/85 transition hover:bg-white/70"
                  >
                    <IconTelegram className="h-5 w-5" />
                    Telegram
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
