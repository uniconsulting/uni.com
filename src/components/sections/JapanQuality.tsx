
"use client";

import React from "react";

type CardKey =
  | "kaizen"
  | "lean"
  | "dao"
  | "stability"
  | "strength"
  | "implementation"
  | "docs"
  | "qc"
  | "security"
  | "support";

const CARDS: Array<{ key: CardKey; title: string; desc: string }> = [
  {
    key: "kaizen",
    title: "Кайдзен",
    desc: "Постоянные улучшения продукта и процессов, даже после запуска.",
  },
  {
    key: "lean",
    title: "Lean-подход",
    desc: "Убираем лишнее. Оставляем то, что реально даёт эффект.",
  },
  {
    key: "dao",
    title: "ДАО-логика",
    desc: "Системность и устойчивость. Решения строятся на принципах.",
  },
  {
    key: "stability",
    title: "Стабильность",
    desc: "Предсказуемое поведение системы и понятные сценарии работы.",
  },
  {
    key: "strength",
    title: "Прочность",
    desc: "Запас по нагрузке и архитектуре, чтобы продукт спокойно рос.",
  },
  {
    key: "implementation",
    title: "Качество внедрения",
    desc: "Интеграция под ваш процесс. Доводим до результата, а не до отчёта.",
  },
  {
    key: "docs",
    title: "Документация",
    desc: "Схемы, инструкции, роли и доступы. Без магии и догадок.",
  },
  {
    key: "qc",
    title: "Контроль качества",
    desc: "Проверяем сценарии и крайние случаи до релиза и после запуска.",
  },
  {
    key: "security",
    title: "Безопасность",
    desc: "Разделение доступов и аккуратная работа с данными на каждом шаге.",
  },
  {
    key: "support",
    title: "Поддержка",
    desc: "После запуска остаёмся рядом: улучшаем, отвечаем, исправляем быстро.",
  },
];

function Icon({ k }: { k: CardKey }) {
  const common = "h-5 w-5";
  switch (k) {
    case "kaizen":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3v3m0 12v3M4.5 12H3m18 0h-1.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M7.2 16.8c2.9 2.9 6.7 2.9 9.6 0s2.9-6.7 0-9.6-6.7-2.9-9.6 0-2.9 6.7 0 9.6Z"
            stroke="currentColor"
            strokeWidth="1.8"
            opacity="0.9"
          />
          <path
            d="M9 12l2 2 4-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "lean":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none">
          <path
            d="M5 8h14M7 12h10M9 16h6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M6 6l2 2-2 2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </svg>
      );
    case "dao":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M12 3c2.76 0 5 2.24 5 5s-2.24 5-5 5-5 2.24-5 5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.9"
          />
          <circle cx="14.5" cy="7.5" r="1.2" fill="currentColor" opacity="0.95" />
          <circle cx="9.5" cy="16.5" r="1.2" fill="currentColor" opacity="0.95" />
        </svg>
      );
    case "stability":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none">
          <path
            d="M6 15l3-3 3 3 6-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 19h16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.9"
          />
        </svg>
      );
    case "strength":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3l8 4v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V7l8-4Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M9 12l2 2 4-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "implementation":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none">
          <path
            d="M7 7h10v10H7V7Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M4 12h3M17 12h3M12 4v3M12 17v3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.9"
          />
        </svg>
      );
    case "docs":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none">
          <path
            d="M7 3h7l3 3v15H7V3Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M14 3v4h4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            opacity="0.9"
          />
          <path
            d="M9 11h6M9 15h6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.9"
          />
        </svg>
      );
    case "qc":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none">
          <path
            d="M10 14l2 2 5-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 3l8 4v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V7l8-4Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </svg>
      );
    case "security":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3l8 4v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V7l8-4Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M9 12a3 3 0 0 1 6 0v3H9v-3Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </svg>
      );
    case "support":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none">
          <path
            d="M4 12a8 8 0 0 1 16 0"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M6 12v4a2 2 0 0 0 2 2h2v-6H8a2 2 0 0 0-2 2Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            opacity="0.9"
          />
          <path
            d="M18 12v4a2 2 0 0 1-2 2h-2v-6h2a2 2 0 0 1 2 2Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </svg>
      );
    default:
      return null;
  }
}

function useSectionInView() {
  const ref = React.useRef<HTMLElement | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.18 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, inView };
}

export default function JapaneseQualitySection() {
  const { ref, inView } = useSectionInView();

  return (
    <section ref={ref as any} id="japanese-quality" className="relative py-14 md:py-20">
      <style>{`
        @keyframes badgeSweep {
          0% { transform: translateX(-120%) rotate(10deg); opacity: 0; }
          15% { opacity: .55; }
          35% { opacity: .0; }
          100% { transform: translateX(160%) rotate(10deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .jq-reveal { transition: none !important; transform: none !important; opacity: 1 !important; }
          .jq-sweep { animation: none !important; }
        }
      `}</style>

      {/* мягкие фоновые иероглифы */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[6%] top-[14%] text-white/8 text-[84px] font-semibold select-none">
          改善
        </div>
        <div className="absolute right-[10%] top-[10%] text-white/7 text-[92px] font-semibold select-none">
          道
        </div>
        <div className="absolute left-[14%] bottom-[8%] text-white/7 text-[88px] font-semibold select-none">
          品質
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-4">
        <div
          className={[
            "jq-reveal transition-all duration-[900ms] ease-out",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
          ].join(" ")}
        >
          <h2 className="text-white font-semibold leading-[0.95] tracking-[-0.02em] text-[24px] sm:text-[32px] lg:text-[42px]">
            Японское качество
          </h2>
          <div className="mt-1 text-white font-semibold tracking-[-0.01em] text-[16px] sm:text-[28px] lg:text-[28px]">
            наших продуктов и подхода
          </div>

          <div className="mt-7 max-w-[980px] text-left">
            <p className="text-white/80 text-[14px] sm:text-[16px] leading-[1.55] font-semibold">
              В основах нашего подхода лежат методы бережливого производства, принципы кайдзен и ДАО.
            </p>
            <p className="mt-3 text-white/80 text-[14px] sm:text-[16px] leading-[1.55] font-semibold">
              В каждом продукте заложен большой ресурс прочности и стабильности.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {CARDS.map((c, i) => {
              const delay = 90 + i * 55;

              return (
                <div
                  key={c.key}
                  className={[
                    "jq-reveal transition-all duration-[900ms] ease-out",
                    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
                  ].join(" ")}
                  style={{ transitionDelay: `${delay}ms` }}
                >
                  {/* внешний стеклянный контур-фрейм */}
                  <div className="lg-border rounded-[34px] border border-white/18 bg-white/10 p-[10px] shadow-[0_18px_55px_rgba(0,0,0,0.06)] backdrop-blur-[24px] backdrop-saturate-150">
                    <div className="pointer-events-none absolute" />

                    {/* внутренний фрейм */}
                    <div className="relative lg-border rounded-[26px] border border-white/18 bg-white/10 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.05)]">
                      {/* блик */}
                      <div className="pointer-events-none absolute inset-0 rounded-[26px] opacity-70 bg-[radial-gradient(220px_120px_at_20%_10%,rgba(255,255,255,0.14),transparent_60%)]" />

                      <div className="relative flex items-start gap-3">
                        {/* бейдж */}
                        <div className="relative isolate">
                          <div className="lg-border h-11 w-11 rounded-full border border-white/18 bg-white/14 backdrop-blur-[16px] shadow-[0_10px_26px_rgba(0,0,0,0.08)] flex items-center justify-center text-white">
                            <Icon k={c.key} />
                          </div>

                          {/* sweep */}
                          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                            <div
                              className="jq-sweep absolute -left-1/2 top-0 h-full w-1/2 opacity-0"
                              style={{
                                animation: inView ? "badgeSweep 8.5s ease-in-out infinite" : "none",
                                animationDelay: `${0.6 + i * 0.12}s`,
                                background:
                                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 45%, transparent 100%)",
                              }}
                            />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div className="text-white text-[14px] font-semibold leading-[1.15]">
                            {c.title}
                          </div>
                          <div className="mt-2 text-white/70 text-[13px] leading-[1.35] font-semibold">
                            {c.desc}
                          </div>
                        </div>
                      </div>

                      {/* hover lift */}
                      <div className="pointer-events-none absolute inset-0 rounded-[26px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>
                  </div>

                  {/* hover поведение на весь контейнер */}
                  <style>{`
                    #japanese-quality .jq-reveal > div {
                      transition: transform 520ms cubic-bezier(.2,.8,.2,1);
                    }
                    #japanese-quality .jq-reveal:hover > div {
                      transform: translateY(-4px);
                    }
                  `}</style>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
