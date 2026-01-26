"use client";

import React from "react";

type Billing = "monthly" | "yearly";
type PlanKey = "small" | "mid" | "enterprise";

const INTEGRATION_COST = 179_990;

const PLAN_META: Record<PlanKey, { title: string; priceMonthly: number }> = {
  small: { title: "Малый", priceMonthly: 9_900 },
  mid: { title: "Средний", priceMonthly: 39_900 },
  enterprise: { title: "Энтерпрайз", priceMonthly: 99_900 },
};

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

function formatRub(v: number) {
  const n = Math.round(v);
  const sign = n < 0 ? "−" : "";
  const abs = Math.abs(n);
  return `${sign}${abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;
}

function formatNum(v: number) {
  const n = Math.round(v);
  const sign = n < 0 ? "−" : "";
  const abs = Math.abs(n);
  return `${sign}${abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
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

function Tooltip({ text }: { text: string }) {
  return (
    <span className="relative inline-flex items-center">
      <span className="group relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/5 text-[12px] font-semibold text-[#0f172a]">
        i
        <span
          className="
            pointer-events-none
            absolute left-1/2 top-full z-20 mt-2 w-[300px]
            -translate-x-1/2
            rounded-[14px]
            lg-border border border-white/18
            bg-white/92
            px-3 py-2
            text-[12px] font-medium text-[#475467]
            shadow-[0_18px_55px_rgba(0,0,0,0.10)]
            opacity-0
            transition-opacity duration-[220ms]
            group-hover:opacity-100
          "
        >
          {text}
        </span>
      </span>
    </span>
  );
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
  const trackBg = `linear-gradient(90deg, rgba(199,63,64,0.20) 0%, rgba(199,63,64,0.10) ${pct}%, rgba(15,23,42,0.06) ${pct}%, rgba(15,23,42,0.06) 100%)`;

  return (
    <div className="rounded-[16px] lg-border border border-white/18 bg-white/65 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
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

function PaybackBar({
  monthlySaving,
  paybackMonths,
}: {
  monthlySaving: number;
  paybackMonths: number | null;
}) {
  const horizon = 12;

  const ok = paybackMonths !== null && paybackMonths > 0;
  const within = ok && paybackMonths! <= horizon;

  const progress = !ok
    ? 0
    : clamp((INTEGRATION_COST / Math.max(1e-6, monthlySaving)) / horizon, 0, 1);

  const markerLeft = !ok
    ? null
    : `${clamp(((Math.min(paybackMonths!, horizon) - 1) / (horizon - 1)) * 100, 0, 100)}%`;

  return (
    <div className="mt-4 rounded-[16px] lg-border border border-white/18 bg-white/60 p-3 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[12px] font-semibold text-[#0f172a]">Окупаемость (12 мес)</div>
        <div className="text-[12px] font-semibold text-[#667085]">
          {ok ? (within ? `≈ ${paybackMonths} мес` : `> ${horizon} мес`) : "нет"}
        </div>
      </div>

      <div className="mt-3 relative h-[26px]">
        <div className="absolute inset-0 rounded-[999px] lg-border border border-white/18 bg-white/70" />
        <div
          className="absolute left-0 top-0 h-full rounded-[999px]"
          style={{
            width: `${clamp(progress * 100, 0, 100)}%`,
            background: "linear-gradient(90deg, rgba(40,223,124,0.30), rgba(40,223,124,0.10))",
            boxShadow: "0 18px 55px rgba(40,223,124,0.10)",
          }}
        />

        {ok ? (
          <div className="absolute top-1/2 -translate-y-1/2" style={{ left: markerLeft ?? "0%" }}>
            <div className="h-5 w-5 rounded-full bg-white shadow-[0_16px_45px_rgba(0,0,0,0.12)] ring-1 ring-black/10" />
          </div>
        ) : null}

        <div className="absolute inset-0 flex items-center justify-between px-3 text-[10px] text-[#98A2B3]">
          {[0, 2, 4, 6, 8, 10, 12].map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
      </div>

      {!ok ? (
        <div className="mt-3 text-[12px] text-[#667085]">
          Не окупается при этих параметрах. Увеличь менеджеров, ФОТ или долю замещения.
        </div>
      ) : null}
    </div>
  );
}

function MiniBars({ peopleYear, uniYear1 }: { peopleYear: number; uniYear1: number }) {
  const maxV = Math.max(peopleYear, uniYear1, 1);
  const p = clamp((peopleYear / maxV) * 100, 0, 100);
  const u = clamp((uniYear1 / maxV) * 100, 0, 100);

  return (
    <div className="mt-4 rounded-[16px] lg-border border border-white/18 bg-white/60 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[12px] font-semibold text-[#0f172a]">Люди vs ЮНИ (1-й год)</div>
        <div className="text-[12px] font-semibold text-[#667085]">2 столбца</div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-[14px] lg-border border border-white/18 bg-white/70 p-3">
          <div className="text-[12px] font-semibold text-[#0f172a]">Люди</div>
          <div className="mt-2 h-[10px] rounded-[999px] bg-black/5 overflow-hidden">
            <div
              className="h-full rounded-[999px]"
              style={{
                width: `${p}%`,
                background: "linear-gradient(90deg, rgba(15,23,42,0.20), rgba(15,23,42,0.08))",
              }}
            />
          </div>
          <div className="mt-2 text-[12px] text-[#667085]">{formatRub(peopleYear)}</div>
        </div>

        <div className="rounded-[14px] lg-border border border-white/18 bg-white/70 p-3">
          <div className="text-[12px] font-semibold text-[#0f172a]">ЮНИ</div>
          <div className="mt-2 h-[10px] rounded-[999px] bg-black/5 overflow-hidden">
            <div
              className="h-full rounded-[999px]"
              style={{
                width: `${u}%`,
                background: "linear-gradient(90deg, rgba(199,63,64,0.22), rgba(199,63,64,0.08))",
              }}
            />
          </div>
          <div className="mt-2 text-[12px] text-[#667085]">{formatRub(uniYear1)}</div>
        </div>
      </div>
    </div>
  );
}

function HorizonSpark({ s1, s3, s5 }: { s1: number; s3: number; s5: number }) {
  const maxAbs = Math.max(Math.abs(s1), Math.abs(s3), Math.abs(s5), 1);
  const mapY = (v: number) => 22 - (v / maxAbs) * 14;

  const p1 = { x: 10, y: mapY(s1) };
  const p3 = { x: 50, y: mapY(s3) };
  const p5 = { x: 90, y: mapY(s5) };

  const allBad = s1 <= 0 && s3 <= 0 && s5 <= 0;
  const stroke = allBad ? "rgba(199,63,64,0.65)" : "rgba(40,223,124,0.65)";
  const dot = allBad ? "rgba(199,63,64,0.85)" : "rgba(40,223,124,0.85)";

  return (
    <div className="mt-4 rounded-[16px] lg-border border border-white/18 bg-white/60 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[12px] font-semibold text-[#0f172a]">Экономия в горизонте</div>
        <div className="text-[12px] font-semibold text-[#667085]">1 / 3 / 5 лет</div>
      </div>

      <div className="mt-3 rounded-[14px] lg-border border border-white/18 bg-white/70 p-3">
        <div className="relative h-[70px]">
          <div
            className="absolute inset-0 rounded-[12px] opacity-75"
            style={{
              background:
                "radial-gradient(320px 90px at 20% 0%, rgba(255,255,255,0.70), transparent 60%)",
            }}
          />
          <svg className="absolute inset-0" viewBox="0 0 100 44" preserveAspectRatio="none">
            <line x1="0" y1="22" x2="100" y2="22" stroke="rgba(15,23,42,0.10)" strokeWidth="2" />
            <path
              d={`M ${p1.x} ${p1.y} L ${p3.x} ${p3.y} L ${p5.x} ${p5.y}`}
              fill="none"
              stroke={stroke}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {[p1, p3, p5].map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="6.2" fill="rgba(255,255,255,0.55)" />
                <circle cx={p.x} cy={p.y} r="4.0" fill={dot} />
              </g>
            ))}
          </svg>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { label: "1 год", v: s1 },
            { label: "3 года", v: s3 },
            { label: "5 лет", v: s5 },
          ].map((x) => (
            <div key={x.label} className="rounded-[14px] lg-border border border-white/18 bg-white/75 p-3">
              <div className="text-[12px] font-semibold text-[#0f172a]">{x.label}</div>
              <div className="mt-1 text-[12px] text-[#667085]">{formatRub(x.v)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RoiCalculatorSection() {
  const [expanded, setExpanded] = React.useState(false);

  // по умолчанию: медианная зарплата менеджера по продажам в РФ на 2025 год
  const [managers, setManagers] = React.useState<number>(5);
  const [salary, setSalary] = React.useState<number>(77_917);

  const [coeff, setCoeff] = React.useState<number>(1.3);
  const [share, setShare] = React.useState<number>(0.7);

  // по умолчанию — "Средний"
  const [plan, setPlan] = React.useState<PlanKey>("mid");
  const [billing, setBilling] = React.useState<Billing>("monthly");

  const calc = React.useMemo(() => {
    const m = clamp(Math.round(managers), 1, 10);
    const sRaw = Math.round(salary);
    const s = clamp(Number.isFinite(sRaw) ? sRaw : 77_917, 10_000, 1_000_000);

    const c = clamp(Number(coeff) || 1.3, 1.0, 2.2);
    const sh = clamp(Number(share) || 0.7, 0.1, 1);

    const peopleYear = m * s * c * 12 * sh;

    const calcForPlan = (k: PlanKey) => {
      const planMonthly = PLAN_META[k].priceMonthly;
      const planAnnual = billing === "monthly" ? planMonthly * 12 : planMonthly * 12 * 0.8;
      const planMonthlyEff = billing === "monthly" ? planMonthly : planMonthly * 0.8;

      const year1Uni = planAnnual + INTEGRATION_COST;
      const year2Uni = planAnnual;

      const savings1 = peopleYear - year1Uni;
      const savings1Pct = peopleYear > 0 ? (savings1 / peopleYear) * 100 : 0;

      const people3 = peopleYear * 3;
      const people5 = peopleYear * 5;

      const uni3 = year1Uni + year2Uni * 2;
      const uni5 = year1Uni + year2Uni * 4;

      const sav3 = people3 - uni3;
      const sav5 = people5 - uni5;

      const sav3Pct = people3 > 0 ? (sav3 / people3) * 100 : 0;
      const sav5Pct = people5 > 0 ? (sav5 / people5) * 100 : 0;

      const monthlyPeople = m * s * c * sh;
      const monthlySaving = monthlyPeople - planMonthlyEff;

      const paybackMonths = monthlySaving > 0 ? Math.ceil(INTEGRATION_COST / monthlySaving) : null;

      return {
        key: k,
        planMonthly,
        planAnnual,
        planMonthlyEff,
        year1Uni,
        year2Uni,
        savings1,
        savings1Pct,
        sav3,
        sav3Pct,
        sav5,
        sav5Pct,
        monthlySaving,
        paybackMonths,
      };
    };

    const plans = (Object.keys(PLAN_META) as PlanKey[]).map(calcForPlan);
    const best = plans.reduce((a, b) => (b.savings1 > a.savings1 ? b : a), plans[0]);

    const chosen = plans.find((x) => x.key === plan) ?? best;

    // Порог окупаемости (в пределах 12 мес) — от N менеджеров при текущих остальных параметрах и выбранном тарифе
    const thresholdManagers = (() => {
      for (let mm = 1; mm <= 10; mm++) {
        const monthlyPeople = mm * s * c * sh;
        const monthlySaving = monthlyPeople - chosen.planMonthlyEff;
        if (monthlySaving <= 0) continue;
        const pb = Math.ceil(INTEGRATION_COST / monthlySaving);
        if (pb <= 12) return mm;
      }
      return null;
    })();

    // Альтернатива: при ФОТ от X ₽ (при текущем числе менеджеров), чтобы окупилось за 12 мес
    const thresholdSalary = (() => {
      const mm = m;
      const needMonthlySaving = INTEGRATION_COST / 12;
      const denom = mm * c * sh;
      if (denom <= 0) return null;

      const sNeed = (chosen.planMonthlyEff + needMonthlySaving) / denom;
      if (!Number.isFinite(sNeed)) return null;

      return clamp(Math.ceil(sNeed / 1000) * 1000, 10_000, 1_000_000);
    })();

    const bad = chosen.savings1 < 0;

    return {
      m,
      s,
      c,
      sh,
      bad,
      peopleYear,
      plans,
      bestPlan: best.key as PlanKey,
      chosen,
      thresholdManagers,
      thresholdSalary,
    };
  }, [managers, salary, coeff, share, plan, billing]);

  const aSavings1 = useCountUp(calc.chosen.savings1, 720);
  const aSavings1Pct = useCountUp(calc.chosen.savings1Pct, 720);

  const aPeopleYear = useCountUp(calc.peopleYear, 650);
  const aYear1Uni = useCountUp(calc.chosen.year1Uni, 650);
  const aYear2Uni = useCountUp(calc.chosen.year2Uni, 650);

  const aSav3 = useCountUp(calc.chosen.sav3, 720);
  const aSav3Pct = useCountUp(calc.chosen.sav3Pct, 720);
  const aSav5 = useCountUp(calc.chosen.sav5, 720);
  const aSav5Pct = useCountUp(calc.chosen.sav5Pct, 720);

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
          <div className="mt-2 text-white/70 font-semibold tracking-[-0.01em] text-[13px] sm:text-[16px]">
            Сколько стоит текущая модель, сколько стоит ЮНИ, когда окупится и что будет на горизонте 3/5 лет.
          </div>
        </div>

        <div className="mt-8 md:mt-12">
          <div className="lg-border relative mx-auto max-w-[1240px] rounded-[44px] border border-white/18 bg-white/10 p-[10px] shadow-[0_22px_70px_rgba(0,0,0,0.05)] backdrop-blur-[26px] backdrop-saturate-150">
            <div className="pointer-events-none absolute inset-0 rounded-[44px] ring-1 ring-white/10" />
            <div className="pointer-events-none absolute inset-0 rounded-[44px] opacity-70 bg-[radial-gradient(900px_420px_at_20%_0%,rgba(255,255,255,0.10),transparent_60%),radial-gradient(900px_420px_at_80%_100%,rgba(199,63,64,0.08),transparent_65%)]" />

            {/* Верхняя белая карточка (как на референсе) */}
            <div className="relative rounded-[36px] lg-border border border-white/18 bg-white/82 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.03)]">
              <div className="grid gap-4 lg:grid-cols-2">
                {/* LEFT */}
                <div className="rounded-[28px] lg-border border border-white/18 bg-white/70 p-6 shadow-[0_16px_45px_rgba(0,0,0,0.04)]">
                  <div className="text-[14px] font-semibold text-[#0f172a]">Входные параметры</div>

                  {/* Managers */}
                  <div className="mt-6">
                    <div className="flex items-end justify-between gap-3">
                      <div className="text-[12px] font-semibold text-[#0f172a]">Кол-во менеджеров</div>
                      <div className="text-[12px] font-semibold text-[#0f172a]">{calc.m}</div>
                    </div>

                    <div className="mt-3">
                      <GlassRange
                        value={calc.m}
                        min={1}
                        max={10}
                        step={1}
                        onChange={setManagers}
                        ariaLabel="Количество менеджеров"
                      />

                      <div className="mt-3 flex flex-wrap gap-2">
                        {[1, 3, 5, 10].map((x) => (
                          <button
                            key={x}
                            type="button"
                            onClick={() => setManagers(x)}
                            className={[
                              "rounded-full px-4 py-2 text-[12px] font-semibold transition-[transform,color,background-color] duration-[600ms] active:scale-[0.99]",
                              "bg-white border border-black/10", // кнопка на белом фоне: еле-серый бордюр
                              calc.m === x ? "text-[#0f172a]" : "text-[#667085] hover:text-[#c73f40]",
                            ].join(" ")}
                          >
                            {x}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Salary */}
                  <div className="mt-8">
                    <div className="text-[12px] font-semibold text-[#0f172a]">ФОТ одного менеджера (₽/мес)</div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
                      <input
                        value={formatMoneyInput(calc.s)}
                        onChange={(e) => setSalary(parseMoneyInput(e.target.value))}
                        inputMode="numeric"
                        className="h-11 w-full rounded-[16px] lg-border border border-white/18 bg-white/65 px-4 text-[14px] font-semibold text-[#0f172a] shadow-[0_12px_35px_rgba(0,0,0,0.04)] outline-none focus:border-white/30"
                        placeholder="77 917"
                        aria-label="ФОТ одного менеджера"
                      />

                      <div className="flex flex-wrap gap-2 sm:justify-end">
                        {[50_000, 80_000, 100_000].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setSalary(v)}
                            className={[
                              "rounded-full px-4 py-2 text-[12px] font-semibold transition-[transform,color,background-color] duration-[600ms] active:scale-[0.99]",
                              "bg-white border border-black/10",
                              calc.s === v ? "text-[#0f172a]" : "text-[#667085] hover:text-[#c73f40]",
                            ].join(" ")}
                          >
                            {formatNum(v)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-2 text-[12px] text-[#98A2B3]">
                      {formatRub(77_917).replace(" ₽", " ₽")} - медианная зарплата менеджера по продажам в РФ на 2025 год
                    </div>
                  </div>

                  {/* EXPANDED: controls */}
                  {expanded ? (
                    <>
                      {/* Overheads */}
                      <div className="mt-8">
                        <div className="flex items-center gap-2 text-[12px] font-semibold text-[#0f172a]">
                          Накладные <Tooltip text="Налоги, рабочее место, обучение, текучка, управление." />
                        </div>

                        <div className="mt-3 rounded-[16px] lg-border border border-white/18 bg-white/65 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
                          <div className="flex flex-wrap items-center gap-2">
                            {[1.0, 1.2, 1.3, 1.5].map((v) => (
                              <button
                                key={v}
                                type="button"
                                onClick={() => setCoeff(v)}
                                className={[
                                  "rounded-full px-4 py-2 text-[12px] font-semibold transition-[transform,color,background-color] duration-[600ms] active:scale-[0.99]",
                                  "bg-white border border-black/10",
                                  Math.abs(calc.c - v) < 0.001
                                    ? "text-[#0f172a]"
                                    : "text-[#667085] hover:text-[#c73f40]",
                                ].join(" ")}
                              >
                                {v.toFixed(1)}
                              </button>
                            ))}

                            <div className="ml-2 flex items-center gap-2">
                              <span className="text-[12px] text-[#667085]">свой:</span>
                              <input
                                value={String(calc.c)}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(",", ".");
                                  const n = Number(raw);
                                  setCoeff(Number.isFinite(n) ? n : 1.3);
                                }}
                                inputMode="decimal"
                                className="h-10 w-[96px] rounded-[14px] lg-border border border-white/18 bg-white/65 px-3 text-[12px] font-semibold text-[#0f172a] outline-none"
                                aria-label="Свой коэффициент накладных"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Plan */}
                      <div className="mt-8">
                        <div className="text-[12px] font-semibold text-[#0f172a]">Тариф</div>

                        <div className="mt-3 grid gap-2 sm:grid-cols-3">
                          {(Object.keys(PLAN_META) as PlanKey[]).map((k) => {
                            const meta = PLAN_META[k];
                            const active = plan === k;
                            const isBest = calc.bestPlan === k;

                            return (
                              <button
                                key={k}
                                type="button"
                                onClick={() => setPlan(k)}
                                className={[
                                  "rounded-[18px] p-4 text-left transition-[transform,box-shadow] duration-[650ms] active:scale-[0.99]",
                                  "lg-border border border-white/18 bg-white/65 shadow-[0_12px_35px_rgba(0,0,0,0.04)]",
                                  isBest ? "ring-1 ring-white/35" : "ring-0",
                                  active ? "outline outline-1 outline-[#c73f40]/25" : "",
                                ].join(" ")}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="text-[12px] font-semibold text-[#0f172a]">{meta.title}</div>
                                  {isBest ? (
                                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-[#0f172a] border border-black/10">
                                      лучший
                                    </span>
                                  ) : null}
                                </div>
                                <div className="mt-1 text-[12px] text-[#667085]">{formatRub(meta.priceMonthly)} / мес</div>
                              </button>
                            );
                          })}
                        </div>

                        <div className="mt-4">
                          <div className="text-[12px] font-semibold text-[#0f172a]">Оплата тарифа</div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setBilling("monthly")}
                              className={[
                                "h-11 rounded-[999px] px-5 text-[13px] font-semibold transition-[transform,color,background-color] duration-[650ms] active:scale-[0.99]",
                                "bg-white border border-black/10",
                                billing === "monthly" ? "text-[#0f172a]" : "text-[#667085] hover:text-[#c73f40]",
                              ].join(" ")}
                            >
                              Ежемесячно
                            </button>

                            <button
                              type="button"
                              onClick={() => setBilling("yearly")}
                              className={[
                                "h-11 rounded-[999px] px-5 text-[13px] font-semibold transition-[transform,color,background-color] duration-[650ms] active:scale-[0.99]",
                                "bg-white border border-black/10",
                                billing === "yearly" ? "text-[#0f172a]" : "text-[#667085] hover:text-[#c73f40]",
                              ].join(" ")}
                            >
                              Годовой (-20%)
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Share */}
                      <div className="mt-8">
                        <div className="flex items-end justify-between gap-3">
                          <div className="text-[12px] font-semibold text-[#0f172a]">Доля замещения функций</div>
                          <div className="text-[12px] font-semibold text-[#0f172a]">{Math.round(calc.sh * 100)}%</div>
                        </div>

                        <div className="mt-3">
                          <GlassRange
                            value={Math.round(calc.sh * 100)}
                            min={10}
                            max={100}
                            step={5}
                            onChange={(v) => setShare(v / 100)}
                            ariaLabel="Доля замещения функций"
                          />

                          <div className="mt-3 flex flex-wrap gap-2">
                            {[
                              { p: 45, t: "Консервативно" },
                              { p: 70, t: "Реалистично" },
                              { p: 100, t: "100%" },
                            ].map((x) => (
                              <button
                                key={x.p}
                                type="button"
                                onClick={() => setShare(x.p / 100)}
                                className={[
                                  "rounded-full px-4 py-2 text-[12px] font-semibold transition-[transform,color,background-color] duration-[600ms] active:scale-[0.99]",
                                  "bg-white border border-black/10",
                                  Math.round(calc.sh * 100) === x.p
                                    ? "text-[#0f172a]"
                                    : "text-[#667085] hover:text-[#c73f40]",
                                ].join(" ")}
                              >
                                {x.t} <span className="opacity-70">({x.p}%)</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Integration */}
                      <div className="mt-8 rounded-[16px] lg-border border border-white/18 bg-white/65 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-[12px] font-semibold text-[#0f172a]">Интеграция (единовременно)</div>
                          <div className="text-[12px] font-semibold text-[#0f172a]">{formatRub(INTEGRATION_COST)}</div>
                        </div>
                        <div className="mt-2 text-[12px] text-[#667085]">
                          Аудит, ТЗ, база знаний, сборка MVP, тестирование и запуск.
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>

                {/* RIGHT */}
                <div className="rounded-[28px] lg-border border border-white/18 bg-white/70 p-6 shadow-[0_16px_45px_rgba(0,0,0,0.04)]">
                  <div className="text-[14px] font-semibold text-[#0f172a]">Результат</div>
                  <div className="mt-1 text-[12px] text-[#667085]">Экономия и окупаемость</div>

                  {/* Main highlight block with “smart” border */}
                  <div className="mt-6 rounded-[26px] p-[2px] bg-gradient-to-r from-[#ff4d4d]/60 via-[#c73f40]/20 to-[#7c3aed]/55">
                    <div className="rounded-[24px] lg-border border border-white/18 bg-white/70 p-5">
                      <div className="text-[12px] font-semibold text-[#667085]">Экономия за 1 год</div>

                      <div className="mt-2 flex flex-wrap items-end gap-3">
                        <div
                          className={[
                            "text-[30px] sm:text-[40px] font-semibold tracking-[-0.02em]",
                            calc.bad ? "text-[#c73f40]" : "text-[#28df7c]",
                          ].join(" ")}
                        >
                          {formatRub(aSavings1)}
                        </div>

                        <div className="pb-[6px] text-[14px] font-semibold text-[#0f172a]">
                          {`${aSavings1Pct.toFixed(1)}%`}
                        </div>
                      </div>

                      <PaybackBar monthlySaving={calc.chosen.monthlySaving} paybackMonths={calc.chosen.paybackMonths} />

                      <div className="mt-3 text-[13px] font-semibold text-[#0f172a]">
                        {calc.chosen.paybackMonths && calc.chosen.paybackMonths > 0
                          ? calc.chosen.paybackMonths <= 12
                            ? `Окупаемость интеграции: ${calc.chosen.paybackMonths} мес`
                            : `Окупаемость интеграции: позже 12 мес`
                          : "Не окупается при этих параметрах"}
                      </div>

                      <div className="mt-2 text-[12px] text-[#98A2B3]">
                        {calc.thresholdManagers !== null ? (
                          <>
                            Окупается от: <span className="font-semibold text-[#0f172a]">{calc.thresholdManagers} менеджеров</span>{" "}
                            (в пределах 12 мес).
                          </>
                        ) : calc.thresholdSalary !== null ? (
                          <>
                            Окупается при ФОТ от:{" "}
                            <span className="font-semibold text-[#0f172a]">{formatRub(calc.thresholdSalary)}</span>{" "}
                            (при {calc.m} менеджерах).
                          </>
                        ) : (
                          <>Окупается при более высоких параметрах.</>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Small costs line (мозг считывает 1-й год дороже) */}
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <div className="rounded-[16px] lg-border border border-white/18 bg-white/65 p-3">
                      <div className="text-[12px] font-semibold text-[#0f172a]">ФОТ людей / год</div>
                      <div className="mt-1 text-[12px] text-[#667085]">{formatRub(aPeopleYear)}</div>
                    </div>
                    <div className="rounded-[16px] lg-border border border-white/18 bg-white/65 p-3">
                      <div className="text-[12px] font-semibold text-[#0f172a]">ЮНИ: 1-й год</div>
                      <div className="mt-1 text-[12px] text-[#667085]">{formatRub(aYear1Uni)}</div>
                    </div>
                    <div className="rounded-[16px] lg-border border border-white/18 bg-white/65 p-3">
                      <div className="text-[12px] font-semibold text-[#0f172a]">ЮНИ: 2-й год</div>
                      <div className="mt-1 text-[12px] text-[#667085]">{formatRub(aYear2Uni)}</div>
                    </div>
                  </div>

                  {/* bottom row like in the mock */}
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div className="text-[12px] font-semibold text-[#0f172a]">
                      Замещение: <span className="text-[#667085]">{Math.round(calc.sh * 100)}%</span>
                    </div>
                    <div className="text-[12px] text-[#98A2B3]">{expanded ? "Можно свернуть" : "Разверни, чтобы отрегулировать"}</div>
                  </div>

                  {/* Expanded: horizons + mini-graphs */}
                  {expanded ? (
                    <>
                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[18px] lg-border border border-white/18 bg-white/65 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
                          <div className="text-[12px] font-semibold text-[#667085]">Экономия за 3 года</div>
                          <div className="mt-2 text-[16px] font-semibold text-[#0f172a]">{formatRub(aSav3)}</div>
                          <div className="mt-1 text-[12px] text-[#667085]">{`${aSav3Pct.toFixed(1)}%`}</div>
                        </div>

                        <div className="rounded-[18px] lg-border border border-white/18 bg-white/65 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
                          <div className="text-[12px] font-semibold text-[#667085]">Экономия за 5 лет</div>
                          <div className="mt-2 text-[16px] font-semibold text-[#0f172a]">{formatRub(aSav5)}</div>
                          <div className="mt-1 text-[12px] text-[#667085]">{`${aSav5Pct.toFixed(1)}%`}</div>
                        </div>
                      </div>

                      <MiniBars peopleYear={calc.peopleYear} uniYear1={calc.chosen.year1Uni} />
                      <HorizonSpark s1={calc.chosen.savings1} s3={calc.chosen.sav3} s5={calc.chosen.sav5} />

                      <div className="mt-4 text-[12px] text-[#667085] leading-[1.35]">
                        Числа для оценки. Итог зависит от сценариев, качества базы знаний и глубины интеграций.
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Нижняя стеклянная зона (как на референсе) */}
            <div className="mt-7 px-6 pb-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="
                    rounded-[22px]
                    bg-white/92
                    px-10 py-5
                    text-[18px] font-semibold
                    text-[#0f172a]
                    border border-black/10
                    shadow-[0_22px_70px_rgba(0,0,0,0.10)]
                    hover:text-[#c73f40]
                    active:scale-[0.99]
                  "
                  style={{ animation: "roiPulse 2.8s ease-in-out infinite" }}
                  aria-label={expanded ? "Свернуть калькулятор" : "Развернуть калькулятор"}
                >
                  {expanded ? "Свернуть калькулятор" : "Развернуть калькулятор"}
                </button>

                <div className="max-w-[760px] text-[18px] leading-[1.35] text-white/80">
                  Разверни калькулятор, чтобы настроить накладные, тариф, долю замещения и увидеть горизонты 3/5 лет.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
