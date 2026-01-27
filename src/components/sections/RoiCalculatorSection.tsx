 "use client";

import React from "react";

const INTEGRATION_COST = 179_990;

// фикс для упрощённого режима (как на макете)
const DEFAULT_PLAN_MONTHLY = 39_900; // "Средний"
const DEFAULT_COEFF = 1.3;
const DEFAULT_SHARE = 0.7;

const SALARY_MAX = 500_000;

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

function parseMoneyInput(raw: string) {
  const digits = raw.replace(/[^\d]/g, "");
  const n = digits ? Number(digits) : 0;
  return Number.isFinite(n) ? n : 0;
}

function formatMoneyInput(n: number) {
  const safe = Math.max(0, Math.round(n));
  return safe.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function formatRub(v: number) {
  const n = Math.round(v);
  const sign = n < 0 ? "−" : "";
  const abs = Math.abs(n);
  return `${sign}${abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;
}

function useCountUp(target: number, durationMs = 650) {
  const [val, setVal] = React.useState<number>(target);
  const prevRef = React.useRef<number>(target);
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const from = prevRef.current;
    const to = target;

    if (!Number.isFinite(from) || !Number.isFinite(to)) {
      setVal(target);
      prevRef.current = target;
      return;
    }

    if (Math.abs(to - from) < 0.5) {
      setVal(to);
      prevRef.current = to;
      return;
    }

    const start = performance.now();
    const dur = clamp(durationMs, 240, 1200);
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const t = clamp((now - start) / dur, 0, 1);
      const e = ease(t);
      setVal(from + (to - from) * e);

      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else prevRef.current = to;
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [target, durationMs]);

  return val;
}

function GlassRange({
  value,
  min,
  max,
  step,
  onChange,
  ariaLabel,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  ariaLabel: string;
}) {
  const pct = ((value - min) / Math.max(1e-6, max - min)) * 100;
  const trackBg = `linear-gradient(90deg, rgba(199,63,64,0.22) 0%, rgba(199,63,64,0.10) ${pct}%, rgba(15,23,42,0.06) ${pct}%, rgba(15,23,42,0.06) 100%)`;

  return (
    <div className="rounded-[18px] lg-border border border-white/18 bg-white/65 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={ariaLabel}
        className="roi-range w-full"
        style={{ background: trackBg }}
      />
    </div>
  );
}

export default function RoiCalculatorSection() {
  // как на макете
  const [managers, setManagers] = React.useState<number>(5);
  const [salary, setSalary] = React.useState<number>(77_917);

  // toast на слишком большую зарплату
  const [salaryToast, setSalaryToast] = React.useState(false);
  React.useEffect(() => {
    if (!salaryToast) return;
    const t = window.setTimeout(() => setSalaryToast(false), 2600);
    return () => window.clearTimeout(t);
  }, [salaryToast]);

  const calc = React.useMemo(() => {
    const m = clamp(Math.round(managers), 1, 10);
    const s = clamp(Math.round(salary || 0), 10_000, SALARY_MAX);

    const coeff = DEFAULT_COEFF;
    const share = DEFAULT_SHARE;

    // ФОТ людей в год (с учётом share)
    const peopleYear = m * s * coeff * 12 * share;

    // ЮНИ
    const planAnnual = DEFAULT_PLAN_MONTHLY * 12;
    const year1Uni = planAnnual + INTEGRATION_COST;
    const year2Uni = planAnnual;

    // Экономия
    const savings1 = peopleYear - year1Uni;
    const savings1Pct = peopleYear > 0 ? (savings1 / peopleYear) * 100 : 0;

    // Окупаемость (по месячной экономии)
    const monthlyPeople = m * s * coeff * share;
    const monthlySaving = monthlyPeople - DEFAULT_PLAN_MONTHLY;
    const paybackMonths = monthlySaving > 0 ? Math.ceil(INTEGRATION_COST / monthlySaving) : null;

    // Порог окупаемости (в пределах 12 мес) от N менеджеров при текущем ФОТ
    const thresholdManagers = (() => {
      for (let mm = 1; mm <= 10; mm++) {
        const mp = mm * s * coeff * share;
        const ms = mp - DEFAULT_PLAN_MONTHLY;
        if (ms <= 0) continue;
        const pb = Math.ceil(INTEGRATION_COST / ms);
        if (pb <= 12) return mm;
      }
      return null;
    })();

    const isBad = savings1 < 0;

    return {
      m,
      s,
      share,
      peopleYear,
      year1Uni,
      year2Uni,
      savings1,
      savings1Pct,
      paybackMonths,
      thresholdManagers,
      isBad,
    };
  }, [managers, salary]);

  const aSavings1 = useCountUp(calc.savings1, 720);
  const aSavings1Pct = useCountUp(calc.savings1Pct, 720);

  return (
    <section id="roi" className="relative py-14 md:py-20">
      <style>{`
        @keyframes roiPulse {
          0% { opacity: 0.86; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-1px); }
          100% { opacity: 0.86; transform: translateY(0); }
        }

        .roi-range {
          -webkit-appearance: none;
          appearance: none;
          height: 14px;
          border-radius: 999px;
          outline: none;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18);
        }

        .roi-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(15,23,42,0.10);
          box-shadow: 0 18px 55px rgba(0,0,0,0.14);
          cursor: pointer;
        }

        .roi-range::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(15,23,42,0.10);
          box-shadow: 0 18px 55px rgba(0,0,0,0.14);
          cursor: pointer;
        }

        .roi-range::-moz-range-track {
          height: 14px;
          border-radius: 999px;
          background: transparent;
        }
      `}</style>

      <div className="mx-auto max-w-[1240px] px-4">
        <div className="mx-auto max-w-[1240px] text-center">
          <h2 className="text-white font-semibold leading-[0.95] tracking-[-0.02em] text-[24px] sm:text-[32px] lg:text-[42px]">
            ROI-калькулятор
          </h2>
          <div className="mt-1 text-white font-semibold tracking-[-0.01em] text-[16px] sm:text-[28px] lg:text-[28px]">
            Иновации, которые окупаются - убедитесь сами.
          </div>
        </div>

        <div className="mt-8 md:mt-12">
          {/* внешний стеклянный контейнер */}
          <div className="lg-border relative mx-auto max-w-[1240px] rounded-[52px] border border-white/18 bg-white/10 p-[12px] shadow-[0_22px_70px_rgba(0,0,0,0.05)] backdrop-blur-[26px] backdrop-saturate-150">
            <div className="pointer-events-none absolute inset-0 rounded-[52px] ring-1 ring-white/10" />
            <div className="pointer-events-none absolute inset-0 rounded-[52px] opacity-70 bg-[radial-gradient(900px_420px_at_20%_0%,rgba(255,255,255,0.10),transparent_60%),radial-gradient(900px_420px_at_80%_100%,rgba(199,63,64,0.08),transparent_65%)]" />

            {/* верхний белый блок (две карточки) */}
            <div className="relative rounded-[40px] lg-border border border-white/18 bg-white/82 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.03)]">
              <div className="grid gap-4 lg:grid-cols-2">
                {/* LEFT */}
                <div className="rounded-[32px] lg-border border border-white/18 bg-white/82 p-7 shadow-[0_16px_45px_rgba(0,0,0,0.04)]">
                  <div className="text-[16px] font-semibold text-[#0f172a]">Входные параметры</div>

                  <div className="mt-6 text-[12px] font-semibold text-[#0f172a]">
                    Кол-во менеджеров <span className="text-[#667085]">— {calc.m}</span>
                  </div>

                  <div className="mt-4 rounded-[22px] lg-border border border-white/18 bg-white/82 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
                    <GlassRange
                      value={calc.m}
                      min={1}
                      max={10}
                      step={1}
                      onChange={setManagers}
                      ariaLabel="Количество менеджеров"
                    />

                    {/* пресеты 1/3/5/10 строго на позициях шкалы 1..10 */}
                    {(() => {
                      const PRESETS = [1, 3, 5, 10] as const;
                      const colClass: Record<(typeof PRESETS)[number], string> = {
                        1: "col-start-1",
                        3: "col-start-3",
                        5: "col-start-5",
                        10: "col-start-10",
                      };

                      return (
                        <div className="mt-4 px-1">
                          <div className="grid grid-cols-10 items-center">
                            {PRESETS.map((v) => {
                              const active = calc.m === v;

                              return (
                                <div key={v} className={colClass[v] + " flex justify-center"}>
                                  <button
                                    type="button"
                                    onClick={() => setManagers(v)}
                                    className={[
                                      "relative isolate overflow-hidden",
                                      "h-11 w-11 rounded-full",
                                      "flex items-center justify-center",
                                      "lg-border border border-black/5",
                                      "bg-white/60 backdrop-blur-[14px]",
                                      "shadow-[0_12px_28px_rgba(0,0,0,0.06)]",
                                      "transition-[transform,background-color,color,box-shadow] duration-[450ms]",
                                      "active:scale-[0.99]",
                                      active
                                        ? "text-[#0f172a] bg-white/75"
                                        : "text-[#98A2B3] hover:text-[#0f172a]",
                                    ].join(" ")}
                                    aria-label={`Установить ${v} менеджеров`}
                                  >
                                    <span className="pointer-events-none absolute -inset-8 opacity-70 bg-[radial-gradient(60px_34px_at_30%_25%,rgba(255,255,255,0.80),transparent_60%)]" />
                                    <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/16" />
                                    <span className="relative leading-none text-[13px] font-semibold">{v}</span>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

 {/* ФОТ-инпут: ширина по значению, max=500k, toast */}
<div className="mt-8">
  <div className="text-[12px] font-semibold text-[#0f172a]">
    ФОТ одного менеджера (₽/мес)
  </div>

  {/* было mt-2 -> делаем меньше и убираем второй mt ниже */}
  <div className="mt-1 relative">
    <div
      className={[
        "pointer-events-none absolute -top-10 left-0",
        "rounded-[14px] lg-border border border-white/18",
        "bg-white/85 backdrop-blur-[16px]",
        "px-4 py-2 text-[12px] font-semibold text-[#0f172a]",
        "shadow-[0_18px_45px_rgba(0,0,0,0.08)]",
        "transition-all duration-500",
        salaryToast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1",
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      Ого! Крутая зарплата! Такого сотрудника лучше оставить!))
    </div>

    {/* было mt-2 -> УБРАЛИ, чтобы не раздувало расстояние */}
    <div className="flex flex-wrap items-center gap-3">
      {(() => {
        const display = formatMoneyInput(salary);
        const chars = clamp(display.length, 6, 12);

        return (
          <input
            value={display}
            onChange={(e) => {
              const n = parseMoneyInput(e.target.value);
              if (n > SALARY_MAX) {
                setSalary(SALARY_MAX);
                setSalaryToast(true);
                return;
              }
              setSalary(n);
            }}
            onBlur={() => setSalary(clamp(salary || 0, 10_000, SALARY_MAX))}
            inputMode="numeric"
            aria-label="ФОТ одного менеджера в месяц"
            className={[
              "h-12",
              "w-auto shrink-0",
              "rounded-[16px]",
              "lg-border border border-white/18",
              "bg-[#c73f40] backdrop-blur-[14px]",
              "px-5",
              "text-[16px] font-semibold text-white",
              "tabular-nums",
              "text-center",
              "shadow-[0_12px_35px_rgba(0,0,0,0.04)]",
              "outline-none focus:border-white/30",
              "transition-[width] duration-300",
            ].join(" ")}
            style={{ width: `calc(${chars}ch + 2.5rem)` }}
          />
        );
      })()}

      <div className="flex flex-wrap items-center gap-3">
        {[50_000, 80_000, 100_000].map((v) => {
          const active = salary === v;

          return (
            <button
              key={v}
              type="button"
              onClick={() => setSalary(v)}
              className={[
                "h-11 px-5 rounded-[16px]",
                "flex items-center justify-center",
                "lg-border border border-black/5",
                "bg-white/40 backdrop-blur-[14px]",
                "shadow-[0_10px_26px_rgba(0,0,0,0.03)]",
                "transition-[transform,background-color,color] duration-500",
                "active:scale-[0.99]",
                active ? "text-[#0f172a] bg-white/75" : "text-[#98A2B3] hover:text-[#0f172a]",
              ].join(" ")}
            >
              {/* было mt-2 -> УБРАЛИ, иначе текст всегда ниже центра */}
              <span className="leading-none text-[13px] font-semibold tabular-nums">
                {formatMoneyInput(v)}
              </span>
            </button>
          );
        })}
      </div>
    </div>

    <div className="mt-3 text-[12px] text-[#98A2B3]">
      77 917 ₽ - медианная зарплата менеджера по продажам в РФ на 2025 год
    </div>
  </div>
</div>

                  {/* градиентная рамка как на макете */}
                  <div className="mt-7 rounded-[26px] p-[2px] bg-gradient-to-r from-[#ff4d4d]/70 via-[#c73f40]/20 to-[#7c3aed]/70">
                    <div className="rounded-[24px] lg-border border border-white/18 bg-white/82 p-6">
                      <div className="text-[13px] font-semibold text-[#667085]">Экономия за 1 год</div>

                      <div className="mt-3 flex flex-wrap items-end gap-4">
                        <div
                          className={[
                            "text-[44px] font-semibold tracking-[-0.02em]",
                            calc.isBad ? "text-[#c73f40]" : "text-[#28df7c]",
                          ].join(" ")}
                        >
                          {formatRub(aSavings1)}
                        </div>

                        <div className="pb-[10px] text-[16px] font-semibold text-[#0f172a]">
                          {aSavings1Pct.toFixed(1)}%
                        </div>
                      </div>

                      <div className="mt-5 text-[14px] font-semibold text-[#0f172a]">
                        {calc.paybackMonths
                          ? `Окупаемость интеграции: ${calc.paybackMonths} мес`
                          : "Не окупается при этих параметрах"}
                      </div>

                      <div className="mt-2 text-[13px] text-[#98A2B3]">
                        {calc.thresholdManagers !== null ? (
                          <>
                            Окупается от:{" "}
                            <span className="font-semibold text-[#0f172a]">{calc.thresholdManagers} менеджеров</span>{" "}
                            <span className="opacity-80">(в пределах 12 мес).</span>
                          </>
                        ) : (
                          <>Окупается при более высоких параметрах.</>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <div className="text-[13px] font-semibold text-[#0f172a]">
                      Замещение: <span className="text-[#667085]">{Math.round(calc.share * 100)}%</span>
                    </div>
                    <div className="text-[13px] text-[#98A2B3]">Разверни, чтобы отрегулировать</div>
                  </div>
                </div>
              </div>
            </div>

            {/* нижняя стеклянная зона с кнопкой и текстом */}
            <div className="px-8 pb-8 pt-7">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <button
                  type="button"
                  className="rounded-[24px] bg-white/92 h-10 px-4 text-[13px] font-semibold text-[#0f172a] border border-black/10 shadow-[0_22px_70px_rgba(0,0,0,0.10)] hover:text-[#c73f40] active:scale-[0.99]"
                  style={{ animation: "roiPulse 2.8s ease-in-out infinite" }}
                  aria-label="Развернуть калькулятор"
                >
                  Развернуть калькулятор
                </button>

                <div className="max-w-[760px] text-[13px] leading-[1.35] text-white/80">
                  Разверни калькулятор, чтобы настроить накладные, тариф, долю замещения и увидеть горизонты 3/5 лет.
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[140px] rounded-b-[52px] opacity-70 bg-[radial-gradient(900px_220px_at_50%_0%,rgba(255,255,255,0.10),transparent_60%)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
