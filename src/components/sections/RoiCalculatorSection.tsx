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
  return `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;
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

function safePrice(billing: Billing, monthly: number) {
  if (billing === "monthly") return monthly;
  return Math.round(monthly * 0.8);
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

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevRef.current = to;
      }
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
  const maxAbs = Math.max(Math.abs(y1), Math.abs(y3), Math.abs(y5), 1);

  // Центр = 50, амплитуда = 32 (чтобы не упираться в края)
  const mapY = (v: number) => 50 - (v / maxAbs) * 32;

  const p1y = mapY(y1);
  const p3y = mapY(y3);
  const p5y = mapY(y5);

  const allBad = y1 < 0 && y3 < 0 && y5 < 0;

  const stroke = allBad ? "rgba(199,63,64,0.55)" : "rgba(40,223,124,0.55)";
  const dot = allBad ? "rgba(199,63,64,0.75)" : "rgba(40,223,124,0.75)";

  return (
    <div
      className="
        mt-4
        rounded-[18px]
        lg-border border border-white/18
        bg-white/10
        p-4
        backdrop-blur-[22px] backdrop-saturate-150
        shadow-[0_18px_55px_rgba(0,0,0,0.03)]
      "
    >
      <div className="text-[12px] font-semibold text-[#0f172a]">Экономия в горизонте</div>

      <div
        className="
          mt-3
          rounded-[18px]
          lg-border border border-white/18
          bg-white/10
          p-3
          backdrop-blur-[22px] backdrop-saturate-150
          shadow-[0_16px_45px_rgba(0,0,0,0.03)]
        "
      >
        <div className="relative h-[74px] w-full">
          <div
            className="absolute inset-0 rounded-[14px] opacity-70"
            style={{
              background:
                "radial-gradient(260px 90px at 20% 0%, rgba(255,255,255,0.40), transparent 60%)",
            }}
          />

          <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* baseline */}
            <line
              x1="0"
              y1="50"
              x2="100"
              y2="50"
              stroke="rgba(15,23,42,0.10)"
              strokeWidth="2"
            />

            {/* line */}
            <path
              d={`M 14 ${p1y.toFixed(2)} L 50 ${p3y.toFixed(2)} L 86 ${p5y.toFixed(2)}`}
              fill="none"
              stroke={stroke}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* dots */}
            {[
              { x: 14, y: p1y, label: "1 год" },
              { x: 50, y: p3y, label: "3 года" },
              { x: 86, y: p5y, label: "5 лет" },
            ].map((p) => (
              <g key={p.label}>
                <circle cx={p.x} cy={p.y} r="4.2" fill={dot} />
                <circle cx={p.x} cy={p.y} r="6.8" fill="rgba(255,255,255,0.35)" />
              </g>
            ))}
          </svg>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-[12px] text-[#667085]">
          <div
            className="
              rounded-[14px]
              lg-border border border-white/18
              bg-white/10
              p-3
              backdrop-blur-[22px] backdrop-saturate-150
            "
          >
            <div className="font-semibold text-[#0f172a]">1 год</div>
            <div className="mt-1">{formatRub(y1)}</div>
          </div>
          <div
            className="
              rounded-[14px]
              lg-border border border-white/18
              bg-white/10
              p-3
              backdrop-blur-[22px] backdrop-saturate-150
            "
          >
            <div className="font-semibold text-[#0f172a]">3 года</div>
            <div className="mt-1">{formatRub(y3)}</div>
          </div>
          <div
            className="
              rounded-[14px]
              lg-border border border-white/18
              bg-white/10
              p-3
              backdrop-blur-[22px] backdrop-saturate-150
            "
          >
            <div className="font-semibold text-[#0f172a]">5 лет</div>
            <div className="mt-1">{formatRub(y5)}</div>
          </div>
        </div>
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

  // допущения: понятные режимы вместо 0-100%
  const [assumptionMode, setAssumptionMode] = React.useState<"full" | "real" | "cons">("full");
  const replaceShare = assumptionMode === "full" ? 1 : assumptionMode === "real" ? 0.7 : 0.45;

  const calc = React.useMemo(() => {
    const m = clamp(Math.round(managers), 1, 10);
    const s = Math.max(0, Math.round(salary));
    const c = clamp(Number(coeff) || 1, 1.0, 2.2);

    const peopleYear = m * s * c * 12;
    const peopleYearForCompare = peopleYear * replaceShare;

    const planMonthly = PLAN_META[plan].priceMonthly;
    const planAnnual =
      billing === "monthly" ? planMonthly * 12 : planMonthly * 12 * 0.8;

    const year1Uni = planAnnual + INTEGRATION_COST;
    const year2Uni = planAnnual;

    const savings1 = peopleYearForCompare - year1Uni;
    const savings1Pct = peopleYearForCompare > 0 ? (savings1 / peopleYearForCompare) * 100 : 0;

    const uni3 = year1Uni + year2Uni * 2;
    const uni5 = year1Uni + year2Uni * 4;

    const people3 = peopleYearForCompare * 3;
    const people5 = peopleYearForCompare * 5;

    const sav3 = people3 - uni3;
    const sav5 = people5 - uni5;

    const sav3Pct = people3 > 0 ? (sav3 / people3) * 100 : 0;
    const sav5Pct = people5 > 0 ? (sav5 / people5) * 100 : 0;

    // окупаемость интеграции (в месяцах)
    const planMonthlyEffective = safePrice(billing, planMonthly);
    const peopleMonthlyForCompare = m * s * c * replaceShare;

    const monthlySaving = peopleMonthlyForCompare - planMonthlyEffective;
    const paybackMonths = monthlySaving > 0 ? Math.ceil(INTEGRATION_COST / monthlySaving) : null;

    return {
      m,
      s,
      c,

      peopleYear,
      peopleYearForCompare,

      planMonthly,
      planAnnual,
      year1Uni,
      year2Uni,

      savings1,
      savings1Pct,

      sav3,
      sav3Pct,
      sav5,
      sav5Pct,

      paybackMonths,
    };
  }, [managers, salary, coeff, plan, billing, replaceShare]);

  const animSavings1 = useCountUp(calc.savings1, 720);
  const animSavings1Pct = useCountUp(calc.savings1Pct, 720);
  const animPayback = calc.paybackMonths ? calc.paybackMonths : null;

  const animSav3 = useCountUp(calc.sav3, 720);
  const animSav3Pct = useCountUp(calc.sav3Pct, 720);
  const animSav5 = useCountUp(calc.sav5, 720);
  const animSav5Pct = useCountUp(calc.sav5Pct, 720);

  const isBad = calc.savings1 < 0;

  return (
    <section id="roi" className="relative py-14 md:py-20">
      <style jsx global>{`
        @keyframes roiBlink {
          0% { opacity: 0.75; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.02); }
          100% { opacity: 0.75; transform: translateX(-50%) scale(1); }
        }
      `}</style>

      <div className="mx-auto max-w-[-[1240px] max-w-[1240px] px-4">
        <div className="mx-auto max-w-[1240px] text-center">
          <h2 className="text-white font-semibold leading-[0.95] tracking-[-0.02em] text-[24px] sm:text-[32px] lg:text-[42px]">
            ROI-калькулятор
          </h2>
          <div className="mt-2 text-white/70 font-semibold tracking-[-0.01em] text-[13px] sm:text-[16px]">
            Сравнение стоимости людей и ЮНИ, включая накладные и интеграцию.
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
              pb-[84px]
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
                bg-white/10
                p-6
                backdrop-blur-[26px] backdrop-saturate-150
                shadow-[0_18px_55px_rgba(0,0,0,0.03)]
                grid gap-4 lg:grid-cols-[1.05fr_0.95fr]
              "
            >
              {/* LEFT */}
              <div
                className="
                  rounded-[26px]
                  lg-border border border-white/18
                  bg-white/10
                  p-5
                  backdrop-blur-[22px] backdrop-saturate-150
                  shadow-[0_16px_45px_rgba(0,0,0,0.03)]
                "
              >
                <div className="text-[14px] font-semibold text-white">Входные параметры</div>

                {/* managers */}
                <div className="mt-5">
                  <div className="flex items-end justify-between gap-3">
                    <div className="text-[12px] font-semibold text-white/85">Кол-во менеджеров</div>
                    <div className="text-[12px] font-semibold text-white">{calc.m}</div>
                  </div>

                  <div
                    className="
                      mt-3
                      rounded-[16px]
                      lg-border border border-white/18
                      bg-white/10
                      p-4
                      backdrop-blur-[22px] backdrop-saturate-150
                      shadow-[0_12px_35px_rgba(0,0,0,0.03)]
                    "
                  >
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={calc.m}
                      onChange={(e) => setManagers(Number(e.target.value))}
                      className="w-full accent-[#c73f40]"
                    />

                    <div className="mt-3 flex flex-wrap gap-2">
                      {[1, 3, 5, 10].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setManagers(m)}
                          className={[
                            "rounded-full lg-border border border-white/18 px-3 py-1 text-[12px] font-semibold transition-[transform,opacity] duration-[600ms]",
                            "active:scale-[0.99]",
                            calc.m === m ? "bg-white/20 text-white" : "bg-white/10 text-white/80 hover:text-white",
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
                  <div className="text-[12px] font-semibold text-white/85">ФОТ одного менеджера (₽/мес)</div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
                    <input
                      value={formatMoneyInput(calc.s)}
                      onChange={(e) => setSalary(parseMoneyInput(e.target.value))}
                      inputMode="numeric"
                      className="
                        h-10 w-full
                        rounded-[14px]
                        lg-border border border-white/18
                        bg-white/10
                        px-4
                        text-[13px]
                        font-semibold
                        text-white
                        shadow-[0_12px_35px_rgba(0,0,0,0.03)]
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
                            "rounded-full lg-border border border-white/18 px-3 py-1 text-[12px] font-semibold transition-[transform,opacity] duration-[600ms]",
                            "active:scale-[0.99]",
                            calc.s === v ? "bg-white/20 text-white" : "bg-white/10 text-white/80 hover:text-white",
                          ].join(" ")}
                        >
                          {formatRub(v).replace(" ₽", "")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* EXPANDED ONLY */}
                {expanded ? (
                  <>
                    {/* coeff */}
                    <div className="mt-5">
                      <div className="text-[12px] font-semibold text-white/85">Коэффициент накладных</div>

                      <div
                        className="
                          mt-3
                          rounded-[16px]
                          lg-border border border-white/18
                          bg-white/10
                          p-4
                          backdrop-blur-[22px] backdrop-saturate-150
                          shadow-[0_12px_35px_rgba(0,0,0,0.03)]
                        "
                      >
                        <div className="flex flex-wrap gap-2">
                          {[1.0, 1.2, 1.3, 1.5].map((v) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => setCoeff(v)}
                              className={[
                                "rounded-full lg-border border border-white/18 px-3 py-1 text-[12px] font-semibold transition-[transform,opacity] duration-[600ms]",
                                "active:scale-[0.99]",
                                Math.abs(coeff - v) < 0.001
                                  ? "bg-white/20 text-white"
                                  : "bg-white/10 text-white/80 hover:text-white",
                              ].join(" ")}
                            >
                              {v.toFixed(1)}
                            </button>
                          ))}

                          <div className="flex items-center gap-2">
                            <span className="text-[12px] text-white/70">свой:</span>
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
                                lg-border border border-white/18
                                bg-white/10
                                px-3
                                text-[12px]
                                font-semibold
                                text-white
                                outline-none
                              "
                            />
                          </div>
                        </div>

                        <div className="mt-3 text-[12px] text-white/65 leading-[1.35]">
                          Накладные: налоги, рабочее место, текучка, обучение, управленческие расходы.
                        </div>
                      </div>
                    </div>

                    {/* plan */}
                    <div className="mt-5">
                      <div className="text-[12px] font-semibold text-white/85">Тариф</div>

                      <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        {(["small", "mid", "enterprise"] as PlanKey[]).map((k) => {
                          const meta = PLAN_META[k];
                          const active = plan === k;
                          return (
                            <button
                              key={k}
                              type="button"
                              onClick={() => setPlan(k)}
                              className={[
                                "rounded-[16px] lg-border border border-white/18 p-3 text-left shadow-[0_12px_35px_rgba(0,0,0,0.03)] transition-[transform,opacity] duration-[650ms]",
                                "active:scale-[0.99]",
                                active ? "bg-white/20 text-white" : "bg-white/10 text-white/85 hover:text-white",
                              ].join(" ")}
                            >
                              <div className="text-[12px] font-semibold">{meta.title}</div>
                              <div className="mt-1 text-[12px] text-white/70">
                                {formatRub(meta.priceMonthly)} / мес
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* billing */}
                    <div className="mt-5">
                      <div className="text-[12px] font-semibold text-white/85">Оплата тарифа</div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setBilling("monthly")}
                          className={[
                            "h-10 rounded-[999px] lg-border border border-white/18 px-5 text-[13px] font-semibold transition-[transform,opacity] duration-[650ms]",
                            "active:scale-[0.99]",
                            billing === "monthly" ? "bg-white/20 text-white" : "bg-white/10 text-white/80 hover:text-white",
                          ].join(" ")}
                        >
                          Ежемесячно
                        </button>

                        <button
                          type="button"
                          onClick={() => setBilling("yearly")}
                          className={[
                            "h-10 rounded-[999px] lg-border border border-white/18 px-5 text-[13px] font-semibold transition-[transform,opacity] duration-[650ms]",
                            "active:scale-[0.99]",
                            billing === "yearly" ? "bg-white/20 text-white" : "bg-white/10 text-white/80 hover:text-white",
                          ].join(" ")}
                        >
                          Годовой (-20%)
                        </button>
                      </div>
                    </div>

                    {/* assumptions (new UI) */}
                    <div className="mt-5">
                      <div className="text-[12px] font-semibold text-white/85">Режим расчёта</div>

                      <div
                        className="
                          mt-3
                          rounded-[16px]
                          lg-border border border-white/18
                          bg-white/10
                          p-4
                          backdrop-blur-[22px] backdrop-saturate-150
                          shadow-[0_12px_35px_rgba(0,0,0,0.03)]
                        "
                      >
                        <div className="flex flex-wrap gap-2">
                          {[
                            { key: "full" as const, label: "100% функций", hint: "как в ТЗ", pct: 100 },
                            { key: "real" as const, label: "Реалистично", hint: "часть функций", pct: 70 },
                            { key: "cons" as const, label: "Консервативно", hint: "минимум замещения", pct: 45 },
                          ].map((x) => (
                            <button
                              key={x.key}
                              type="button"
                              onClick={() => setAssumptionMode(x.key)}
                              className={[
                                "rounded-[999px] lg-border border border-white/18 px-4 py-2 text-[12px] font-semibold transition-[transform,opacity] duration-[650ms]",
                                "active:scale-[0.99]",
                                assumptionMode === x.key
                                  ? "bg-white/20 text-white"
                                  : "bg-white/10 text-white/80 hover:text-white",
                              ].join(" ")}
                            >
                              {x.label} <span className="text-white/70">({x.pct}%)</span>
                            </button>
                          ))}
                        </div>

                        <div className="mt-3 text-[12px] text-white/65 leading-[1.35]">
                          Это не про увольнения. Это про долю задач, которые можно закрыть агентами.
                        </div>
                      </div>
                    </div>

                    {/* integration info */}
                    <div
                      className="
                        mt-5
                        rounded-[16px]
                        lg-border border border-white/18
                        bg-white/10
                        p-4
                        backdrop-blur-[22px] backdrop-saturate-150
                        shadow-[0_12px_35px_rgba(0,0,0,0.03)]
                      "
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-[12px] font-semibold text-white/85">
                          Интеграция (единовременно)
                        </div>
                        <div className="text-[12px] font-semibold text-white">{formatRub(INTEGRATION_COST)}</div>
                      </div>
                      <div className="mt-2 text-[12px] text-white/65 leading-[1.35]">
                        Аудит, ТЗ, база знаний, сборка MVP, тестирование и запуск.
                      </div>
                    </div>
                  </>
                ) : null}
              </div>

              {/* RIGHT */}
              <div
                className="
                  rounded-[26px]
                  lg-border border border-white/18
                  bg-white/10
                  p-5
                  backdrop-blur-[22px] backdrop-saturate-150
                  shadow-[0_16px_45px_rgba(0,0,0,0.03)]
                "
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[14px] font-semibold text-white">Результат</div>
                    <div className="mt-1 text-[12px] text-white/65">
                      Экономия и окупаемость
                    </div>
                  </div>

                  <div
                    className="
                      rounded-full
                      lg-border border border-white/18
                      bg-white/10
                      px-3 py-1
                      text-[12px]
                      font-semibold
                      text-white
                      shadow-[0_10px_26px_rgba(0,0,0,0.04)]
                      backdrop-blur-[18px] backdrop-saturate-150
                    "
                    title="Окупаемость интеграции"
                  >
                    {animPayback ? `Окупаемость: ${animPayback} мес` : "Окупаемость: нет"}
                  </div>
                </div>

                {/* Big savings */}
                <div
                  className="
                    mt-5
                    rounded-[22px]
                    lg-border border border-white/18
                    bg-white/10
                    p-5
                    backdrop-blur-[22px] backdrop-saturate-150
                    shadow-[0_18px_55px_rgba(0,0,0,0.03)]
                    relative overflow-hidden
                  "
                >
                  <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(520px_180px_at_25%_0%,rgba(255,255,255,0.20),transparent_60%),radial-gradient(520px_180px_at_85%_100%,rgba(199,63,64,0.10),transparent_65%)]" />

                  <div className="relative">
                    <div className="text-[12px] font-semibold text-white/70">Экономия за 1 год</div>

                    <div className="mt-2 flex flex-wrap items-end gap-3">
                      <div
                        className={[
                          "text-[28px] sm:text-[34px] font-semibold tracking-[-0.02em]",
                          isBad ? "text-[#ff6b6b]" : "text-[#28df7c]",
                        ].join(" ")}
                      >
                        {formatRub(animSavings1)}
                      </div>

                      <div className="pb-[6px] text-[14px] font-semibold text-white">
                        {`${animSavings1Pct.toFixed(1)}%`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* EXPANDED ONLY: extra blocks */}
                {expanded ? (
                  <>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div
                        className="
                          rounded-[18px]
                          lg-border border border-white/18
                          bg-white/10
                          p-4
                          backdrop-blur-[22px] backdrop-saturate-150
                          shadow-[0_12px_35px_rgba(0,0,0,0.03)]
                        "
                      >
                        <div className="text-[12px] font-semibold text-white/70">Экономия за 3 года</div>
                        <div className="mt-2 text-[16px] font-semibold text-white">{formatRub(animSav3)}</div>
                        <div className="mt-1 text-[12px] text-white/65">{`${animSav3Pct.toFixed(1)}%`}</div>
                      </div>

                      <div
                        className="
                          rounded-[18px]
                          lg-border border border-white/18
                          bg-white/10
                          p-4
                          backdrop-blur-[22px] backdrop-saturate-150
                          shadow-[0_12px_35px_rgba(0,0,0,0.03)]
                        "
                      >
                        <div className="text-[12px] font-semibold text-white/70">Экономия за 5 лет</div>
                        <div className="mt-2 text-[16px] font-semibold text-white">{formatRub(animSav5)}</div>
                        <div className="mt-1 text-[12px] text-white/65">{`${animSav5Pct.toFixed(1)}%`}</div>
                      </div>
                    </div>

                    <HorizonChart y1={calc.savings1} y3={calc.sav3} y5={calc.sav5} />

                    <div className="mt-4 text-[12px] text-white/55 leading-[1.35]">
                      Числа для оценки. Итог зависит от сценариев, качества базы знаний и глубины интеграций.
                    </div>
                  </>
                ) : (
                  <div className="mt-4 text-[12px] text-white/60 leading-[1.35]">
                    Разверни, чтобы настроить накладные, тариф, режим расчёта и увидеть горизонты 3/5 лет.
                  </div>
                )}
              </div>
            </div>

            {/* center blinking button on glass */}
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="
                absolute left-1/2 bottom-[18px]
                rounded-[999px]
                lg-border border border-white/18
                bg-white/18
                px-6 py-3
                text-[13px] font-semibold
                text-white
                shadow-[0_22px_70px_rgba(0,0,0,0.18)]
                backdrop-blur-[26px] backdrop-saturate-150
                hover:bg-white/22
                active:scale-[0.99]
              "
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
