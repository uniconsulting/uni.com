"use client";

import React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

type Billing = "monthly" | "yearly";

type MegaColumn = {
  title: string;
  items: string[];
};

type PlanMega = {
  title: string;
  subtitle?: string;
  columns: MegaColumn[];
  footnote?: string;
};

type Plan = {
  key: "trial" | "small" | "mid" | "enterprise";
  title: string;
  desc: string; // можно с \n
  priceMonthly: number | null; // null = индивидуально
  noteUnderPrice?: string;
  integrationNote?: string;
  paramsTitle: string;
  params: string[];
  cta: string;
  variant?: "primary" | "outline";
  featured?: boolean;
  mega: PlanMega;
};

const PLANS: Plan[] = [
  {
    key: "trial",
    title: "Тестовый",
    desc: "Соберите первых\nассистентов и оцените\nинтерфейс, аналитику\nи логику работы.",
    priceMonthly: 0,
    noteUnderPrice: "0 ₽, бессрочно",
    paramsTitle: "Ключевые параметры",
    params: [
      "Модель: Uni-6 Nano",
      "До 1 000 сообщений / мес",
      "До 2 кастомных агентов",
      "До 2 шаблонных агентов",
    ],
    cta: "Попробовать",
    variant: "outline",
    mega: {
      title: "Тестовый тариф",
      subtitle: "Чтобы спокойно посмотреть интерфейс и поведение ассистентов.",
      columns: [
        {
          title: "Лимиты",
          items: [
            "Сообщения: 1 000 / месяц (при необходимости можно поднять до 2 000)",
            "Агенты: до 2 созданных с нуля",
            "Шаблоны: до 2 готовых",
            "Модель: Uni-6 Nano (только она)",
          ],
        },
        {
          title: "Нет",
          items: [
            "Настройки параметров генерации",
            "Управления базой знаний и RAG",
            "Обучения на реакциях (Reaction RAG)",
            "Батчинга сообщений",
            "Выбора модели",
          ],
        },
        {
          title: "Поддержка",
          items: ["База знаний + e-mail/чат по остаточному принципу"],
        },
      ],
    },
  },
  {
    key: "small",
    title: "Малый",
    desc: "Для небольших команд:\nбыстрый запуск по\nинструкциям ЮНИ +\nлёгкая помощь эксперта.",
    priceMonthly: 9900,
    integrationNote: "интеграции: от 179 900₽ / разово *",
    noteUnderPrice: "2–4 часа помощи / мес",
    paramsTitle: "Ключевые параметры",
    params: [
      "5 активных кастомных агентов",
      "+ вся библиотека готовых",
      "До 5 000 сообщений / мес",
      "Telegram + ещё 1 канал",
    ],
    cta: "Выбрать тариф",
    variant: "outline",
    mega: {
      title: "Малый тариф",
      subtitle:
        "Для собственника, который готов разбираться по инструкциям и иногда получать поддержку ЮНИ.",
      columns: [
        {
          title: "Кому",
          items: [
            "Предпринимателю / собственнику",
            "Сам разбирается по инструкциям",
            "Точечно подключает эксперта ЮНИ",
          ],
        },
        {
          title: "Лимиты и каналы",
          items: [
            "Сообщения: до 5 000 / месяц",
            "Агенты: 5 активных кастомных + вся библиотека готовых",
            "Каналы: Telegram + ещё 1 (VK / WhatsApp по мере готовности)",
            "Модели: Uni-6 Nano + Uni-6 Mini",
          ],
        },
        {
          title: "Функционал и поддержка",
          items: [
            "Полная база знаний и RAG",
            "Reaction RAG (обучение на реакциях)",
            "Батчинг сообщений",
            "Настройка параметров генерации",
            "Поддержка: 2–4 часа консультаций/правок в месяц + стандартные SLA",
          ],
        },
      ],
    },
  },
  {
    key: "mid",
    title: "Средний",
    desc: "Для масштабирования\nдействующих процессов.\nПолноценная интеграция\nпод ключ командой ЮНИ.",
    priceMonthly: 39900,
    integrationNote: "интеграции: от 179 900₽ / разово *",
    noteUnderPrice: "PM + до 12 часов / мес",
    paramsTitle: "Ключевые параметры",
    params: [
      "10 активных кастомных агентов",
      "+ вся библиотека готовых",
      "До 30 000 сообщений / мес",
      "До 4 каналов",
    ],
    cta: "Подключить сейчас",
    variant: "primary",
    featured: true,
    mega: {
      title: "Средний тариф",
      subtitle:
        "Для руководителей продаж/маркетинга и команд, которым нужно управляемое масштабирование.",
      columns: [
        {
          title: "Кому",
          items: [
            "Директору по развитию",
            "Коммерческому директору",
            "Руководителю продаж",
            "Маркетологу",
          ],
        },
        {
          title: "Лимиты и стек",
          items: [
            "Сообщения: до 30 000 / месяц",
            "Агенты: 10 активных кастомных + вся библиотека готовых",
            "Каналы: до 4 (TG, VK, WhatsApp, сайт-виджет, позже Авито)",
            "Модели: Uni-6 Pro",
          ],
        },
        {
          title: "Фичи и поддержка",
          items: [
            "Всё из малого пакета",
            "Расширенная аналитика и отчёты",
            "Гибкие настройки RAG: несколько баз знаний, top-K, порог и т.п.",
            "Поддержка: закреплённый PM",
            "До 12 часов работы команды в месяц: обновление базы знаний, доработка промптов, A/B тесты сценариев, разбор аналитики и рекомендации",
          ],
        },
      ],
    },
  },
  {
    key: "enterprise",
    title: "Энтерпрайз",
    desc: "Для крупных компаний:\nмакс. персонализация,\nSLA и постоянное\nвовлечение команды ЮНИ.",
    priceMonthly: null,
    noteUnderPrice: "White-glove, 40 часов / мес",
    integrationNote: "условия: индивидуально",
    paramsTitle: "Ключевые параметры",
    params: [
      "Сообщения: индивидуально",
      "Агенты: безлимит",
      "Каналы: все + интеграции",
      "Uni-6 Pro и Uni-6 Pro+",
    ],
    cta: "Заказать звонок",
    variant: "outline",
    mega: {
      title: "Энтерпрайз",
      subtitle: "Когда нужен максимум качества, контроля и вовлечения команды ЮНИ.",
      columns: [
        {
          title: "Кому",
          items: [
            "Маркетологу крупной компании",
            "Head of Digital",
            "Руководителю AI-направления",
            "Контакт-центру и связанным функциям",
          ],
        },
        {
          title: "Лимиты и каналы",
          items: [
            "Сообщения: индивидуально",
            "Агенты: безлимит",
            "Каналы: все, включая несколько Telegram-ботов, группы, сайт, кастомные интеграции",
            "Модели: Uni-6 Pro и Uni-6 Pro+",
          ],
        },
        {
          title: "Функционал и поддержка",
          items: [
            "Приоритетный доступ к новым фичам",
            "Расширенная аналитика и кастомные отчёты",
            "Продвинутые функции Reaction RAG и сложный RAG, много баз знаний",
            "White-glove сервис: ведущий PM",
            "40 часов команды/месяц + регулярные стратегические созвоны и roadmap по AI в компании",
          ],
        },
      ],
    },
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
  return `${Math.round(v)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}₽`;
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

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function getPriceValue(billing: Billing, p: Plan) {
  if (p.priceMonthly === null) return null;
  if (p.priceMonthly === 0) return 0;
  if (billing === "monthly") return p.priceMonthly;
  return Math.round(p.priceMonthly * 0.8);
}

function getPriceSuffix(p: Plan) {
  if (p.key === "trial") return "/ бессрочно";
  if (p.priceMonthly === null) return "";
  return "/ мес";
}

function BlurredPreview({
  plan,
  onOpen,
}: {
  plan: Plan;
  onOpen: (rect: DOMRect) => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => onOpen((e.currentTarget as HTMLElement).getBoundingClientRect())}
      className="
        lg-border
        relative mt-4
        w-full
        rounded-[18px]
        border border-black/10
        bg-white/60
        shadow-[0_16px_45px_rgba(0,0,0,0.03)]
        overflow-hidden
        px-4 py-4
        text-left
        transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:scale-[1.01] active:scale-[0.99]
      "
      aria-label={`Открыть подробности тарифа ${plan.title}`}
    >
      {/* тонкая пластика */}
      <span className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(700px_200px_at_20%_0%,rgba(255,255,255,0.40),transparent_60%),radial-gradient(700px_240px_at_85%_100%,rgba(199,63,64,0.08),transparent_65%)]" />
      <span className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-white/35" />

      {/* “размытый” текст */}
      <div
        className="relative z-10 text-[#101828]"
        style={{ filter: "blur(6px)", opacity: 0.78, transform: "translateZ(0)" }}
      >
        <div className="text-[12px] leading-[1.35]">
          {plan.mega.columns
            .slice(0, 2)
            .map((c) => `${c.title}: ${c.items.slice(0, 2).join(" · ")}`)
            .join("\n")}
        </div>
      </div>

      {/* hint */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="rounded-full bg-black/20 px-4 py-2 text-[12px] font-semibold text-white/90 backdrop-blur-[10px]">
          Нажмите, чтобы раскрыть
        </div>
      </div>
    </button>
  );
}

function MegaMenu({
  openKey,
  anchorRect,
  plans,
  onClose,
}: {
  openKey: Plan["key"] | null;
  anchorRect: DOMRect | null;
  plans: Plan[];
  onClose: () => void;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => {
    if (!openKey) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [openKey, onClose]);

  if (!mounted) return null;
  const plan = plans.find((p) => p.key === openKey);
  if (!plan || !anchorRect) return null;

  const width = Math.min(820, window.innerWidth - 32);
  const approxH = 440;

  const desiredLeft = anchorRect.left + anchorRect.width / 2 - width / 2;
  const left = clamp(desiredLeft, 16, window.innerWidth - width - 16);

  const below = anchorRect.bottom + 14;
  const above = anchorRect.top - 14 - approxH;
  const top =
    below + approxH <= window.innerHeight - 16 ? below : clamp(above, 16, window.innerHeight - approxH - 16);

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0 bg-black/35 backdrop-blur-[8px]"
          onMouseDown={onClose}
        />

        <motion.div
          className="
            absolute
            rounded-[30px]
            border border-white/22 bg-white/12 lg-border
            shadow-[0_30px_110px_rgba(0,0,0,0.22)]
            backdrop-blur-[26px] backdrop-saturate-150
            overflow-hidden
          "
          style={{ top, left, width }}
          initial={{ y: 10, scale: 0.985, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 10, scale: 0.985, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="bg-white/88 text-[#101828]">
            <div className="flex items-start justify-between gap-4 p-6">
              <div>
                <div className="text-[18px] font-semibold tracking-[-0.01em]">{plan.mega.title}</div>
                {plan.mega.subtitle ? (
                  <div className="mt-1 text-[13px] text-[#667085] leading-[1.35]">{plan.mega.subtitle}</div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="h-10 w-10 rounded-full border border-black/10 bg-white/60 hover:bg-white/85"
                aria-label="Закрыть"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-3 px-6 pb-6 md:grid-cols-3">
              {plan.mega.columns.map((col) => (
                <div
                  key={col.title}
                  className="rounded-[18px] border border-black/10 bg-white p-4"
                >
                  <div className="text-[13px] font-semibold text-[#101828]">{col.title}</div>
                  <ul className="mt-2 space-y-2 text-[13px] leading-[1.4] text-[#475467]">
                    {col.items.map((it) => (
                      <li key={it} className="flex gap-2">
                        <span className="mt-[7px] h-[5px] w-[5px] rounded-full bg-[#c73f40]/70" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {plan.mega.footnote ? (
              <div className="px-6 pb-6 text-[12px] text-[#98A2B3]">{plan.mega.footnote}</div>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

export default function PricingPlansSection() {
  const [billing, setBilling] = React.useState<Billing>("monthly");
  const [openKey, setOpenKey] = React.useState<Plan["key"] | null>(null);
  const [anchorRect, setAnchorRect] = React.useState<DOMRect | null>(null);

  const openMega = React.useCallback((key: Plan["key"], rect: DOMRect) => {
    setOpenKey(key);
    setAnchorRect(rect);
  }, []);

  const closeMega = React.useCallback(() => {
    setOpenKey(null);
    setAnchorRect(null);
  }, []);

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

        {/* Общий контейнер карточек */}
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
                const price = getPriceValue(billing, p);
                const priceText = price === null ? "Индивидуально" : formatRub(price);

                return (
                  <div
                    key={p.key}
                    data-plan-card
                    className={[
                      "lg-border rounded-[28px] border bg-white/82 shadow-[0_16px_45px_rgba(0,0,0,0.06)] overflow-hidden",
                      p.featured ? "border-[#c73f40]/55" : "border-black/10",
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
                            {priceText}
                          </div>
                          {getPriceSuffix(p) ? (
                            <div className="pb-[3px] text-[16px] text-[#98A2B3]">
                              {getPriceSuffix(p)}
                            </div>
                          ) : null}
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
                        onClick={(e) => {
                          const card = (e.currentTarget as HTMLElement).closest(
                            "[data-plan-card]"
                          ) as HTMLElement | null;
                          const rect = (card ?? (e.currentTarget as HTMLElement)).getBoundingClientRect();
                          openMega(p.key, rect);
                        }}
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

                      {/* Плейсхолдер-контент: размытый текст + открытие MegaMenu */}
                      <BlurredPreview
                        plan={p}
                        onOpen={(rect) => openMega(p.key, rect)}
                      />

                      {/* CTA */}
                      <div className="mt-4">
                        <button
                          type="button"
                          className={[
                            "lg-border w-full rounded-[18px] border px-4 py-3 text-[13px] font-semibold transition-[transform,background-color,color,box-shadow] duration-[900ms] ease-out",
                            "active:scale-[0.99]",
                            p.variant === "primary"
                              ? "border-[#c73f40]/30 bg-[#c73f40] text-white shadow-[0_16px_45px_rgba(199,63,64,0.06)] hover:scale-[1.01]"
                              : "border-black/5 bg-white/75 text-[#0f172a] shadow-[0_16px_45px_rgba(0,0,0,0.02)] hover:text-[#c73f40] hover:scale-[1.01]",
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

      <MegaMenu openKey={openKey} anchorRect={anchorRect} plans={PLANS} onClose={closeMega} />
    </section>
  );
}
