"use client";

import React from "react";
import { createPortal } from "react-dom";

type Billing = "monthly" | "yearly";

type MegaBlock = {
  title: string;
  items: string[];
};

type PlanMega = {
  title: string;
  subtitle?: string;
  blocks: MegaBlock[];
  footnote?: string;
};

type Plan = {
  key: "trial" | "small" | "mid" | "enterprise";
  title: string;
  desc: string; // допускает \n
  priceMonthly: number | null; // null = индивидуально
  noteUnderPrice?: string;
  integrationNote?: string;
  paramsTitle: string;
  params: string[];
  cta: string;
  variant?: "primary" | "outline";
  featured?: boolean;

  mega: PlanMega;
  previewLines: string[];
};

const PLANS: Plan[] = [
  {
    key: "trial",
    title: "Тестовый",
    desc: "Соберите первых\nассистентов и оцените\nинтерфейс, аналитику\nи логику работы.",
    priceMonthly: 0,
    noteUnderPrice: "0 ₽ / бессрочно",
    paramsTitle: "Ключевые параметры",
    params: ["2 кастомных агента", "2 готовых агента", "До 1 000 сообщений / мес"],
    cta: "Попробовать",
    variant: "outline",
    previewLines: ["Uni-6 Nano", "1 000 сообщений/мес", "2 кастомных + 2 шаблонных"],
    mega: {
      title: "Тестовый",
      subtitle: "Чтобы без риска посмотреть интерфейс и поведение ассистентов.",
      blocks: [
        {
          title: "Лимиты",
          items: [
            "0 ₽ / бессрочно",
            "Модель: Uni-6 Nano (только она)",
            "Сообщения: 1 000 / месяц (можно поднять до 2 000 при необходимости)",
            "Агенты: до 2 созданных с нуля + до 2 шаблонных",
          ],
        },
        {
          title: "Нет",
          items: [
            "Настройки параметров генерации",
            "Управление базой знаний и RAG",
            "Обучение на реакциях (Reaction RAG)",
            "Батчинг сообщений",
            "Выбор модели",
          ],
        },
        {
          title: "Поддержка",
          items: ["Только база знаний + e-mail/чат по остаточному принципу"],
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
    paramsTitle: "Ключевые параметры",
    params: ["5 кастомных агентов", "+ вся библиотека готовых", "До 5 000 сообщений / мес"],
    cta: "Выбрать тариф",
    variant: "outline",
    previewLines: ["Uni-6 Nano + Uni-6 Mini", "Telegram + ещё 1 канал", "2–4 часа помощи/мес"],
    mega: {
      title: "Малый",
      subtitle:
        "Для собственника, который готов разбираться по инструкциям и периодически получать помощь ЮНИ.",
      blocks: [
        {
          title: "Кому",
          items: [
            "Предприниматель / собственник",
            "Сам внедряет по инструкциям",
            "Иногда подключает эксперта ЮНИ для правок и консультаций",
          ],
        },
        {
          title: "Лимиты и каналы",
          items: [
            "Сообщения: до 5 000 / мес",
            "Агенты: 5 активных кастомных + вся библиотека готовых",
            "Каналы: Telegram + ещё 1 (VK / WhatsApp по мере готовности)",
            "Модели: Uni-6 Nano + Uni-6 Mini",
          ],
        },
        {
          title: "Функции и поддержка",
          items: [
            "Полная база знаний и RAG",
            "Reaction RAG (обучение на реакциях)",
            "Батчинг сообщений",
            "Настройка параметров генерации",
            "Поддержка: 2–4 часа консультаций/правок в месяц + стандартные SLA",
          ],
        },
      ],
      footnote: "* Стоимость интеграций зависит от состава систем и глубины сценариев.",
    },
  },
  {
    key: "mid",
    title: "Средний",
    desc: "Для масштабирования\nдействующих процессов.\nПолноценная интеграция\nпод ключ командой ЮНИ.",
    priceMonthly: 39900,
    integrationNote: "интеграции: от 179 900₽ / разово *",
    paramsTitle: "Ключевые параметры",
    params: ["10 кастомных агентов", "+ вся библиотека готовых", "До 30 000 сообщений / мес"],
    cta: "Подключить сейчас",
    variant: "primary",
    featured: true,
    previewLines: ["Uni-6 Pro", "До 4 каналов", "PM + 12 часов/мес"],
    mega: {
      title: "Средний",
      subtitle:
        "Для руководителей продаж/маркетинга и команд, которым нужно управляемое масштабирование процессов.",
      blocks: [
        {
          title: "Кому",
          items: ["Директор по развитию", "Коммерческий директор", "Руководитель продаж", "Маркетолог"],
        },
        {
          title: "Лимиты и каналы",
          items: [
            "Сообщения: до 30 000 / мес",
            "Агенты: 10 активных кастомных + вся библиотека готовых",
            "Каналы: до 4 (TG, VK, WhatsApp, сайт-виджет, позже Авито)",
            "Модель: Uni-6 Pro",
          ],
        },
        {
          title: "Фичи и сопровождение",
          items: [
            "Всё из малого пакета",
            "Расширенная аналитика и отчёты",
            "Гибкие настройки RAG: несколько баз знаний, top-K, порог и т.п.",
            "Закреплённый проектный менеджер",
            "До 12 часов команды в месяц: обновление базы знаний, доработка промптов, A/B тесты, разбор аналитики и рекомендации",
          ],
        },
      ],
      footnote: "* Стоимость интеграций зависит от состава систем и глубины сценариев.",
    },
  },
  {
    key: "enterprise",
    title: "Энтерпрайз",
    desc: "Для крупных компаний:\nмакс. персонализация,\nSLA и постоянное\nвовлечение команды ЮНИ.",
    priceMonthly: 99900,
    integrationNote: "условия: индивидуально",
    paramsTitle: "Ключевые параметры",
    params: ["Индивидуальные лимиты", "Максимум персонализации", "Без ограничений"],
    cta: "Заказать звонок",
    variant: "outline",
    previewLines: ["White-glove", "Uni-6 Pro / Pro+", "Безлимит агентов и каналов"],
    mega: {
      title: "Энтерпрайз",
      subtitle: "Когда нужен максимум качества, контроля, SLA и постоянное вовлечение команды ЮНИ.",
      blocks: [
        {
          title: "Кому",
          items: [
            "Маркетолог крупной компании",
            "Head of Digital",
            "Руководитель AI-направления",
            "Контакт-центр и смежные функции",
          ],
        },
        {
          title: "Лимиты и каналы",
          items: [
            "Сообщения: индивидуально",
            "Агенты: безлимит",
            "Каналы: все + кастомные интеграции (включая несколько Telegram-ботов, группы, сайт)",
            "Модели: Uni-6 Pro и Uni-6 Pro+",
          ],
        },
        {
          title: "Функции и сопровождение",
          items: [
            "Приоритетный доступ к новым фичам",
            "Расширенная аналитика и кастомные отчёты",
            "Продвинутые функции Reaction RAG, сложный RAG, много баз знаний",
            "White-glove сервис: ведущий PM",
            "40 часов команды/месяц + регулярные стратегические созвоны и roadmap по AI в компании",
          ],
        },
      ],
    },
  },
];

type ServiceCard = {
  title: string;
  subtitle: string;
  bullets: string[];
  chips: string[];
};

const SERVICES: ServiceCard[] = [
  {
    title: "Обучение команд / Консалтинг",
    subtitle:
      "Обучаем руководителей и команды тому, как применять нейросети в ежедневной работе и получать измеримый эффект.",
    chips: ["Руководители", "Команды", "Практика", "Результат"],
    bullets: [
      "Документация, регламенты, база знаний",
      "Отчёты, аналитика, KPI, управленческие сводки",
      "Таблицы, расчёты, финмодели, Excel-рутины",
      "Договоры, письма, коммерческие предложения",
      "Сценарии, промпты, стандарты качества ответов",
    ],
  },
  {
    title: "Индивидуальная разработка",
    subtitle:
      "Проектная разработка решений под вашу задачу: от идеи и ТЗ до готового внедрения и сопровождения.",
    chips: ["Проектно", "Под ключ", "Интеграции", "Сопровождение"],
    bullets: [
      "Сбор требований и формализация задачи",
      "Проектирование логики, ролей, сценариев",
      "Разработка MVP и доведение до итоговой версии",
      "Интеграции с сервисами, CRM/ERP, площадками",
      "Запуск, контроль качества, улучшения по данным",
    ],
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

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function safePrice(billing: Billing, p: Plan) {
  if (p.priceMonthly === null) return null;
  if (p.priceMonthly === 0) return 0;
  if (billing === "monthly") return p.priceMonthly;
  return Math.round(p.priceMonthly * 0.8);
}

function MegaMenu({
  openKey,
  onClose,
}: {
  openKey: Plan["key"] | null;
  onClose: () => void;
}) {
  const [mounted, setMounted] = React.useState(false);
  const [entered, setEntered] = React.useState(false);

  const plan = React.useMemo(
    () => PLANS.find((p) => p.key === openKey) ?? null,
    [openKey]
  );

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!openKey) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t = window.setTimeout(() => setEntered(true), 10);

    return () => {
      window.clearTimeout(t);
      setEntered(false);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [openKey, onClose]);

  if (!mounted || !plan) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div
        className={[
          "absolute inset-0 bg-black/35 backdrop-blur-[10px] transition-opacity duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          entered ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onMouseDown={onClose}
      />

      <div className="absolute left-1/2 top-1/2 w-[min(980px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2">
        <div
          className={[
            "lg-border rounded-[34px] border border-white/22 bg-white/10 shadow-[0_30px_110px_rgba(0,0,0,0.22)] backdrop-blur-[26px] backdrop-saturate-150 overflow-hidden transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
            entered
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-[0.985] translate-y-[10px]",
          ].join(" ")}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(900px_420px_at_20%_0%,rgba(255,255,255,0.12),transparent_60%),radial-gradient(900px_420px_at_80%_100%,rgba(199,63,64,0.10),transparent_65%)]" />
          <div className="pointer-events-none absolute inset-0 rounded-[34px] ring-1 ring-white/12" />

          <div className="relative bg-white/86">
            <div className="flex items-start justify-between gap-4 px-7 pt-7">
              <div>
                <div className="text-[18px] sm:text-[20px] font-semibold tracking-[-0.01em] text-[#0f172a]">
                  {plan.mega.title}
                </div>
                {plan.mega.subtitle ? (
                  <div className="mt-1 text-[13px] sm:text-[14px] leading-[1.4] text-[#667085]">
                    {plan.mega.subtitle}
                  </div>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2">
                  {plan.previewLines.map((t) => (
                    <span
                      key={t}
                      className="
                        rounded-full
                        border border-black/10
                        bg-white
                        px-3 py-1
                        text-[12px]
                        font-semibold
                        text-[#0f172a]
                        shadow-[0_10px_26px_rgba(0,0,0,0.04)]
                      "
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="
                  lg-border
                  grid h-10 w-10 place-items-center
                  rounded-full
                  border border-black/10
                  bg-white/65
                  text-[#0f172a]
                  shadow-[0_10px_26px_rgba(0,0,0,0.06)]
                  transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                  hover:scale-[1.04] active:scale-[0.98]
                "
                aria-label="Закрыть"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mt-6 grid gap-3 px-7 pb-7 md:grid-cols-3">
              {plan.mega.blocks.map((b) => (
                <div
                  key={b.title}
                  className="
                    lg-border
                    rounded-[20px]
                    border border-black/10
                    bg-white
                    p-5
                    shadow-[0_16px_45px_rgba(0,0,0,0.05)]
                  "
                >
                  <div className="text-[13px] font-semibold text-[#0f172a]">{b.title}</div>

                  <ul className="mt-3 space-y-2">
                    {b.items.map((it) => (
                      <li
                        key={it}
                        className="flex items-start gap-2 text-[13px] leading-[1.45] text-[#475467]"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[8px] h-[7px] w-[7px] shrink-0 rounded-full bg-[#c73f40]/70"
                        />
                        <span className="min-w-0">{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {plan.mega.footnote ? (
              <div className="px-7 pb-7 text-[12px] text-[#98A2B3]">{plan.mega.footnote}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function IntegrationMegaMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = React.useState(false);
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t = window.setTimeout(() => setEntered(true), 10);

    return () => {
      window.clearTimeout(t);
      setEntered(false);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const blocks: MegaBlock[] = [
    { title: "Диагностика", items: ["Аудит", "Фиксация целей и метрик результата"] },
    { title: "Проектирование", items: ["Разработка ТЗ", "Декомпозиция сценариев и ролей"] },
    {
      title: "Знания и промпты",
      items: [
        "Адаптация документов и информации для базы знаний",
        "Упаковка базы знаний",
        "Написание промптов",
      ],
    },
    {
      title: "Сборка и запуск",
      items: [
        "Разработка MVP-версии",
        "Тестирование",
        "Внесение правок",
        "Доработка до итоговой версии",
      ],
    },
    {
      title: "Интеграции",
      items: ["Интеграции с сервисами/площадками/платформами, CRM, ERP", "Права, маршрутизация, события"],
    },
    { title: "Сопровождение", items: ["Контроль качества", "Улучшения по аналитике и данным", "План развития (roadmap)"] },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div
        className={[
          "absolute inset-0 bg-black/35 backdrop-blur-[10px] transition-opacity duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          entered ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onMouseDown={onClose}
      />

      <div className="absolute left-1/2 top-1/2 w-[min(980px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2">
        <div
          className={[
            "lg-border rounded-[34px] border border-white/22 bg-white/10 shadow-[0_30px_110px_rgba(0,0,0,0.22)] backdrop-blur-[26px] backdrop-saturate-150 overflow-hidden transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
            entered
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-[0.985] translate-y-[10px]",
          ].join(" ")}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(900px_420px_at_20%_0%,rgba(255,255,255,0.12),transparent_60%),radial-gradient(900px_420px_at_80%_100%,rgba(199,63,64,0.10),transparent_65%)]" />
          <div className="pointer-events-none absolute inset-0 rounded-[34px] ring-1 ring-white/12" />

          <div className="relative bg-white/86">
            <div className="flex items-start justify-between gap-4 px-7 pt-7">
              <div>
                <div className="text-[18px] sm:text-[20px] font-semibold tracking-[-0.01em] text-[#0f172a]">
                  Интеграции под ключ
                </div>
                <div className="mt-1 text-[13px] sm:text-[14px] leading-[1.4] text-[#667085]">
                  Прозрачный процесс: от аудита и ТЗ до запуска, интеграций и сопровождения.
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {["Аудит", "ТЗ", "База знаний", "MVP", "Интеграции", "Сопровождение"].map((t) => (
                    <span
                      key={t}
                      className="
                        rounded-full
                        border border-black/10
                        bg-white
                        px-3 py-1
                        text-[12px]
                        font-semibold
                        text-[#0f172a]
                        shadow-[0_10px_26px_rgba(0,0,0,0.04)]
                      "
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="
                  lg-border
                  grid h-10 w-10 place-items-center
                  rounded-full
                  border border-black/10
                  bg-white/65
                  text-[#0f172a]
                  shadow-[0_10px_26px_rgba(0,0,0,0.06)]
                  transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                  hover:scale-[1.04] active:scale-[0.98]
                "
                aria-label="Закрыть"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mt-6 grid gap-3 px-7 pb-7 md:grid-cols-2">
              {blocks.map((b) => (
                <div
                  key={b.title}
                  className="
                    lg-border
                    rounded-[20px]
                    border border-black/10
                    bg-white
                    p-5
                    shadow-[0_16px_45px_rgba(0,0,0,0.05)]
                  "
                >
                  <div className="text-[13px] font-semibold text-[#0f172a]">{b.title}</div>

                  <ul className="mt-3 space-y-2">
                    {b.items.map((it) => (
                      <li
                        key={it}
                        className="flex items-start gap-2 text-[13px] leading-[1.45] text-[#475467]"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[8px] h-[7px] w-[7px] shrink-0 rounded-full bg-[#c73f40]/70"
                        />
                        <span className="min-w-0">{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="px-7 pb-7 text-[12px] text-[#98A2B3]">
              * Стоимость интеграций зависит от состава систем и глубины сценариев.
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function PricingPlansSection() {
  const [billing, setBilling] = React.useState<Billing>("monthly");
  const [openKey, setOpenKey] = React.useState<Plan["key"] | null>(null);
  const [integrationOpen, setIntegrationOpen] = React.useState(false);

  const openMega = React.useCallback((key: Plan["key"]) => setOpenKey(key), []);
  const closeMega = React.useCallback(() => setOpenKey(null), []);

  const openIntegration = React.useCallback(() => setIntegrationOpen(true), []);
  const closeIntegration = React.useCallback(() => setIntegrationOpen(false), []);

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

          {/* Billing switch */}
          <div className="mt-7 flex justify-center">
            <div
              role="tablist"
              aria-label="Вариант оплаты"
              className="
                lg-border
                w-[min(520px,100%)]
                rounded-[999px]
                border border-white/22
                bg-white/10
                p-2
                backdrop-blur-[22px] backdrop-saturate-150
                shadow-[0_22px_70px_rgba(0,0,0,0.05)]
                flex items-center gap-2 justify-between
              "
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
                  "active:scale-[0.99]",
                  billing === "yearly"
                    ? "bg-white/85 text-[#0f172a] shadow-[0_16px_45px_rgba(0,0,0,0.08)]"
                    : "text-white/75 hover:text-white hover:scale-[1.02]",
                ].join(" ")}
              >
                Годовой
              </button>

              {/* -20%: белый фон по умолчанию, при выборе yearly текст красный */}
              <button
                type="button"
                onClick={() => setBilling("yearly")}
                aria-label="Скидка 20% при годовой оплате"
                aria-pressed={billing === "yearly"}
                className="h-10 p-0 active:scale-[0.99] transition-transform duration-[900ms] ease-out"
              >
                <span
                  className={[
                    "inline-flex h-10 items-center rounded-[999px] px-4",
                    "bg-white/85 border border-white/10 shadow-[0_16px_45px_rgba(0,0,0,0.08)]",
                    "text-[12px] font-semibold transition-colors duration-[600ms]",
                    billing === "yearly" ? "text-[#c73f40]" : "text-[#0f172a]",
                  ].join(" ")}
                >
                  -20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Общий контейнер карточек (упаковку НЕ меняем) */}
        <div className="relative mx-auto mt-10 max-w-[1240px]">
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
            <div className="pointer-events-none absolute inset-0 rounded-[40px] ring-1 ring-white/10" />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {PLANS.map((p) => {
                const price = safePrice(billing, p);
                const priceText = price === null ? "Индивидуально" : formatRub(price);

                return (
                  <div
                    key={p.key}
                    className={[
                      "relative overflow-hidden rounded-[26px] border border-white/22 bg-white/65 shadow-[0_18px_55px_rgba(0,0,0,0.03)] backdrop-blur-[20px] backdrop-saturate-150 p-6">"relative overflow-hidden rounded-[26px] border border-white/22 bg-white/65 shadow-[0_18px_55px_rgba(0,0,0,0.03)] backdrop-blur-[20px] backdrop-saturate-150 p-6",
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
                          <div className="text-[26px] font-semibold text-[#41e18b] tracking-[-0.02em]">
                            {priceText}
                          </div>

                          {price !== null ? (
                            <div className="pb-[3px] text-[16px] text-[#98A2B3]">/ мес</div>
                          ) : null}
                        </div>

                        {p.noteUnderPrice ? (
                          <div className="mt-1 text-[12px] text-[#98A2B3]">{p.noteUnderPrice}</div>
                        ) : null}

                        {p.integrationNote ? (
                          <div className="mt-1 text-[12px] text-[#98A2B3]">{p.integrationNote}</div>
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
                        onClick={() => openMega(p.key)}
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

                      {/* Плейсхолдер: размытый текст + клик -> MegaMenu */}
                      <div
                        className="
                          lg-border
                          mt-4
                          h-[92px]
                          w-full
                          rounded-[18px]
                          border border-black/2
                          bg-white/60
                          shadow-[0_16px_45px_rgba(0,0,0,0.02)]
                          relative overflow-hidden
                        "
                      >
                        <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(600px_160px_at_25%_0%,rgba(255,255,255,0.40),transparent_60%),radial-gradient(600px_160px_at_85%_100%,rgba(199,63,64,0.08),transparent_65%)]" />

                        <div className="absolute inset-0 p-4">
                          <div
                            className="text-[12px] leading-[1.35] text-[#475467] whitespace-pre-line"
                            style={{
                              filter: "blur(6px)",
                              opacity: 0.78,
                              transform: "translateZ(0)",
                            }}
                          >
                            {p.previewLines.join("\n")}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => openMega(p.key)}
                          className="absolute inset-0 cursor-pointer bg-transparent"
                          aria-label={`Открыть подробности тарифа ${p.title}`}
                        />
                      </div>

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

        {/* Под-секция (2 карточки) вместо старых “Доп-услуг” */}
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
            <div className="relative overflow-hidden rounded-[26px] border border-white/22 bg-white/65 shadow-[0_18px_55px_rgba(0,0,0,0.03)] backdrop-blur-[20px] backdrop-saturate-150 p-6">
              <div className="grid gap-3 md:grid-cols-2">
                {SERVICES.map((s) => (
                  <div
                    key={s.title}
                    className="
                      relative
                      lg-border
                      rounded-[18px]
                      border border-white/22
                      bg-white/10
                      p-5
                      shadow-[0_20px_60px_rgba(0,0,0,0.03)]
                      backdrop-blur-[22px] backdrop-saturate-150
                      h-full
                    "
                  >
                    <div className="text-[16px] font-semibold text-[#0f172a] tracking-[-0.01em]">
                      {s.title}
                    </div>

                    <div className="mt-2 text-[13px] leading-[1.45] text-[#475467]">
                      {s.subtitle}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {s.chips.map((t) => (
                        <span
                          key={t}
                          className="
                            rounded-full
                            border border-black/10
                            bg-white
                            px-3 py-1
                            text-[12px]
                            font-semibold
                            text-[#0f172a]
                            shadow-[0_10px_26px_rgba(0,0,0,0.04)]
                          "
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <ul className="mt-4 space-y-2">
                      {s.bullets.map((it) => (
                        <li
                          key={it}
                          className="flex items-start gap-2 text-[13px] leading-[1.45] text-[#475467]"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[8px] h-[7px] w-[7px] shrink-0 rounded-full bg-[#c73f40]/70"
                          />
                          <span className="min-w-0">{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-[12px] text-[#98A2B3]">
                  * Стоимость интеграций зависит от состава систем и глубины сценариев.
                </div>

                <button
                  type="button"
                  onClick={openIntegration}
                  className="
                    inline-flex items-center gap-2
                    text-[12px] font-semibold
                    text-[#0f172a]
                    hover:text-[#c73f40]
                    transition-colors duration-[600ms]
                  "
                >
                  Подробнее <EyeIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MegaMenu openKey={openKey} onClose={closeMega} />
      <IntegrationMegaMenu open={integrationOpen} onClose={closeIntegration} />
    </section>
  );
}
