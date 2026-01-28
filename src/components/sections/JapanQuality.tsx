"use client";

import React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Card = {
  title: string;
  badge: string;
  desc: string;
};

const CARDS: Card[] = [
  { title: "Кайдзен", badge: "改善", desc: "Ежедневные улучшения без перегруза процессов." },
  { title: "Lean", badge: "精益", desc: "Убираем лишнее, усиливаем ценность для клиента." },
  { title: "ДАО", badge: "道", desc: "Логика потока: простые правила вместо хаоса." },
  { title: "Стабильность", badge: "安定", desc: "Системы работают ровно, без сюрпризов." },
  { title: "Прочность", badge: "堅牢", desc: "Запас устойчивости: выдерживает рост нагрузки." },
  { title: "Внедрение", badge: "導入", desc: "Аккуратно встраиваемся в вашу реальность." },
  { title: "Документация", badge: "手順", desc: "Понятные регламенты, чтобы команда не терялась." },
  { title: "Контроль", badge: "検査", desc: "Проверяем качество на каждом критичном шаге." },
  { title: "Безопасность", badge: "安全", desc: "Минимизируем риски данных и доступа." },
  { title: "Поддержка", badge: "支援", desc: "Не бросаем: помогаем довести до результата." },
];

// Turbopack-safe CSS string
const JQ_STYLE =
  "@media (prefers-reduced-motion: reduce){.jq-sweep{animation:none !important;}}" +
  "@keyframes badgeSweep{" +
  "0%{transform:translateX(-120%) rotate(10deg);opacity:0;}" +
  "12%{opacity:.45;}" +
  "32%{opacity:0;}" +
  "100%{transform:translateX(160%) rotate(10deg);opacity:0;}" +
  "}";

export default function JapanQuality() {
  const reduceMotion = useReducedMotion();

  // 1) циклический текст под заголовком
  const [phraseIdx, setPhraseIdx] = React.useState(0);

  React.useEffect(() => {
    if (reduceMotion) return;
    const t = window.setInterval(() => setPhraseIdx((p) => (p === 0 ? 1 : 0)), 5000);
    return () => window.clearInterval(t);
  }, [reduceMotion]);

  const RotatingText = phraseIdx === 0 ? (
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

  // анимации карточек
  const cardIn = {
    hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.05 + i * 0.04,
      },
    }),
  } as const;

  const outerVariants = reduceMotion
    ? undefined
    : {
        rest: { y: 0 },
        hover: { y: -2, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
      };

  const innerVariants = reduceMotion
    ? undefined
    : {
        rest: { scale: 1 },
        hover: { scale: 1.01, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
      };

  const badgeTextVariants = reduceMotion
    ? undefined
    : {
        rest: { color: "#0f172a" },
        hover: { color: "#c73f40", transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
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

          {/* 1.1: циклический текст по центру (без подзаголовка) */}
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
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  {RotatingText}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* 1.2: убрали два абзаца слева */}
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
                  variants={innerVariants}
                  initial={reduceMotion ? undefined : "rest"}
                  animate={reduceMotion ? undefined : "rest"}
                  whileHover={reduceMotion ? undefined : "hover"}
                  className={[
                    "lg-border",
                    "relative overflow-hidden",
                    "h-full",
                    "rounded-[26px] border border-white/18",
                    "bg-white/82", // 3) фон внутри стекляшки
                    "p-5",
                    "shadow-[0_12px_35px_rgba(0,0,0,0.04)]",
                    "backdrop-blur-[18px] backdrop-saturate-150",
                  ].join(" ")}
                >
                  <div className="pointer-events-none absolute inset-0 rounded-[26px] opacity-70 bg-[radial-gradient(220px_140px_at_30%_20%,rgba(255,255,255,0.55),transparent_60%),radial-gradient(240px_160px_at_70%_90%,rgba(199,63,64,0.08),transparent_65%)]" />

                  {/* контент */}
                  <motion.div
                    variants={outerVariants}
                    initial={reduceMotion ? undefined : "rest"}
                    animate={reduceMotion ? undefined : "rest"}
                    whileHover={reduceMotion ? undefined : "hover"}
                    className="relative"
                  >
                    <div className="flex items-center gap-3">
                      {/* бейдж */}
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
                        {/* sweep: базовый (тёмный) + hover (красный) */}
                        <span
                          className="jq-sweep pointer-events-none absolute inset-y-0 left-0 w-[70%] opacity-0"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent 0%, rgba(15,23,42,0.35) 45%, transparent 100%)",
                            animation: reduceMotion ? undefined : "badgeSweep 3.6s ease-in-out infinite",
                          }}
                        />
                        <span
                          className={[
                            "jq-sweep pointer-events-none absolute inset-y-0 left-0 w-[70%] opacity-0",
                            "transition-opacity duration-700",
                          ].join(" ")}
                          style={{
                            background:
                              "linear-gradient(90deg, transparent 0%, rgba(199,63,64,0.55) 45%, transparent 100%)",
                            animation: reduceMotion ? undefined : "badgeSweep 3.6s ease-in-out infinite",
                          }}
                        />
                        {/* переключаем видимость красного sweep через hover по родителю */}
                        <style
                          dangerouslySetInnerHTML={{
                            __html:
                              "#japanese-quality .jq-card:hover .jq-sweep:nth-child(2){opacity:0;}#japanese-quality .jq-card:hover .jq-sweep:nth-child(3){opacity:.55;}",
                          }}
                        />

                        <motion.span
                          variants={badgeTextVariants}
                          className="relative text-[14px] font-semibold leading-none"
                          style={{ color: "#0f172a" }}
                        >
                          {c.badge}
                        </motion.span>
                      </div>

                      {/* название */}
                      <div className="text-[#0f172a] font-semibold text-[14px] leading-none">
                        {c.title}
                      </div>
                    </div>

                    {/* описание */}
                    <div className="mt-3 text-[#0f172a]/70 text-[12px] leading-[1.45]">
                      {c.desc}
                    </div>
                  </motion.div>

                  {/* обёртка-ховер таргет */}
                  <div className="absolute inset-0 jq-card" aria-hidden="true" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
