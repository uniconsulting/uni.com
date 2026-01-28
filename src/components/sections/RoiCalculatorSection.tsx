"use client";

import React from "react";

/**
 * ROI-калькулятор (8-я секция) — с нуля по ТЗ
 * Этап 1: простой режим (по умолчанию)
 * Этап 2: расширенный режим (раскрывается кнопкой)
 *
 * Важно:
 * - Никаких серых контуров на фреймах: везде border border-white/18 + lg-border
 * - Кнопки на чисто белом фоне: допускаем еле-серый бордюр (border-black/10), но lg-border сохраняем
 * - Все расчёты — в одном useMemo
 */

const INTEGRATION_COST = 179_990;
const SALARY_DEFAULT = 77_917;
const SALARY_MAX = 500_000;
const MANAGERS_MIN = 1;
const MANAGERS_MAX = 10;

// ПРАЙСЫ ТАРИФОВ: вынеси сюда реальные цифры, если отличаются
const PLANS = [
  { id: "small", name: "Малый", monthly: 19_900 },
  { id: "medium", name: "Средний", monthly: 39_900 }, // по умолчанию
  { id: "enterprise", name: "Энтерпрайз", monthly: 79_900 },
] as const;

const COEFF_PRESETS = [1.0, 1.2, 1.3, 1.5] as const;

type PlanId = (typeof PLANS)[number]["id"];
type Billing = "monthly" | "yearly";

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

function formatPct(v: number, digits = 1) {
  if (!Number.isFinite(v)) return "0.0%";
  return `${v.toFixed(digits)}%`;
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

function TinyTooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex items-center">
      <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full lg-border border border-white/18 bg-white/55 text-[12px] font-semibold text-[#0f172a]">
        ?
      </span>
      <span className="pointer-events-none absolute left-0 top-7 z-20 w-[240px] rounded-[14px] lg-border border border-white/18 bg-white/88 px-3 py-2 text-[12px] font-semibold text-[#0f172a] shadow-[0_18px_45px_rgba(0,0,0,0.10)] opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
        {text}
      </span>
    </span>
  );
}

function MiniBarPair({
  leftLabel,
  rightLabel,
  leftValue,
  rightValue,
}: {
  leftLabel: string;
  rightLabel: string;
  leftValue: number;
  rightValue: number;
}) {
  const maxV = Math.max(1, Math.max(leftValue, rightValue));
  const l = clamp((leftValue / maxV) * 100, 0, 100);
  const r = clamp((rightValue / maxV) * 100, 0, 100);

  return (
    <div className="rounded-[18px] lg-border border border-white/18 bg-white/60 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between text-[12px] font-semibold text-[#667085]">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>

      <div className="mt-3 grid gap-3">
        <div className="flex items-center gap-3">
          <div className="w-[64px] text-[12px] font-semibold text-[#0f172a]">Люди</div>
          <div className="h-[10px] flex-1 rounded-full bg-black/5 overflow-hidden">
            <div className="h-full rounded-full bg-[#c73f40]/40" style={{ width: `${l}%` }} />
          </div>
          <div className="w-[120px] text-right text-[12px] font-semibold text-[#0f172a] tabular-nums">
            {formatRub(leftValue)}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-[64px] text-[12px] font-semibold text-[#0f172a]">ЮНИ</div>
          <div className="h-[10px] flex-1 rounded-full bg-black/5 overflow-hidden">
            <div className="h-full rounded-full bg-black/15" style={{ width: `${r}%` }} />
          </div>
          <div className="w-[120px] text-right text-[12px] font-semibold text-[#0f172a] tabular-nums">
            {formatRub(rightValue)}
          </div>
        </div>
      </div>
    </div>
  );
}

function PaybackGraph({
  monthlySaving,
  integrationCost,
}: {
  monthlySaving: number;
  integrationCost: number;
}) {
  // 12 месяцев — достаточно для “вау-эффекта”
  const months = 12;

  const points = React.useMemo(() => {
    const arr: number[] = [];
    let cum = 0;
    for (let i = 1; i <= months; i++) {
      cum += monthlySaving;
      arr.push(cum);
    }
    return arr;
  }, [monthlySaving]);

  const maxY = Math.max(integrationCost, ...points, 1);
  const w = 320;
  const h = 90;
  const padX = 8;
  const padY = 10;

  const x = (i: number) => padX + (i / (months - 1)) * (w - padX * 2);
  const y = (v: number) =>
    padY + (1 - clamp(v / maxY, 0, 1)) * (h - padY * 2);

  const poly = points
    .map((v, i) => `${x(i)},${y(v)}`)
    .join(" ");

  const paybackMonth = (() => {
    if (!(monthlySaving > 0)) return null;
    const m = Math.ceil(integrationCost / monthlySaving);
    if (!Number.isFinite(m) || m <= 0) return null;
    return m;
  })();

  return (
    <div className="rounded-[18px] lg-border border border-white/18 bg-white/60 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        <div className="text-[12px] font-semibold text-[#667085]">
          Окупаемость на графике (12 мес)
        </div>
        <div className="text-[12px] font-semibold text-[#0f172a]">
          {paybackMonth ? `Окупаемость: ${paybackMonth} мес` : "Не окупается"}
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-[14px] lg-border border border-white/18 bg-white/70">
        <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="block">
          {/* линия порога (integrationCost) */}
          <line
            x1={0}
            x2={w}
            y1={y(integrationCost)}
            y2={y(integrationCost)}
            stroke="rgba(15,23,42,0.22)"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          <polyline
            fill="none"
            stroke="rgba(199,63,64,0.55)"
            strokeWidth="3"
            points={poly}
          />
          {/* точки */}
          {points.map((v, i) => (
            <circle
              key={i}
              cx={x(i)}
              cy={y(v)}
              r={2.5}
              fill="rgba(15,23,42,0.35)"
            />
          ))}
        </svg>
      </div>

      <div className="mt-2 text-[12px] font-semibold text-[#98A2B3]">
        Порог: {formatRub(integrationCost)} (интеграция)
      </div>
    </div>
  );
}

export default function RoiCalculatorSection() {
  // входные (видимы в простом режиме)
  const [managers, setManagers] = React.useState<number>(5);
  const [salary, setSalary] = React.useState<number>(SALARY_DEFAULT);

  // расширенный режим
  const [expanded, setExpanded] = React.useState(false);

  // параметры расширенного режима (по умолчанию: “Средний”, мес)
  const [planId, setPlanId] = React.useState<PlanId>("medium");
  const [billing, setBilling] = React.useState<Billing>("monthly");
  const [share, setShare] = React.useState<number>(0.7);

  const [coeffMode, setCoeffMode] = React.useState<"preset" | "custom">("preset");
  const [coeffPreset, setCoeffPreset] = React.useState<number>(1.3);
  const [coeffCustom, setCoeffCustom] = React.useState<number>(1.3);

  // toast на слишком большую зарплату
  const [salaryToast, setSalaryToast] = React.useState(false);
  React.useEffect(() => {
    if (!salaryToast) return;
    const t = window.setTimeout(() => setSalaryToast(false), 2400);
    return () => window.clearTimeout(t);
  }, [salaryToast]);

  // измерение ширины salary-инпута (реальная ширина текста, чтобы центр был “идеальным”)
  const salaryDisplay = React.useMemo(() => formatMoneyInput(salary), [salary]);
  const measureRef = React.useRef<HTMLSpanElement | null>(null);
  const [salaryTextPx, setSalaryTextPx] = React.useState<number>(0);

  React.useLayoutEffect(() => {
    if (!measureRef.current) return;
    setSalaryTextPx(measureRef.current.getBoundingClientRect().width);
  }, [salaryDisplay]);

  const calc = React.useMemo(() => {
    const m = clamp(Math.round(managers), MANAGERS_MIN, MANAGERS_MAX);
    const s = clamp(Math.round(salary || 0), 10_000, SALARY_MAX);

    const coeff = coeffMode === "custom" ? clamp(coeffCustom || 1.0, 1.0, 2.5) : clamp(coeffPreset, 1.0, 2.5);
    const sh = clamp(share || 0, 0.1, 1);

    const currentPlan = PLANS.find((p) => p.id === planId) ?? PLANS[1];
    const planMonthly = currentPlan.monthly;

    const yearlyFactor = billing === "yearly" ? 0.8 : 1;
    const planAnnual = planMonthly * 12 * yearlyFactor;

    // ФОТ людей в год (учёт доли замещения)
    const peopleYear = m * s * coeff * 12 * sh;

    // ЮНИ (год 1 с интеграцией, год 2 без)
    const year1Uni = planAnnual + INTEGRATION_COST;
    const year2Uni = planAnnual;

    // Экономия
    const savings1 = peopleYear - year1Uni;
    const savings1Pct = peopleYear > 0 ? (savings1 / peopleYear) * 100 : 0;

    // горизонты
    const people3 = peopleYear * 3;
    const uni3 = year1Uni + year2Uni * 2;
    const savings3 = people3 - uni3;
    const savings3Pct = people3 > 0 ? (savings3 / people3) * 100 : 0;

    const people5 = peopleYear * 5;
    const uni5 = year1Uni + year2Uni * 4;
    const savings5 = people5 - uni5;
    const savings5Pct = people5 > 0 ? (savings5 / people5) * 100 : 0;

    // Окупаемость интеграции (по месячной экономии)
    const monthlyPeople = m * s * coeff * sh;
    const monthlyPlanEffective = planMonthly * yearlyFactor; // “месячный эквивалент” с учётом скидки годовой оплаты
    const monthlySaving = monthlyPeople - monthlyPlanEffective;

    const paybackMonths = monthlySaving > 0 ? Math.ceil(INTEGRATION_COST / monthlySaving) : null;

    // Порог окупаемости: от скольких менеджеров окупится в пределах 12 месяцев (при текущем ФОТ)
    const thresholdManagers = (() => {
      for (let mm = MANAGERS_MIN; mm <= MANAGERS_MAX; mm++) {
        const ms = mm * s * coeff * sh - monthlyPlanEffective;
        if (ms <= 0) continue;
        const pb = Math.ceil(INTEGRATION_COST / ms);
        if (pb <= 12) return mm;
      }
      return null;
    })();

    // Альтернативный порог: при какой зарплате окупится (в пределах 12 мес) при текущих менеджерах
    const thresholdSalary = (() => {
      const denom = m * coeff * sh;
      if (denom <= 0) return null;
      const needMonthlyPeople = monthlyPlanEffective + INTEGRATION_COST / 12;
      const req = Math.ceil(needMonthlyPeople / denom);
      if (!Number.isFinite(req)) return null;
      return clamp(req, 10_000, SALARY_MAX);
    })();

    // Лучший тариф при текущих вводных (по экономии 1 года)
    const bestPlanId = (() => {
      let best: { id: PlanId; s1: number } | null = null;
      for (const p of PLANS) {
        const pa = p.monthly * 12 * yearlyFactor;
        const y1 = pa + INTEGRATION_COST;
        const s1 = peopleYear - y1;
        if (!best || s1 > best.s1) best = { id: p.id, s1 };
      }
      return best?.id ?? "medium";
    })();

    const isBad = savings1 < 0;

    return {
      m,
      s,
      coeff,
      share: sh,
      planMonthly,
      billing,
      planAnnual,
      year1Uni,
      year2Uni,

      peopleYear,
      savings1,
      savings1Pct,

      people3,
      uni3,
      savings3,
      savings3Pct,

      people5,
      uni5,
      savings5,
      savings5Pct,

      monthlySaving,
      paybackMonths,
      thresholdManagers,
      thresholdSalary,
      bestPlanId,
      isBad,
    };
  }, [managers, salary, planId, billing, share, coeffMode, coeffPreset, coeffCustom]);

  const aSavings1 = useCountUp(calc.savings1, 720);
  const aSavings1Pct = useCountUp(calc.savings1Pct, 720);

  const aSavings3 = useCountUp(calc.savings3, 820);
  const aSavings3Pct = useCountUp(calc.savings3Pct, 820);

  const aSavings5 = useCountUp(calc.savings5, 920);
  const aSavings5Pct = useCountUp(calc.savings5Pct, 920);

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

        /* Локальный контроль вертикальных отступов внутри “стека” (чтобы не ломали внешние space-y/prose) */
        .roi-tight > :not([hidden]) ~ :not([hidden]) { margin-top: var(--roi-gap, 2px) !important; }
      `}</style>

      <div className="mx-auto max-w-[1240px] px-4">
        <div className="mx-auto max-w-[980px] text-center">
          <h2 className="text-white font-semibold leading-[0.95] tracking-[-0.02em] text-[24px] sm:text-[32px] lg:text-[42px]">
            ROI-калькулятор
          </h2>
          <div className="mt-2 text-white/70 font-semibold tracking-[-0.01em] text-[13px] sm:text-[16px]">
            Короткая история: сколько стоит текущая модель, сколько стоит ЮНИ, когда окупится и что будет через 3 и 5 лет.
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
                {/* LEFT — простой режим */}
                <div className="rounded-[32px] lg-border border border-white/18 bg-white/82 p-7 shadow-[0_16px_45px_rgba(0,0,0,0.04)]">
                  <div className="text-[16px] font-semibold text-[#0f172a]">Входные параметры</div>

                  <div className="mt-6 text-[12px] font-semibold text-[#0f172a]">
                    Кол-во менеджеров <span className="text-[#667085]">— {calc.m}</span>
                  </div>

                  <div className="mt-4 rounded-[22px] lg-border border border-white/18 bg-white/82 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
                    <GlassRange
                      value={calc.m}
                      min={MANAGERS_MIN}
                      max={MANAGERS_MAX}
                      step={1}
                      onChange={setManagers}
                      ariaLabel="Количество менеджеров"
                    />

                    {/* пресеты 1/3/5/10 (ускоряют взаимодействие) */}
                    <div className="mt-4 px-1">
                      <div className="grid grid-cols-10 items-center">
                        {([1, 3, 5, 10] as const).map((v) => {
                          const colStart =
                            v === 1 ? "col-start-1" : v === 3 ? "col-start-3" : v === 5 ? "col-start-5" : "col-start-10";
                          const active = calc.m === v;

                          return (
                            <div key={v} className={`${colStart} flex justify-center`}>
                              <button
                                type="button"
                                onClick={() => setManagers(v)}
                                className={[
                                  "relative isolate overflow-hidden",
                                  "h-11 w-11 rounded-full",
                                  "inline-flex items-center justify-center",
                                  "lg-border border border-white/18",
                                  "bg-white/60 backdrop-blur-[14px]",
                                  "shadow-[0_12px_28px_rgba(0,0,0,0.06)]",
                                  "transition-[transform,background-color,color] duration-[450ms]",
                                  "active:scale-[0.99]",
                                  active ? "text-[#0f172a] bg-white/75" : "text-[#98A2B3] hover:text-[#0f172a]",
                                ].join(" ")}
                                aria-label={`Установить ${v} менеджеров`}
                              >
                                <span className="pointer-events-none absolute -inset-8 opacity-70 bg-[radial-gradient(60px_34px_at_30%_25%,rgba(255,255,255,0.80),transparent_60%)]" />
                                <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/16" />
                                <span className="relative leading-none text-[13px] font-semibold tabular-nums">{v}</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* ФОТ-инпут: маска, ширина по значению (реальная), max=500k, toast */}
                  <div className="mt-8">
                    <div className="roi-tight flex flex-col" style={{ ["--roi-gap" as any]: "6px" }}>
                      <div className="text-[12px] font-semibold text-[#0f172a]">
                        ФОТ одного менеджера (₽/мес)
                      </div>

                      <div className="relative">
                        {/* скрытый измеритель ширины текста */}
                        <span
                          ref={measureRef}
                          className="pointer-events-none absolute -z-10 opacity-0 whitespace-pre tabular-nums text-[16px] font-semibold"
                        >
                          {salaryDisplay}
                        </span>

                        {/* toast */}
                        <div
                          className={[
                            "pointer-events-none absolute -top-10 left-0",
                            "rounded-[12px] lg-border border border-white/18",
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

                        <div className="flex flex-wrap items-center gap-3">
                          <input
                            value={salaryDisplay}
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
                              "bg-white/70 backdrop-blur-[14px]",
                              "px-5",
                              "text-[16px] font-semibold text-[#0f172a]",
                              "tabular-nums text-center",
                              "shadow-[0_12px_35px_rgba(0,0,0,0.04)]",
                              "outline-none focus:border-white/30",
                              "transition-[width] duration-300",
                            ].join(" ")}
                            style={{
                              // +40px = px-5 слева+справа (20+20). +8px запас, чтобы “дышало”.
                              width: `${clamp(Math.round(salaryTextPx + 48), 160, 260)}px`,
                            }}
                          />

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
                                    "inline-flex items-center justify-center",
                                    "lg-border border border-white/18",
                                    "bg-white/55 backdrop-blur-[14px]",
                                    "shadow-[0_10px_26px_rgba(0,0,0,0.03)]",
                                    "transition-[transform,background-color,color] duration-500",
                                    "active:scale-[0.99]",
                                    active ? "text-[#0f172a] bg-white/75" : "text-[#98A2B3] hover:text-[#0f172a]",
                                  ].join(" ")}
                                >
                                  <span className="leading-none text-[13px] font-semibold tabular-nums">
                                    {formatMoneyInput(v)}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="mt-3 text-[12px] text-[#98A2B3]">
                          77 917 ₽ — медианная зарплата менеджера по продажам в РФ на 2025 год
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT — результат (простой режим) */}
                <div className="rounded-[32px] lg-border border border-white/18 bg-white/82 p-7 shadow-[0_16px_45px_rgba(0,0,0,0.04)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[16px] font-semibold text-[#0f172a]">Результат</div>
                      <div className="mt-1 text-[13px] text-[#667085]">Экономия и окупаемость</div>
                    </div>

                    <div className="rounded-[999px] lg-border border border-white/18 bg-white/82 px-4 py-2 text-[13px] font-semibold text-[#0f172a] shadow-[0_10px_26px_rgba(0,0,0,0.04)]">
                      Замещение: {Math.round(calc.share * 100)}%
                    </div>
                  </div>

                  {/* главный акцент */}
                  <div className="mt-7 rounded-[26px] p-[2px] bg-gradient-to-r from-[#ff4d4d]/70 via-[#c73f40]/20 to-[#7c3aed]/70">
                    <div className="rounded-[24px] lg-border border border-white/18 bg-white/82 p-6">
                      <div className="text-[13px] font-semibold text-[#667085]">Экономия за 1 год</div>

                      <div className="mt-3 flex flex-wrap items-end gap-4">
                        <div
                          className={[
                            "text-[44px] font-semibold tracking-[-0.02em] tabular-nums",
                            calc.isBad ? "text-[#c73f40]" : "text-[#28df7c]",
                          ].join(" ")}
                        >
                          {formatRub(aSavings1)}
                        </div>

                        <div className="pb-[10px] text-[16px] font-semibold text-[#0f172a] tabular-nums">
                          {formatPct(aSavings1Pct, 1)}
                        </div>
                      </div>

                      <div className="mt-5 text-[14px] font-semibold text-[#0f172a]">
                        {calc.paybackMonths
                          ? `Окупаемость интеграции: ${calc.paybackMonths} мес`
                          : "Не окупается при этих параметрах"}
                      </div>

                      <div className="mt-2 text-[13px] text-[#98A2B3]">
                        {calc.paybackMonths ? (
                          calc.thresholdManagers !== null ? (
                            <>
                              Окупается от:{" "}
                              <span className="font-semibold text-[#0f172a]">{calc.thresholdManagers} менеджеров</span>{" "}
                              <span className="opacity-80">(в пределах 12 мес).</span>
                            </>
                          ) : (
                            <>Окупается при более высоких параметрах.</>
                          )
                        ) : calc.thresholdManagers !== null ? (
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

                  {/* небольшие пояснения, “мозг понимает первый год дороже” */}
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[18px] lg-border border border-white/18 bg-white/60 p-4">
                      <div className="text-[12px] font-semibold text-[#667085]">Стоимость 1-го года</div>
                      <div className="mt-2 text-[14px] font-semibold text-[#0f172a] tabular-nums">
                        {formatRub(calc.year1Uni)}
                      </div>
                    </div>
                    <div className="rounded-[18px] lg-border border border-white/18 bg-white/60 p-4">
                      <div className="text-[12px] font-semibold text-[#667085]">Стоимость 2-го года</div>
                      <div className="mt-2 text-[14px] font-semibold text-[#0f172a] tabular-nums">
                        {formatRub(calc.year2Uni)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ЭТАП 2: раскрывающийся расширенный режим */}
              <div
                className={[
                  "overflow-hidden transition-[max-height,opacity] duration-700",
                  expanded ? "max-h-[2200px] opacity-100 mt-6" : "max-h-0 opacity-0 mt-0",
                ].join(" ")}
                aria-hidden={!expanded}
              >
                <div className="rounded-[32px] lg-border border border-white/18 bg-white/70 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.03)]">
                  <div className="grid gap-4 lg:grid-cols-2">
                    {/* расширенные параметры */}
                    <div className="rounded-[26px] lg-border border border-white/18 bg-white/72 p-6">
                      <div className="text-[15px] font-semibold text-[#0f172a]">Расширенные настройки</div>
                      <div className="mt-1 text-[13px] text-[#667085]">Накладные, тариф, оплата, доля замещения</div>

                      {/* Накладные */}
                      <div className="mt-5">
                        <div className="text-[12px] font-semibold text-[#0f172a] inline-flex items-center">
                          Накладные
                          <TinyTooltip text="Обычно включает: налоги, рабочее место, обучение, текучку и сопутствующие расходы." />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {COEFF_PRESETS.map((c) => {
                            const active = coeffMode === "preset" && Math.abs(coeffPreset - c) < 1e-6;
                            return (
                              <button
                                key={c}
                                type="button"
                                onClick={() => {
                                  setCoeffMode("preset");
                                  setCoeffPreset(c);
                                }}
                                className={[
                                  "h-10 px-4 rounded-full",
                                  "inline-flex items-center justify-center",
                                  "lg-border border border-white/18",
                                  "bg-white/55 backdrop-blur-[14px]",
                                  "shadow-[0_10px_26px_rgba(0,0,0,0.03)]",
                                  "transition-[transform,background-color,color] duration-500",
                                  "active:scale-[0.99]",
                                  active ? "text-[#0f172a] bg-white/78" : "text-[#98A2B3] hover:text-[#0f172a]",
                                ].join(" ")}
                              >
                                <span className="leading-none text-[13px] font-semibold tabular-nums">{c.toFixed(1)}</span>
                              </button>
                            );
                          })}

                          <button
                            type="button"
                            onClick={() => setCoeffMode("custom")}
                            className={[
                              "h-10 px-4 rounded-full",
                              "inline-flex items-center justify-center",
                              "lg-border border border-white/18",
                              "bg-white/55 backdrop-blur-[14px]",
                              "shadow-[0_10px_26px_rgba(0,0,0,0.03)]",
                              "transition-[transform,background-color,color] duration-500",
                              "active:scale-[0.99]",
                              coeffMode === "custom" ? "text-[#0f172a] bg-white/78" : "text-[#98A2B3] hover:text-[#0f172a]",
                            ].join(" ")}
                          >
                            <span className="leading-none text-[13px] font-semibold">свой</span>
                          </button>

                          {coeffMode === "custom" && (
                            <input
                              value={String(coeffCustom ?? 1.3)}
                              onChange={(e) => {
                                const raw = e.target.value.replace(",", ".");
                                const n = Number(raw);
                                if (!Number.isFinite(n)) return;
                                setCoeffCustom(clamp(n, 1.0, 2.5));
                              }}
                              className={[
                                "h-10 w-[90px] rounded-[14px]",
                                "lg-border border border-white/18",
                                "bg-white/65 backdrop-blur-[14px]",
                                "px-3",
                                "text-[13px] font-semibold text-[#0f172a] tabular-nums text-center",
                                "outline-none",
                              ].join(" ")}
                              inputMode="decimal"
                              aria-label="Свой коэффициент накладных"
                            />
                          )}
                        </div>
                      </div>

                      {/* Тариф */}
                      <div className="mt-6">
                        <div className="text-[12px] font-semibold text-[#0f172a]">Тариф</div>

                        <div className="mt-3 grid gap-2 sm:grid-cols-3">
                          {PLANS.map((p) => {
                            const selected = p.id === planId;
                            const best = p.id === calc.bestPlanId;

                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => setPlanId(p.id)}
                                className={[
                                  "rounded-[16px] p-4 text-left",
                                  "lg-border border border-white/18",
                                  "bg-white/55 backdrop-blur-[14px]",
                                  "shadow-[0_10px_26px_rgba(0,0,0,0.03)]",
                                  "transition-[transform,background-color,color,box-shadow] duration-500",
                                  "active:scale-[0.99]",
                                  selected ? "bg-white/78 text-[#0f172a]" : "text-[#0f172a]",
                                  best ? "ring-1 ring-[#c73f40]/35 shadow-[0_16px_40px_rgba(199,63,64,0.12)]" : "",
                                ].join(" ")}
                                aria-label={`Тариф ${p.name}`}
                              >
                                <div className="text-[13px] font-semibold">{p.name}</div>
                                <div className="mt-1 text-[12px] font-semibold text-[#667085] tabular-nums">
                                  {formatRub(p.monthly)}/мес
                                </div>
                                {best && (
                                  <div className="mt-2 text-[11px] font-semibold text-[#c73f40]">
                                    выгоднее при ваших вводных
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Оплата */}
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setBilling("monthly")}
                            className={[
                              "h-10 px-4 rounded-full",
                              "inline-flex items-center justify-center",
                              "lg-border border border-white/18",
                              "bg-white/55 backdrop-blur-[14px]",
                              "shadow-[0_10px_26px_rgba(0,0,0,0.03)]",
                              "transition-[transform,background-color,color] duration-500",
                              "active:scale-[0.99]",
                              billing === "monthly" ? "text-[#0f172a] bg-white/78" : "text-[#98A2B3] hover:text-[#0f172a]",
                            ].join(" ")}
                          >
                            Ежемесячно
                          </button>

                          <button
                            type="button"
                            onClick={() => setBilling("yearly")}
                            className={[
                              "h-10 px-4 rounded-full",
                              "inline-flex items-center justify-center",
                              "lg-border border border-white/18",
                              "bg-white/55 backdrop-blur-[14px]",
                              "shadow-[0_10px_26px_rgba(0,0,0,0.03)]",
                              "transition-[transform,background-color,color] duration-500",
                              "active:scale-[0.99]",
                              billing === "yearly" ? "text-[#0f172a] bg-white/78" : "text-[#98A2B3] hover:text-[#0f172a]",
                            ].join(" ")}
                          >
                            Годовой (−20%)
                          </button>

                          <div className="ml-1 text-[12px] font-semibold text-[#667085]">
                            Интеграция: <span className="text-[#0f172a] tabular-nums">{formatRub(INTEGRATION_COST)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Доля замещения */}
                      <div className="mt-6">
                        <div className="text-[12px] font-semibold text-[#0f172a]">
                          Доля замещения функций <span className="text-[#667085]">— {Math.round(calc.share * 100)}%</span>
                        </div>

                        <div className="mt-3">
                          <GlassRange
                            value={Math.round(calc.share * 100)}
                            min={10}
                            max={100}
                            step={5}
                            onChange={(v) => setShare(clamp(v / 100, 0.1, 1))}
                            ariaLabel="Доля замещения функций"
                          />
                        </div>
                      </div>
                    </div>

                    {/* расширенные результаты + мини-визуализации */}
                    <div className="rounded-[26px] lg-border border border-white/18 bg-white/72 p-6">
                      <div className="text-[15px] font-semibold text-[#0f172a]">Горизонты и смысл</div>
                      <div className="mt-1 text-[13px] text-[#667085]">1 год, 3 года, 5 лет + окупаемость на графике</div>

                      <div className="mt-5 grid gap-3">
                        <MiniBarPair
                          leftLabel="ФОТ людей (1 год)"
                          rightLabel="ЮНИ (1 год)"
                          leftValue={calc.peopleYear}
                          rightValue={calc.year1Uni}
                        />

                        <PaybackGraph monthlySaving={calc.monthlySaving} integrationCost={INTEGRATION_COST} />

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-[18px] lg-border border border-white/18 bg-white/60 p-4">
                            <div className="text-[12px] font-semibold text-[#667085]">Экономия за 3 года</div>
                            <div
                              className={[
                                "mt-2 text-[18px] font-semibold tabular-nums",
                                calc.savings3 < 0 ? "text-[#c73f40]" : "text-[#0f172a]",
                              ].join(" ")}
                            >
                              {formatRub(aSavings3)}
                            </div>
                            <div className="mt-1 text-[12px] font-semibold text-[#667085] tabular-nums">
                              {formatPct(aSavings3Pct, 1)}
                            </div>
                          </div>

                          <div className="rounded-[18px] lg-border border border-white/18 bg-white/60 p-4">
                            <div className="text-[12px] font-semibold text-[#667085]">Экономия за 5 лет</div>
                            <div
                              className={[
                                "mt-2 text-[18px] font-semibold tabular-nums",
                                calc.savings5 < 0 ? "text-[#c73f40]" : "text-[#0f172a]",
                              ].join(" ")}
                            >
                              {formatRub(aSavings5)}
                            </div>
                            <div className="mt-1 text-[12px] font-semibold text-[#667085] tabular-nums">
                              {formatPct(aSavings5Pct, 1)}
                            </div>
                          </div>
                        </div>

                        <div className="text-[12px] font-semibold text-[#98A2B3]">
                          {calc.paybackMonths ? (
                            <>
                              Окупаемость интеграции:{" "}
                              <span className="text-[#0f172a]">{calc.paybackMonths} мес</span>.{" "}
                              {calc.thresholdManagers !== null && (
                                <>
                                  Порог: <span className="text-[#0f172a]">{calc.thresholdManagers} менеджеров</span>.
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              Не окупается при этих параметрах.{" "}
                              {calc.thresholdManagers !== null ? (
                                <>
                                  Окупается от{" "}
                                  <span className="text-[#0f172a]">{calc.thresholdManagers} менеджеров</span>{" "}
                                  (в пределах 12 мес).
                                </>
                              ) : calc.thresholdSalary !== null ? (
                                <>
                                  Попробуй ФОТ от{" "}
                                  <span className="text-[#0f172a]">{formatMoneyInput(calc.thresholdSalary)} ₽</span>.
                                </>
                              ) : (
                                <>Попробуй увеличить долю замещения или ФОТ.</>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* нижняя стеклянная зона с кнопкой и текстом */}
            <div className="px-8 pb-8 pt-7">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className={[
                    "rounded-[24px] px-8 py-4",
                    "bg-white/92",
                    "text-[15px] font-semibold text-[#0f172a]",
                    "lg-border border border-black/10",
                    "shadow-[0_22px_70px_rgba(0,0,0,0.10)]",
                    "hover:text-[#c73f40] active:scale-[0.99]",
                  ].join(" ")}
                  style={{ animation: "roiPulse 2.8s ease-in-out infinite" }}
                  aria-label="Развернуть калькулятор"
                >
                  {expanded ? "Свернуть калькулятор" : "Развернуть калькулятор"}
                </button>

                <div className="max-w-[760px] text-[13px] leading-[1.35] text-white/80">
                  {expanded
                    ? "Здесь можно настроить накладные, тариф, оплату и долю замещения. Дальше подтянем ещё более “доказательные” акценты при необходимости."
                    : "Разверни калькулятор, чтобы настроить накладные, тариф, долю замещения и увидеть горизонты 3/5 лет."}
                </div>
              </div>
            </div>

            {/* мягкая нижняя подсветка */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[140px] rounded-b-[52px] opacity-70 bg-[radial-gradient(900px_220px_at_50%_0%,rgba(255,255,255,0.10),transparent_60%)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
