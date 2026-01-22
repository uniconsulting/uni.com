// src/components/ui/CallModal.tsx
"use client";

import React, { useEffect, useState } from "react";

const LINKS = {
  telegram: "https://t.me/uniconsulting",
};

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

export default function CallModal({
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
            <a
              className="text-[#c73f40] underline"
              href={LINKS.telegram}
              target="_blank"
              rel="noreferrer"
            >
              t.me/uniconsulting
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
