"use client";

import React from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

type Card = {
  title: string;
  badge: string;
  desc: string;
};

const CARDS: Card[] = [
  { title: "Кайдзен", badge: "改善", desc: "Ежедневные улучшения, которые дают накопительный эффект." },
  { title: "Lean", badge: "精益", desc: "Убираем лишнее, усиливаем ценность и скорость решений." },
  { title: "ДАО", badge: "道", desc: "Логика потока: проще, чище, без суеты и перегруза." },
  { title: "Стабильность", badge: "安定", desc: "Предсказуемая работа системы в реальных условиях бизнеса." },
  { title: "Прочность", badge: "堅牢", desc: "Запас устойчивости под рост нагрузки и сложность процессов." },
  { title: "Внедрение", badge: "導入", desc: "Интеграция без ломки: аккуратно встраиваемся в текущие процессы." },
  { title: "Документация", badge: "手順", desc: "Понятные инструкции, чтобы команда не зависела от одного человека." },
  { title: "Контроль", badge: "検査", desc: "Проверка качества на критичных этапах, чтобы не было сюрпризов." },
  { title: "Безопасность", badge: "安全", desc: "Доступы, данные, контуры, правила. Всё аккуратно и по делу." },
  { title: "Поддержка", badge: "支援", desc: "Не исчезаем после запуска: доводим до стабильного результата." },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Turbopack-safe CSS (без template literals внутри JSX)
const JQ_STYLE =
  "@media (prefers-reduced-motion: reduce){.jq-sweep{animation:none !important;}}" +
  "@keyframes jqBadgeSweep{0%{transform:translateX(-120%) rotate(10deg);}100%{transform:translateX(160%) rotate(10deg);}}";

export default function JapanQuality() {
  const reduceMotion = useReducedMotion();

  // циклический текст под заголовком (5 сек / 5 сек)
  const [phraseIdx, setPhraseIdx] = React.useState(0);

  React.useEffect(() => {
    if (reduceMotion) return;
    const t = window.setInterval(() => setPhraseIdx((p) => (p === 0 ? 1 : 0)), 5000);
    return () => window.clearInterval(t);
  }, [reduceMotion]);

  const RotatingText =
    phraseIdx === 0 ? (
      <>
        В каждом продукте заложен большой
        <br />
        ресурс прочности и стабильности.
      </>
    ) : (
      <>
        В основах нашего подхода
        <br />
        лежат методы бережливого производства,
        <br />
        принципы кайдзен и ДАО.
      </>
    );

  const cardIn: Variants = {
    hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.55,
        ease: EASE,
        delay: 0.06 + i * 0.04,
      },
    }),
  };

  const hoverCard: Variants = reduceMotion
    ? {}
    : {
        rest: { y: 0, scale: 1 },
        hover: {
          y: -2,
          scale: 1.01,
          transition: { duration: 0.55, ease: EASE },
        },
      };

  const badgeText: Variants = reduceMotion
    ? {}
    : {
        rest: { color: "#0f172a" },
        hover: { color: "#c73f40", transition: { duration: 0.9, ease: EASE } },
      };

  return (
    <section id="japanese-quality" className="relative py-14 md:py-20">
      <style dangerouslySetInnerHTML={{ __html: JQ_STYLE }} />

      <div className="mx-auto max-w-[1240px] px-4">
        {/* Заголовок по центру, без анимаций */}
        <div className="mx-auto max-w-[1240px] text-center">
          <h2 className="text-white font-semibold leading-[0.95] tracking-[-0.02em] text-[24px] sm:text-[32px] lg:text-[42px]">
            Японское качество
          </h2>

          {/* Текст, который меняется каждые 5 секунд */}
          <div className="mt-3 text-white font-semibold tracking-[-0.01em] text-[16px] sm:text-[20px] lg:text-[20px]">
            {reduceMotion ? (
              RotatingText
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={phraseIdx}
                  initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
                  transition={{ duration: 0.75, ease: EASE }}
                >
                  {RotatingText}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Сетка карточек */}
        <div className="mt-10 md:mt-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CARDS.map((c, i) => (
              <motion.div
                key={c.title}
                custom={i}
                variants={cardIn}
                initial={reduceMotion ? false : "hidden"}
                whileInView={reduceMotion ? undefined : "show"}
                viewport={{ once: true, amount: 0.35 }}
                className={[
                  "lg-border",
                  "rounded-[34px] border border-white/18 bg-white/10",
                  "p-[10px]",
                  "backdrop-blur-[24px] backdrop-saturate-150",
                  "shadow-[0_18px_55px_rgba(0,0,0,0.05)]",
                  "min-h-[170px]",
                ].join(" ")}
              >
                <motion.div
                  variants={hoverCard}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  className={[
                    "group",
                    "lg-border",
                    "relative overflow-hidden",
                    "h-full",
                    "rounded-[26px] border border-white/18",
                    "bg-white/82",
                    "p-5",
                    "shadow-[0_12px_35px_rgba(0,0,0,0.04)]",
                    "backdrop-blur-[18px] backdrop-saturate-150",
                    "transition-shadow duration-500",
                    "hover:shadow-[0_20px_60px_rgba(0,0,0,0.10)]",
                  ].join(" ")}
                >
                  {/* лёгкий внутренний блик */}
                  <div className="pointer-events-none absolute inset-0 rounded-[26px] opacity-70 bg-[radial-gradient(220px_140px_at_30%_20%,rgba(255,255,255,0.55),transparent_60%),radial-gradient(240px_160px_at_70%_90%,rgba(199,63,64,0.08),transparent_65%)]" />

                  <div className="relative">
                    {/* верхняя строка: бейдж + слово */}
                    <div className="flex items-center gap-3">
                      <div
                        className={[
                          "relative isolate overflow-hidden",
                          "h-10 w-10 rounded-full",
                          "lg-border border border-white/18",
                          "bg-white/60 backdrop-blur-[18px]",
                          "shadow-[0_10px_26px_rgba(0,0,0,0.05)]",
                          "flex items-center justify-center",
                        ].join(" ")}
                        aria-hidden="true"
                      >
                        {/* sweep: по умолчанию тёмный, на hover красный */}
                        <span
                          className="jq-sweep pointer-events-none absolute inset-y-0 left-0 w-[72%] opacity-[0.28] group-hover:opacity-0 transition-opacity duration-[900ms]"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent 0%, rgba(15,23,42,0.35) 45%, transparent 100%)",
                            animation: reduceMotion ? undefined : "jqBadgeSweep 3.8s ease-in-out infinite",
                          }}
                        />
                        <span
                          className="jq-sweep pointer-events-none absolute inset-y-0 left-0 w-[72%] opacity-0 group-hover:opacity-[0.55] transition-opacity duration-[900ms]"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent 0%, rgba(199,63,64,0.55) 45%, transparent 100%)",
                            animation: reduceMotion ? undefined : "jqBadgeSweep 3.8s ease-in-out infinite",
                          }}
                        />

                        <motion.span
                          variants={badgeText}
                          className="relative text-[14px] font-semibold leading-none"
                        >
                          {c.badge}
                        </motion.span>
                      </div>

                      <div className="text-[#0f172a] font-semibold text-[14px] leading-none">
                        {c.title}
                      </div>
                    </div>

                    {/* описание */}
                    <div className="mt-3 text-[#0f172a]/70 text-[12px] leading-[1.45]">
                      {c.desc}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
