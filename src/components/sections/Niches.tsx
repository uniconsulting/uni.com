"use client";

import React from "react";

type Props = {
  /** Если хочешь связать с демо-чатом напрямую, можешь передать колбек */
  onSelectNiche?: (niche: string) => void;
  /** Опционально: подсветка выбранной ниши извне */
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

  // последняя “пилюля-загрузка”
  { kind: "loading" },
];

export default function NichesBlock({ onSelectNiche, value }: Props) {
  const [internalValue, setInternalValue] = React.useState<string>("");
  const selected = value ?? internalValue;

  const selectNiche = (niche: string) => {
    setInternalValue(niche);
    onSelectNiche?.(niche);

    // Для секции "6. Демо-чат": можно слушать window.addEventListener("uni:niche-select", ...)
    window.dispatchEvent(new CustomEvent("uni:niche-select", { detail: { niche } }));
  };

  return (
    <section id="niches" className="relative py-14 md:py-20">
      {/* локальная анимация shimmer, чтобы не лезть в globals.css */}
      <style>{`
        @keyframes uniShimmer {
          0% { transform: translateX(-60%); opacity: .65; }
          50% { opacity: 1; }
          100% { transform: translateX(60%); opacity: .65; }
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
          {/* мягкая “подложка-облако” под пилюли */}
          <div
            className="
              pointer-events-none absolute left-1/2 top-1/2
              h-[260px] w-[980px] -translate-x-1/2 -translate-y-1/2
              rounded-[999px]
              bg-black/10 blur-[70px] opacity-35
            "
          />

          <div className="relative mx-auto flex max-w-[980px] flex-wrap justify-center gap-x-4 gap-y-4">
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
      className={`
        relative inline-flex select-none items-center justify-center
        rounded-full px-7 py-3
        whitespace-nowrap
        text-[14px] sm:text-[15px]
        font-[400]
        transition-[transform,color,background-color,border-color,box-shadow] duration-[900ms] ease-out
        hover:scale-[1.06] active:scale-[0.98]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60
        ${active ? "scale-[1.02]" : ""}
      `}
      aria-pressed={active}
    >
      {/* “тело” пилюли */}
      <span
        className={`
          relative z-10 inline-flex items-center justify-center
          rounded-full px-7 py-3
          ${active ? "text-[#c73f40]" : "text-[#0f172a]"}
          hover:text-[#c73f40]
          bg-white/70
          backdrop-blur-[18px] backdrop-saturate-150
          shadow-[0_18px_55px_rgba(0,0,0,0.06)]
          border
          ${active ? "border-[#c73f40]/25" : "border-black/10"}
          lg-border
        `}
      >
        {children}
      </span>

      {/* очень тонкий внутренний хайлайт (дороговизна) */}
      <span
        className={`
          pointer-events-none absolute inset-0 rounded-full
          ring-1 ring-white/35
        `}
      />
    </button>
  );
}

function LoadingPill() {
  return (
    <div
      className="
        relative inline-flex select-none items-center justify-center
        rounded-full px-7 py-3
        bg-white/70
        backdrop-blur-[18px] backdrop-saturate-150
        shadow-[0_18px_55px_rgba(0,0,0,0.06)]
        border border-black/10
        lg-border
        overflow-hidden
        min-w-[190px]
      "
      aria-hidden="true"
    >
      {/* “текст” пустой, вместо него линия загрузки */}
      <div className="relative h-[10px] w-[140px] rounded-full bg-black/10 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(199,63,64,0.00), rgba(199,63,64,0.35), rgba(177,207,235,0.75), rgba(199,63,64,0.35), rgba(199,63,64,0.00))",
            animation: "uniShimmer 1.9s ease-in-out infinite",
          }}
        />
      </div>

      <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/35" />
    </div>
  );
}
