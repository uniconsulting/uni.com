"use client";

import React from "react";

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

// ВАЖНО: не используем template literal внутри <style>{...}</style>, чтобы Turbopack не ломался
const JQ_STYLE =
  "@media (prefers-reduced-motion: reduce){.jq-sweep{animation:none !important;}}" +
  "@keyframes badgeSweep{" +
  "0%{transform:translateX(-120%) rotate(10deg);opacity:0;}" +
  "12%{opacity:.55;}" +
  "32%{opacity:0;}" +
  "100%{transform:translateX(160%) rotate(10deg);opacity:0;}" +
  "}";

export default function JapanQuality() {
  return (
    <section id="japanese-quality" className="relative py-14 md:py-20">
      <style dangerouslySetInnerHTML={{ __html: JQ_STYLE }} />

      <div className="mx-auto max-w-[1240px] px-4">
        {/* Заголовок + подзаголовок по центру, без анимаций */}
        <div className="mx-auto max-w-[1240px] text-center">
          <h2 className="text-white font-semibold leading-[0.95] tracking-[-0.02em] text-[24px] sm:text-[32px] lg:text-[42px]">
            Японское качество
          </h2>
          <div className="mt-1 text-white font-semibold tracking-[-0.01em] text-[16px] sm:text-[28px] lg:text-[28px]">
            наших продуктов и подхода
          </div>
        </div>

        {/* Текст слева, 2 абзаца, 12px, с переносами строк как в ТЗ */}
        <div className="mt-10 md:mt-12">
          <div className="text-white/85 text-[12px] sm:text-[24px] lg:text-[28px] font-semibold leading-[1.55]">
            <div>
              В основах нашего подхода
              <br />
              лежат методы бережливого производства,
              <br />
              принципы кайдзен и ДАО.
            </div>

            <div className="mt-4">
              В каждом продукте заложен большой
              <br />
              ресурс прочности и стабильности.
            </div>
          </div>

          {/* Сетка карточек 2x5 (desktop), адаптивно вниз */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CARDS.map((c) => (
              <div
                key={c.title}
                className={[
                  "lg-border",
                  "rounded-[34px] border border-white/18 bg-white/10",
                  "p-[10px]",
                  "backdrop-blur-[24px] backdrop-saturate-150",
                  "shadow-[0_18px_55px_rgba(0,0,0,0.05)]",
                ].join(" ")}
              >
                <div
                  className={[
                    "lg-border",
                    "relative overflow-hidden",
                    "h-full",
                    "rounded-[26px] border border-white/18 bg-white/82",
                    "p-5",
                    "shadow-[0_12px_35px_rgba(0,0,0,0.04)]",
                    "backdrop-blur-[22px] backdrop-saturate-150",
                  ].join(" ")}
                >
                  {/* декоративный sweep внутри бейджа */}
                  <div className="flex items-center gap-3">
                    <div
                      className={[
                        "relative isolate overflow-hidden",
                        "h-10 w-10 rounded-full",
                        "lg-border border border-white/18",
                        "bg-white/14 backdrop-blur-[18px]",
                        "shadow-[0_10px_26px_rgba(0,0,0,0.03)]",
                        "flex items-center justify-center",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      <span
                        className="jq-sweep pointer-events-none absolute inset-y-0 left-0 w-[70%] opacity-0"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 45%, transparent 100%)",
                          animation: "badgeSweep 3.6s ease-in-out infinite",
                        }}
                      />
                      <span className="relative text-[#0f172a] text-[14px] font-semibold leading-none">
                        {c.badge}
                      </span>
                    </div>

                    {/* название справа, на центральной линии бейджа */}
                    <div className="text-[#0f172a] font-semibold text-[14px] leading-none">
                      {c.title}
                    </div>
                  </div>

                  {/* описание под бейджем */}
                  <div className="mt-3 text-[#0f172a] text-[12px] leading-[1.45]">
                    {c.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
