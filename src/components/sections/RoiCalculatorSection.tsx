"use client";

import React from "react";

type Billing = "monthly" | "yearly";
type PlanKey = "small" | "mid" | "enterprise";

const INTEGRATION_COST = 179_990;

const PLANS: Record<
  PlanKey,
  { title: string; priceMonthly: number; hint: string }
> = {
  small: { title: "Малый", priceMonthly: 9_900, hint: "Быстрый запуск и лёгкая поддержка" },
  mid: { title: "Средний", priceMonthly: 39_900, hint: "Интеграция под ключ и PM" },
  enterprise: { title: "Энтерпрайз", priceMonthly: 99_900, hint: "Максимум качества и вовлечения" },
};

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

function formatRub(v: number) {
  const n = Math.round(v);
  const sign = n < 0 ? "−" : "";
  const abs = Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${sign}${abs} ₽`;
}

function formatMoneyInput(n: number) {
  const safe = Math.max(0, Math.round(n));
  return safe.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function parseMoneyInput(raw: string) {
  const digits = raw.replace(/[^\d]/g, "");
  const n = digits ? Number(digits) : 0;
  return Number.isFinite(n) ? n : 0;
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

    if (Math.abs(to - from) < 0.25) {
      setVal(to);
      prevRef.current = to;
      return;
    }

    const start = performance.now();
    const dur = clamp(durationMs, 260, 1200);
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

function GlassSlider({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const p = ((value - min) / (max - min)) * 100;

  return (
    <div className="mt-3">
      <div
        className="
          lg-border border border-white/18
          rounded-[16px]
          bg-white/65
          p-4
          shadow-[0_12px_35px_rgba(0,0,0,0.04)]
        "
      >
        <div className="relative h-[18px]">
          <div className="absolute inset-0 rounded-full bg-black/5" />
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${p}%`,
              background:
                "linear-gradient(90deg, rgba(199,63,64,0.22), rgba(199,63,64,0.10))",
              boxShadow: "0 0 24px rgba(199,63,64,0.10)",
            }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `calc(${p}% - 10px)` }}
          >
            <div
              className="
                h-5 w-5 rounded-full
                bg-white/90
                lg-border border border-white/18
                shadow-[0_10px_26px_rgba(0,0,0,0.10)]
              "
            />
          </div>

          <input
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label="Слайдер"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {[1, 3, 5, 10].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onChange(m)}
              className={[
                "rounded-full px-3 py-1 text-[12px] font-semibold transition-[transform,background-color,color] duration-[600ms] active:scale-[0.99]",
                "bg-white/80",
                "lg-border border border-black/5", // кнопка на светлом фоне: еле-серый
                value === m ? "text-[#0f172a]" : "text-[#475467] hover:text-[#c73f40]",
              ].join(" ")}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TinyBars({
  peopleYear,
  uniYear1,
}: {
  peopleYear: number;
  uniYear1: number;
}) {
  const maxV = Math.max(peopleYear, uniYear1, 1);
  const hp = clamp((peopleYear / maxV) * 100, 0, 100);
  const hu = clamp((uniYear1 / maxV) * 100, 0, 100);

  return (
    <div
      className="
        mt-4
        lg-border border border-white/18
        rounded-[18px]
        bg-white/60
        p-4
        shadow-[0_14px_40px_rgba(0,0,0,0.04)]
      "
    >
      <div className="text-[12px] font-semibold text-[#0f172a]">Сравнение за 1 год</div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[12px] font-semibold text-[#0f172a]">Люди</div>
            <div className="text-[12px] text-[#667085] truncate">{formatRub(peopleYear)}</div>
          </div>
          <div className="mt-2 h-[10px] rounded-full bg-black/5 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${hp}%`,
                background: "linear-gradient(90deg, rgba(15,23,42,0.18), rgba(15,23,42,0.10))",
              }}
            />
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[12px] font-semibold text-[#0f172a]">ЮНИ</div>
            <div className="text-[12px] text-[#667085] truncate">{formatRub(uniYear1)}</div>
          </div>
          <div className="mt-2 h-[10px] rounded-full bg-black/5 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${hu}%`,
                background: "linear-gradient(90deg, rgba(199,63,64,0.22), rgba(199,63,64,0.10))",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizonSpark({
  y1,
  y3,
  y5,
}: {
  y1: number;
  y3: number;
  y5: number;
}) {
  const maxAbs = Math.max(Math.abs(y1), Math.abs(y3), Math.abs(y5), 1);
  const mapY = (v: number) => 50 - (v / maxAbs) * 26;

  const p1y = mapY(y1);
  const p3y = mapY(y3);
  const p5y = mapY(y5);

  const good = y1 >= 0 || y3 >= 0 || y5 >= 0;
  const stroke = good ? "rgba(40,223,124,0.55)" : "rgba(199,63,64,0.55)";
  const dot = good ? "rgba(40,223,124,0.80)" : "rgba(199,63,64,0.80)";

  return (
    <div
      className="
        mt-4
        lg-border border border-white/18
        rounded-[18px]
        bg-white/60
        p-4
        shadow-[0_14px_40px_rgba(0,0,0,0.04)]
      "
    >
      <div className="text-[12px] font-semibold text-[#0f172a]">Экономия в горизонте</div>

      <div
        className="
          mt-3
          lg-border border border-white/18
          rounded-[16px]
          bg-white/70
          p-3
        "
      >
        <div className="relative h-[76px] overflow-hidden rounded-[14px]">
          <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(15,23,42,0.10)" strokeWidth="2" />
            <path
              d={`M 14 ${p1y.toFixed(2)} L 50 ${p3y.toFixed(2)} L 86 ${p5y.toFixed(2)}`}
              fill="none"
              stroke={stroke}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {[
              { x: 14, y: p1y },
              { x: 50, y: p3y },
              { x: 86, y: p5y },
            ].map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="6.5" fill="rgba(255,255,255,0.45)" />
                <circle cx={p.x} cy={p.y} r="4.0" fill={dot} />
              </g>
            ))}
          </svg>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { label: "1 год", v: y1 },
            { label: "3 года", v: y3 },
            { label: "5 лет", v: y5 },
          ].map((x) => (
            <div
              key={x.label}
              className="
                lg-border border border-white/18
                rounded-[14px]
                bg-white/70
                p-3
              "
            >
              <div className="text-[12px] font-semibold text-[#0f172a]">{x.label}</div>
              <div className="mt-1 text-[12px] text-[#667085]">{formatRub(x.v)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PaybackTrack({
  paybackMonths,
  monthlySaving,
}: {
  paybackMonths: number | null;
  monthlySaving: number;
}) {
  const horizon = 12;
  const marker = paybackMonths ? clamp(paybackMonths, 1, horizon) : null;

  return (
    <div
      className="
        mt-3
        lg-border border border-white/18
        rounded-[16px]
        bg-white/70
        p-4
      "
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-[12px] font-semibold text-[#0f172a]">Окупаемость на шкале</div>
        <div className="text-[12px] text-[#667085]">
          {monthlySaving > 0 ? `Экономия/мес: ${formatRub(monthlySaving)}` : `Экономия/мес: ${formatRub(monthlySaving)}`}
        </div>
      </div>

      <div className="mt-3 relative h-[18px] rounded-full bg-black/5 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: marker ? `${(marker / horizon) * 100}%` : "0%",
            background: "linear-gradient(90deg, rgba(199,63,64,0.20), rgba(199,63,64,0.08))",
          }}
        />
        {marker ? (
          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `calc(${(marker / horizon) * 100}% - 7px)` }}
          >
            <div
              className="
                h-[14px] w-[14px] rounded-full
                bg-white/90
                lg-border border border-white/18
                shadow-[0_10px_26px_rgba(0,0,0,0.10)]
              "
              title={`Окупится примерно за ${marker} мес`}
            />
          </div>
        ) : null}
      </div>

      <div className="mt-2 flex justify-between text-[11px] text-[#98A2B3]">
        <span>1 мес</span>
        <span>12 мес</span>
      </div>
    </div>
  );
}

export default function RoiCalculatorSection() {
  const [expanded, setExpanded] = React.useState(false);

  const [managers, setManagers] = React.useState<number>(3);
  const [salary, setSalary] = React.useState<number>(50_000);

  const [coeff, setCoeff] = React.useState<number>(1.3);
  const [plan, setPlan] = React.useState<PlanKey>("mid");
  const [billing, setBilling] = React.useState<Billing>("monthly");

  const [shareMode, setShareMode] = React.useState<"100" | "70" | "45" | "custom">("70");
  const [shareCustom, setShareCustom] = React.useState<number>(60);

  const calc = React.useMemo(() => {
    const m = clamp(Math.round(managers || 1), 1, 10);

    const sRaw = Math.round(salary || 0);
    const s = clamp(sRaw, 10_000, 1_000_000);

    const c = clamp(Number(coeff) || 1.3, 1.0, 2.2);

    const sharePct =
      shareMode === "100" ? 100 : shareMode === "70" ? 70 : shareMode === "45" ? 45 : clamp(shareCustom, 10, 100);
    const share = sharePct / 100;

    const planMonthly = PLANS[plan].priceMonthly;
    const planAnnual = billing === "monthly" ? planMonthly * 12 : planMonthly * 12 * 0.8;

    const peopleYear = m * s * c * 12;
    const peopleYearCompare = peopleYear * share;

    const year1Uni = planAnnual + INTEGRATION_COST;
    const year2Uni = planAnnual;

    const savings1 = peopleYearCompare - year1Uni;
    const savings1Pct = peopleYearCompare > 0 ? (savings1 / peopleYearCompare) * 100 : 0;

    const uni3 = year1Uni + year2Uni * 2;
    const uni5 = year1Uni + year2Uni * 4;

    const people3 = peopleYearCompare * 3;
    const people5 = peopleYearCompare * 5;

    const sav3 = people3 - uni3;
    const sav5 = people5 - uni5;

    const sav3Pct = people3 > 0 ? (sav3 / people3) * 100 : 0;
    const sav5Pct = people5 > 0 ? (sav5 / people5) * 100 : 0;

    const planMonthlyEffective = billing === "monthly" ? planMonthly : Math.round(planMonthly * 0.8);
    const peopleMonthlyCompare = m * s * c * share;
    const monthlySaving = peopleMonthlyCompare - planMonthlyEffective;

    let paybackMonths: number | null = null;
    if (monthlySaving > 100) {
      // месяц, когда накопленная экономия перекроет интеграцию
      paybackMonths = Math.ceil(INTEGRATION_COST / monthlySaving);
      if (!Number.isFinite(paybackMonths) || paybackMonths <= 0) paybackMonths = null;
    }

    // Порог окупаемости (по смыслу: окупится в пределах 12 мес)
    let minManagersToPayback: number | null = null;
    for (let mm = 1; mm <= 10; mm++) {
      const peopleMonthly = mm * s * c * share;
      const ms = peopleMonthly - planMonthlyEffective;
      if (ms > 100) {
        const pb = Math.ceil(INTEGRATION_COST / ms);
        if (pb <= 12) {
          minManagersToPayback = mm;
          break;
        }
      }
    }

    // Альтернатива: порог ФОТ при текущем числе менеджеров
    const salaryToPayback =
      m * c * share > 0
        ? Math.ceil((planMonthlyEffective + INTEGRATION_COST / 12) / (m * c * share))
        : null;

    // Лучший тариф по текущим вводным: max savings1
    const best = (Object.keys(PLANS) as PlanKey[]).reduce(
      (acc, k) => {
        const pm = PLANS[k].priceMonthly;
        const pa = billing === "monthly" ? pm * 12 : pm * 12 * 0.8;
        const y1 = pa + INTEGRATION_COST;
        const s1 = peopleYearCompare - y1;
        if (s1 > acc.savings) return { key: k, savings: s1 };
        return acc;
      },
      { key: "mid" as PlanKey, savings: -Infinity }
    );

    return {
      m,
      s,
      c,
      sharePct,
      share,
      planAnnual,
      planMonthlyEffective,
      peopleYearCompare,
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
      minManagersToPayback,
      salaryToPayback,
      bestPlan: best.key,
    };
  }, [managers, salary, coeff, plan, billing, shareMode, shareCustom]);

  const animSavings1 = useCountUp(calc.savings1, 720);
  const animSavings1Pct = useCountUp(calc.savings1Pct, 720);

  const animYear1Uni = useCountUp(calc.year1Uni, 650);
  const animYear2Uni = useCountUp(calc.year2Uni, 650);
  const animPeopleYear = useCountUp(calc.peopleYearCompare, 650);

  const animSav3 = useCountUp(calc.sav3, 720);
  const animSav3Pct = useCountUp(calc.sav3Pct, 720);
  const animSav5 = useCountUp(calc.sav5, 720);
  const animSav5Pct = useCountUp(calc.sav5Pct, 720);

  const goodTone = calc.savings1 >= 0;

  return (
    <section id="roi" className="relative py-14 md:py-20">
      <style>{`
        @keyframes roiBlink {
          0% { opacity: 0.82; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.02); }
          100% { opacity: 0.82; transform: translateX(-50%) scale(1); }
        }
      `}</style>

      <div className="mx-auto max-w-[1240px] px-4">
        <div className="mx-auto max-w-[1240px] text-center">
          <h2 className="text-white font-semibold leading-[0.95] tracking-[-0.02em] text-[24px] sm:text-[32px] lg:text-[42px]">
            ROI-калькулятор
          </h2>
          <div className="mt-2 text-white/70 font-semibold tracking-[-0.01em] text-[13px] sm:text-[16px]">
            Короткая история: люди vs ЮНИ, окупаемость, горизонт 3 и 5 лет.
          </div>
        </div>

        <div className="mt-8 md:mt-12">
          <div
            className="
              lg-border
              relative mx-auto max-w-[1240px]
              rounded-[40px]
              border border-white/18
              bg-white/10
              p-[10px]
              pb-[120px]
              shadow-[0_22px_70px_rgba(0,0,0,0.05)]
              backdrop-blur-[26px] backdrop-saturate-150
            "
          >
            <div className="pointer-events-none absolute inset-0 rounded-[40px] ring-1 ring-white/10" />
            <div className="pointer-events-none absolute inset-0 rounded-[40px] opacity-70 bg-[radial-gradient(900px_420px_at_20%_0%,rgba(255,255,255,0.10),transparent_60%),radial-gradient(900px_420px_at_80%_100%,rgba(199,63,64,0.08),transparent_65%)]" />

            <div
              className="
                relative
                rounded-[34px]
                lg-border border border-white/18
                bg-white/82
                p-6
                shadow-[0_18px_55px_rgba(0,0,0,0.03)]
                grid gap-4 lg:grid-cols-[1.05fr_0.95fr]
              "
            >
              {/* LEFT: Inputs */}
              <div
                className="
                  rounded-[26px]
                  lg-border border border-white/18
                  bg-white/70
                  p-5
                  shadow-[0_16px_45px_rgba(0,0,0,0.04)]
                "
              >
                <div className="text-[14px] font-semibold text-[#0f172a]">Входные параметры</div>

                {/* Managers */}
                <div className="mt-5">
                  <div className="flex items-end justify-between gap-3">
                    <div className="text-[12px] font-semibold text-[#0f172a]">Кол-во менеджеров</div>
                    <div className="text-[12px] font-semibold text-[#0f172a]">{calc.m}</div>
                  </div>

                  <GlassSlider
                    value={calc.m}
                    min={1}
                    max={10}
                    step={1}
                    onChange={(v) => setManagers(v)}
                  />
                </div>

                {/* Salary */}
                <div className="mt-5">
                  <div className="text-[12px] font-semibold text-[#0f172a]">ФОТ одного менеджера (₽/мес)</div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
                    <input
                      value={formatMoneyInput(calc.s)}
                      onChange={(e) => setSalary(parseMoneyInput(e.target.value))}
                      inputMode="numeric"
                      className="
                        h-10 w-full
                        rounded-[14px]
                        lg-border border border-white/18
                        bg-white/65
                        px-4
                        text-[13px]
                        font-semibold
                        text-[#0f172a]
                        shadow-[0_12px_35px_rgba(0,0,0,0.04)]
                        outline-none
                        focus:border-white/30
                      "
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
                            "rounded-full px-3 py-1 text-[12px] font-semibold transition-[transform,background-color,color] duration-[600ms] active:scale-[0.99]",
                            "bg-white/80",
                            "lg-border border border-black/5", // кнопка на светлом: еле-серый
                            calc.s === v ? "text-[#0f172a]" : "text-[#475467] hover:text-[#c73f40]",
                          ].join(" ")}
                        >
                          {formatRub(v).replace(" ₽", "")}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-[#98A2B3] leading-[1.3]">
                    Валидация: от 10 000 до 1 000 000 ₽. Маска только для отображения.
                  </div>
                </div>

                {/* Expanded: realistic knobs */}
                {expanded ? (
                  <>
                    {/* Overheads */}
                    <div className="mt-5">
                      <div className="flex items-center gap-2">
                        <div className="text-[12px] font-semibold text-[#0f172a]">Накладные</div>

                        <div className="relative group">
                          <div
                            className="
                              h-5 w-5 grid place-items-center rounded-full
                              bg-white/80
                              lg-border border border-black/5
                              text-[11px] font-semibold text-[#667085]
                              cursor-help
                            "
                            aria-label="Что входит в накладные"
                          >
                            i
                          </div>
                          <div
                            className="
                              pointer-events-none
                              absolute left-0 top-[26px]
                              w-[260px]
                              rounded-[14px]
                              lg-border border border-white/18
                              bg-white/90
                              p-3
                              text-[11px]
                              text-[#475467]
                              shadow-[0_18px_55px_rgba(0,0,0,0.10)]
                              opacity-0 translate-y-1
                              transition-all duration-[250ms]
                              group-hover:opacity-100 group-hover:translate-y-0
                            "
                          >
                            Налоги, рабочее место, обучение, текучка, управление и прочие расходы.
                          </div>
                        </div>
                      </div>

                      <div
                        className="
                          mt-3
                          rounded-[16px]
                          lg-border border border-white/18
                          bg-white/65
                          p-4
                          shadow-[0_12px_35px_rgba(0,0,0,0.04)]
                        "
                      >
                        <div className="flex flex-wrap gap-2 items-center">
                          {[1.0, 1.2, 1.3, 1.5].map((v) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => setCoeff(v)}
                              className={[
                                "rounded-full px-3 py-1 text-[12px] font-semibold transition-[transform,background-color,color] duration-[600ms] active:scale-[0.99]",
                                "bg-white/80",
                                "lg-border border border-black/5", // на светлом фоне: еле-серый
                                Math.abs(coeff - v) < 0.001
                                  ? "text-[#0f172a]"
                                  : "text-[#475467] hover:text-[#c73f40]",
                              ].join(" ")}
                            >
                              {v.toFixed(1)}
                            </button>
                          ))}

                          <div className="flex items-center gap-2 ml-2">
                            <span className="text-[12px] text-[#667085]">свой:</span>
                            <input
                              value={String(coeff)}
                              onChange={(e) => {
                                const raw = e.target.value.replace(",", ".");
                                const n = Number(raw);
                                setCoeff(Number.isFinite(n) ? n : 1.3);
                              }}
                              inputMode="decimal"
                              className="
                                h-9 w-[92px]
                                rounded-[12px]
                                lg-border border border-black/5
                                bg-white/80
                                px-3
                                text-[12px]
                                font-semibold
                                text-[#0f172a]
                                outline-none
                              "
                              aria-label="Свой коэффициент накладных"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Share */}
                    <div className="mt-5">
                      <div className="text-[12px] font-semibold text-[#0f172a]">Доля замещения функций</div>

                      <div
                        className="
                          mt-3
                          rounded-[16px]
                          lg-border border border-white/18
                          bg-white/65
                          p-4
                          shadow-[0_12px_35px_rgba(0,0,0,0.04)]
                        "
                      >
                        <div className="flex flex-wrap gap-2 items-center">
                          {[
                            { key: "100" as const, label: "100%", hint: "как в ТЗ" },
                            { key: "70" as const, label: "70%", hint: "реалистично" },
                            { key: "45" as const, label: "45%", hint: "консервативно" },
                            { key: "custom" as const, label: "свой", hint: "" },
                          ].map((x) => (
                            <button
                              key={x.key}
                              type="button"
                              onClick={() => setShareMode(x.key)}
                              className={[
                                "rounded-full px-3 py-1 text-[12px] font-semibold transition-[transform,background-color,color] duration-[600ms] active:scale-[0.99]",
                                "bg-white/80",
                                "lg-border border border-black/5",
                                shareMode === x.key ? "text-[#0f172a]" : "text-[#475467] hover:text-[#c73f40]",
                              ].join(" ")}
                            >
                              {x.label}
                              {x.hint ? <span className="ml-2 text-[#98A2B3] font-semibold">({x.hint})</span> : null}
                            </button>
                          ))}
                        </div>

                        {shareMode === "custom" ? (
                          <div className="mt-3 flex items-center gap-3">
                            <div className="text-[12px] text-[#667085]">%</div>
                            <input
                              type="number"
                              min={10}
                              max={100}
                              value={shareCustom}
                              onChange={(e) => setShareCustom(Number(e.target.value))}
                              className="
                                h-9 w-[110px]
                                rounded-[12px]
                                lg-border border border-black/5
                                bg-white/80
                                px-3
                                text-[12px]
                                font-semibold
                                text-[#0f172a]
                                outline-none
                              "
                              aria-label="Своя доля замещения в процентах"
                            />
                            <div className="text-[12px] text-[#98A2B3]">
                              Для правдоподобия: чаще закрывают часть функций, а не увольняют всех.
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3 text-[12px] text-[#667085] leading-[1.35]">
                            ФОТ для сравнения = managers × salary × coeff × 12 × share.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Plan */}
                    <div className="mt-5">
                      <div className="text-[12px] font-semibold text-[#0f172a]">Тариф</div>

                      <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        {(Object.keys(PLANS) as PlanKey[]).map((k) => {
                          const meta = PLANS[k];
                          const active = plan === k;
                          const best = calc.bestPlan === k;

                          return (
                            <button
                              key={k}
                              type="button"
                              onClick={() => setPlan(k)}
                              className={[
                                "rounded-[16px] p-3 text-left transition-[transform,background-color,color] duration-[650ms] active:scale-[0.99]",
                                "bg-white/80",
                                "lg-border border",
                                // карточки - только белая рамка по правилу
                                best ? "border-white/18 ring-1 ring-[#c73f40]/25" : "border-white/18",
                                active ? "text-[#0f172a]" : "text-[#475467] hover:text-[#c73f40]",
                              ].join(" ")}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="text-[12px] font-semibold">{meta.title}</div>
                                {best ? (
                                  <span className="text-[10px] font-semibold text-[#c73f40]">лучший</span>
                                ) : null}
                              </div>
                              <div className="mt-1 text-[12px] text-[#667085]">{formatRub(meta.priceMonthly)} / мес</div>
                              <div className="mt-1 text-[11px] text-[#98A2B3]">{meta.hint}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Billing */}
                    <div className="mt-5">
                      <div className="text-[12px] font-semibold text-[#0f172a]">Оплата тарифа</div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setBilling("monthly")}
                          className={[
                            "h-10 rounded-[999px] px-5 text-[13px] font-semibold transition-[transform,background-color,color] duration-[650ms] active:scale-[0.99]",
                            "bg-white/80",
                            "lg-border border border-black/5",
                            billing === "monthly" ? "text-[#0f172a]" : "text-[#475467] hover:text-[#c73f40]",
                          ].join(" ")}
                        >
                          Ежемесячно
                        </button>

                        <button
                          type="button"
                          onClick={() => setBilling("yearly")}
                          className={[
                            "h-10 rounded-[999px] px-5 text-[13px] font-semibold transition-[transform,background-color,color] duration-[650ms] active:scale-[0.99]",
                            "bg-white/80",
                            "lg-border border border-black/5",
                            billing === "yearly" ? "text-[#0f172a]" : "text-[#475467] hover:text-[#c73f40]",
                          ].join(" ")}
                        >
                          Годовой (-20%)
                        </button>
                      </div>
                    </div>

                    {/* Integration */}
                    <div
                      className="
                        mt-5
                        rounded-[16px]
                        lg-border border border-white/18
                        bg-white/65
                        p-4
                        shadow-[0_12px_35px_rgba(0,0,0,0.04)]
                      "
                    >
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

              {/* RIGHT: Story / Result */}
              <div
                className="
                  rounded-[26px]
                  lg-border border border-white/18
                  bg-white/70
                  p-5
                  shadow-[0_16px_45px_rgba(0,0,0,0.04)]
                "
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[14px] font-semibold text-[#0f172a]">Результат</div>
                    <div className="mt-1 text-[12px] text-[#667085]">Экономия и окупаемость</div>
                  </div>

                  <div
                    className="
                      rounded-full
                      lg-border border border-white/18
                      bg-white/65
                      px-3 py-1
                      text-[12px]
                      font-semibold
                      text-[#0f172a]
                      shadow-[0_10px_26px_rgba(0,0,0,0.04)]
                    "
                    title="Доля замещения уже учтена"
                  >
                    Замещение: {calc.sharePct}%
                  </div>
                </div>

                {/* Big: savings 1y */}
                <div
                  className="
                    mt-5
                    rounded-[22px]
                    lg-border border border-white/18
                    bg-white/70
                    p-5
                    shadow-none
                    relative overflow-hidden
                  "
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-60"
                    style={{
                      background:
                        "radial-gradient(520px 180px at 25% 0%, rgba(255,255,255,0.60), transparent 62%)",
                    }}
                  />
                  <div className="relative">
                    <div className="text-[12px] font-semibold text-[#667085]">Экономия за 1 год</div>

                    <div className="mt-2 flex flex-wrap items-end gap-3">
                      <div
                        className={[
                          "text-[28px] sm:text-[34px] font-semibold tracking-[-0.02em]",
                          goodTone ? "text-[#28df7c]" : "text-[#c73f40]",
                        ].join(" ")}
                      >
                        {formatRub(animSavings1)}
                      </div>

                      <div className="pb-[6px] text-[14px] font-semibold text-[#0f172a]">
                        {`${animSavings1Pct.toFixed(1)}%`}
                      </div>
                    </div>

                    {/* Payback message (wow) */}
                    <div className="mt-3 text-[12px] text-[#667085]">
                      {calc.paybackMonths ? (
                        <span className="font-semibold text-[#0f172a]">
                          Окупаемость интеграции: {calc.paybackMonths} мес
                        </span>
                      ) : (
                        <span className="font-semibold text-[#0f172a]">
                          Не окупается при этих параметрах
                        </span>
                      )}
                    </div>

                    {/* Threshold */}
                    <div className="mt-2 text-[12px] text-[#98A2B3] leading-[1.35]">
                      {calc.minManagersToPayback ? (
                        <>Окупается от: <span className="font-semibold text-[#0f172a]">{calc.minManagersToPayback} менеджеров</span> (в пределах 12 мес).</>
                      ) : calc.salaryToPayback ? (
                        <>Окупается при ФОТ от: <span className="font-semibold text-[#0f172a]">{formatRub(calc.salaryToPayback).replace(" ₽", "")} ₽</span> на менеджера.</>
                      ) : (
                        <>Порог окупаемости не удалось оценить при текущих вводных.</>
                      )}
                    </div>
                  </div>
                </div>

                {/* Basic mode only shows payback “story” cleanly */}
                {expanded ? (
                  <>
                    <PaybackTrack paybackMonths={calc.paybackMonths} monthlySaving={calc.monthlySaving} />

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div
                        className="
                          lg-border border border-white/18
                          rounded-[18px]
                          bg-white/65
                          p-4
                        "
                      >
                        <div className="text-[12px] font-semibold text-[#667085]">Стоимость 1-го года</div>
                        <div className="mt-2 text-[16px] font-semibold text-[#0f172a]">{formatRub(animYear1Uni)}</div>
                        <div className="mt-1 text-[11px] text-[#98A2B3]">тариф + интеграция</div>
                      </div>

                      <div
                        className="
                          lg-border border border-white/18
                          rounded-[18px]
                          bg-white/65
                          p-4
                        "
                      >
                        <div className="text-[12px] font-semibold text-[#667085]">Стоимость 2-го года</div>
                        <div className="mt-2 text-[16px] font-semibold text-[#0f172a]">{formatRub(animYear2Uni)}</div>
                        <div className="mt-1 text-[11px] text-[#98A2B3]">только тариф</div>
                      </div>
                    </div>

                    <div
                      className="
                        mt-3
                        lg-border border border-white/18
                        rounded-[18px]
                        bg-white/65
                        p-4
                      "
                    >
                      <div className="text-[12px] font-semibold text-[#667085]">ФОТ людей за 1 год (для сравнения)</div>
                      <div className="mt-2 text-[16px] font-semibold text-[#0f172a]">{formatRub(animPeopleYear)}</div>
                      <div className="mt-1 text-[11px] text-[#98A2B3]">уже учтены накладные и доля замещения</div>
                    </div>

                    <TinyBars peopleYear={calc.peopleYearCompare} uniYear1={calc.year1Uni} />

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div
                        className="
                          lg-border border border-white/18
                          rounded-[18px]
                          bg-white/65
                          p-4
                        "
                      >
                        <div className="text-[12px] font-semibold text-[#667085]">Экономия за 3 года</div>
                        <div className="mt-2 text-[16px] font-semibold text-[#0f172a]">{formatRub(animSav3)}</div>
                        <div className="mt-1 text-[12px] text-[#667085]">{`${animSav3Pct.toFixed(1)}%`}</div>
                      </div>

                      <div
                        className="
                          lg-border border border-white/18
                          rounded-[18px]
                          bg-white/65
                          p-4
                        "
                      >
                        <div className="text-[12px] font-semibold text-[#667085]">Экономия за 5 лет</div>
                        <div className="mt-2 text-[16px] font-semibold text-[#0f172a]">{formatRub(animSav5)}</div>
                        <div className="mt-1 text-[12px] text-[#667085]">{`${animSav5Pct.toFixed(1)}%`}</div>
                      </div>
                    </div>

                    <HorizonSpark y1={calc.savings1} y3={calc.sav3} y5={calc.sav5} />

                    <div className="mt-4 text-[12px] text-[#667085] leading-[1.35]">
                      Числа для оценки. Итог зависит от сценариев, качества базы знаний и глубины интеграций.
                    </div>
                  </>
                ) : (
                  <div className="mt-4 text-[12px] text-[#667085] leading-[1.35]">
                    Разверни калькулятор, чтобы настроить накладные, тариф, долю замещения и увидеть горизонты 3/5 лет.
                  </div>
                )}
              </div>
            </div>

            {/* Center blinking button on glass */}
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="
                absolute left-1/2 bottom-[34px]
                rounded-[999px]
                lg-border border border-white/18
                bg-white/85
                px-6 py-3
                text-[13px] font-semibold
                text-[#0f172a]
                shadow-[0_22px_70px_rgba(0,0,0,0.12)]
                hover:text-[#c73f40]
                active:scale-[0.99]
              "
              style={{ animation: "roiBlink 2.8s ease-in-out infinite", transform: "translateX(-50%)" }}
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
