"use client";

import React from "react";

type DocLink = {
  title: string;
  href: string;
  desc: string;
};

const DOCS: DocLink[] = [
  {
    title: "Политика конфиденциальности",
    href: "/docs/privacy",
    desc: "Как мы обрабатываем и защищаем персональные данные.",
  },
  {
    title: "Согласие ОПД клиента",
    href: "/docs/pd-consent",
    desc: "Согласие на обработку персональных данных для оказания услуг.",
  },
  {
    title: "Публичная оферта",
    href: "/docs/offer",
    desc: "Условия оказания услуг и оплаты, права и обязанности сторон.",
  },
  {
    title: "Политика cookies",
    href: "/docs/cookies",
    desc: "Какие cookies используем и зачем, как управлять настройками.",
  },
];

export default function FooterSection() {
  const [docsOpen, setDocsOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!docsOpen) return;
      const el = wrapRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setDocsOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (!docsOpen) return;
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
    <footer className="relative">
      {/* тонкий разделитель сверху */}
      <div className="h-px w-full bg-black/10" />

      <div className="bg-white/92">
        <div className="mx-auto max-w-[1240px] px-4 py-12">
          {/* основная панель футера */}
          <div className="rounded-[34px] lg-border border border-white/18 bg-white/82 p-[10px] shadow-[0_22px_70px_rgba(0,0,0,0.06)] backdrop-blur-[18px]">
            <div className="rounded-[26px] bg-white/82 px-7 py-8">
              <div className="grid gap-10 lg:grid-cols-12">
                {/* BRAND */}
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-3">
                    {/* круглый бейдж под лого (как в хедере) */}
                    <div className="relative h-12 w-12 rounded-full lg-border border border-black/10 bg-white/70 shadow-[0_12px_28px_rgba(0,0,0,0.06)]">
                      <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/40" />
                      {/* сюда можно вставить Image/лого */}
                      <div className="flex h-full w-full items-center justify-center text-[#0f172a] font-semibold">
                        Ю
                      </div>
                    </div>

                    <div className="text-[#0f172a] font-semibold tracking-[-0.02em] text-[16px]">
                      ЮНИ.ai
                    </div>
                  </div>

                  <div className="mt-4 text-[#0f172a] text-[12px] font-semibold">
                    СТЭП = Стабильность. Точность. Эффективность. Простота.
                  </div>

                  <div className="mt-5 space-y-1.5 text-[#0f172a] text-[12px] leading-[1.5]">
                    <div className="font-semibold">ООО "БЭНИФИТ"</div>
                    <div className="text-black/70">ИНН: 7300031274 • ОГРН: 1247300003257</div>
                    <div className="text-black/70">
                      зарегистрирована 04.04.2024 г. по адресу обл. Ульяновская, г. Ульяновск, ул. Жигулевская, д. 17,
                      кв. 4.
                    </div>
                  </div>
                </div>

                {/* CONTACTS */}
                <div className="lg:col-span-4">
                  <div className="text-[#0f172a] font-semibold text-[13px]">Контакты</div>

                  <div className="mt-4 space-y-2 text-[12px]">
                    <a
                      href="tel:+79955186942"
                      className="inline-flex items-center rounded-full px-3 py-2 lg-border border border-black/10 bg-white/70 text-[#0f172a] font-semibold hover:bg-white"
                    >
                      +7 (995) 518-69-42
                    </a>

                    <div className="flex flex-col gap-2">
                      <a
                        href="https://t.me/uni_smb"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-between rounded-[18px] px-4 py-3 lg-border border border-black/10 bg-white/70 text-[#0f172a] hover:bg-white transition"
                      >
                        <span className="font-semibold">t.me/uni_smb</span>
                        <span className="text-black/60">Telegram</span>
                      </a>

                      <a
                        href="mailto:uni.kit@mail.ru"
                        className="inline-flex items-center justify-between rounded-[18px] px-4 py-3 lg-border border border-black/10 bg-white/70 text-[#0f172a] hover:bg-white transition"
                      >
                        <span className="font-semibold">uni.kit@mail.ru</span>
                        <span className="text-black/60">Email</span>
                      </a>

                      <a
                        href="https://t.me/uniconsulting"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-between rounded-[18px] px-4 py-3 lg-border border border-black/10 bg-white/70 text-[#0f172a] hover:bg-white transition"
                      >
                        <span className="font-semibold">t.me/uniconsulting</span>
                        <span className="text-black/60">Блог</span>
                      </a>

                      <a
                        href="https://t.me/uni_smb"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-between rounded-[18px] px-4 py-3 lg-border border border-black/10 bg-white/70 text-[#0f172a] hover:bg-white transition"
                      >
                        <span className="font-semibold">Сообщить о проблеме</span>
                        <span className="text-black/60">Telegram</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* DOCS + RU */}
                <div className="lg:col-span-3">
                  <div className="text-[#0f172a] font-semibold text-[13px]">Документы</div>

                  <div ref={wrapRef} className="mt-4 relative">
                    <button
                      type="button"
                      onClick={() => setDocsOpen((v) => !v)}
                      className="w-full rounded-[18px] px-4 py-3 lg-border border border-black/10 bg-white/70 text-[#0f172a] hover:bg-white transition flex items-center justify-between"
                      aria-expanded={docsOpen}
                      aria-controls="footer-docs-mega"
                    >
                      <span className="text-[12px] font-semibold">Открыть документы</span>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        className={[
                          "transition-transform duration-300",
                          docsOpen ? "rotate-180" : "rotate-0",
                        ].join(" ")}
                        aria-hidden="true"
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="#0f172a"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {/* MegaMenu */}
                    <div
                      id="footer-docs-mega"
                      className={[
                        "absolute left-0 right-0 mt-3 origin-top",
                        "transition-[opacity,transform] duration-300",
                        docsOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none",
                      ].join(" ")}
                    >
                      <div className="rounded-[34px] lg-border border border-white/18 bg-white/82 p-[10px] shadow-[0_22px_70px_rgba(0,0,0,0.08)] backdrop-blur-[18px]">
                        <div className="rounded-[26px] bg-white/82 p-5">
                          <div className="text-[#0f172a] text-[12px] font-semibold">
                            Юридические документы
                          </div>

                          <div className="mt-4 grid gap-2">
                            {DOCS.map((d) => (
                              <a
                                key={d.href}
                                href={d.href}
                                className="rounded-[18px] lg-border border border-black/10 bg-white px-4 py-3 hover:bg-white/95 transition"
                              >
                                <div className="text-[#0f172a] text-[12px] font-semibold">{d.title}</div>
                                <div className="mt-1 text-black/60 text-[11px] leading-[1.35]">{d.desc}</div>
                              </a>
                            ))}
                          </div>

                          <div className="mt-4 text-[11px] text-black/60 leading-[1.35]">
                            Если нужен договор под ваш кейс (оферта, SLA, NDA), напишите в поддержку.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RU плашка */}
                  <div className="mt-8">
                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 lg-border border border-black/10 bg-white/70 text-[#0f172a]">
                      <span className="text-[12px] font-semibold">RU</span>
                      <span className="text-[12px] text-black/70">Продукт сделан в России</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* нижняя строка */}
              <div className="mt-10 pt-6 border-t border-black/10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-[12px] text-black/60">
                    Copyright © 2026 Uni.ai (ООО "БЭНИФИТ")
                  </div>

                  {/* при желании можно добавить сюда вторичные ссылки */}
                  <div className="text-[12px] text-black/60">
                    {/* пусто намеренно */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* конец панели */}
        </div>
      </div>
    </footer>
  );
}
