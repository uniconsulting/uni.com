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

function formatInt(n: number) {
  const x = Math.round(n);
  const sign = x < 0 ? "−" : "";
  const abs = Math.abs(x);
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

function GlassSlider({
  value,
  min,
  max,
  step,
  onChange,
  ariaLabel,
  disabled,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  ariaLabel: string;
  disabled?: boolean;
}) {
  const pct = ((value - min) / Math.max(1e-6, max - min)) * 100;
  const trackBg = `linear-gradient(90deg, rgba(199,63,64,0.18) 0%, rgba(199,63,64,0.10) ${pct}%, rgba(15,23,42,0.06) ${pct}%, rgba(15,23,42,0.06) 100%)`;

  return (
    <div
      className={[
        "rounded-[16px] lg-border border border-white/18 bg-white/65 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.04)]",
        disabled ? "opacity-60" : "",
      ].join(" ")}
    >
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={ariaLabel}
        disabled={disabled}
        className="roi-range w-full"
        style={{ background: trackBg }}
      />
    </div>
  );
}

function Tooltip({
  label,
  text,
}: {
  label: React.ReactNode;
  text: string;
}) {
  return (
    <span className="relative inline-flex items-center gap-1">
      <span>{label}</span>
      <span className="group relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/5 text-[12px] font-semibold text-[#0f172a]">
        i
        <span
          className="
            pointer-events-none
            absolute left-1/2 top-full z-20 mt-2 w-[280px]
            -translate-x-1/2
            rounded-[14px]
            lg-border border border-white/18
            bg-white/90
            px-3 py-2
            text-[12px] font-medium text-[#475467]
            shadow-[0_18px_55px_rgba(0,0,0,0.10)]
            opacity-0
            transition-opacity duration-[250ms]
            group-hover:opacity-100
          "
        >
          {text}
        </span>
      </span>
    </span>
  );
}

function PaybackTimeline({
  monthlyDelta,
  paybackMonths,
}: {
  monthlyDelta: number;
  paybackMonths: number | null;
}) {
  const maxMonths = 12;
  const ok = paybackMonths !== null && paybackMonths > 0;
  const within = ok && paybackMonths! <= maxMonths;

  const prog = !ok
    ? 0
    : clamp((INTEGRATION_COST / Math.max(1e-6, monthlyDelta)) / maxMonths, 0, 1);

  const markerLeft = !ok
    ? null
    : `${clamp(((Math.min(paybackMonths!, maxMonths) - 1) / (maxMonths - 1)) * 100, 0, 100)}%`;

  return (
    <div className="mt-4">
      <div
        className="
          rounded-[16px]
          lg-border border border-white/18
          bg-white/60
          p-3
          shadow-[0_12px_35px_rgba(0,0,0,0.04)]
        "
      >
        <div className="flex items-center justify-between gap-3">
          <div className="text-[12px] font-semibold text-[#0f172a]">Окупаемость на горизонте 12 мес</div>
          <div className="text-[12px] font-semibold text-[#667085]">
            {ok
              ? within
                ? `≈ ${paybackMonths} мес`
                : `> ${maxMonths} мес`
              : "нет"}
          </div>
        </div>

        <div className="mt-3 relative h-[26px]">
          <div
            className="
              absolute inset-0
              rounded-[999px]
              lg-border border border-white/18
              bg-white/70
            "
          />
          <div
            className="absolute left-0 top-0 h-full rounded-[999px]"
            style={{
              width: `${clamp(prog * 100, 0, 100)}%`,
              background:
                "linear-gradient(90deg, rgba(40,223,124,0.30), rgba(40,223,124,0.10))",
              boxShadow: "0 18px 50px rgba(40,223,124,0.12)",
            }}
          />

          {ok ? (
            <div
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: markerLeft ?? "0%" }}
            >
              <div
                className="
                  h-5 w-5
                  rounded-full
                  bg-white
                  shadow-[0_16px_45px_rgba(0,0,0,0.12)]
                  ring-1 ring-black/10
                "
              />
              <div
                className="
                  absolute left-1/2 top-full mt-2
                  -translate-x-1/2
                  whitespace-nowrap
                  rounded-[999px]
                  bg-white/90
                  px-3 py-1
                  text-[12px] font-semibold
                  text-[#0f172a]
                  ring-1 ring-black/10
                "
              >
                {within ? `Окупится: ${paybackMonths} мес` : "Окупится позже"}
              </div>
            </div>
          ) : null}

          <div className="absolute inset-0 flex items-center justify-between px-3 text-[10px] text-[#98A2B3]">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i}>{i === 0 ? "0" : i * 2}</span>
            ))}
          </div>
        </div>

        {!ok ? (
          <div className="mt-3 text-[12px] text-[#667085]">
            Не окупается при этих параметрах. Увеличь число менеджеров, ФОТ или долю замещения.
          </div>
        ) : null}
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
  const maxV = Math.max(peopleYear, uniYear1, 1);
  const hp = clamp((peopleYear / maxV) * 100, 0, 100);
  const hu = clamp((uniYear1 / maxV) * 100, 0, 100);

  return (
    <div
      className="
        mt-4
        rounded-[16px]
        lg-border border border-white/18
        bg-white/60
        p-4
        shadow-[0_12px_35px_rgba(0,0,0,0.04)]
      "
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-[12px] font-semibold text-[#0f172a]">Люди vs ЮНИ (1-й год)</div>
        <div className="text-[12px] font-semibold text-[#667085]">сравнение</div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-[14px] lg-border border border-white/18 bg-white/70 p-3">
          <div className="text-[12px] font-semibold text-[#0f172a]">Люди</div>
          <div className="mt-2 h-[10px] rounded-[999px] bg-black/5 overflow-hidden">
            <div
              className="h-full rounded-[999px]"
              style={{
                width: `${hp}%`,
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
                width: `${hu}%`,
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

function HorizonSpark({
  s1,
  s3,
  s5,
}: {
  s1: number;
  s3: number;
  s5: number;
}) {
  const maxAbs = Math.max(Math.abs(s1), Math.abs(s3), Math.abs(s5), 1);
  const mapY = (v: number) => 22 - (v / maxAbs) * 14; // 0..44 svg
  const p1 = { x: 10, y: mapY(s1) };
  const p3 = { x: 50, y: mapY(s3) };
  const p5 = { x: 90, y: mapY(s5) };

  const allBad = s1 <= 0 && s3 <= 0 && s5 <= 0;
  const stroke = allBad ? "rgba(199,63,64,0.65)" : "rgba(40,223,124,0.65)";
  const dot = allBad ? "rgba(199,63,64,0.85)" : "rgba(40,223,124,0.85)";

  return (
    <div
      className="
        mt-4
        rounded-[16px]
        lg-border border border-white/18
        bg-white/60
        p-4
        shadow-[0_12px_35px_rgba(0,0,0,0.04)]
      "
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-[12px] font-semibold text-[#0f172a]">Экономия в горизонте</div>
        <div className="text-[12px] font-semibold text-[#667085]">1 / 3 / 5 лет</div>
      </div>

      <div className="mt-3 rounded-[14px] lg-border border border-white/18 bg-white/70 p-3">
        <div className="relative h-[70px] overflow-visible">
          <div
            className="absolute inset-0 rounded-[12px] opacity-75"
            style={{
              background:
                "radial-gradient(320px 90px at 20% 0%, rgba(255,255,255,0.70), transparent 60%)",
            }}
          />
          <svg
            className="absolute inset-0"
            viewBox="0 0 100 44"
            preserveAspectRatio="none"
            style={{ overflow: "visible" }}
          >
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

  const [managers, setManagers] = React.useState<number>(5);
  const [salary, setSalary] = React.useState<number>(50_000);

  const [coeff, setCoeff] = React.useState<number>(1.3);
  const [plan, setPlan] = React.useState<PlanKey>("mid");
  const [billing, setBilling] = React.useState<Billing>("monthly");

  const [share, setShare] = React.useState<number>(0.7);

  const computed = React.useMemo(() => {
    const m = clamp(Math.round(managers), 1, 10);

    // зарплата: защищаем от пустого/0/слишком больших
    const sRaw = Math.round(salary);
    const s = clamp(Number.isFinite(sRaw) ? sRaw : 50_000, 10_000, 1_000_000);

    const c = clamp(Number(coeff) || 1.3, 1.0, 2.2);
    const sh = clamp(Number(share) || 0.7, 0.1, 1);

    const peopleYear = m * s * c * 12 * sh;

    const calcForPlan = (k: PlanKey) => {
      const monthly = PLAN_META[k].priceMonthly;
      const planAnnual = billing === "monthly" ? monthly * 12 : monthly * 12 * 0.8;
      const planMonthlyEff = billing === "monthly" ? monthly : monthly * 0.8;

      const year1Uni = planAnnual + INTEGRATION_COST;
      const year2Uni = planAnnual;

      const saving1 = peopleYear - year1Uni;
      const saving1Pct = peopleYear > 0 ? (saving1 / peopleYear) * 100 : 0;

      const uni3 = year1Uni + year2Uni * 2;
      const uni5 = year1Uni + year2Uni * 4;

      const people3 = peopleYear * 3;
      const people5 = peopleYear * 5;

      const sav3 = people3 - uni3;
      const sav5 = people5 - uni5;

      const sav3Pct = people3 > 0 ? (sav3 / people3) * 100 : 0;
      const sav5Pct = people5 > 0 ? (sav5 / people5) * 100 : 0;

      const peopleMonthly = m * s * c * sh;
      const monthlyDelta = peopleMonthly - planMonthlyEff;

      const paybackMonths =
        monthlyDelta > 0 ? Math.ceil(INTEGRATION_COST / monthlyDelta) : null;

      return {
        key: k,
        planAnnual,
        planMonthlyEff,
        year1Uni,
        year2Uni,
        saving1,
        saving1Pct,
        sav3,
        sav3Pct,
        sav5,
        sav5Pct,
        monthlyDelta,
        paybackMonths,
      };
    };

    const all = (Object.keys(PLAN_META) as PlanKey[]).map(calcForPlan);
    const best = all.reduce((a, b) => (b.saving1 > a.saving1 ? b : a), all[0]);

    const chosen = all.find((x) => x.key === plan) ?? best;

    // порог окупаемости: минимальные менеджеры (1..10), чтобы окупилось <= 12 мес
    const thresholdManagers = (() => {
      for (let mm = 1; mm <= 10; mm++) {
        const peopleMonthly = mm * s * c * sh;
        const monthlyDelta = peopleMonthly - chosen.planMonthlyEff;
        if (monthlyDelta <= 0) continue;
        const pb = Math.ceil(INTEGRATION_COST / monthlyDelta);
        if (pb <= 12) return mm;
      }
      return null;
    })();

    // альтернативно: порог ФОТ при текущих менеджерах, чтобы окупилось <= 12 мес
    const thresholdSalary = (() => {
      const mm = m;
      const needDelta = INTEGRATION_COST / 12;
      const denom = mm * c * sh;
      if (denom <= 0) return null;
      const sNeed = (chosen.planMonthlyEff + needDelta) / denom;
      if (!Number.isFinite(sNeed)) return null;
      return clamp(Math.ceil(sNeed / 1000) * 1000, 10_000, 1_000_000);
    })();

    return {
      m,
      s,
      c,
      sh,
      allPlans: all,
      bestPlan: best.key as PlanKey,
      chosen,
      peopleYear,
      thresholdManagers,
      thresholdSalary,
    };
  }, [managers, salary, coeff, share, plan, billing]);

  const animSaving1 = useCountUp(computed.chosen.saving1, 700);
  const animSaving1Pct = useCountUp(computed.chosen.saving1Pct, 700);

  const animPeopleYear = useCountUp(computed.peopleYear, 650);
  const animYear1Uni = useCountUp(computed.chosen.year1Uni, 650);
  const animYear2Uni = useCountUp(computed.chosen.year2Uni, 650);

  const animSav3 = useCountUp(computed.chosen.sav3, 700);
  const animSav3Pct = useCountUp(computed.chosen.sav3Pct, 700);
  const animSav5 = useCountUp(computed.chosen.sav5, 700);
  const animSav5Pct = useCountUp(computed.chosen.sav5Pct, 700);

  const bad = computed.chosen.saving1 < 0;

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
          background: rgba(15,23,42,0.06);
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
            Короткая история про экономику: люди, ЮНИ, окупаемость, горизонты 3 и 5 лет.
          </div>
        </div>

        <div className="mt-8 md:mt-12">
          <div
            className="
              lg-border
              relative mx-auto max-w-[1240px]
              rounded-[44px]
              border border-white/18
              bg-white/10
              p-[10px]
              shadow-[0_22px_70px_rgba(0,0,0,0.05)]
              backdrop-blur-[26px] backdrop-saturate-150
            "
          >
            <div className="pointer-events-none absolute inset-0 rounded-[44px] ring-1 ring-white/10" />
            <div className="pointer-events-none absolute inset-0 rounded-[44px] opacity-70 bg-[radial-gradient(900px_420px_at_20%_0%,rgba(255,255,255,0.10),transparent_60%),radial-gradient(900px_420px_at_80%_100%,rgba(199,63,64,0.08),transparent_65%)]" />

            {/* top white card */}
            <div
              className="
                relative
                rounded-[34px]
                lg-border border border-white/18
                bg-white/82
                p-6
                shadow-[0_18px_55px_rgba(0,0,0,0.03)]
              "
            >
              <div className="grid gap-4 lg:grid-cols-2">
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
                      <div className="text-[12px] font-semibold text-[#0f172a]">{computed.m}</div>
                    </div>

                    <div className="mt-3">
                      <GlassSlider
                        value={computed.m}
                        min={1}
                        max={10}
                        step={1}
                        onChange={(v) => setManagers(v)}
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
                              "bg-white border border-black/10",
                              computed.m === x ? "text-[#0f172a]" : "text-[#667085] hover:text-[#c73f40]",
                            ].join(" ")}
                          >
                            {x}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* salary */}
                  <div className="mt-6">
                    <div className="text-[12px] font-semibold text-[#0f172a]">ФОТ одного менеджера (₽/мес)</div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
                      <input
                        value={formatMoneyInput(computed.s)}
                        onChange={(e) => setSalary(parseMoneyInput(e.target.value))}
                        inputMode="numeric"
                        className="
                          h-11 w-full
                          rounded-[16px]
                          lg-border border border-white/18
                          bg-white/65
                          px-4
                          text-[14px]
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
                              "rounded-full px-4 py-2 text-[12px] font-semibold transition-[transform,color,background-color] duration-[600ms] active:scale-[0.99]",
                              "bg-white border border-black/10",
                              computed.s === v ? "text-[#0f172a]" : "text-[#667085] hover:text-[#c73f40]",
                            ].join(" ")}
                          >
                            {formatInt(v)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-2 text-[12px] text-[#98A2B3]">
                      Валидация: от 10 000 до 1 000 000 ₽. Маска только для отображения.
                    </div>
                  </div>

                  {/* expanded controls */}
                  {expanded ? (
                    <>
                      {/* overhead */}
                      <div className="mt-6">
                        <div className="text-[12px] font-semibold text-[#0f172a]">
                          <Tooltip
                            label="Накладные"
                            text="Обычно включает: налоги, рабочее место, обучение, текучка, управление."
                          />
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
                          <div className="flex flex-wrap items-center gap-2">
                            {[1.0, 1.2, 1.3, 1.5].map((v) => (
                              <button
                                key={v}
                                type="button"
                                onClick={() => setCoeff(v)}
                                className={[
                                  "rounded-full px-4 py-2 text-[12px] font-semibold transition-[transform,color,background-color] duration-[600ms] active:scale-[0.99]",
                                  "bg-white border border-black/10",
                                  Math.abs(computed.c - v) < 0.001
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
                                value={String(computed.c)}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(",", ".");
                                  const n = Number(raw);
                                  setCoeff(Number.isFinite(n) ? n : 1.3);
                                }}
                                inputMode="decimal"
                                className="
                                  h-10 w-[96px]
                                  rounded-[14px]
                                  lg-border border border-white/18
                                  bg-white/65
                                  px-3
                                  text-[12px]
                                  font-semibold
                                  text-[#0f172a]
                                  outline-none
                                "
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* plan + billing */}
                      <div className="mt-6">
                        <div className="text-[12px] font-semibold text-[#0f172a]">Тариф</div>

                        <div className="mt-3 grid gap-2 sm:grid-cols-3">
                          {(["small", "mid", "enterprise"] as PlanKey[]).map((k) => {
                            const meta = PLAN_META[k];
                            const active = plan === k;
                            const best = computed.bestPlan === k;

                            return (
                              <button
                                key={k}
                                type="button"
                                onClick={() => setPlan(k)}
                                className={[
                                  "rounded-[18px] p-4 text-left transition-[transform,box-shadow] duration-[650ms] active:scale-[0.99]",
                                  "lg-border border border-white/18 bg-white/65 shadow-[0_12px_35px_rgba(0,0,0,0.04)]",
                                  best ? "ring-1 ring-white/35" : "ring-0",
                                  active ? "outline outline-1 outline-[#c73f40]/25" : "",
                                ].join(" ")}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="text-[12px] font-semibold text-[#0f172a]">{meta.title}</div>
                                  {best ? (
                                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-[#0f172a] border border-black/10">
                                      лучший
                                    </span>
                                  ) : null}
                                </div>
                                <div className="mt-1 text-[12px] text-[#667085]">
                                  {formatRub(meta.priceMonthly)} / мес
                                </div>
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

                      {/* share */}
                      <div className="mt-6">
                        <div className="flex items-end justify-between gap-3">
                          <div className="text-[12px] font-semibold text-[#0f172a]">Доля замещения функций</div>
                          <div className="text-[12px] font-semibold text-[#0f172a]">{Math.round(computed.sh * 100)}%</div>
                        </div>

                        <div className="mt-3">
                          <GlassSlider
                            value={Math.round(computed.sh * 100)}
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
                                  Math.round(computed.sh * 100) === x.p
                                    ? "text-[#0f172a]"
                                    : "text-[#667085] hover:text-[#c73f40]",
                                ].join(" ")}
                              >
                                {x.t} <span className="opacity-70">({x.p}%)</span>
                              </button>
                            ))}
                          </div>

                          <div className="mt-2 text-[12px] text-[#98A2B3]">
                            В реальности чаще закрываем часть функций, а не “увольняем всех”. Это делает расчёт правдоподобнее.
                          </div>
                        </div>
                      </div>

                      {/* integration */}
                      <div
                        className="
                          mt-6
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
                        <div className="mt-2 text-[12px] text-[#667085]">
                          Аудит, ТЗ, база знаний, сборка MVP, тестирование и запуск.
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>

                {/* RIGHT: result */}
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
                      title="Доля замещения"
                    >
                      Замещение: {Math.round(computed.sh * 100)}%
                    </div>
                  </div>

                  {/* main saving box (no weird corner glow) */}
                  <div
                    className="
                      mt-5
                      rounded-[24px]
                      lg-border border border-white/18
                      bg-white/65
                      p-5
                      shadow-none
                      relative overflow-hidden
                    "
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(520px_180px_at_25%_0%,rgba(255,255,255,0.70),transparent_60%),radial-gradient(520px_180px_at_85%_100%,rgba(199,63,64,0.10),transparent_65%)]" />

                    <div className="relative">
                      <div className="text-[12px] font-semibold text-[#667085]">Экономия за 1 год</div>

                      <div className="mt-2 flex flex-wrap items-end gap-3">
                        <div
                          className={[
                            "text-[28px] sm:text-[36px] font-semibold tracking-[-0.02em]",
                            bad ? "text-[#c73f40]" : "text-[#28df7c]",
                          ].join(" ")}
                        >
                          {formatRub(animSaving1)}
                        </div>

                        <div className="pb-[6px] text-[14px] font-semibold text-[#0f172a]">
                          {`${useCountUp(computed.chosen.saving1Pct, 700).toFixed(1)}%`}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-3">
                        <div className="rounded-[16px] lg-border border border-white/18 bg-white/75 p-3">
                          <div className="text-[12px] font-semibold text-[#0f172a]">ФОТ людей / год</div>
                          <div className="mt-1 text-[12px] text-[#667085]">{formatRub(animPeopleYear)}</div>
                        </div>
                        <div className="rounded-[16px] lg-border border border-white/18 bg-white/75 p-3">
                          <div className="text-[12px] font-semibold text-[#0f172a]">ЮНИ: 1-й год</div>
                          <div className="mt-1 text-[12px] text-[#667085]">{formatRub(animYear1Uni)}</div>
                        </div>
                        <div className="rounded-[16px] lg-border border border-white/18 bg-white/75 p-3">
                          <div className="text-[12px] font-semibold text-[#0f172a]">ЮНИ: 2-й год</div>
                          <div className="mt-1 text-[12px] text-[#667085]">{formatRub(animYear2Uni)}</div>
                        </div>
                      </div>

                      <PaybackTimeline
                        monthlyDelta={computed.chosen.monthlyDelta}
                        paybackMonths={computed.chosen.paybackMonths}
                      />

                      <div className="mt-3 text-[12px] text-[#667085]">
                        {computed.chosen.paybackMonths && computed.chosen.paybackMonths <= 12 ? (
                          <>
                            Окупаемость интеграции:{" "}
                            <span className="font-semibold text-[#0f172a]">
                              {computed.chosen.paybackMonths} мес
                            </span>
                            .
                          </>
                        ) : (
                          <>
                            Окупаемость интеграции:{" "}
                            <span className="font-semibold text-[#0f172a]">не окупается</span> при этих параметрах.
                          </>
                        )}
                      </div>

                      <div className="mt-2 text-[12px] text-[#98A2B3]">
                        {computed.thresholdManagers !== null ? (
                          <>
                            Окупается от:{" "}
                            <span className="font-semibold text-[#0f172a]">{computed.thresholdManagers} менеджеров</span>{" "}
                            (в пределах 12 мес).
                          </>
                        ) : computed.thresholdSalary !== null ? (
                          <>
                            Окупается при ФОТ от:{" "}
                            <span className="font-semibold text-[#0f172a]">{formatRub(computed.thresholdSalary).replace(" ₽", " ₽")}</span>{" "}
                            (при {computed.m} менеджерах).
                          </>
                        ) : (
                          <>Окупается при более высоких параметрах.</>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* bottom hint row like on your layout */}
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div className="text-[12px] font-semibold text-[#0f172a]">
                      Замещение: <span className="text-[#667085]">{Math.round(computed.sh * 100)}%</span>
                    </div>
                    <div className="text-[12px] text-[#98A2B3]">
                      {expanded ? "Можно свернуть обратно" : "Разверни, чтобы отрегулировать"}
                    </div>
                  </div>

                  {expanded ? (
                    <>
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[18px] lg-border border border-white/18 bg-white/65 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
                          <div className="text-[12px] font-semibold text-[#667085]">Экономия за 3 года</div>
                          <div className="mt-2 text-[16px] font-semibold text-[#0f172a]">{formatRub(animSav3)}</div>
                          <div className="mt-1 text-[12px] text-[#667085]">{`${animSav3Pct.toFixed(1)}%`}</div>
                        </div>

                        <div className="rounded-[18px] lg-border border border-white/18 bg-white/65 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
                          <div className="text-[12px] font-semibold text-[#667085]">Экономия за 5 лет</div>
                          <div className="mt-2 text-[16px] font-semibold text-[#0f172a]">{formatRub(animSav5)}</div>
                          <div className="mt-1 text-[12px] text-[#667085]">{`${animSav5Pct.toFixed(1)}%`}</div>
                        </div>
                      </div>

                      <MiniBars peopleYear={computed.peopleYear} uniYear1={computed.chosen.year1Uni} />
                      <HorizonSpark s1={computed.chosen.saving1} s3={computed.chosen.sav3} s5={computed.chosen.sav5} />

                      <div className="mt-4 text-[12px] text-[#667085] leading-[1.35]">
                        Числа для оценки. Итог зависит от сценариев, качества базы знаний и глубины интеграций.
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            {/* bottom glass area like in your drawn layout */}
            <div className="mt-8 px-6 pb-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="
                    rounded-[22px]
                    bg-white/90
                    px-8 py-4
                    text-[16px] font-semibold
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

                <div className="max-w-[720px] text-[18px] leading-[1.35] text-white/80">
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
