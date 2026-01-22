"use client";

import React, { useEffect, useMemo, useState } from "react";

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
    <svg viewBox="0 0 20 20" fill="none" {...props}>
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

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M8.7 10.3c1.3 2.5 3.5 4.7 6 6l1.9-1.9c.3-.3.8-.4 1.2-.2 1.1.4 2.3.7 3.6.8.6.1 1 .6 1 1.2V20c0 .7-.6 1.2-1.3 1.2C11 21.2 2.8 13 2.8 2.9 2.8 2.2 3.4 1.6 4.1 1.6H7c.6 0 1.1.4 1.2 1 .1 1.2.4 2.5.8 3.6.1.4 0 .9-.3 1.2L6.9 9.2"
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
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M21.7 3.9L2.9 11.2c-.9.4-.9 1.6.1 1.9l4.7 1.5 1.8 5.7c.3.9 1.4 1.1 2 .4l2.6-3.2 5 3.7c.8.6 2 .1 2.2-.9l3.2-15.6c.2-1.1-.9-2-2-1.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.7 14.7l13-8.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BurgerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M5 7h14M5 12h14M5 17h14"
        stroke="currentColor"
        strokeWidth="1.8"
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
        strokeWidth="1.8"
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
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[18px] font-semibold leading-tight">
              Заказать звонок
            </div>
            <div className="mt-1 text-[13px] text-[#667085]">
              Оставь контакты, мы свяжемся и подскажем лучший сценарий.
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-black/10 bg-white/60 p-2 hover:bg-white/80"
            aria-label="Закрыть"
          >
            <XIcon className="h-5 w-5 text-black/70" />
          </button>
        </div>

        <form
          className="mt-4 grid grid-cols-1 gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!agree) return;

            const fd = new FormData(e.currentTarget);
            const name = String(fd.get("name") ?? "");
            const company = String(fd.get("company") ?? "");
            const phone = String(fd.get("phone") ?? "");
            const tg = String(fd.get("tg") ?? "");
            const comment = String(fd.get("comment") ?? "");

            const msg =
              `Заявка: Заказать звонок\n` +
              `Имя: ${name}\n` +
              `Компания: ${company}\n` +
              `Телефон: ${phone}\n` +
              (tg ? `Telegram: ${tg}\n` : "") +
              (comment ? `Комментарий: ${comment}\n` : "");

            // Работает на статике: откроет “поделиться в Telegram”
            const shareUrl =
              "https://t.me/share/url?url=" +
              encodeURIComponent(window.location.href) +
              "&text=" +
              encodeURIComponent(msg);

            window.open(shareUrl, "_blank", "noopener,noreferrer");
            onClose();
          }}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-[12px] text-[#667085]">Имя</span>
              <input
                name="name"
                required
                className="h-11 rounded-[14px] border border-black/10 bg-white/75 px-3 outline-none focus:border-[#c73f40]/60"
                placeholder="Тимур"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-[12px] text-[#667085]">Компания</span>
              <input
                name="company"
                required
                className="h-11 rounded-[14px] border border-black/10 bg-white/75 px-3 outline-none focus:border-[#c73f40]/60"
                placeholder="ООО Ромашка"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-[12px] text-[#667085]">Телефон</span>
              <input
                name="phone"
                required
                className="h-11 rounded-[14px] border border-black/10 bg-white/75 px-3 outline-none focus:border-[#c73f40]/60"
                placeholder="+7 ..."
              />
            </label>

            <label className="grid gap-1">
              <span className="text-[12px] text-[#667085]">
                Telegram (опционально)
              </span>
              <input
                name="tg"
                className="h-11 rounded-[14px] border border-black/10 bg-white/75 px-3 outline-none focus:border-[#c73f40]/60"
                placeholder="@username"
              />
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-[12px] text-[#667085]">
              Комментарий (опционально)
            </span>
            <textarea
              name="comment"
              rows={3}
              className="resize-none rounded-[14px] border border-black/10 bg-white/75 px-3 py-2 outline-none focus:border-[#c73f40]/60"
              placeholder="Когда удобнее позвонить, что за бизнес, что хочешь автоматизировать…"
            />
          </label>

          <label className="mt-1 flex items-center gap-2 text-[12px] text-[#667085]">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            Согласен на обработку данных
          </label>

          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-[999px] border border-black/10 bg-white/60 px-4 text-[14px] hover:bg-white/80"
            >
              Отмена
            </button>

            <button
              type="submit"
              disabled={!agree}
              className="h-11 rounded-[999px] bg-[#c73f40] px-5 text-[14px] font-medium text-white shadow-[0_16px_40px_rgba(199,63,64,0.35)] hover:bg-[#b43738] active:bg-[#9f2f30] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Отправить
            </button>
          </div>

          <div className="pt-1 text-[12px] text-[#667085]">
            Или напиши в Telegram:{" "}
            <a className="text-[#c73f40] underline" href={LINKS.telegram} target="_blank" rel="noreferrer">
              t.me/uniconsulting
            </a>
          </div>
        </form>
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
        <div className="mx-auto max-w-[1240px] px-4">
          <div className="rounded-[999px] border border-white/40 bg-white/15 p-2 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-[24px]">
            <div className="flex items-center justify-between gap-3">
              {/* Left */}
              <a href="#top" className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/45 bg-white/18 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-[18px]">
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
              <nav className="hidden md:flex items-center gap-6 text-[13px] text-white/90">
                {nav.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="group inline-flex items-center gap-1 rounded-full px-2 py-1 hover:text-white"
                  >
                    <span className="relative">
                      {item.label}
                      <span className="absolute -bottom-[6px] left-0 h-[1px] w-0 bg-white/60 transition-all group-hover:w-full" />
                    </span>
                    {item.chevron ? (
                      <ChevronDown className="h-4 w-4 opacity-80" />
                    ) : null}
                  </a>
                ))}
              </nav>

              {/* Right */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCallOpen(true)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-white/16 text-white shadow-[0_10px_28px_rgba(0,0,0,0.18)] backdrop-blur-[18px] hover:bg-white/22"
                  aria-label="Заказать звонок"
                  title="Заказать звонок"
                >
                  <PhoneIcon className="h-5 w-5" />
                </button>

                <a
                  href={LINKS.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-white/16 text-white shadow-[0_10px_28px_rgba(0,0,0,0.18)] backdrop-blur-[18px] hover:bg-white/22"
                  aria-label="Telegram"
                  title="Telegram"
                >
                  <TelegramIcon className="h-5 w-5" />
                </a>

                <a
                  href={LINKS.login}
                  className="ml-1 inline-flex h-10 items-center justify-center rounded-full border border-[#c73f40] bg-white/0 px-4 text-[13px] font-medium text-[#c73f40] hover:bg-[#c73f40]/10"
                >
                  Войти
                </a>

                <a
                  href={LINKS.start}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-[#c73f40] px-4 text-[13px] font-medium text-white shadow-[0_16px_42px_rgba(199,63,64,0.35)] hover:bg-[#b43738] active:bg-[#9f2f30]"
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
              className="absolute right-3 top-3 w-[min(92vw,420px)] rounded-[28px] border border-white/40 bg-white/18 p-4 text-white shadow-[0_24px_90px_rgba(0,0,0,0.40)] backdrop-blur-[26px]"
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
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[#c73f40] bg-white/0 px-4 text-[14px] font-medium text-[#c73f40] hover:bg-[#c73f40]/10"
                >
                  Войти
                </a>
                <a
                  href={LINKS.start}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#c73f40] px-4 text-[14px] font-medium text-white shadow-[0_16px_42px_rgba(199,63,64,0.35)] hover:bg-[#b43738] active:bg-[#9f2f30]"
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
