"use client";

import React from "react";

type Billing = "monthly" | "yearly";
type PlanKey = "small" | "mid" | "enterprise";

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
  const n = Math.round(v);
  return `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;
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

function useCountUp(target: number, durationMs = 650) {
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

    if (Math.abs(to - from) < 0.5) {
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

function Tooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span className="relative inline-flex items-center group">
      {children}
      <span
        className="
          pointer-events-none
          absolute left-1/2 top-full z-20 mt-2 w-[260px] -translate-x-1/2
          rounded-[14px]
          lg-border border border-white/18
          bg-white/85
          px-3 py-2
          text-[12px] leading-[1.35]
          text-[#0f172a]
          opacity-0 translate-y-1
          shadow-[0_18px_55px_rgba(0,0,0,0.10)]
          backdrop-blur-[18px]
          transition-all duration-[220ms]
          group-hover:opacity-100 group-hover:translate-y-0
        "
        role="tooltip"
      >
        {label}
      </span>
    </span>
  );
}

function BarsPeopleVsUni({
  people,
  uni,
  bad,
}: {
  people: number;
  uni: number;
  bad: boolean;
}) {
  const max = Math.max(people, uni, 1);
  const hp = clamp((people / max) * 100, 0, 100);
  const hu = clamp((uni / max) * 100, 0, 100);

  return (
    <div
      className="
        mt-4
        rounded-[18px]
        lg-border border border-white/18
        bg-white/65
        p-4
        shadow-[0_16px_45px_rgba(0,0,0,0.04)]
      "
    >
      <div className="flex items-end justify-between gap-3">
        <div className="text-[12px] font-semibold text-[#0f172a]">Сравнение за 1 год</div>
        <div className="text-[12px] text-[#667085]">Люди vs ЮНИ</div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-[16px] lg-border border border-white/18 bg-white/70 p-4">
          <div className="text-[12px] font-semibold text-[#0f172a]">Люди</div>
          <div className="mt-1 text-[12px] text-[#667085]">{formatRub(people)}</div>
          <div className="mt-3 h-[10px] rounded-full bg-black/5 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${hp}%`,
                background:
                  "linear-gradient(90deg, rgba(15,23,42,0.16), rgba(15,23,42,0.08))",
              }}
            />
          </div>
        </div>

        <div className="rounded-[16px] lg-border border border-white/18 bg-white/70 p-4">
          <div className="text-[12px] font-semibold text-[#0f172a]">ЮНИ</div>
          <div className="mt-1 text-[12px] text-[#667085]">{formatRub(uni)}</div>
          <div className="mt-3 h-[10px] rounded-full bg-black/5 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${hu}%`,
                background: bad
                  ? "linear-gradient(90deg, rgba(199,63,64,0.35), rgba(199,63,64,0.18))"
                  : "linear-gradient(90deg, rgba(40,223,124,0.40), rgba(40,223,124,0.20))",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizonMini({
  s1,
  s3,
  s5,
}: {
  s1: number;
  s3: number;
  s5: number;
}) {
  const maxAbs = Math.max(Math.abs(s1), Math.abs(s3), Math.abs(s5), 1);
  const mapY = (v: number) => 50 - (v / maxAbs) * 26; // стабильнее, не режется

  const p1 = { x: 16, y: mapY(s1) };
  const p3 = { x: 50, y: mapY(s3) };
  const p5 = { x: 84, y: mapY(s5) };

  const allBad = s1 < 0 && s3 < 0 && s5 < 0;
  const stroke = allBad ? "rgba(199,63,64,0.55)" : "rgba(40,223,124,0.55)";
  const dot = allBad ? "rgba(199,63,64,0.80)" : "rgba(40,223,124,0.80)";

  return (
    <div
      className="
        mt-4
        rounded-[18px]
        lg-border border border-white/18
        bg-white/65
        p-4
        shadow-[0_16px_45px_rgba(0,0,0,0.04)]
      "
    >
      <div className="text-[12px] font-semibold text-[#0f172a]">Экономия в горизонте</div>

      <div
        className="
          mt-3
          rounded-[16px]
          lg-border border border-white/18
          bg-white/70
          p-3
        "
      >
        <div className="relative h-[84px] w-full overflow-hidden rounded-[14px]">
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background:
                "radial-gradient(320px 120px at 22% 0%, rgba(255,255,255,0.65), transparent 62%)",
            }}
          />

          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(15,23,42,0.10)" strokeWidth="2" />
            <path
              d={`M ${p1.x} ${p1.y.toFixed(2)} L ${p3.x} ${p3.y.toFixed(
                2
              )} L ${p5.x} ${p5.y.toFixed(2)}`}
              fill="none"
              stroke={stroke}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {[p1, p3, p5].map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="7.0" fill="rgba(255,255,255,0.45)" />
                <circle cx={p.x} cy={p.y} r="4.2" fill={dot} />
              </g>
            ))}
          </svg>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-[12px] text-[#667085]">
          {[
            { label: "1 год", v: s1 },
            { label: "3 года", v: s3 },
            { label: "5 лет", v: s5 },
          ].map((x) => (
            <div
              key={x.label}
              className="rounded-[14px] lg-border border border-white/18 bg-white/70 p-3"
            >
              <div className="font-semibold text-[#0f172a]">{x.label}</div>
              <div className="mt-1">{formatRub(x.v)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PaybackChart({
  monthlySaving,
  paybackMonth,
  integrationCost,
}: {
  monthlySaving: number;
  paybackMonth: number | null;
  integrationCost: number;
}) {
  const months = 12;

  const cum: number[] = [];
  for (let i = 1; i <= months; i++) cum.push(monthlySaving * i);

  const maxY = Math.max(integrationCost, ...cum.map((x) => Math.max(0, x)), 1);
  const y = (v: number) => {
    const vv = clamp(v, 0, maxY);
    const padTop = 10;
    const padBot = 12;
    const h = 100 - padTop - padBot;
    return padTop + (1 - vv / maxY) * h;
  };

  const x = (i: number) => {
    const padL = 8;
    const padR = 8;
    const w = 100 - padL - padR;
    return padL + ((i - 1) / (months - 1)) * w;
  };

  const lineD = cum
    .map((v, i) => `${i === 0 ? "M" : "L"} ${x(i + 1).toFixed(2)} ${y(v).toFixed(2)}`)
    .join(" ");

  const ok = monthlySaving > 0 && paybackMonth !== null && paybackMonth <= 12;
  const stroke = ok ? "rgba(40,223,124,0.65)" : "rgba(199,63,64,0.55)";
  const dot = ok ? "rgba(40,223,124,0.85)" : "rgba(199,63,64,0.85)";

  const px = paybackMonth ? x(paybackMonth) : x(12);
  const py = paybackMonth ? y(monthlySaving * paybackMonth) : y(cum[cum.length - 1]);

  return (
    <div
      className="
        mt-4
        rounded-[18px]
        lg-border border border-white/18
        bg-white/65
        p-4
        shadow-[0_16px_45px_rgba(0,0,0,0.04)]
      "
    >
      <div className="flex items-end justify-between gap-3">
        <div className="text-[12px] font-semibold text-[#0f172a]">Окупаемость на графике</div>
        <div className="text-[12px] text-[#667085]">горизонт 12 мес</div>
      </div>

      <div className="mt-3 rounded-[16px] lg-border border border-white/18 bg-white/70 p-3">
        <div className="relative h-[92px] w-full overflow-hidden rounded-[14px]">
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background:
                "radial-gradient(320px 120px at 20% 0%, rgba(255,255,255,0.65), transparent 60%)",
            }}
          />

          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* линия стоимости интеграции */}
            <line
              x1="0"
              y1={y(integrationCost)}
              x2="100"
              y2={y(integrationCost)}
              stroke="rgba(15,23,42,0.10)"
              strokeWidth="2"
            />

            {/* кривая накопленной экономии */}
            <path
              d={lineD}
              fill="none"
              stroke={stroke}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* маркер */}
            <circle cx={px} cy={py} r="6.6" fill="rgba(255,255,255,0.45)" />
            <circle cx={px} cy={py} r="4.1" fill={dot} />

            {/* вертикаль в точке окупаемости */}
            {ok ? (
              <line x1={px} y1="8" x2={px} y2="92" stroke="rgba(40,223,124,0.18)" strokeWidth="2" />
            ) : null}
          </svg>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-[12px] text-[#667085]">
          <div>Интеграция: {formatRub(integrationCost)}</div>
          <div>
            {ok ? `Окупилось на ${paybackMonth} мес` : "Не окупается при этих параметрах"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoiCalculatorSection() {
  const [expanded, setExpanded] = React.useState(false);

  // базовые (90% пользователей)
  const [managers, setManagers] = React.useState(5);
  const [salary, setSalary] = React.useState(50_000);

  // расширенные
  const [coeff, setCoeff] = React.useState<number>(1.3);
  const [plan, setPlan] = React.useState<PlanKey>("mid");
  const [billing, setBilling] = React.useState<Billing>("monthly");
  const [shareMode, setShareMode] = React.useState<"full" | "real" | "cons" | "custom">("real");
  const [shareCustom, setShareCustom] = React.useState<number>(70);

  const share =
    shareMode === "full"
      ? 1
      : shareMode === "real"
      ? 0.7
      : shareMode === "cons"
      ? 0.45
      : clamp(shareCustom / 100, 0.1, 1);

  const calc = React.useMemo(() => {
    const m = clamp(Math.round(managers), 1, 10);

    const sRaw = Math.round(salary);
    const s = clamp(sRaw || 0, 10_000, 1_000_000);

    const c = clamp(Number(coeff) || 1.0, 1.0, 2.2);

    const peopleYear = m * s * c * 12;
    const peopleYearAdj = peopleYear * share;

    const planMonthly = PLANS[plan].monthly;
    const planAnnual = billing === "monthly" ? planMonthly * 12 : planMonthly * 12 * 0.8;

    const uniYear1 = planAnnual + INTEGRATION_COST;
    const uniYear2 = planAnnual;

    const savings1 = peopleYearAdj - uniYear1;
    const savings1Pct = peopleYearAdj > 0 ? (savings1 / peopleYearAdj) * 100 : 0;

    const people3 = peopleYearAdj * 3;
    const people5 = peopleYearAdj * 5;

    const uni3 = uniYear1 + uniYear2 * 2;
    const uni5 = uniYear1 + uniYear2 * 4;

    const sav3 = people3 - uni3;
    const sav5 = people5 - uni5;

    const sav3Pct = people3 > 0 ? (sav3 / people3) * 100 : 0;
    const sav5Pct = people5 > 0 ? (sav5 / people5) * 100 : 0;

    const planMonthlyEffective = billing === "monthly" ? planMonthly : planMonthly * 0.8;
    const peopleMonthlyAdj = m * s * c * share;

    const monthlySaving = peopleMonthlyAdj - planMonthlyEffective;

    let paybackMonth: number | null = null;
    if (monthlySaving > 0) {
      for (let i = 1; i <= 24; i++) {
        if (monthlySaving * i >= INTEGRATION_COST) {
          paybackMonth = i;
          break;
        }
      }
    }

    // порог окупаемости по менеджерам (в пределах 10)
    let paybackFromManagers: number | null = null;
    for (let mm = 1; mm <= 10; mm++) {
      const ppl = mm * s * c * 12 * share;
      if (ppl - uniYear1 >= 0) {
        paybackFromManagers = mm;
        break;
      }
    }

    // альтернативно: порог по зарплате (если по менеджерам не влезли)
    let paybackFromSalary: number | null = null;
    if (!paybackFromManagers) {
      const step = 1000;
      for (let ss = 10_000; ss <= 1_000_000; ss += step) {
        const ppl = m * ss * c * 12 * share;
        if (ppl - uniYear1 >= 0) {
          paybackFromSalary = ss;
          break;
        }
      }
    }

    // лучший тариф при текущих вводных (только расширенный смысл, но считаем всегда)
    const byPlan: Record<PlanKey, { savings1: number; uniYear1: number; planAnnual: number }> = {
      small: { savings1: 0, uniYear1: 0, planAnnual: 0 },
      mid: { savings1: 0, uniYear1: 0, planAnnual: 0 },
      enterprise: { savings1: 0, uniYear1: 0, planAnnual: 0 },
    };

    (Object.keys(PLANS) as PlanKey[]).forEach((k) => {
      const pm = PLANS[k].monthly;
      const pa = billing === "monthly" ? pm * 12 : pm * 12 * 0.8;
      const uy1 = pa + INTEGRATION_COST;
      byPlan[k] = { savings1: peopleYearAdj - uy1, uniYear1: uy1, planAnnual: pa };
    });

    let bestPlan: PlanKey = "small";
    (Object.keys(byPlan) as PlanKey[]).forEach((k) => {
      if (byPlan[k].savings1 > byPlan[bestPlan].savings1) bestPlan = k;
    });

    return {
      m,
      s,
      c,
      share,
      peopleYearAdj,
      planMonthly,
      planAnnual,
      uniYear1,
      uniYear2,
      savings1,
      savings1Pct,
      sav3,
      sav3Pct,
      sav5,
      sav5Pct,
      monthlySaving,
      paybackMonth,
      paybackFromManagers,
      paybackFromSalary,
      byPlan,
      bestPlan,
    };
  }, [managers, salary, coeff, plan, billing, share, shareMode, shareCustom]);

  const bad = calc.savings1 < 0;

  const aSavings1 = useCountUp(calc.savings1, 740);
  const aSavings1Pct = useCountUp(calc.savings1Pct, 740);

  const aPeopleYear = useCountUp(calc.peopleYearAdj, 640);
  const aUniYear1 = useCountUp(calc.uniYear1, 640);
  const aUniYear2 = useCountUp(calc.uniYear2, 640);

  const aSav3 = useCountUp(calc.sav3, 700);
  const aSav3Pct = useCountUp(calc.sav3Pct, 700);
  const aSav5 = useCountUp(calc.sav5, 700);
  const aSav5Pct = useCountUp(calc.sav5Pct, 700);

  const sliderPct = ((calc.m - 1) / 9) * 100;

  return (
    <section id="roi" className="relative py-14 md:py-20">
      <style>{`
        .roi-range{
          -webkit-appearance:none;
          appearance:none;
          width:100%;
          height:38px;
          border-radius:999px;
          background:
            linear-gradient(90deg,
              rgba(199,63,64,0.28) 0%,
              rgba(199,63,64,0.18) calc(var(--p) * 1%),
              rgba(15,23,42,0.08) calc(var(--p) * 1%),
              rgba(15,23,42,0.06) 100%);
          border:1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(18px);
          box-shadow: 0 12px 35px rgba(0,0,0,0.05);
          outline:none;
        }
        .roi-range::-webkit-slider-thumb{
          -webkit-appearance:none;
          appearance:none;
          width:22px;
          height:22px;
          border-radius:999px;
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(15,23,42,0.10);
          box-shadow: 0 18px 45px rgba(0,0,0,0.16);
          cursor:pointer;
        }
        .roi-range::-moz-range-thumb{
          width:22px;
          height:22px;
          border-radius:999px;
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(15,23,42,0.10);
          box-shadow: 0 18px 45px rgba(0,0,0,0.16);
          cursor:pointer;
        }
        .roi-range::-moz-range-track{
          height:38px;
          border-radius:999px;
          border:1px solid rgba(255,255,255,0.18);
          background:
            linear-gradient(90deg,
              rgba(199,63,64,0.28) 0%,
              rgba(199,63,64,0.18) calc(var(--p) * 1%),
              rgba(15,23,42,0.08) calc(var(--p) * 1%),
              rgba(15,23,42,0.06) 100%);
        }
        @keyframes roiBlinkSoft {
          0% { opacity: 0.80; transform: translateY(0) scale(1); }
          50% { opacity: 1; transform: translateY(-1px) scale(1.015); }
          100% { opacity: 0.80; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div className="mx-auto max-w-[1240px] px-4">
        <div className="mx-auto max-w-[1240px] text-center">
          <h2 className="text-white font-semibold leading-[0.95] tracking-[-0.02em] text-[24px] sm:text-[32px] lg:text-[42px]">
            ROI-калькулятор
          </h2>
          <div className="mt-2 text-white/70 font-semibold tracking-[-0.01em] text-[13px] sm:text-[16px]">
            Короткая история: сколько стоит текущая модель, сколько стоит ЮНИ, когда окупится интеграция и что будет на горизонте.
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
              pb-[170px]
              shadow-[0_22px_70px_rgba(0,0,0,0.05)]
              backdrop-blur-[26px] backdrop-saturate-150
            "
          >
            <div className="pointer-events-none absolute inset-0 rounded-[40px] ring-1 ring-white/10" />
            <div className="pointer-events-none absolute inset-0 rounded-[40px] opacity-70 bg-[radial-gradient(900px_420px_at_20%_0%,rgba(255,255,255,0.10),transparent_60%),radial-gradient(900px_420px_at_80%_100%,rgba(199,63,64,0.08),transparent_65%)]" />

            {/* main cards */}
            <div
              className="
                relative
                rounded-[34px]
                lg-border border border-white/18
                bg-white/82
                p-6
                shadow-[0_18px_55px_rgba(0,0,0,0.03)]
                grid gap-4
                lg:grid-cols-[1.05fr_0.95fr]
              "
            >
              {/* LEFT: inputs */}
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

                {/* managers */}
                <div className="mt-5">
                  <div className="flex items-end justify-between gap-3">
                    <div className="text-[12px] font-semibold text-[#0f172a]">Кол-во менеджеров</div>
                    <div className="text-[12px] font-semibold text-[#0f172a]">{calc.m}</div>
                  </div>

                  <div className="mt-3 rounded-[16px] lg-border border border-white/18 bg-white/65 p-4">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={calc.m}
                      onChange={(e) => setManagers(Number(e.target.value))}
                      className="roi-range"
                      style={{ ["--p" as any]: sliderPct }}
                      aria-label="Количество менеджеров"
                    />

                    <div className="mt-3 flex flex-wrap gap-2">
                      {[1, 3, 5, 10].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setManagers(m)}
                          className={[
                            "rounded-full px-3 py-1 text-[12px] font-semibold transition-[transform,color,background-color] duration-[600ms]",
                            "active:scale-[0.99]",
                            // кнопки на белом фоне: еле-серый бордюр
                            "border border-black/5",
                            calc.m === m ? "bg-white text-[#0f172a]" : "bg-white/70 text-[#475467] hover:text-[#c73f40]",
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
                      value={formatMoneyInput(salary)}
                      onChange={(e) => setSalary(parseMoneyInput(e.target.value))}
                      onBlur={() => setSalary(clamp(Math.round(salary) || 0, 10_000, 1_000_000))}
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
                            "rounded-full px-3 py-1 text-[12px] font-semibold transition-[transform,color,background-color] duration-[600ms]",
                            "active:scale-[0.99]",
                            "border border-black/5",
                            Math.abs(salary - v) < 1 ? "bg-white text-[#0f172a]" : "bg-white/70 text-[#475467] hover:text-[#c73f40]",
                          ].join(" ")}
                        >
                          {formatRub(v).replace(" ₽", "")}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2 text-[12px] text-[#667085]">
                    Валидация: от 10 000 до 1 000 000 ₽. Маска только для отображения.
                  </div>
                </div>

                {/* expanded inputs */}
                {expanded ? (
                  <>
                    {/* overhead */}
                    <div className="mt-5">
                      <div className="flex items-center gap-2">
                        <div className="text-[12px] font-semibold text-[#0f172a]">Накладные</div>
                        <Tooltip label="Налоги, рабочее место, обучение, текучка, управленческие расходы. Обычно 1.2–1.5.">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-black/5 bg-white text-[12px] font-semibold text-[#0f172a]">
                            i
                          </span>
                        </Tooltip>
                      </div>

                      <div className="mt-3 rounded-[16px] lg-border border border-white/18 bg-white/65 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {[1.0, 1.2, 1.3, 1.5].map((v) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => setCoeff(v)}
                              className={[
                                "rounded-full px-3 py-1 text-[12px] font-semibold transition-[transform,color,background-color] duration-[600ms]",
                                "active:scale-[0.99]",
                                // кнопка на белом фоне -> еле-серый контур
                                "border border-black/5",
                                Math.abs(coeff - v) < 0.001
                                  ? "bg-white text-[#0f172a]"
                                  : "bg-white/70 text-[#475467] hover:text-[#c73f40]",
                              ].join(" ")}
                            >
                              {v.toFixed(1)}
                            </button>
                          ))}

                          <div className="ml-2 flex items-center gap-2">
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
                                border border-black/5
                                bg-white/85
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

                    {/* share */}
                    <div className="mt-5">
                      <div className="text-[12px] font-semibold text-[#0f172a]">Доля замещения функций</div>

                      <div className="mt-3 rounded-[16px] lg-border border border-white/18 bg-white/65 p-4">
                        <div className="flex flex-wrap gap-2">
                          {[
                            { key: "cons" as const, label: "Консервативно", pct: 45 },
                            { key: "real" as const, label: "Реалистично", pct: 70 },
                            { key: "full" as const, label: "100% функций", pct: 100 },
                          ].map((x) => (
                            <button
                              key={x.key}
                              type="button"
                              onClick={() => setShareMode(x.key)}
                              className={[
                                "rounded-[999px] px-4 py-2 text-[12px] font-semibold transition-[transform,color,background-color] duration-[650ms]",
                                "active:scale-[0.99]",
                                "border border-black/5",
                                shareMode === x.key
                                  ? "bg-white text-[#0f172a]"
                                  : "bg-white/70 text-[#475467] hover:text-[#c73f40]",
                              ].join(" ")}
                            >
                              {x.label} <span className="opacity-70">({x.pct}%)</span>
                            </button>
                          ))}

                          <button
                            type="button"
                            onClick={() => setShareMode("custom")}
                            className={[
                              "rounded-[999px] px-4 py-2 text-[12px] font-semibold transition-[transform,color,background-color] duration-[650ms]",
                              "active:scale-[0.99]",
                              "border border-black/5",
                              shareMode === "custom"
                                ? "bg-white text-[#0f172a]"
                                : "bg-white/70 text-[#475467] hover:text-[#c73f40]",
                            ].join(" ")}
                          >
                            Свой
                          </button>

                          {shareMode === "custom" ? (
                            <div className="flex items-center gap-2">
                              <input
                                value={String(shareCustom)}
                                onChange={(e) => setShareCustom(parseMoneyInput(e.target.value))}
                                onBlur={() => setShareCustom(clamp(Math.round(shareCustom) || 70, 10, 100))}
                                inputMode="numeric"
                                className="h-9 w-[72px] rounded-[12px] border border-black/5 bg-white/85 px-3 text-[12px] font-semibold text-[#0f172a] outline-none"
                                aria-label="Свой процент замещения"
                              />
                              <span className="text-[12px] text-[#667085]">%</span>
                            </div>
                          ) : null}
                        </div>

                        <div className="mt-3 text-[12px] text-[#667085] leading-[1.35]">
                          Сравниваем не “увольнение”, а долю функций, которую закрывают агенты. Поэтому ФОТ для сравнения уменьшается на этот процент.
                        </div>
                      </div>
                    </div>

                    {/* plan + billing */}
                    <div className="mt-5">
                      <div className="text-[12px] font-semibold text-[#0f172a]">Тариф и оплата</div>

                      <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        {(Object.keys(PLANS) as PlanKey[]).map((k) => {
                          const meta = PLANS[k];
                          const active = plan === k;
                          const recommended = calc.bestPlan === k;

                          return (
                            <button
                              key={k}
                              type="button"
                              onClick={() => setPlan(k)}
                              className={[
                                "rounded-[16px] p-3 text-left transition-[transform,color,background-color] duration-[650ms] active:scale-[0.99]",
                                "bg-white/85",
                                "border",
                                active ? "border-black/10" : "border-black/5",
                                recommended && !active ? "ring-1 ring-[#c73f40]/18" : "",
                              ].join(" ")}
                              title={recommended ? "Самый выгодный вариант при текущих вводных" : undefined}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="text-[12px] font-semibold text-[#0f172a]">{meta.title}</div>
                                {recommended ? (
                                  <span className="rounded-full border border-black/5 bg-white px-2 py-[2px] text-[10px] font-semibold text-[#0f172a]">
                                    Рекомендуем
                                  </span>
                                ) : null}
                              </div>
                              <div className="mt-1 text-[12px] text-[#667085]">
                                {formatRub(meta.monthly)} / мес
                              </div>
                              <div className="mt-2 text-[12px] text-[#667085]">
                                Экономия (1 год):{" "}
                                <span className="font-semibold text-[#0f172a]">
                                  {formatRub(calc.byPlan[k].savings1)}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setBilling("monthly")}
                          className={[
                            "h-10 rounded-[999px] px-5 text-[13px] font-semibold transition-[transform,color,background-color] duration-[650ms] active:scale-[0.99]",
                            "border border-black/5 bg-white/85",
                            billing === "monthly" ? "text-[#0f172a]" : "text-[#475467] hover:text-[#c73f40]",
                          ].join(" ")}
                        >
                          Ежемесячно
                        </button>

                        <button
                          type="button"
                          onClick={() => setBilling("yearly")}
                          className={[
                            "h-10 rounded-[999px] px-5 text-[13px] font-semibold transition-[transform,color,background-color] duration-[650ms] active:scale-[0.99]",
                            "border border-black/5 bg-white/85",
                            billing === "yearly" ? "text-[#0f172a]" : "text-[#475467] hover:text-[#c73f40]",
                          ].join(" ")}
                        >
                          Годовой (-20%)
                        </button>
                      </div>
                    </div>

                    {/* integration */}
                    <div className="mt-5 rounded-[16px] lg-border border border-white/18 bg-white/65 p-4">
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

              {/* RIGHT: results */}
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

                  <div className="rounded-full lg-border border border-white/18 bg-white/65 px-3 py-1 text-[12px] font-semibold text-[#0f172a]">
                    Замещение: {Math.round(calc.share * 100)}%
                  </div>
                </div>

                {/* main highlight (без лишней тени/свечения углов) */}
                <div
                  className="
                    mt-5
                    rounded-[22px]
                    lg-border border border-white/18
                    bg-white/65
                    p-5
                    relative overflow-hidden
                  "
                >
                  <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(520px_180px_at_25%_0%,rgba(255,255,255,0.70),transparent_60%),radial-gradient(520px_180px_at_85%_100%,rgba(199,63,64,0.10),transparent_65%)]" />

                  <div className="relative">
                    <div className="text-[12px] font-semibold text-[#667085]">Экономия за 1 год</div>

                    <div className="mt-2 flex flex-wrap items-end gap-3">
                      <div
                        className={[
                          "text-[28px] sm:text-[34px] font-semibold tracking-[-0.02em]",
                          bad ? "text-[#c73f40]" : "text-[#28df7c]",
                        ].join(" ")}
                      >
                        {formatRub(aSavings1)}
                      </div>
                      <div className="pb-[6px] text-[14px] font-semibold text-[#0f172a]">
                        {`${aSavings1Pct.toFixed(1)}%`}
                      </div>
                    </div>

                    <div className="mt-3 text-[13px] font-semibold text-[#0f172a]">
                      {calc.paybackMonth && calc.monthlySaving > 0
                        ? `Окупаемость интеграции: ${calc.paybackMonth} мес`
                        : "Окупаемость: не окупается при этих параметрах"}
                    </div>

                    <div className="mt-2 text-[12px] text-[#667085]">
                      {calc.paybackFromManagers ? (
                        <>
                          Окупается от:{" "}
                          <span className="font-semibold text-[#0f172a]">{calc.paybackFromManagers} менеджеров</span>{" "}
                          (в пределах 10).
                        </>
                      ) : calc.paybackFromSalary ? (
                        <>
                          Окупается при ФОТ от:{" "}
                          <span className="font-semibold text-[#0f172a]">{formatRub(calc.paybackFromSalary)}</span>{" "}
                          (при {calc.m} менеджерах).
                        </>
                      ) : (
                        <>Подсказка: увеличь кол-во менеджеров или ФОТ, либо выбери годовую оплату.</>
                      )}
                    </div>
                  </div>
                </div>

                {/* expanded results */}
                {expanded ? (
                  <>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-[18px] lg-border border border-white/18 bg-white/65 p-4">
                        <div className="text-[12px] font-semibold text-[#667085]">ФОТ людей (1 год)</div>
                        <div className="mt-2 text-[14px] font-semibold text-[#0f172a]">{formatRub(aPeopleYear)}</div>
                        <div className="mt-1 text-[12px] text-[#667085]">с учётом замещения</div>
                      </div>

                      <div className="rounded-[18px] lg-border border border-white/18 bg-white/65 p-4">
                        <div className="text-[12px] font-semibold text-[#667085]">Стоимость 1-го года</div>
                        <div className="mt-2 text-[14px] font-semibold text-[#0f172a]">{formatRub(aUniYear1)}</div>
                        <div className="mt-1 text-[12px] text-[#667085]">тариф + интеграция</div>
                      </div>

                      <div className="rounded-[18px] lg-border border border-white/18 bg-white/65 p-4">
                        <div className="text-[12px] font-semibold text-[#667085]">Стоимость 2-го года</div>
                        <div className="mt-2 text-[14px] font-semibold text-[#0f172a]">{formatRub(aUniYear2)}</div>
                        <div className="mt-1 text-[12px] text-[#667085]">только тариф</div>
                      </div>
                    </div>

                    <BarsPeopleVsUni people={calc.peopleYearAdj} uni={calc.uniYear1} bad={bad} />

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[18px] lg-border border border-white/18 bg-white/65 p-4">
                        <div className="text-[12px] font-semibold text-[#667085]">Экономия за 3 года</div>
                        <div className="mt-2 text-[16px] font-semibold text-[#0f172a]">{formatRub(aSav3)}</div>
                        <div className="mt-1 text-[12px] text-[#667085]">{`${aSav3Pct.toFixed(1)}%`}</div>
                      </div>

                      <div className="rounded-[18px] lg-border border border-white/18 bg-white/65 p-4">
                        <div className="text-[12px] font-semibold text-[#667085]">Экономия за 5 лет</div>
                        <div className="mt-2 text-[16px] font-semibold text-[#0f172a]">{formatRub(aSav5)}</div>
                        <div className="mt-1 text-[12px] text-[#667085]">{`${aSav5Pct.toFixed(1)}%`}</div>
                      </div>
                    </div>

                    <HorizonMini s1={calc.savings1} s3={calc.sav3} s5={calc.sav5} />

                    <PaybackChart
                      monthlySaving={calc.monthlySaving}
                      paybackMonth={calc.paybackMonth}
                      integrationCost={INTEGRATION_COST}
                    />

                    <div className="mt-4 text-[12px] text-[#667085] leading-[1.35]">
                      Числа для оценки. Итог зависит от сценариев, качества базы знаний и глубины интеграций.
                    </div>
                  </>
                ) : (
                  <div className="mt-5 flex items-center justify-between gap-3 text-[12px]">
                    <div className="font-semibold text-[#0f172a]">
                      Замещение: {Math.round(calc.share * 100)}%
                    </div>
                    <div className="text-[#98A2B3]">Разверни, чтобы отрегулировать</div>
                  </div>
                )}
              </div>
            </div>

            {/* bottom glass space: button + hint (как на твоём 2-м скрине) */}
            <div className="absolute left-[22px] right-[22px] bottom-[34px] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="
                  rounded-[18px]
                  bg-white/90
                  px-7 py-4
                  text-[14px] font-semibold
                  text-[#0f172a]
                  border border-white/18 lg-border
                  shadow-[0_22px_70px_rgba(0,0,0,0.10)]
                  hover:text-[#c73f40]
                  active:scale-[0.99]
                "
                style={{ animation: "roiBlinkSoft 2.9s ease-in-out infinite" }}
                aria-label={expanded ? "Свернуть калькулятор" : "Развернуть калькулятор"}
              >
                {expanded ? "Свернуть калькулятор" : "Развернуть калькулятор"}
              </button>

              <div className="text-white/70 text-[13px] leading-[1.4] max-w-[720px]">
                Разверни калькулятор, чтобы настроить накладные, тариф, долю замещения и увидеть горизонты 3/5 лет.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
