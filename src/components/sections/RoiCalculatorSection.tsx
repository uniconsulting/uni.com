"use client";

import React from "react";

type Billing = "monthly" | "yearly";
type PlanKey = "small" | "mid" | "enterprise";
type AssumptionMode = "full" | "real" | "cons";

const INTEGRATION_COST = 179_990;

const PLANS: Record<PlanKey, { title: string; monthly: number }> = {
  small: { title: "Малый", monthly: 9_900 },
  mid: { title: "Средний", monthly: 39_900 },
  enterprise: { title: "Энтерпрайз", monthly: 99_900 },
};

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

function formatRub(v: number) {
  const sign = v < 0 ? "-" : "";
  const n = Math.round(Math.abs(v));
  return `${sign}${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;
}

function parseMoney(raw: string) {
  const digits = raw.replace(/[^\d]/g, "");
  const n = digits ? Number(digits) : 0;
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(n: number) {
  const safe = Math.max(0, Math.round(n));
  return safe.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function useCountUp(target: number, durationMs = 700) {
  const [val, setVal] = React.useState<number>(target);
  const prevRef = React.useRef<number>(target);
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const from = prevRef.current;
    const to = target;

    if (!Number.isFinite(from) || !Number.isFinite(to)) {
      setVal(to);
      prevRef.current = to;
      return;
    }

    if (Math.abs(to - from) < 0.01) {
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

function HorizonChart({
  y1,
  y3,
  y5,
}: {
  y1: number;
  y3: number;
  y5: number;
}) {
  const values = [y1, y3, y5].map((v) => (Number.isFinite(v) ? v : 0));
  const maxAbs = Math.max(...values.map((v) => Math.abs(v)), 1);

  // центр 50, амплитуда 32 (точки стабильно остаются внутри)
  const mapY = (v: number) => 50 - (v / maxAbs) * 32;

  const pts = [
    { x: 14, y: mapY(values[0]) },
    { x: 50, y: mapY(values[1]) },
    { x: 86, y: mapY(values[2]) },
  ];

  const allBad = values[0] < 0 && values[1] < 0 && values[2] < 0;
  const stroke = allBad ? "rgba(199,63,64,0.62)" : "rgba(40,223,124,0.62)";
  const dot = allBad ? "rgba(199,63,64,0.86)" : "rgba(40,223,124,0.86)";
  const areaTop = allBad ? "rgba(199,63,64,0.12)" : "rgba(40,223,124,0.12)";

  const d = `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y} L ${pts[2].x} ${pts[2].y}`;

  return (
    <div className="mt-4 rounded-[18px] lg-border border border-white/18 bg-white/60 p-4">
      <div className="text-[12px] font-semibold text-[#0f172a]">Экономия в горизонте</div>

      <div className="mt-3 rounded-[18px] lg-border border border-white/18 bg-white/65 p-3">
        <div className="rounded-[14px] lg-border border border-white/18 bg-white/55 p-3">
          <svg viewBox="0 0 100 100" className="h-[92px] w-full">
            <defs>
              <linearGradient id="roiAreaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={areaTop} />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>

            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(15,23,42,0.10)" strokeWidth="2" />

            <path d={`${d} L ${pts[2].x} 92 L ${pts[0].x} 92 Z`} fill="url(#roiAreaFill)" />

            <path
              d={d}
              fill="none"
              stroke={stroke}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {pts.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="7.2" fill="rgba(255,255,255,0.55)" />
                <circle cx={p.x} cy={p.y} r="4.6" fill={dot} />
              </g>
            ))}
          </svg>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-[12px] text-[#667085]">
          {[
            { label: "1 год", v: values[0] },
            { label: "3 года", v: values[1] },
            { label: "5 лет", v: values[2] },
          ].map((x) => (
            <div key={x.label} className="rounded-[14px] lg-border border border-white/18 bg-white/65 p-3">
              <div className="font-semibold text-[#0f172a]">{x.label}</div>
              <div className="mt-1">{formatRub(x.v)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniBars({
  peopleYear,
  uniYear1,
}: {
  peopleYear: number;
  uniYear1: number;
}) {
  const a = Math.max(0, peopleYear);
  const b = Math.max(0, uniYear1);
  const max = Math.max(a, b, 1);

  const hA = clamp((a / max) * 100, 0, 100);
  const hB = clamp((b / max) * 100, 0, 100);

  return (
    <div className="mt-4 rounded-[18px] lg-border border border-white/18 bg-white/60 p-4">
      <div className="text-[12px] font-semibold text-[#0f172a]">Люди vs ЮНИ (1 год)</div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {[
          { title: "Люди", h: hA, value: peopleYear },
          { title: "ЮНИ", h: hB, value: uniYear1 },
        ].map((x) => (
          <div key={x.title} className="rounded-[16px] lg-border border border-white/18 bg-white/65 p-3">
            <div className="flex items-center justify-between">
              <div className="text-[12px] font-semibold text-[#0f172a]">{x.title}</div>
              <div className="text-[12px] text-[#667085]">{formatRub(x.value)}</div>
            </div>

            <div className="mt-3 h-[72px] rounded-[14px] lg-border border border-white/18 bg-white/55 p-2">
              <div className="relative h-full w-full rounded-[12px] bg-black/5 overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-[12px]"
                  style={{
                    height: `${x.h}%`,
                    background:
                      x.title === "ЮНИ"
                        ? "linear-gradient(180deg, rgba(199,63,64,0.28), rgba(199,63,64,0.10))"
                        : "linear-gradient(180deg, rgba(40,223,124,0.28), rgba(40,223,124,0.10))",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RoiCalculatorSection() {
  const [expanded, setExpanded] = React.useState(false);

  const [managers, setManagers] = React.useState(3);
  const [salary, setSalary] = React.useState(50_000);

  const [salaryStr, setSalaryStr] = React.useState(formatMoney(50_000));

  const [coeff, setCoeff] = React.useState(1.3);
  const [coeffStr, setCoeffStr] = React.useState("1.3");

  const [plan, setPlan] = React.useState<PlanKey>("mid");
  const [billing, setBilling] = React.useState<Billing>("monthly");

  const [assumptionMode, setAssumptionMode] = React.useState<AssumptionMode>("full");
  const replaceShare = assumptionMode === "full" ? 1 : assumptionMode === "real" ? 0.7 : 0.45;

  React.useEffect(() => {
    setSalaryStr(formatMoney(salary));
  }, [salary]);

  React.useEffect(() => {
    setCoeffStr(String(coeff));
  }, [coeff]);

  const calc = React.useMemo(() => {
    const m = clamp(Math.round(managers), 1, 10);
    const s = Math.max(0, Math.round(salary));
    const c = clamp(Number(coeff) || 1, 1.0, 2.2);

    const peopleYear = m * s * c * 12;
    const peopleYearCompare = peopleYear * replaceShare;

    const planMonthly = PLANS[plan].monthly;
    const planAnnual = billing === "monthly" ? planMonthly * 12 : planMonthly * 12 * 0.8;

    const uniYear1 = planAnnual + INTEGRATION_COST;
    const uniYear2 = planAnnual;

    const savings1 = peopleYearCompare - uniYear1;
    const savings1Pct = peopleYearCompare > 0 ? (savings1 / peopleYearCompare) * 100 : 0;

    const people3 = peopleYearCompare * 3;
    const people5 = peopleYearCompare * 5;

    const uni3 = uniYear1 + uniYear2 * 2;
    const uni5 = uniYear1 + uniYear2 * 4;

    const sav3 = people3 - uni3;
    const sav5 = people5 - uni5;

    const sav3Pct = people3 > 0 ? (sav3 / people3) * 100 : 0;
    const sav5Pct = people5 > 0 ? (sav5 / people5) * 100 : 0;

    const planMonthlyEffective = billing === "monthly" ? planMonthly : Math.round(planMonthly * 0.8);
    const peopleMonthlyCompare = m * s * c * replaceShare;

    const monthlySaving = peopleMonthlyCompare - planMonthlyEffective;
    const paybackMonths = monthlySaving > 0 ? Math.ceil(INTEGRATION_COST / monthlySaving) : null;

    return {
      m,
      s,
      c,
      replaceShare,
      planMonthly,
      planAnnual,
      peopleYear,
      peopleYearCompare,
      uniYear1,
      uniYear2,
      savings1,
      savings1Pct,
      sav3,
      sav3Pct,
      sav5,
      sav5Pct,
      paybackMonths,
    };
  }, [managers, salary, coeff, plan, billing, replaceShare]);

  const animSavings1 = useCountUp(calc.savings1, 760);
  const animSavings1Pct = useCountUp(calc.savings1Pct, 760);
  const animSav3 = useCountUp(calc.sav3, 760);
  const animSav3Pct = useCountUp(calc.sav3Pct, 760);
  const animSav5 = useCountUp(calc.sav5, 760);
  const animSav5Pct = useCountUp(calc.sav5Pct, 760);

  const bad = calc.savings1 < 0;

  const sliderPct = ((calc.m - 1) / 9) * 100;
  const sliderStyle = {
    ["--p" as any]: `${sliderPct}%`,
  } as React.CSSProperties;

  return (
    <section id="roi" className="relative py-14 md:py-20">
      <style>{`
        @keyframes roiBlink {
          0% { opacity: 0.86; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.02); }
          100% { opacity: 0.86; transform: translateX(-50%) scale(1); }
        }

        /* Премиальный ползунок (без сторонних либ) */
        .roiRange {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 14px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.18);
          background:
            linear-gradient(
              to right,
              rgba(199,63,64,0.65) 0%,
              rgba(199,63,64,0.65) var(--p),
              rgba(15,23,42,0.10) var(--p),
              rgba(15,23,42,0.10) 100%
            );
          outline: none;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.35);
        }
        .roiRange::-webkit-slider-thumb{
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(15,23,42,0.10);
          box-shadow: 0 10px 26px rgba(0,0,0,0.12);
          transition: transform 700ms cubic-bezier(0.16,1,0.3,1);
          cursor: pointer;
        }
        .roiRange:active::-webkit-slider-thumb{ transform: scale(1.06); }

        .roiRange::-moz-range-thumb{
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(15,23,42,0.10);
          box-shadow: 0 10px 26px rgba(0,0,0,0.12);
          transition: transform 700ms cubic-bezier(0.16,1,0.3,1);
          cursor: pointer;
        }
        .roiRange:active::-moz-range-thumb{ transform: scale(1.06); }
      `}</style>

      <div className="mx-auto max-w-[1240px] px-4">
        <div className="mx-auto max-w-[1240px] text-center">
          <h2 className="text-white font-semibold leading-[0.95] tracking-[-0.02em] text-[24px] sm:text-[32px] lg:text-[42px]">
            ROI-калькулятор
          </h2>
          <div className="mt-2 text-white/70 font-semibold tracking-[-0.01em] text-[13px] sm:text-[16px]">
            Сравнение стоимости людей и ЮНИ, включая накладные и интеграцию.
          </div>
        </div>

        <div className="mt-8 md:mt-12">
          <div className="lg-border relative mx-auto max-w-[1240px] rounded-[40px] border border-white/18 bg-white/10 p-[10px] pb-[128px] shadow-[0_22px_70px_rgba(0,0,0,0.05)] backdrop-blur-[26px] backdrop-saturate-150">
            <div className="pointer-events-none absolute inset-0 rounded-[40px] ring-1 ring-white/10" />
            <div className="pointer-events-none absolute inset-0 rounded-[40px] opacity-70 bg-[radial-gradient(900px_420px_at_20%_0%,rgba(255,255,255,0.10),transparent_60%),radial-gradient(900px_420px_at_80%_100%,rgba(199,63,64,0.08),transparent_65%)]" />

            <div className="relative rounded-[34px] lg-border border border-white/18 bg-white/82 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.03)] grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              {/* LEFT */}
              <div className="rounded-[26px] lg-border border border-white/18 bg-white/70 p-5 shadow-[0_16px_45px_rgba(0,0,0,0.04)]">
                <div className="text-[14px] font-semibold text-[#0f172a]">Входные параметры</div>

                {/* managers */}
                <div className="mt-5">
                  <div className="flex items-end justify-between gap-3">
                    <div className="text-[12px] font-semibold text-[#0f172a]">Кол-во менеджеров</div>
                    <div className="text-[12px] font-semibold text-[#0f172a]">{calc.m}</div>
                  </div>

                  <div className="mt-3 rounded-[16px] lg-border border border-white/18 bg-white/65 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={calc.m}
                      onChange={(e) => setManagers(Number(e.target.value))}
                      className="roiRange"
                      style={sliderStyle}
                      aria-label="Количество менеджеров"
                    />

                    <div className="mt-3 flex flex-wrap gap-2">
                      {[1, 3, 5, 10].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setManagers(m)}
                          className={[
                            "rounded-full lg-border border border-black/5 px-3 py-1 text-[12px] font-semibold transition-[transform,color,background-color,border-color] duration-[650ms]",
                            "active:scale-[0.99]",
                            calc.m === m
                              ? "bg-white text-[#0f172a] border-black/10"
                              : "bg-white/70 text-[#475467] hover:text-[#c73f40] hover:border-black/10",
                          ].join(" ")}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* salary */}
                <div className="mt-5">
                  <div className="text-[12px] font-semibold text-[#0f172a]">ФОТ одного менеджера (₽/мес)</div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
                    <input
                      value={salaryStr}
                      onChange={(e) => {
                        const n = parseMoney(e.target.value);
                        setSalary(n);
                        setSalaryStr(formatMoney(n));
                      }}
                      onBlur={() => setSalaryStr(formatMoney(calc.s))}
                      inputMode="numeric"
                      className="h-10 w-full rounded-[14px] lg-border border border-white/18 bg-white/65 px-4 text-[13px] font-semibold text-[#0f172a] shadow-[0_12px_35px_rgba(0,0,0,0.04)] outline-none focus:border-white/30"
                      placeholder="50 000"
                      aria-label="ФОТ одного менеджера в месяц"
                    />

                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      {[50_000, 70_000, 100_000].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setSalary(v)}
                          className={[
                            "rounded-full lg-border border border-black/5 px-3 py-1 text-[12px] font-semibold transition-[transform,color,background-color,border-color] duration-[650ms]",
                            "active:scale-[0.99]",
                            calc.s === v
                              ? "bg-white text-[#0f172a] border-black/10"
                              : "bg-white/70 text-[#475467] hover:text-[#c73f40] hover:border-black/10",
                          ].join(" ")}
                        >
                          {formatRub(v).replace(" ₽", "")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* expanded controls */}
                {expanded ? (
                  <>
                    {/* coeff */}
                    <div className="mt-5">
                      <div className="text-[12px] font-semibold text-[#0f172a]">Коэффициент накладных</div>

                      <div className="mt-3 rounded-[16px] lg-border border border-white/18 bg-white/65 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
                        <div className="flex flex-wrap gap-2 items-center">
                          {[1.0, 1.2, 1.3, 1.5].map((v) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => setCoeff(v)}
                              className={[
                                "rounded-full lg-border border border-black/5 px-3 py-1 text-[12px] font-semibold transition-[transform,color,background-color,border-color] duration-[650ms]",
                                "active:scale-[0.99]",
                                Math.abs(calc.c - v) < 0.001
                                  ? "bg-white text-[#0f172a] border-black/10"
                                  : "bg-white/70 text-[#475467] hover:text-[#c73f40] hover:border-black/10",
                              ].join(" ")}
                            >
                              {v.toFixed(1)}
                            </button>
                          ))}

                          <div className="flex items-center gap-2 ml-2">
                            <span className="text-[12px] text-[#667085]">свой:</span>
                            <input
                              value={coeffStr}
                              onChange={(e) => {
                                const raw = e.target.value.replace(",", ".");
                                setCoeffStr(raw);
                                const n = Number(raw);
                                if (Number.isFinite(n)) setCoeff(n);
                              }}
                              onBlur={() => setCoeffStr(String(calc.c))}
                              inputMode="decimal"
                              className="h-9 w-[92px] rounded-[12px] lg-border border border-black/5 bg-white/65 px-3 text-[12px] font-semibold text-[#0f172a] outline-none"
                              aria-label="Свой коэффициент накладных"
                            />
                          </div>
                        </div>

                        <div className="mt-3 text-[12px] text-[#667085] leading-[1.35]">
                          Накладные: налоги, рабочее место, текучка, обучение, управленческие расходы.
                        </div>
                      </div>
                    </div>

                    {/* plan */}
                    <div className="mt-5">
                      <div className="text-[12px] font-semibold text-[#0f172a]">Тариф</div>

                      <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        {(["small", "mid", "enterprise"] as PlanKey[]).map((k) => {
                          const meta = PLANS[k];
                          const active = plan === k;

                          return (
                            <button
                              key={k}
                              type="button"
                              onClick={() => setPlan(k)}
                              className={[
                                "rounded-[16px] lg-border border border-black/5 p-3 text-left shadow-[0_12px_35px_rgba(0,0,0,0.04)] transition-[transform,color,background-color,border-color] duration-[650ms]",
                                "active:scale-[0.99]",
                                active
                                  ? "bg-white text-[#0f172a] border-black/10"
                                  : "bg-white/70 text-[#475467] hover:text-[#c73f40] hover:border-black/10",
                              ].join(" ")}
                            >
                              <div className="text-[12px] font-semibold">{meta.title}</div>
                              <div className="mt-1 text-[12px] opacity-80">{formatRub(meta.monthly)} / мес</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* billing */}
                    <div className="mt-5">
                      <div className="text-[12px] font-semibold text-[#0f172a]">Оплата тарифа</div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setBilling("monthly")}
                          className={[
                            "h-10 rounded-[999px] lg-border border border-black/5 px-5 text-[13px] font-semibold transition-[transform,color,background-color,border-color] duration-[650ms]",
                            "active:scale-[0.99]",
                            billing === "monthly"
                              ? "bg-white text-[#0f172a] border-black/10"
                              : "bg-white/70 text-[#475467] hover:text-[#c73f40] hover:border-black/10",
                          ].join(" ")}
                        >
                          Ежемесячно
                        </button>

                        <button
                          type="button"
                          onClick={() => setBilling("yearly")}
                          className={[
                            "h-10 rounded-[999px] lg-border border border-black/5 px-5 text-[13px] font-semibold transition-[transform,color,background-color,border-color] duration-[650ms]",
                            "active:scale-[0.99]",
                            billing === "yearly"
                              ? "bg-white text-[#0f172a] border-black/10"
                              : "bg-white/70 text-[#475467] hover:text-[#c73f40] hover:border-black/10",
                          ].join(" ")}
                        >
                          Годовой (-20%)
                        </button>
                      </div>
                    </div>

                    {/* assumptions */}
                    <div className="mt-5">
                      <div className="text-[12px] font-semibold text-[#0f172a]">Допущения</div>

                      <div className="mt-3 rounded-[16px] lg-border border border-white/18 bg-white/65 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
                        <div className="flex flex-wrap gap-2">
                          {[
                            { key: "full" as const, label: "100% функций", pct: 100 },
                            { key: "real" as const, label: "Реалистично", pct: 70 },
                            { key: "cons" as const, label: "Консервативно", pct: 45 },
                          ].map((x) => (
                            <button
                              key={x.key}
                              type="button"
                              onClick={() => setAssumptionMode(x.key)}
                              className={[
                                "rounded-[999px] lg-border border border-black/5 px-4 py-2 text-[12px] font-semibold transition-[transform,color,background-color,border-color] duration-[650ms]",
                                "active:scale-[0.99]",
                                assumptionMode === x.key
                                  ? "bg-white text-[#0f172a] border-black/10"
                                  : "bg-white/70 text-[#475467] hover:text-[#c73f40] hover:border-black/10",
                              ].join(" ")}
                            >
                              {x.label} <span className="opacity-70">({x.pct}%)</span>
                            </button>
                          ))}
                        </div>

                        <div className="mt-3 text-[12px] text-[#667085] leading-[1.35]">
                          Это доля задач, которую реально закрыть агентами. По умолчанию 100% как в ТЗ.
                        </div>
                      </div>
                    </div>

                    {/* integration */}
                    <div className="mt-5 rounded-[16px] lg-border border border-white/18 bg-white/65 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-[12px] font-semibold text-[#0f172a]">Интеграция (единовременно)</div>
                        <div className="text-[12px] font-semibold text-[#0f172a]">{formatRub(INTEGRATION_COST)}</div>
                      </div>
                      <div className="mt-2 text-[12px] text-[#667085] leading-[1.35]">
                        Аудит, ТЗ, база знаний, сборка MVP, тестирование и запуск.
                      </div>
                    </div>
                  </>
                ) : null}
              </div>

              {/* RIGHT */}
              <div className="rounded-[26px] lg-border border border-white/18 bg-white/70 p-5 shadow-[0_16px_45px_rgba(0,0,0,0.04)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[14px] font-semibold text-[#0f172a]">Результат</div>
                    <div className="mt-1 text-[12px] text-[#667085]">Экономия и окупаемость</div>
                  </div>

                  <div className="rounded-full lg-border border border-white/18 bg-white/65 px-3 py-1 text-[12px] font-semibold text-[#0f172a] shadow-[0_10px_26px_rgba(0,0,0,0.04)]">
                    {calc.paybackMonths ? `Окупаемость: ${calc.paybackMonths} мес` : "Окупаемость: нет"}
                  </div>
                </div>

                {/* Savings 1 year (без свечений/угловых градиентов) */}
                <div className="mt-5 rounded-[22px] lg-border border border-white/18 bg-white/65 p-5">
                  <div className="text-[12px] font-semibold text-[#667085]">Экономия за 1 год</div>

                  <div className="mt-2 flex flex-wrap items-end gap-3">
                    <div
                      className={[
                        "text-[28px] sm:text-[34px] font-semibold tracking-[-0.02em]",
                        bad ? "text-[#c73f40]" : "text-[#28df7c]",
                      ].join(" ")}
                    >
                      {formatRub(animSavings1)}
                    </div>

                    <div className="pb-[6px] text-[14px] font-semibold text-[#0f172a]">
                      {`${animSavings1Pct.toFixed(1)}%`}
                    </div>
                  </div>

                  <div className="mt-3 text-[12px] text-[#667085]">
                    Сравнение с ФОТ (включая накладные) и стоимость 1-го года с интеграцией.
                  </div>
                </div>

                {expanded ? (
                  <>
                    {/* costs */}
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {[
                        { label: "ФОТ людей / год", v: calc.peopleYearCompare },
                        { label: "Стоимость 1-го года", v: calc.uniYear1 },
                        { label: "Стоимость 2-го года", v: calc.uniYear2 },
                      ].map((x) => (
                        <div key={x.label} className="rounded-[18px] lg-border border border-white/18 bg-white/65 p-4">
                          <div className="text-[12px] font-semibold text-[#667085]">{x.label}</div>
                          <div className="mt-2 text-[14px] font-semibold text-[#0f172a]">{formatRub(x.v)}</div>
                        </div>
                      ))}
                    </div>

                    <MiniBars peopleYear={calc.peopleYearCompare} uniYear1={calc.uniYear1} />

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[18px] lg-border border border-white/18 bg-white/65 p-4">
                        <div className="text-[12px] font-semibold text-[#667085]">Экономия за 3 года</div>
                        <div className="mt-2 text-[16px] font-semibold text-[#0f172a]">{formatRub(animSav3)}</div>
                        <div className="mt-1 text-[12px] text-[#667085]">{`${animSav3Pct.toFixed(1)}%`}</div>
                      </div>

                      <div className="rounded-[18px] lg-border border border-white/18 bg-white/65 p-4">
                        <div className="text-[12px] font-semibold text-[#667085]">Экономия за 5 лет</div>
                        <div className="mt-2 text-[16px] font-semibold text-[#0f172a]">{formatRub(animSav5)}</div>
                        <div className="mt-1 text-[12px] text-[#667085]">{`${animSav5Pct.toFixed(1)}%`}</div>
                      </div>
                    </div>

                    <HorizonChart y1={calc.savings1} y3={calc.sav3} y5={calc.sav5} />

                    <div className="mt-4 text-[12px] text-[#667085] leading-[1.35]">
                      Числа для оценки. Итог зависит от сценариев, качества базы знаний и глубины интеграций.
                    </div>
                  </>
                ) : (
                  <div className="mt-4 text-[12px] text-[#667085] leading-[1.35]">
                    По умолчанию показаны базовые параметры. Разверни, чтобы настроить накладные, тариф, допущения и увидеть горизонты 3/5 лет.
                  </div>
                )}
              </div>
            </div>

            {/* кнопка: строго по центру стеклянного пространства ниже контента */}
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="absolute left-1/2 bottom-[20px] rounded-[999px] lg-border border border-white/18 bg-white/85 px-6 py-3 text-[13px] font-semibold text-[#0f172a] shadow-[0_22px_70px_rgba(0,0,0,0.12)] hover:text-[#c73f40] active:scale-[0.99]"
              style={{ animation: "roiBlink 2.8s ease-in-out infinite" }}
              aria-label={expanded ? "Свернуть калькулятор" : "Развернуть калькулятор"}
            >
              {expanded ? "Свернуть калькулятор" : "Развернуть калькулятор"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
