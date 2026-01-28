"use client";

import React from "react";
import Link from "next/link";

const DOCS = [
  { label: "Политика конфиденциальности", href: "/docs/privacy" },
  { label: "Согласие ОПД клиента", href: "/docs/opd-consent" },
  { label: "Публичная оферта", href: "/docs/offer" },
  { label: "Политика cookies", href: "/docs/cookies" },
];

const CONTACTS = {
  phone: "+7 (995) 518-69-42",
  telegram: "https://t.me/uni_smb",
  blog: "https://t.me/uniconsulting",
  email: "uni.kit@mail.ru",
  issue: "https://t.me/uni_smb",
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={[
        "h-5 w-5 text-[#0f172a]/70 transition-transform duration-300",
        open ? "rotate-180" : "rotate-0",
      ].join(" ")}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FooterSection() {
  const [docsOpen, setDocsOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!docsOpen) return;
      const t = e.target as Node | null;
      if (wrapRef.current && t && !wrapRef.current.contains(t)) setDocsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDocsOpen(false);
    };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [docsOpen]);

  return (
    <footer id="footer" className="relative">
      {/* тонкий разделитель сверху */}
      <div className="h-px w-full bg-black/10" />

      {/* светлая стеклянная панель */}
      <div className="bg-white/75 backdrop-blur-[18px]">
        <div className="mx-auto max-w-[1240px] px-4 py-12">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* 1) Бренд */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-4">
                {/* круглый бейдж-рамка под лого (как в хедере) */}
                <div className="relative h-12 w-12 rounded-full border border-black/10 bg-white/70 shadow-[0_10px_26px_rgba(0,0,0,0.06)]">
                  <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/40" />
                  {/* сюда вставишь лого */}
                  <div className="flex h-full w-full items-center justify-center text-[11px] font-semibold text-[#0f172a]/70">
                    LOGO
                  </div>
                </div>

                <div className="text-[#0f172a] font-semibold tracking-[-0.01em] text-[18px]">
                  ЮНИ.ai
                </div>
              </div>

              <div className="mt-4 text-[12px] font-semibold text-[#0f172a]/80">
                СТЭП = Стабильность. Точность. Эффективность. Простота.
              </div>

              <div className="mt-5 space-y-1 text-[12px] leading-[1.45] text-[#0f172a]/70">
                <div className="font-semibold text-[#0f172a]/85">ООО "БЭНИФИТ"</div>
                <div>ИНН: 7300031274 • ОГРН: 1247300003257</div>
                <div>
                  зарегистрирована 04.04.2024 г. по адресу обл. Ульяновская, г. Ульяновск,
                  ул. Жигулевская, д. 17, кв. 4.
                </div>
              </div>

              {/* плашка RU */}
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 shadow-[0_10px_26px_rgba(0,0,0,0.05)]">
                <span className="text-[12px] font-semibold text-[#0f172a]">RU</span>
                <span className="h-3 w-px bg-black/10" />
                <span className="text-[12px] font-semibold text-[#0f172a]/70">
                  Продукт сделан в России
                </span>
              </div>
            </div>

            {/* 2) Контакты */}
            <div className="lg:col-span-4">
              <div className="text-[#0f172a] font-semibold text-[14px]">Контакты</div>

              <div className="mt-4 space-y-3 text-[12px] font-semibold">
                <a
                  href={`tel:${CONTACTS.phone.replace(/[^\d+]/g, "")}`}
                  className="inline-flex items-center gap-2 text-[#0f172a]/80 hover:text-[#0f172a]"
                >
                  {CONTACTS.phone}
                </a>

                <a
                  href={CONTACTS.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[#0f172a]/80 hover:text-[#0f172a]"
                >
                  t.me/uni_smb <span className="text-[#0f172a]/50 font-semibold">(Telegram)</span>
                </a>

                <a
                  href={`mailto:${CONTACTS.email}`}
                  className="inline-flex items-center gap-2 text-[#0f172a]/80 hover:text-[#0f172a]"
                >
                  {CONTACTS.email}
                </a>

                <a
                  href={CONTACTS.blog}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[#0f172a]/80 hover:text-[#0f172a]"
                >
                  Блог: t.me/uniconsulting
                </a>

                <a
                  href={CONTACTS.issue}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[#0f172a]/80 hover:text-[#0f172a]"
                >
                  Сообщить о проблеме
                </a>
              </div>
            </div>

            {/* 3) Документы (MegaMenu) */}
            <div className="lg:col-span-3">
              <div className="text-[#0f172a] font-semibold text-[14px]">Документы</div>

              <div ref={wrapRef} className="mt-4 relative">
                <button
                  type="button"
                  onClick={() => setDocsOpen((v) => !v)}
                  onMouseEnter={() => setDocsOpen(true)}
                  onMouseLeave={() => setDocsOpen(false)}
                  className={[
                    "w-full",
                    "rounded-[34px]",
                    "border border-black/10",
                    "bg-white/70 backdrop-blur-[14px]",
                    "px-5 py-4",
                    "shadow-[0_14px_40px_rgba(0,0,0,0.06)]",
                    "transition-[transform,background-color] duration-300",
                    "active:scale-[0.99]",
                  ].join(" ")}
                  aria-expanded={docsOpen}
                  aria-haspopup="menu"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[12px] font-semibold text-[#0f172a]">
                      Открыть список документов
                    </div>
                    <Chevron open={docsOpen} />
                  </div>
                </button>

                {/* MegaMenu-панель */}
                <div
                  onMouseEnter={() => setDocsOpen(true)}
                  onMouseLeave={() => setDocsOpen(false)}
                  className={[
                    "absolute left-0 right-0 mt-3",
                    "rounded-[34px] border border-white/18 lg-border",
                    "bg-white/82 backdrop-blur-[18px]",
                    "shadow-[0_18px_55px_rgba(0,0,0,0.10)]",
                    "transition-all duration-300",
                    docsOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-1 pointer-events-none",
                  ].join(" ")}
                  role="menu"
                >
                  <div className="p-[10px]">
                    <div className="rounded-[26px] bg-white/82 border border-white/18 lg-border p-3">
                      <div className="grid gap-2">
                        {DOCS.map((d) => (
                          <Link
                            key={d.href}
                            href={d.href}
                            className={[
                              "rounded-[18px]",
                              "bg-white/70",
                              "border border-black/10",
                              "px-4 py-3",
                              "text-[12px] font-semibold text-[#0f172a]/80",
                              "shadow-[0_10px_26px_rgba(0,0,0,0.05)]",
                              "transition-[transform,background-color,color] duration-300",
                              "hover:bg-white hover:text-[#0f172a]",
                              "active:scale-[0.99]",
                            ].join(" ")}
                            role="menuitem"
                            onClick={() => setDocsOpen(false)}
                          >
                            {d.label}
                          </Link>
                        ))}
                      </div>

                      <div className="mt-3 text-[11px] leading-[1.35] text-[#0f172a]/55">
                        Документы будут подключены в отдельных страницах / модалках.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-[11px] leading-[1.35] text-[#0f172a]/55">
                Если нужно, могу сразу подготовить контент этих 4 документов в стиле проекта.
              </div>
            </div>
          </div>

          {/* нижняя линия */}
          <div className="mt-10 pt-6 border-t border-black/10">
            <div className="text-[12px] font-semibold text-[#0f172a]/70">
              Copyright © 2026 Uni.ai (ООО "БЭНИФИТ")
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
