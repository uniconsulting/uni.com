"use client";

import React from "react";

type Billing = "monthly" | "yearly";

type Plan = {
  key: "trial" | "small" | "mid" | "enterprise";
  title: string;
  desc: string;
  priceMonthly: number; // ₽/мес
  noteUnderPrice?: string;
  integrationNote?: string;
  paramsTitle: string;
  params: string[];
  cta: string;
  variant?: "primary" | "outline";
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    key: "trial",
    title: "Тестовый",
    desc:
      "Соберите первых\nассистентов и оцените\nинтерфейс, аналитику\nи логику работы.",
    priceMonthly: 0,
    noteUnderPrice: "нет интеграции от ЮНИ",
    paramsTitle: "Ключевые параметры",
    params: ["2 кастомных агента", "2 готовых агента", "До 1 000 сообщений / мес"],
    cta: "Попробовать",
    variant: "outline",
  },
  {
    key: "small",
    title: "Малый",
    desc:
      "Для небольших команд:\nбыстрый запуск по\nинструкциям ЮНИ +\nлёгкая помощь эксперта.",
    priceMonthly: 9900,
    integrationNote: "интеграции: от 179 900₽ / разово *",
    paramsTitle: "Ключевые параметры",
    params: ["5 кастомных агентов", "+ вся библиотека готовых", "До 5 000 сообщений / мес"],
    cta: "Выбрать тариф",
    variant: "outline",
  },
  {
    key: "mid",
    title: "Средний",
    desc:
      "Для масштабирования\nдействующих процессов.\nПолноценная интеграция\nпод ключ командой ЮНИ.",
    priceMonthly: 39900,
    integrationNote: "интеграции: от 179 900₽ / разово *",
    paramsTitle: "Ключевые параметры",
    params: ["10 кастомных агентов", "+ вся библиотека готовых", "До 30 000 сообщений / мес"],
    cta: "Подключить сейчас",
    variant: "primary",
    featured: true,
  },
  {
    key: "enterprise",
    title: "Энтерпрайз",
    desc:
      "Для крупных компаний:\nмакс. персонализация,\nSLA и постоянное\nвовлечение команды ЮНИ.",
    priceMonthly: 99900,
    integrationNote: "интеграции: от 179 900₽ / разово *",
    paramsTitle: "Ключевые параметры",
    params: ["Индивидуальные лимиты", "Максимум персонализации", "Без ограничений"],
    cta: "Заказать звонок",
    variant: "outline",
  },
];

type Addon = {
  title: string;
  desc: string;
  price: string;
};

const ADDONS: Addon[] = [
  {
    title: "Интеграции под ключ",
    desc: "AmoCRM, телефония, Telegram, аналитика. Сценарии, права, маршрутизация.",
    price: "от 179 900₽",
  },
  {
    title: "Настройка базы знаний",
    desc: "Регламенты, FAQ, документы, инструкции. Удобный справочник для сотрудников.",
    price: "от 49 990₽",
  },
  {
    title: "Контроль качества",
    desc: "Скрипты, оценка диалогов, отчёты, алерты. Поддержка и улучшения.",
    price: "от 49 990₽",
  },
  {
    title: "Обучение команды",
    desc: "Роли, промпты, сценарии. Внедрение привычек использования в повседневной работе.",
    price: "от 29 990₽",
  },
];

function formatRub(v: number) {
  if (v === 0) return "0₽";
  return `${Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}₽`;
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2.2 12s3.6-7 9.8-7 9.8 7 9.8 7-3.6 7-9.8 7-9.8-7-9.8-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PricingPlansSection() {
  const [billing, setBilling] = React.useState<Billing>("monthly");

  const priceFor = React.useCallback(
    (p: Plan) => {
      if (billing === "monthly") return p.priceMonthly;
      // Годовой: -20% от помесячной логики (демо-арифметика).
      return Math.round(p.priceMonthly * 0.8);
    },
    [billing]
  );

  return (
    <section id="plans" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-[1240px] px-4">
        <div className="mx-auto max-w-[1240px] text-center">
          <h2 className="text-white font-semibold leading-[0.95] tracking-[-0.02em] text-[24px] sm:text-[32px] lg:text-[42px]">
            Сделай выбор
          </h2>

          <div className="mt-1 text-white font-semibold tracking-[-0.01em] text-[16px] sm:text-[28px] lg:text-[28px]">
            Прозрачные условия, никаких скрытых платежей.
          </div>

          <div className="mt-3 text-white/55 font-semibold tracking-[-0.01em] text-[13px] sm:text-[14px]">
            + инвестиционная окупаемость
          </div>

          {/* Переключатель billing */}
          <div className="mt-7 flex justify-center">
            <div
              className="
                lg-border
                inline-flex items-center gap-2
                rounded-[999px]
                border border-white/22
                bg-white/10
                p-1
                backdrop-blur-[22px] backdrop-saturate-150
                shadow-[0_22px_70px_rgba(0,0,0,0.05)]
              "
              role="tablist"
              aria-label="Вариант оплаты"
            >
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                aria-pressed={billing === "monthly"}
                className={[
                  "h-10 rounded-[999px] px-5 text-[14px] font-semibold transition-[transform,background-color,color] duration-[900ms] ease-out",
                  "active:scale-[0.99]",
                  billing === "monthly"
                    ? "bg-white/85 text-[#0f172a] shadow-[0_16px_45px_rgba(0,0,0,0.08)]"
                    : "text-white/75 hover:text-white hover:scale-[1.02]",
                ].join(" ")}
              >
                Ежемесячно
              </button>

              <button
                type="button"
                onClick={() => setBilling("yearly")}
                aria-pressed={billing === "yearly"}
                className={[
                  "h-10 rounded-[999px] px-5 text-[14px] font-semibold transition-[transform,background-color,color] duration-[900ms] ease-out",
                  "active:scale-[0.99] inline-flex items-center gap-2",
                  billing === "yearly"
                    ? "bg-white/85 text-[#0f172a] shadow-[0_16px_45px_rgba(0,0,0,0.08)]"
                    : "text-white/75 hover:text-white hover:scale-[1.02]",
                ].join(" ")}
              >
                Годовой
                <span
                  className="
                    ml-1
                    rounded-full
                    bg-[#c73f40]/12
                    px-2 py-1
                    text-[12px]
                    font-semibold
                    text-[#c73f40]
                    border border-[#c73f40]/18
                  "
                >
                  -20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Общий контейнер карточек (как в макете: большая рамка вокруг всех) */}
        <div className="relative mx-auto mt-10 max-w-[1240px]">
          <div
            className="
              lg-border
              rounded-[40px]
              border border-white/18
              bg-white/10
              p-[10px]
              shadow-[0_22px_70px_rgba(0,0,0,0.05)]
              backdrop-blur-[26px] backdrop-saturate-150
            "
          >
            <div className="pointer-events-none absolute inset-0 rounded-[40px] ring-1 ring-white/10" />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {PLANS.map((p) => {
                const price = priceFor(p);

                return (
                  <div
                    key={p.key}
                    className={[
                      "lg-border rounded-[28px] border bg-white/82 shadow-[0_16px_45px_rgba(0,0,0,0.06)] overflow-hidden",
                      p.featured
                        ? "border-[#c73f40]/55"
                        : "border-black/10",
                    ].join(" ")}
                  >
                    <div className="p-5">
                      <div className="text-[20px] font-semibold text-[#0f172a] tracking-[-0.01em]">
                        {p.title}
                      </div>

                      <div className="mt-2 text-[13px] leading-[1.35] text-[#475467] min-h-[52px] whitespace-pre-line">
                        {p.desc}
                      </div>

                      <div className="mt-4 h-px w-full bg-black/10" />

                      <div className="mt-4">
                        <div className="flex items-end gap-2">
                          <div className="text-[26px] font-semibold text-[#0f172a] tracking-[-0.02em]">
                            {formatRub(price)}
                          </div>
                          <div className="pb-[3px] text-[16px] text-[#98A2B3]">/ мес</div>
                        </div>

                        {p.noteUnderPrice ? (
                          <div className="mt-1 text-[12px] text-[#98A2B3]">
                            {p.noteUnderPrice}
                          </div>
                        ) : null}

                        {p.integrationNote ? (
                          <div className="mt-1 text-[12px] text-[#98A2B3]">
                            {p.integrationNote}
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-4 h-px w-full bg-black/10" />

                      <div className="mt-4">
                        <div className="text-[12px] font-semibold text-[#0f172a]">
                          {p.paramsTitle}
                        </div>

                        <div className="mt-3 space-y-2 text-[13px] text-[#344054]">
                          {p.params.map((x) => (
                            <div key={x} className="leading-[1.25]">
                              {x}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 h-px w-full bg-black/10" />

                      <button
                        type="button"
                        className="
                          mt-4 inline-flex items-center gap-2
                          text-[13px] font-semibold
                          text-[#0f172a]
                          hover:text-[#c73f40]
                          transition-colors duration-[600ms]
                        "
                      >
                        Изучить возможности <EyeIcon />
                      </button>

                      {/* Плейсхолдер-контент */}
                      <div
                        className="
                          lg-border
                          mt-4
                          h-[92px]
                          w-full
                          rounded-[18px]
                          border border-black/10
                          bg-white/60
                        "
                      />

                      {/* CTA */}
                      <div className="mt-4">
                        <button
                          type="button"
                          className={[
                            "lg-border w-full rounded-[999px] border px-4 py-3 text-[13px] font-semibold transition-[transform,background-color,color,box-shadow] duration-[900ms] ease-out",
                            "active:scale-[0.99]",
                            p.variant === "primary"
                              ? "border-[#c73f40]/30 bg-[#c73f40] text-white shadow-[0_16px_45px_rgba(199,63,64,0.18)] hover:scale-[1.01]"
                              : "border-black/12 bg-white/75 text-[#0f172a] shadow-[0_16px_45px_rgba(0,0,0,0.06)] hover:text-[#c73f40] hover:scale-[1.01]",
                          ].join(" ")}
                        >
                          {p.cta}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* лёгкая “пластика” внутри общей рамки */}
            <div className="pointer-events-none absolute inset-0 rounded-[40px] opacity-70 bg-[radial-gradient(900px_420px_at_20%_0%,rgba(255,255,255,0.10),transparent_60%),radial-gradient(900px_420px_at_80%_100%,rgba(199,63,64,0.08),transparent_65%)]" />
          </div>
        </div>

        {/* Доп-услуги */}
        <div className="mx-auto mt-10 max-w-[1240px]">
          <div
            className="
              lg-border
              rounded-[34px]
              border border-white/18
              bg-white/10
              p-[10px]
              shadow-[0_22px_70px_rgba(0,0,0,0.05)]
              backdrop-blur-[26px] backdrop-saturate-150
            "
          >
            <div className="rounded-[26px] bg-white/82 border border-black/10 lg-border p-6">
              <div className="text-[18px] font-semibold text-[#0f172a] tracking-[-0.01em]">
                Доп-услуги
              </div>
              <div className="mt-1 text-[13px] text-[#475467]">
                Можно добавить к любому тарифу, чтобы быстрее упереться в результат.
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {ADDONS.map((a) => (
                  <div
                    key={a.title}
                    className="
                      lg-border
                      rounded-[18px]
                      border border-black/10
                      bg-white/70
                      p-4
                      shadow-[0_16px_45px_rgba(0,0,0,0.05)]
                    "
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[14px] font-semibold text-[#0f172a]">
                          {a.title}
                        </div>
                        <div className="mt-1 text-[12px] leading-[1.35] text-[#475467]">
                          {a.desc}
                        </div>
                      </div>

                      <div className="shrink-0 text-[13px] font-semibold text-[#c73f40]">
                        {a.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 text-[12px] text-[#98A2B3]">
                * Стоимость интеграций зависит от состава систем и глубины сценариев.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
