"use client";

import React from "react";

type DocItem = {
  title: string;
  desc: string;
  href: string;
};

const DOCS: DocItem[] = [
  {
    title: "Политика конфиденциальности",
    desc: "Как мы обрабатываем и защищаем данные.",
    href: "/docs/privacy",
  },
  {
    title: "Согласие ОПД клиента",
    desc: "Согласие на обработку персональных данных.",
    href: "/docs/pd-consent",
  },
  {
    title: "Публичная оферта",
    desc: "Условия оказания услуг и оплаты.",
    href: "/docs/offer",
  },
  {
    title: "Политика cookies",
    desc: "Какие cookies используем и зачем.",
    href: "/docs/cookies",
  },
];

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6.75 9.5L12 14.75L17.25 9.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExternalLinkIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 5h5v5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 14L19 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 14v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Footer() {
  const [docsOpen, setDocsOpen] = React.useState(false);
  const docsWrapRef = React.useRef<HTMLDivElement | null>(null);
  const buttonId = "footer-docs-button";
  const panelId = "footer-docs-panel";

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDocsOpen(false);
    };
    const onClickOutside = (e: MouseEvent) => {
      const el = docsWrapRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setDocsOpen(false);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  return (
    <footer className="relative">
      {/* тонкий разделитель сверху */}
      <div className="h-px w-full bg-[linear-gradient(90deg,rgba(15,23,42,0.06),rgba(15,23,42,0.12),rgba(15,23,42,0.06))]" />

      <div className="bg-white/72 backdrop-blur-[22px]">
        <div className="mx-auto max-w-[1240px] px-4 py-10">
          <div className="grid gap-10 md:grid-cols-12">
            {/* Бренд */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3">
                {/* бейдж-рамка под лого (как в хедере). Вставь сюда img/next-image */}
                <div className="relative h-11 w-11 rounded-full lg-border border border-black/8 bg-white/70 shadow-[0_10px_26px_rgba(0,0,0,0.06)]">
                  <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-black/5" />
                  <div className="h-full w-full flex items-center justify-center text-[#0f172a] text-[12px] font-semibold">
                    Ю
                  </div>
                </div>

                <div className="text-[#0f172a] text-[18px] font-semibold tracking-[-0.01em]">
                  ЮНИ.ai
                </div>
              </div>

              <div className="mt-4 text-[#0f172a]/70 text-[13px] leading-[1.35] font-semibold">
                СТЭП = Стабильность. Точность. Эффективность. Простота.
              </div>

              <div className="mt-6 space-y-2 text-[#0f172a]/80 text-[12px] leading-[1.45]">
                <div className="font-semibold text-[#0f172a]">ООО "БЭНИФИТ"</div>
                <div>ИНН: 7300031274 • ОГРН: 1247300003257</div>
                <div>
                  зарегистрирована 04.04.2024 г. по адресу обл. Ульяновская, г. Ульяновск,
                  ул. Жигулевская, д. 17, кв. 4.
                </div>
              </div>
            </div>

            {/* Контакты */}
            <div className="md:col-span-4">
              <div className="text-[#0f172a] text-[14px] font-semibold">Контакты</div>

              <div className="mt-4 space-y-3 text-[13px]">
                <a
                  href="tel:+79955186942"
                  className="inline-flex items-center gap-2 text-[#0f172a] font-semibold hover:text-[#c73f40] transition-colors"
                >
                  +7 (995) 518-69-42
                </a>

                <div className="flex flex-col gap-2">
                  <a
                    href="https://t.me/uni_smb"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[#0f172a] hover:text-[#c73f40] transition-colors"
                  >
                    t.me/uni_smb <span className="text-[#0f172a]/60">Telegram</span>
                    <ExternalLinkIcon className="text-[#0f172a]/45" />
                  </a>

                  <a
                    href="mailto:uni.kit@mail.ru"
                    className="inline-flex items-center gap-2 text-[#0f172a] hover:text-[#c73f40] transition-colors"
                  >
                    uni.kit@mail.ru
                  </a>

                  <a
                    href="https://t.me/uniconsulting"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[#0f172a] hover:text-[#c73f40] transition-colors"
                  >
                    Блог: t.me/uniconsulting <span className="text-[#0f172a]/60">Telegram-канал</span>
                    <ExternalLinkIcon className="text-[#0f172a]/45" />
                  </a>

                  <a
                    href="https://t.me/uni_smb"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[#0f172a] font-semibold hover:text-[#c73f40] transition-colors"
                  >
                    Сообщить о проблеме
                    <ExternalLinkIcon className="text-[#0f172a]/45" />
                  </a>
                </div>
              </div>
            </div>

            {/* Документы + RU */}
            <div className="md:col-span-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[#0f172a] text-[14px] font-semibold">Документы</div>

                {/* RU плашка */}
                <div className="rounded-full lg-border border border-black/8 bg-white/70 px-3 py-1 text-[11px] font-semibold text-[#0f172a] shadow-[0_10px_26px_rgba(0,0,0,0.05)]">
                  RU • Продукт сделан в России
                </div>
              </div>

              <div className="mt-4" ref={docsWrapRef}>
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => setDocsOpen((v) => !v)}
                  aria-expanded={docsOpen}
                  aria-controls={panelId}
                  className={[
                    "w-full",
                    "rounded-[26px]",
                    "lg-border border border-black/8",
                    "bg-white/82",
                    "px-4 py-3",
                    "flex items-center justify-between",
                    "text-[#0f172a] font-semibold text-[13px]",
                    "shadow-[0_12px_35px_rgba(0,0,0,0.04)]",
                    "hover:shadow-[0_16px_45px_rgba(0,0,0,0.06)]",
                    "transition-[box-shadow,transform] duration-500",
                    "active:scale-[0.995]",
                  ].join(" ")}
                >
                  Открыть список документов
                  <ChevronDown
                    className={[
                      "text-[#0f172a]",
                      "transition-transform duration-500",
                      docsOpen ? "rotate-180" : "rotate-0",
                    ].join(" ")}
                  />
                </button>

                {/* MegaMenu */}
                <div className="relative">
                  <div
                    id={panelId}
                    role="menu"
                    aria-labelledby={buttonId}
                    className={[
                      "absolute left-0 right-0 mt-3",
                      "rounded-[34px]",
                      "lg-border border border-black/8",
                      "bg-white/72 backdrop-blur-[18px]",
                      "shadow-[0_22px_70px_rgba(0,0,0,0.10)]",
                      "p-[10px]",
                      "transition-all duration-500",
                      docsOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none",
                    ].join(" ")}
                  >
                    <div className="rounded-[26px] lg-border border border-white/18 bg-white/82 p-4">
                      <div className="grid gap-3">
                        {DOCS.map((d) => (
                          <a
                            key={d.title}
                            href={d.href}
                            role="menuitem"
                            className={[
                              "rounded-[18px]",
                              "lg-border border border-white/18",
                              "bg-white",
                              "px-4 py-3",
                              "shadow-[0_10px_26px_rgba(0,0,0,0.04)]",
                              "hover:shadow-[0_14px_34px_rgba(0,0,0,0.06)]",
                              "transition-[box-shadow,transform,color] duration-500",
                              "active:scale-[0.995]",
                              "group",
                            ].join(" ")}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-[#0f172a] text-[13px] font-semibold group-hover:text-[#c73f40] transition-colors">
                                  {d.title}
                                </div>
                                <div className="mt-1 text-[#0f172a]/60 text-[12px] leading-[1.35]">
                                  {d.desc}
                                </div>
                              </div>
                              <ExternalLinkIcon className="mt-0.5 text-[#0f172a]/40 group-hover:text-[#0f172a]/65 transition-colors" />
                            </div>
                          </a>
                        ))}
                      </div>

                      <div className="mt-4 text-[#0f172a]/55 text-[11px] leading-[1.35]">
                        Документы будут оформлены и опубликованы в этом разделе.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* мелкая подпись справа */}
              <div className="mt-6 text-[#0f172a]/60 text-[12px] leading-[1.35]">
                Если нужен договор под Enterprise или on-premise, напишите в Telegram.
              </div>
            </div>
          </div>

          {/* нижняя линия */}
          <div className="mt-10 pt-6 border-t border-black/5">
            <div className="text-[#0f172a]/65 text-[12px]">
              Copyright © 2026 Uni.ai (ООО "БЭНИФИТ")
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
