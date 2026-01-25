"use client";

import React from "react";

type Billing = "monthly" | "yearly";
type PlanKey = "small" | "mid" | "enterprise";

const INTEGRATION_COST = 179_990;

const PLAN_META: Record<
  PlanKey,
  { title: string; priceMonthly: number; badge?: string }
> = {
  small: { title: "Малый", priceMonthly: 9_900, badge: "SMB" },
  mid: { title: "Средний", priceMonthly: 39_900, badge: "Most popular" },
  enterprise: { title: "Энтерпрайз", priceMonthly: 99_900, badge: "White-glove" },
};

function formatRub(v: number) {
  const n = Math.round(v);
  return `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;
}

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

function parseMoneyInput(raw: string) {
  // оставляем только цифры
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

    // если мало изменилось, не анимируем
    if (Math.abs(to - from) < 0.5) {
      setVal(to);
      prevRef.current = to;
      return;
    }

    const start = performance.now();
    const dur = clamp(durationMs, 220, 1200);

    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const t = clamp((now - start) / dur, 0, 1);
      const e = ease(t);
      const next = from + (to - from) * e;
      setVal(next);

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

function DotBullet({ className = "" }: { className?: string }) {
  // стабильное выравнивание маркера по первой строке
  return (
    <span
      aria-hidden="true"
      className={[
        "h-[7px] w-[7px] shrink-0 rounded-full bg-[#c73f40]/70",
        "relative top-[0.42em]", // лучше, чем mt-*, потому что не “плавает” на разных line-height
        className,
      ].join(" ")}
    />
  );
}

function MiniBars({
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
  const max = Math.max(leftValue, rightValue, 1);
  const lh = clamp((leftValue / max) * 100, 6, 100);
  const rh = clamp((rightValue / max) * 100, 6, 100);

  return (
    <div className="mt-4">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <div className="h-[88px] rounded-[14px] border border-black/10 bg-white/55 p-2 shadow-[0_16px_45px_rgba(0,0,0,0.02)]">
            <div
              className="h-full w-full rounded-[10px] bg-black/10"
              style={{ overflow: "hidden" }}
            >
              <div
                className="h-full w-full origin-bottom"
                style={{
                  transform: `scaleY(${lh / 100})`,
                  background:
                    "radial-gradient(220px 100px at 30% 0%, rgba(255,255,255,0.55), transparent 60%), rgba(15,23,42,0.16)",
                }}
              />
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-[12px] text-[#667085]">
            <span className="font-semibold text-[#0f172a]">{leftLabel}</span>
            <span>{formatRub(leftValue)}</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="h-[88px] rounded-[14px] border border-black/10 bg-white/55 p-2 shadow-[0_16px_45px_rgba(0,0,0,0.02)]">
            <div
              className="h-full w-full rounded-[10px] bg-black/10"
              style={{ overflow: "hidden" }}
            >
              <div
                className="h-full w-full origin-bottom"
                style={{
                  transform: `scaleY(${rh / 100})`,
                  background:
                    "radial-gradient(220px 100px at 30% 0%, rgba(255,255,255,0.55), transparent 60%), rgba(199,63,64,0.22)",
                }}
              />
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-[12px] text-[#667085]">
            <span className="font-semibold text-[#0f172a]">{rightLabel}</span>
            <span>{formatRub(rightValue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SmallTrend({
  y1,
  y3,
  y5,
}: {
  y1: number;
  y3: number;
  y5: number;
}) {
  // три “точки” экономии (накопительно), аккуратно, без библиотек
  const max = Math.max(Math.abs(y1), Math.abs(y3), Math.abs(y5), 1);
  const p1 = clamp((y1 / max) * 50 + 50, 4, 96);
  const p3 = clamp((y3 / max) * 50 + 50, 4, 96);
  const p5 = clamp((y5 / max) * 50 + 50, 4, 96);

  const isBad = y1 < 0 && y3 < 0 && y5 < 0;

  return (
    <div className="mt-4 rounded-[16px] border border-black/10 bg-white/55 p-4 shadow-[0_16px_45px_rgba(0,0,0,0.02)]">
      <div className="text-[12px] font-semibold text-[#0f172a]">
        Экономия в горизонте
      </div>

      <div className="mt-3 h-[64px] w-full rounded-[14px] border border-black/10 bg-white/70 p-2">
        <div className="relative h-full w-full rounded-[10px] bg-black/5">
          <div
            className="absolute inset-0 rounded-[10px] opacity-70"
            style={{
              background:
                "radial-gradient(220px 70px at 20% 0%, rgba(255,255,255,0.65), transparent 60%)",
            }}
          />

          {/* линия */}
          <div
            className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 opacity-70"
            style={{ background: "rgba(15,23,42,0.08)" }}
          />

          {/* “поли-линия” (условно) */}
          <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d={`M 12 ${100 - p1} L 50 ${100 - p3} L 88 ${100 - p5}`}
              fill="none"
              stroke={isBad ? "rgba(199,63,64,0.55)" : "rgba(40,223,124,0.50)"}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* точки */}
          {[
            { x: 12, y: 100 - p1, label: "1 год" },
            { x: 50, y: 100 - p3, label: "3 года" },
            { x: 88, y: 100 - p5, label: "5 лет" },
          ].map((pt) => (
            <div
              key={pt.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
            >
              <div
                className="h-[10px] w-[10px] rounded-full border border-black/10"
                style={{
                  background: isBad ? "rgba(199,63,64,0.65)" : "rgba(40,223,124,0.65)",
                  boxShadow: "0 10px 26px rgba(0,0,0,0.06)",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-[12px] text-[#667085]">
        <div className="rounded-[12px] border border-black/10 bg-white/70 p-2">
          <div className="font-semibold text-[#0f172a]">1 год</div>
          <div className="mt-1">{formatRub(y1)}</div>
        </div>
        <div className="rounded-[12px] border border-black/10 bg-white/70 p-2">
          <div className="font-semibold text-[#0f172a]">3 года</div>
          <div className="mt-1">{formatRub(y3)}</div>
        </div>
        <div className="rounded-[12px] border border-black/10 bg-white/70 p-2">
          <div className="font-semibold text-[#0f172a]">5 лет</div>
          <div className="mt-1">{formatRub(y5)}</div>
        </div>
      </div>
    </div>
  );
}

export default function RoiCalculatorSection() {
  const [managers, setManagers] = React.useState<number>(3);
  const [salary, setSalary] = React.useState<number>(50_000);

  const [coeffMode, setCoeffMode] = React.useState<"preset" | "custom">("preset");
  const [coeffPreset, setCoeffPreset] = React.useState<number>(1.3);
  const [coeffCustom, setCoeffCustom] = React.useState<number>(1.3);

  const [plan, setPlan] = React.useState<PlanKey>("mid");
  const [billing, setBilling] = React.useState<Billing>("monthly");

  const [advancedOpen, setAdvancedOpen] = React.useState(false);
  const [replaceShare, setReplaceShare] = React.useState<number>(1); // 1 = 100%

  const coeff = coeffMode === "custom" ? coeffCustom : coeffPreset;

  const calc = React.useMemo(() => {
    const safeManagers = clamp(Math.round(managers), 1, 10);
    const safeSalary = Math.max(0, Math.round(salary));
    const safeCoeff = clamp(Number(coeff) || 1, 0.8, 2.2);

    const share = clamp(replaceShare, 0.2, 1);

    const peopleMonthly = safeManagers * safeSalary * safeCoeff;
    const peopleYear = peopleMonthly * 12;

    const peopleYearForCompare = advancedOpen ? peopleYear * share : peopleYear;

    const planMonthly = PLAN_META[plan].priceMonthly;
    const planAnnual = billing === "monthly" ? planMonthly * 12 : planMonthly * 12 * 0.8;

    const year1Uni = planAnnual + INTEGRATION_COST;
    const year2Uni = planAnnual;

    const savings1 = peopleYearForCompare - year1Uni;
    const savings1Pct =
      peopleYearForCompare > 0 ? (savings1 / peopleYearForCompare) * 100 : 0;

    const uni3 = year1Uni + year2Uni * 2;
    const uni5 = year1Uni + year2Uni * 4;

    const people3 = peopleYearForCompare * 3;
    const people5 = peopleYearForCompare * 5;

    const sav3 = people3 - uni3;
    const sav5 = people5 - uni5;

    const sav3Pct = people3 > 0 ? (sav3 / people3) * 100 : 0;
    const sav5Pct = people5 > 0 ? (sav5 / people5) * 100 : 0;

    // окупаемость интеграции (месяцев)
    const planMonthlyEffective = billing === "monthly" ? planMonthly : planMonthly * 0.8;
    const peopleMonthlyForCompare = advancedOpen ? peopleMonthly * share : peopleMonthly;

    const monthlySaving = peopleMonthlyForCompare - planMonthlyEffective;
    const paybackMonths =
      monthlySaving > 0 ? Math.ceil(INTEGRATION_COST / monthlySaving) : null;

    // порог окупаемости по кол-ву менеджеров (в рамках текущих salary/coeff/plan/billing/share)
    let thresholdManagers: number | null = null;
    for (let m = 1; m <= 10; m++) {
      const pm = m * safeSalary * safeCoeff;
      const py = pm * 12;
      const base = advancedOpen ? py * share : py;
      if (base >= year1Uni) {
        thresholdManagers = m;
        break;
      }
    }

    return {
      safeManagers,
      safeSalary,
      safeCoeff,
      share,

      peopleMonthlyForCompare,
      peopleYearForCompare,

      planMonthly,
      planAnnual,

      year1Uni,
      year2Uni,

      savings1,
      savings1Pct,

      people3,
      people5,
      uni3,
      uni5,
      sav3,
      sav5,
      sav3Pct,
      sav5Pct,

      monthlySaving,
      paybackMonths,
      thresholdManagers,
    };
  }, [
    managers,
    salary,
    coeff,
    plan,
    billing,
    advancedOpen,
    replaceShare,
  ]);

  const animSavings1 = useCountUp(calc.savings1, 720);
  const animSavings1Pct = useCountUp(calc.savings1Pct, 720);

  const animYear1 = useCountUp(calc.year1Uni, 650);
  const animYear2 = useCountUp(calc.year2Uni, 650);

  const animPeopleYear = useCountUp(calc.peopleYearForCompare, 650);

  const animSav3 = useCountUp(calc.sav3, 720);
  const animSav3Pct = useCountUp(calc.sav3Pct, 720);
  const animSav5 = useCountUp(calc.sav5, 720);
  const animSav5Pct = useCountUp(calc.sav5Pct, 720);

  const isBad = calc.savings1 < 0;

  return (
    <section id="roi" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-[1240px] px-4">
        <div className="mx-auto max-w-[1240px] text-center">
          <h2 className="text-white font-semibold leading-[0.95] tracking-[-0.02em] text-[24px] sm:text-[32px] lg:text-[42px]">
            ROI-калькулятор
          </h2>

          <div className="mt-2 text-white/70 font-semibold tracking-[-0.01em] text-[13px] sm:text-[16px]">
            Сравниваем годовую стоимость людей и ЮНИ, включая накладные и интеграцию.
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
              shadow-[0_22px_70px_rgba(0,0,0,0.05)]
              backdrop-blur-[26px] backdrop-saturate-150
            "
          >
            <div className="pointer-events-none absolute inset-0 rounded-[40px] ring-1 ring-white/10" />
            <div className="pointer-events-none absolute inset-0 rounded-[40px] opacity-70 bg-[radial-gradient(900px_420px_at_20%_0%,rgba(255,255,255,0.10),transparent_60%),radial-gradient(900px_420px_at_80%_100%,rgba(199,63,64,0.08),transparent_65%)]" />

            <div className="relative grid gap-4 rounded-[34px] bg-white/70 p-6 lg:grid-cols-[1.05fr_0.95fr]">
              {/* LEFT: inputs */}
              <div className="rounded-[26px] border border-black/10 bg-white/55 p-5 shadow-[0_16px_45px_rgba(0,0,0,0.02)]">
                <div className="text-[14px] font-semibold text-[#0f172a]">
                  Входные параметры
                </div>

                {/* managers */}
                <div className="mt-5">
                  <div className="flex items-end justify-between gap-3">
                    <div className="text-[12px] font-semibold text-[#0f172a]">
                      Кол-во менеджеров
                    </div>
                    <div className="text-[12px] font-semibold text-[#c73f40]">
                      {calc.safeManagers}
                    </div>
                  </div>

                  <div className="mt-3 rounded-[16px] border border-black/10 bg-white/65 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.02)]">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={calc.safeManagers}
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
                            "rounded-full border px-3 py-1 text-[12px] font-semibold transition-[transform,color,background-color] duration-[600ms]",
                            "active:scale-[0.99]",
                            calc.safeManagers === m
                              ? "border-[#c73f40]/40 bg-[#c73f40]/10 text-[#0f172a]"
                              : "border-black/10 bg-white text-[#667085] hover:text-[#0f172a]",
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
                  <div className="text-[12px] font-semibold text-[#0f172a]">
                    ФОТ одного менеджера (₽/мес)
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
                    <input
                      value={formatMoneyInput(calc.safeSalary)}
                      onChange={(e) => setSalary(parseMoneyInput(e.target.value))}
                      inputMode="numeric"
                      className="
                        h-10 w-full
                        rounded-[14px]
                        border border-black/10
                        bg-white/70
                        px-4
                        text-[13px]
                        font-semibold
                        text-[#0f172a]
                        shadow-[0_12px_35px_rgba(0,0,0,0.02)]
                        outline-none
                        focus:border-[#c73f40]/35
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
                            "rounded-full border px-3 py-1 text-[12px] font-semibold transition-[transform,color,background-color] duration-[600ms]",
                            "active:scale-[0.99]",
                            calc.safeSalary === v
                              ? "border-[#c73f40]/40 bg-[#c73f40]/10 text-[#0f172a]"
                              : "border-black/10 bg-white text-[#667085] hover:text-[#0f172a]",
                          ].join(" ")}
                        >
                          {formatRub(v).replace(" ₽", "")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* coeff */}
                <div className="mt-5">
                  <div className="text-[12px] font-semibold text-[#0f172a]">
                    Коэффициент накладных
                  </div>

                  <div className="mt-3 rounded-[16px] border border-black/10 bg-white/65 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.02)]">
                    <div className="flex flex-wrap gap-2">
                      {[1.0, 1.2, 1.3, 1.5].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            setCoeffMode("preset");
                            setCoeffPreset(v);
                          }}
                          className={[
                            "rounded-full border px-3 py-1 text-[12px] font-semibold transition-[transform,color,background-color] duration-[600ms]",
                            "active:scale-[0.99]",
                            coeffMode === "preset" && coeffPreset === v
                              ? "border-[#c73f40]/40 bg-[#c73f40]/10 text-[#0f172a]"
                              : "border-black/10 bg-white text-[#667085] hover:text-[#0f172a]",
                          ].join(" ")}
                        >
                          {v.toFixed(1)}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => setCoeffMode("custom")}
                        className={[
                          "rounded-full border px-3 py-1 text-[12px] font-semibold transition-[transform,color,background-color] duration-[600ms]",
                          "active:scale-[0.99]",
                          coeffMode === "custom"
                            ? "border-[#c73f40]/40 bg-[#c73f40]/10 text-[#0f172a]"
                            : "border-black/10 bg-white text-[#667085] hover:text-[#0f172a]",
                        ].join(" ")}
                      >
                        Свой
                      </button>
                    </div>

                    {coeffMode === "custom" ? (
                      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
                        <input
                          value={String(coeffCustom)}
                          onChange={(e) => {
                            const raw = e.target.value.replace(",", ".");
                            const n = Number(raw);
                            setCoeffCustom(Number.isFinite(n) ? n : 1.3);
                          }}
                          inputMode="decimal"
                          className="
                            h-10 w-full
                            rounded-[14px]
                            border border-black/10
                            bg-white/70
                            px-4
                            text-[13px]
                            font-semibold
                            text-[#0f172a]
                            shadow-[0_12px_35px_rgba(0,0,0,0.02)]
                            outline-none
                            focus:border-[#c73f40]/35
                          "
                          aria-label="Коэффициент накладных (свой)"
                        />
                        <div className="text-[12px] text-[#667085]">
                          обычно 1.2–1.5
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 text-[12px] text-[#667085] leading-[1.35]">
                        Накладные: налоги, рабочее место, текучка, обучение, управленческие расходы.
                      </div>
                    )}
                  </div>
                </div>

                {/* plan */}
                <div className="mt-5">
                  <div className="text-[12px] font-semibold text-[#0f172a]">Тариф</div>

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
                            "rounded-[16px] border p-3 text-left shadow-[0_12px_35px_rgba(0,0,0,0.02)] transition-[transform,background-color,border-color] duration-[700ms]",
                            "active:scale-[0.99]",
                            active
                              ? "border-[#c73f40]/45 bg-white/80"
                              : "border-black/10 bg-white/65 hover:bg-white/75",
                          ].join(" ")}
                        >
                          <div className="text-[12px] font-semibold text-[#0f172a]">
                            {meta.title}
                          </div>
                          <div className="mt-1 text-[12px] text-[#667085]">
                            {formatRub(meta.priceMonthly)} / мес
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* billing */}
                <div className="mt-5">
                  <div className="text-[12px] font-semibold text-[#0f172a]">
                    Оплата тарифа
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setBilling("monthly")}
                      className={[
                        "h-10 rounded-[999px] px-5 text-[13px] font-semibold transition-[transform,background-color,color] duration-[800ms]",
                        "active:scale-[0.99]",
                        billing === "monthly"
                          ? "bg-white/85 text-[#0f172a] border border-black/10 shadow-[0_12px_35px_rgba(0,0,0,0.02)]"
                          : "bg-white/60 text-[#667085] border border-black/10 hover:text-[#0f172a]",
                      ].join(" ")}
                    >
                      Ежемесячно
                    </button>

                    <button
                      type="button"
                      onClick={() => setBilling("yearly")}
                      className={[
                        "h-10 rounded-[999px] px-5 text-[13px] font-semibold transition-[transform,background-color,color] duration-[800ms]",
                        "active:scale-[0.99]",
                        billing === "yearly"
                          ? "bg-white/85 text-[#c73f40] border border-black/10 shadow-[0_12px_35px_rgba(0,0,0,0.02)]"
                          : "bg-white/60 text-[#667085] border border-black/10 hover:text-[#0f172a]",
                      ].join(" ")}
                    >
                      Годовой (-20%)
                    </button>
                  </div>
                </div>

                {/* integration */}
                <div className="mt-5 rounded-[16px] border border-black/10 bg-white/65 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[12px] font-semibold text-[#0f172a]">
                      Интеграция (единовременно)
                    </div>
                    <div className="text-[12px] font-semibold text-[#0f172a]">
                      {formatRub(INTEGRATION_COST)}
                    </div>
                  </div>
                  <div className="mt-2 text-[12px] text-[#667085] leading-[1.35]">
                    Входит аудит, ТЗ, подготовка базы знаний, сборка MVP, тестирование и запуск.
                  </div>
                </div>

                {/* advanced */}
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setAdvancedOpen((v) => !v)}
                    className="
                      inline-flex items-center gap-2
                      text-[12px] font-semibold
                      text-[#0f172a]
                      hover:text-[#c73f40]
                      transition-colors duration-[600ms]
                    "
                  >
                    {advancedOpen ? "Скрыть допущения" : "Показать допущения"}
                    <span className="text-[#98A2B3]">(реалистичный режим)</span>
                  </button>

                  {advancedOpen ? (
                    <div className="mt-3 rounded-[16px] border border-black/10 bg-white/65 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.02)]">
                      <div className="flex items-end justify-between gap-3">
                        <div className="text-[12px] font-semibold text-[#0f172a]">
                          Доля замещения функций
                        </div>
                        <div className="text-[12px] font-semibold text-[#c73f40]">
                          {Math.round(calc.share * 100)}%
                        </div>
                      </div>

                      <div className="mt-3">
                        <input
                          type="range"
                          min={20}
                          max={100}
                          step={5}
                          value={Math.round(calc.share * 100)}
                          onChange={(e) => setReplaceShare(Number(e.target.value) / 100)}
                          className="w-full accent-[#c73f40]"
                        />
                        <div className="mt-2 text-[12px] text-[#667085] leading-[1.35]">
                          Это не про “уволить всех”, а про то, какую часть функций закрываем агентами.
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* RIGHT: results */}
              <div className="rounded-[26px] border border-black/10 bg-white/55 p-5 shadow-[0_16px_45px_rgba(0,0,0,0.02)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[14px] font-semibold text-[#0f172a]">
                      Результат
                    </div>
                    <div className="mt-1 text-[12px] text-[#667085]">
                      Сравнение по годовой стоимости
                    </div>
                  </div>

                  {/* payback chip */}
                  <div
                    className={[
                      "relative overflow-hidden rounded-full border px-3 py-1 text-[12px] font-semibold",
                      "bg-white/75 shadow-[0_10px_26px_rgba(0,0,0,0.04)]",
                      isBad ? "border-[#c73f40]/30 text-[#c73f40]" : "border-black/10 text-[#0f172a]",
                      "uni-shine",
                    ].join(" ")}
                    title="Окупаемость интеграции"
                  >
                    {calc.paybackMonths
                      ? `Окупаемость: ${calc.paybackMonths} мес`
                      : "Окупаемость: нет"}
                  </div>
                </div>

                {/* Big savings */}
                <div
                  className={[
                    "mt-5 rounded-[20px] border p-5",
                    "bg-white/75 shadow-[0_18px_55px_rgba(0,0,0,0.03)]",
                    isBad ? "border-[#c73f40]/25" : "border-black/10",
                    "relative overflow-hidden",
                  ].join(" ")}
                >
                  <div className="pointer-events-none absolute inset-0 opacity-70 uni-shine" />

                  <div className="relative">
                    <div className="text-[12px] font-semibold text-[#667085]">
                      Экономия за 1 год
                    </div>

                    <div className="mt-2 flex flex-wrap items-end gap-3">
                      <div
                        className={[
                          "text-[28px] sm:text-[34px] font-semibold tracking-[-0.02em]",
                          isBad ? "text-[#c73f40]" : "text-[#28df7c]",
                        ].join(" ")}
                      >
                        {formatRub(animSavings1)}
                      </div>

                      <div
                        className={[
                          "pb-[6px] text-[14px] font-semibold",
                          isBad ? "text-[#c73f40]" : "text-[#0f172a]",
                        ].join(" ")}
                      >
                        {`${animSavings1Pct.toFixed(1)}%`}
                      </div>
                    </div>

                    {calc.thresholdManagers ? (
                      <div className="mt-3 text-[12px] text-[#667085]">
                        Окупается от <span className="font-semibold text-[#0f172a]">{calc.thresholdManagers}</span>{" "}
                        менеджеров при текущих параметрах.
                      </div>
                    ) : (
                      <div className="mt-3 text-[12px] text-[#667085]">
                        Попробуй увеличить число менеджеров или ФОТ, либо выбрать другой тариф.
                      </div>
                    )}
                  </div>
                </div>

                {/* Costs */}
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[18px] border border-black/10 bg-white/70 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.02)]">
                    <div className="text-[12px] font-semibold text-[#667085]">
                      Стоимость 1-го года (ЮНИ)
                    </div>
                    <div className="mt-2 text-[16px] font-semibold text-[#0f172a]">
                      {formatRub(animYear1)}
                    </div>
                    <div className="mt-2 text-[12px] text-[#98A2B3]">
                      Тариф + интеграция
                    </div>
                  </div>

                  <div className="rounded-[18px] border border-black/10 bg-white/70 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.02)]">
                    <div className="text-[12px] font-semibold text-[#667085]">
                      Стоимость 2-го года (ЮНИ)
                    </div>
                    <div className="mt-2 text-[16px] font-semibold text-[#0f172a]">
                      {formatRub(animYear2)}
                    </div>
                    <div className="mt-2 text-[12px] text-[#98A2B3]">
                      Только тариф
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-[18px] border border-black/10 bg-white/70 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.02)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[12px] font-semibold text-[#667085]">
                        ФОТ людей за 1 год
                      </div>
                      <div className="mt-2 text-[16px] font-semibold text-[#0f172a]">
                        {formatRub(animPeopleYear)}
                      </div>
                    </div>

                    <div className="text-right text-[12px] text-[#98A2B3] leading-[1.35]">
                      {advancedOpen ? "учтена доля замещения" : "100% функций"}
                    </div>
                  </div>

                  <MiniBars
                    leftLabel="Люди"
                    rightLabel="ЮНИ"
                    leftValue={calc.peopleYearForCompare}
                    rightValue={calc.year1Uni}
                  />
                </div>

                {/* 3y / 5y */}
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[18px] border border-black/10 bg-white/70 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.02)]">
                    <div className="text-[12px] font-semibold text-[#667085]">
                      Экономия за 3 года
                    </div>
                    <div
                      className={[
                        "mt-2 text-[16px] font-semibold",
                        animSav3 < 0 ? "text-[#c73f40]" : "text-[#0f172a]",
                      ].join(" ")}
                    >
                      {formatRub(animSav3)}
                    </div>
                    <div className="mt-1 text-[12px] text-[#98A2B3]">
                      {`${animSav3Pct.toFixed(1)}%`}
                    </div>
                  </div>

                  <div className="rounded-[18px] border border-black/10 bg-white/70 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.02)]">
                    <div className="text-[12px] font-semibold text-[#667085]">
                      Экономия за 5 лет
                    </div>
                    <div
                      className={[
                        "mt-2 text-[16px] font-semibold",
                        animSav5 < 0 ? "text-[#c73f40]" : "text-[#0f172a]",
                      ].join(" ")}
                    >
                      {formatRub(animSav5)}
                    </div>
                    <div className="mt-1 text-[12px] text-[#98A2B3]">
                      {`${animSav5Pct.toFixed(1)}%`}
                    </div>
                  </div>
                </div>

                <SmallTrend y1={calc.savings1} y3={calc.sav3} y5={calc.sav5} />

                <div className="mt-4 text-[12px] text-[#98A2B3] leading-[1.35]">
                  Числа для оценки. Итог зависит от сценариев, качества базы знаний и глубины интеграций.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* быстрый якорь/CTA под секцией можно добавить позже */}
      </div>
    </section>
  );
}
