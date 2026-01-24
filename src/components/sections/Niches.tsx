"use client";

import React from "react";

type Props = {
  onSelectNiche?: (niche: string) => void;
  value?: string;
};

type PillItem =
  | { kind?: "niche"; label: string }
  | { kind: "loading"; label?: string };

const PILL_ITEMS: PillItem[] = [
  { label: "Ремонт коммерческих помещений" },
  { label: "Автосервис" },
  { label: "Обслуживание мобильных устройств" },
  { label: "Аренда квартир" },
  { label: "Стоматологическая клиника" },
  { label: "Груминг" },
  { label: "Производство (b2b)" },
  { label: "Онлайн-школа" },
  { label: "Детейлинг-студия" },
  { label: "Магазин одежды" },
  { kind: "loading" },
];

export default function NichesBlock({ onSelectNiche, value }: Props) {
  const [internalValue, setInternalValue] = React.useState<string>("");
  const selected = value ?? internalValue;

  const selectNiche = (niche: string) => {
    setInternalValue(niche);
    onSelectNiche?.(niche);
    window.dispatchEvent(new CustomEvent("uni:niche-select", { detail: { niche } }));
  };

  return (
    <section id="niches" className="relative py-14 md:py-20">
      {/* локальные keyframes (чтобы не ломать globals.css) */}
      <style>{`
        @keyframes uniLoaderFlow {
          0%   { background-position: 0% 50%; opacity: .70; }
          50%  { opacity: 1; }
          100% { background-position: 100% 50%; opacity: .70; }
        }
      `}</style>

      <div className="mx-auto max-w-[1240px] px-4">
        {/* Заголовок (как ты задал) */}
        <div className="mx-auto max-w-[980px] text-center">
          <h2 className="text-white font-semibold leading-[0.95] tracking-[-0.02em] text-[24px] sm:text-[32px] lg:text-[42px]">
            Готовые настройки
          </h2>
          <div className="mt-1 text-white font-semibold tracking-[-0.01em] text-[16px] sm:text-[28px] lg:text-[28px]">
            для самых разных направлений
          </div>
        </div>

        <div className="relative mt-10 md:mt-12">
          {/* мягкая “подложка-облако” */}
          <div
            className="
              pointer-events-none absolute left-1/2 top-1/2
              h-[280px] w-[980px] -translate-x-1/2 -translate-y-1/2
              rounded-[999px]
              bg-black/06 blur-[80px] opacity-30
            "
          />

          <div className="relative mx-auto flex max-w-[980px] flex-wrap justify-center gap-x-6 gap-y-6">
            {PILL_ITEMS.map((item, idx) => {
              if (item.kind === "loading") {
                return <LoadingPill key={`loading-${idx}`} />;
              }

              const isActive = item.label === selected;

              return (
                <NichePill
                  key={item.label}
                  active={isActive}
                  onClick={() => selectNiche(item.label)}
                >
                  {item.label}
                </NichePill>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function NichePill({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`
        relative inline-flex items-center justify-center
        rounded-[999px]
        p-[10px]
        border border-white/22
        bg-white/10
        backdrop-blur-[22px] backdrop-saturate-150
        shadow-[0_22px_70px_rgba(0,0,0,0.05)]
        lg-border
        transition-[transform] duration-[900ms]
        ease-out
        hover:scale-[1.08] active:scale-[0.98]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60
        ${active ? "ring-1 ring-[#c73f40]/20" : ""}
      `}
    >
      {/* тонкий внутренний хайлайт как “дорогая пластика” */}
      <span className="pointer-events-none absolute inset-0 rounded-[999px] ring-1 ring-white/12" />
      <span className="pointer-events-none absolute inset-0 rounded-[999px] opacity-70 bg-[radial-gradient(900px_220px_at_25%_0%,rgba(255,255,255,0.10),transparent_60%),radial-gradient(900px_220px_at_80%_100%,rgba(199,63,64,0.06),transparent_65%)]" />

      {/* белая “пилюля” внутри */}
      <span
        className={`
          relative z-10 inline-flex items-center justify-center
          rounded-full
          px-8 py-3
          bg-white/82
          border
          ${active ? "border-[#c73f40]/18" : "border-black/10"}
          shadow-[0_16px_45px_rgba(0,0,0,0.06)]
          text-[14px] sm:text-[15px]
          font-[400]
          whitespace-nowrap
          transition-colors duration-[1200ms] ease-out
          ${active ? "text-[#c73f40]" : "text-[#0f172a]"}
          hover:text-[#c73f40]
        `}
      >
        {children}
      </span>
    </button>
  );
}

function LoadingPill() {
  return (
    <div
      className="
        relative inline-flex items-center justify-center
        rounded-[999px]
        p-[10px]
        border border-white/22
        bg-white/10
        backdrop-blur-[22px] backdrop-saturate-150
        shadow-[0_22px_70px_rgba(0,0,0,0.05)]
        lg-border
      "
      aria-hidden="true"
    >
      <span className="pointer-events-none absolute inset-0 rounded-[999px] ring-1 ring-white/12" />
      <span className="pointer-events-none absolute inset-0 rounded-[999px] opacity-70 bg-[radial-gradient(900px_220px_at_25%_0%,rgba(255,255,255,0.10),transparent_60%),radial-gradient(900px_220px_at_80%_100%,rgba(177,207,235,0.10),transparent_65%)]" />

      {/* внутренняя белая пилюля (как у остальных) */}
      <div
        className="
          relative z-10 inline-flex items-center justify-center
          rounded-full
          h-12 px-8
          bg-white/82
          border border-black/10
          shadow-[0_16px_45px_rgba(0,0,0,0.06)]
          min-w-[220px]
        "
      >
        {/* “дорогая” загрузка: мягкий перелив внутри полоски */}
        <div className="relative h-[10px] w-[170px] overflow-hidden rounded-full bg-black/10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(199,63,64,0.00), rgba(199,63,64,0.18), rgba(177,207,235,0.85), rgba(199,63,64,0.18), rgba(199,63,64,0.00))",
              backgroundSize: "220% 100%",
              filter: "blur(0.2px)",
              animation: "uniLoaderFlow 20.0s cubic-bezier(0.16,1,0.3,1) infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}
