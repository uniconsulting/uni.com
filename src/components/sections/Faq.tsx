"use client";

import React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type FaqItem = {
  q: string;
  a: string;
};

const FAQ: FaqItem[] = [
  {
    q: "Чем ЮНИ отличается от «просто чат-бота»?",
    a: "ЮНИ — это не скриптовый бот с кнопками. Это полноценные ИИ-сотрудники, которые понимают контекст, ведут естественный диалог, помнят историю общения и могут решать сложные задачи. Они обучаются на вашей базе знаний и адаптируются под специфику бизнеса. Это как нанять умного менеджера, который работает 24/7 без выходных и больничных.",
  },
  {
    q: "Нужны ли программисты со стороны клиента?",
    a: "Нет. Вся настройка происходит в визуальном интерфейсе без кода. Для интеграций с CRM/ERP наши специалисты подготовят все необходимое. Вам понадобится только доступ к нужным системам и человек, который понимает бизнес-процессы.",
  },
  {
    q: "Сколько времени занимает внедрение?",
    a: "Базовый запуск — от 1 дня. Полноценное внедрение с интеграцией в CRM, обучением на базе знаний и настройкой сценариев — 2–4 недели. Мы сопровождаем вас на каждом этапе и проводим еженедельные улучшения по методологии Kaizen.",
  },
  {
    q: "Можно ли подключить нашу CRM?",
    a: "Да, мы интегрируемся с популярными CRM: Битрикс24, amoCRM, 1С, Мегаплан и другие. Для нестандартных систем делаем кастомную интеграцию через API. Данные о клиентах синхронизируются в реальном времени.",
  },
  {
    q: "Что насчет безопасности данных?",
    a: "Безопасность — приоритет. Все данные шифруются при передаче и хранении (TLS 1.3, AES-256). Серверы расположены в России, соответствие 152-ФЗ. Для Enterprise доступен вариант on-premise с размещением на ваших серверах.",
  },
  {
    q: "Как происходит обучение ИИ под наш бизнес?",
    a: "Вы загружаете базу знаний: прайсы, скрипты продаж, FAQ, описания услуг. ИИ анализирует материалы и начинает отвечать как ваш сотрудник. Можно добавлять примеры идеальных диалогов. Мы помогаем структурировать информацию для лучших результатов.",
  },
  {
    q: "Что если ИИ ответит неправильно?",
    a: "В аналитике вы видите все диалоги и можете отмечать ошибки. Мы оперативно корректируем модель. Для критичных сценариев настраиваем передачу на живого оператора. С каждой неделей качество ответов растет благодаря постоянным улучшениям.",
  },
  {
    q: "Работаете ли вы с Казахстаном?",
    a: "Да, ЮНИ работает в России и Казахстане. Поддерживаем русский и казахский языки. Оплата возможна в рублях или тенге. Все юридические вопросы решаем — работаем как с ИП/ООО, так и с ТОО.",
  },
  {
    q: "Какие каналы поддерживаются?",
    a: "Telegram, VK, Avito, WhatsApp (через официальный API), виджет на сайте, интеграция в мобильное приложение. На тарифе Enterprise — любые кастомные каналы. Один агент может работать во всех каналах одновременно.",
  },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className={[
        "ml-4 inline-flex h-10 w-10 items-center justify-center",
        "rounded-full lg-border border border-black/10", // кнопка на белом фоне -> тонкий серый бордюр
        "bg-white/70 backdrop-blur-[14px]",
        "shadow-[0_12px_28px_rgba(0,0,0,0.06)]",
        "transition-transform duration-500",
        open ? "rotate-180" : "rotate-0",
      ].join(" ")}
      aria-hidden="true"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M6.5 9.5L12 15l5.5-5.5"
          stroke="#0f172a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function FaqSection() {
  const reduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <section id="faq" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-[1240px] px-4">
        <div className="mx-auto max-w-[1240px] text-center">
          <h2 className="text-white font-semibold leading-[0.95] tracking-[-0.02em] text-[24px] sm:text-[32px] lg:text-[42px]">
            Часто задаваемые вопросы
          </h2>
        </div>

        <div className="mt-8 md:mt-10 space-y-4">
          {FAQ.map((item, idx) => {
            const open = openIndex === idx;
            const contentId = `faq-panel-${idx}`;
            const buttonId = `faq-button-${idx}`;

            return (
              <div key={item.q} className="group">
                {/* внешний pill: r=34, при раскрытии только растёт по высоте */}
                <div
                  className={[
                    "lg-border rounded-[34px] border border-white/18",
                    "bg-white/10 p-[10px]",
                    "shadow-[0_22px_70px_rgba(0,0,0,0.05)]",
                    "backdrop-blur-[26px] backdrop-saturate-150",
                    "transition-[transform,background-color] duration-500",
                    "group-hover:-translate-y-[1px] group-hover:bg-white/12",
                  ].join(" ")}
                >
                  {/* внутренний фрейм вопроса: r=26, bg-white/82 */}
                  <div className="lg-border rounded-[26px] border border-white/18 bg-white/82 px-5 py-4">
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={open}
                      aria-controls={contentId}
                      onClick={() => setOpenIndex((p) => (p === idx ? null : idx))}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-[#0f172a] font-semibold tracking-[-0.01em] text-[14px] sm:text-[16px]">
                          {item.q}
                        </div>
                        <Chevron open={open} />
                      </div>
                    </button>

                    {/* ответ внутри того же pill: просто увеличивает высоту */}
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          id={contentId}
                          role="region"
                          aria-labelledby={buttonId}
                          initial={
                            reduceMotion
                              ? { opacity: 1, height: "auto" }
                              : { opacity: 0, height: 0 }
                          }
                          animate={
                            reduceMotion
                              ? { opacity: 1, height: "auto" }
                              : { opacity: 1, height: "auto" }
                          }
                          exit={
                            reduceMotion
                              ? { opacity: 0, height: 0 }
                              : { opacity: 0, height: 0 }
                          }
                          transition={
                            reduceMotion
                              ? { duration: 0.01 }
                              : { duration: 0.55, ease: EASE }
                          }
                          className="overflow-hidden"
                        >
                          {/* фрейм ответа: r=18, bg-white */}
                          <div className="mt-4 rounded-[18px] lg-border border border-white/18 bg-white px-5 py-4 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
                            <div className="text-[#0f172a] text-[12px] sm:text-[13px] leading-[1.45]">
                              {item.a}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
