"use client";

import React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type QualityCard = {
  title: string; // одно слово справа от бейджа
  badge: string; // текст внутри бейджа (меняет цвет при hover)
  desc: string;  // 1-2 строки
};

const CARDS: QualityCard[] = [
  {
    title: "Кайдзен",
    badge: "改善",
    desc: "Ежедневные улучшения без хаоса и лишней сложности.",
  },
  {
    title: "Lean",
    badge: "精益",
    desc: "Убираем потери и усиливаем пользу в каждом шаге процесса.",
  },
  {
    title: "ДАО",
    badge: "道",
    desc: "Логика, где система работает мягко, но стабильно и предсказуемо.",
  },
  {
    title: "Стабильность",
    badge: "安定",
    desc: "Поведение продукта одинаковое сегодня, завтра и через месяц.",
  },
  {
    title: "Прочность",
    badge: "強靭",
    desc: "Запас надежности в архитектуре, данных и сценариях.",
  },
  {
    title: "Внедрение",
    badge: "導入",
    desc: "Аккуратная интеграция без поломки текущих процессов.",
  },
  {
    title: "Документы",
    badge: "仕様",
    desc: "Понятные инструкции, регламенты и схема работы для команды.",
  },
  {
    title: "Контроль",
    badge: "検査",
    desc: "Проверки качества и мониторинг, чтобы не ловить сюрпризы.",
  },
  {
    title: "Безопасность",
    badge: "安全",
    desc: "Минимизируем риски: доступы, данные, сценарии и аудит.",
  },
  {
    title: "Поддержка",
    badge: "支援",
    desc: "Не исчезаем после запуска: ведем, улучшаем, усиливаем эффект.",
  },
];

function usePhraseCycle(enabled: boolean, ms = 5000) {
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    if (!enabled) return;
    const t = window.setInterval(() => setIdx((p) => (p + 1) % 2), ms);
    return () => window.clearInterval(t);
  }, [enabled, ms]);

  return idx;
}

export default function JapanQuality() {
  const reduceMotion = useReducedMotion();
  const phraseIdx = usePhraseCycle(!reduceMotion, 5000);

  const phraseA = (
    <>
      В каждом продукте заложен большой
      <br />
      ресурс прочности и стабильности.
    </>
  );

  const phraseB = (
    <>
      В основах нашего подхода
      <br />
      лежат методы бережливого производства,
      <br />
      принципы кайдзен и ДАО.
    </>
  );

  const rotatingText = phraseIdx === 0 ? phraseA : phraseB;

  const cardIn = {
    hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.75, ease: EASE, delay: 0.06 * i },
    }),
  } as const;

  return (
    <section id="japanese-quality" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-[1240px] px-4">
        {/* Заголовок по центру, без анимаций */}
        <div className="text-center">
          <h2 className="text-white font-semibold leading-[0.95] tracking-[-0.02em] text-[24px] sm:text-[32px] lg:text-[42px]">
            Японское качество
          </h2>

          {/* Ротация текста, фиксируем высоту под 3 строки чтобы не прыгали карточки */}
          <div className="mt-3 flex justify-center">
            <div
              className="
                text-white font-semibold tracking-[-0.01em]
                text-[16px] sm:text-[20px] lg:text-[20px]
                leading-[1.25]
                min-h-[3.75em]
                flex items-center
                text-center
              "
            >
              {reduceMotion ? (
                rotatingText
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={phraseIdx}
                    initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
                    transition={{ duration: 0.8, ease: EASE }}
                  >
                    {rotatingText}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        {/* Карточки */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CARDS.map((c, i) => (
            <motion.div
              key={c.title}
              custom={i}
              variants={cardIn}
              initial={reduceMotion ? false : "hidden"}
              whileInView={reduceMotion ? undefined : "show"}
              viewport={{ once: true, amount: 0.35 }}
              whileHover={
                reduceMotion
                  ? undefined
                  : { y: -2, transition: { duration: 0.35, ease: EASE } }
              }
              className="group"
            >
              {/* стекляшка: внешний контур 34, внутренний 26, отступ 10px */}
              <div className="lg-border rounded-[34px] border border-white/18 bg-white/10 p-[10px] shadow-[0_18px_55px_rgba(0,0,0,0.06)] backdrop-blur-[26px] backdrop-saturate-150">
                <div className="lg-border rounded-[26px] border border-white/18 bg-white/82 p-5 text-[#0f172a] shadow-[0_14px_40px_rgba(0,0,0,0.04)]">
                  {/* верхняя строка: бейдж слева, title справа по одной линии */}
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        lg-border
                        inline-flex items-center justify-center
                        rounded-full border border-white/18
                        bg-white/70 backdrop-blur-[14px]
                        px-3 h-8
                        shadow-[0_10px_26px_rgba(0,0,0,0.06)]
                      "
                    >
                      <span
                        className="
                          text-[12px] font-semibold tabular-nums
                          text-[#0f172a]
                          transition-colors duration-[900ms]
                          group-hover:text-[#c73f40]
                        "
                      >
                        {c.badge}
                      </span>
                    </div>

                    <div className="text-[14px] font-semibold leading-none text-[#0f172a]">
                      {c.title}
                    </div>
                  </div>

                  {/* описание */}
                  <div className="mt-3 text-[12px] leading-[1.35] text-[#0f172a]/80">
                    {c.desc}
                  </div>

                  {/* фиксируем визуально одинаковую высоту карточек */}
                  <div className="h-2" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
