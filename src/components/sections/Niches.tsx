import React from "react";

type Niche = {
  label: string;
  accent?: boolean;
};

const NICHES: Niche[] = [
  { label: "Ремонт коммерческих помещений" },
  { label: "Автосервис" },
  { label: "Обслуживание мобильных устройств" },
  { label: "Аренда квартир" },
  { label: "Стоматологическая клиника", accent: true },
  { label: "Груминг" },
  { label: "Производство (b2b)" },
  { label: "Онлайн-школа" },
  { label: "Детейлинг-студия" },
  { label: "Магазин одежды" },
];

export default function NichesBlock() {
  return (
    <section id="niches" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-[1240px] px-4">
        <div className="mx-auto max-w-[980px] text-center">
          <h2 className="text-white leading-[0.96] tracking-[-0.02em]">
            <span className="block text-[34px] sm:text-[44px] md:text-[56px] font-[700]">
              Готовые настройки
            </span>
            <span className="mt-2 block text-[28px] sm:text-[38px] md:text-[48px] font-[700]">
              для самых разных направлений
            </span>
          </h2>
        </div>

        {/* мягкая “тень-подушка” под группой пилюль, как в референсе */}
        <div className="relative mt-10 md:mt-14">
          <div className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-44 max-w-[980px] rounded-[999px] bg-black/10 blur-[80px] opacity-40" />

          <div className="relative mx-auto flex max-w-[980px] flex-wrap justify-center gap-4 md:gap-5">
            {NICHES.map((n) => (
              <Pill key={n.label} accent={!!n.accent}>
                {n.label}
              </Pill>
            ))}

            {/* “и ещё…” пилюля-плейсхолдер (как последняя в референсе) */}
            <div
              className="
                lg-border
                inline-flex items-center justify-center
                h-12 sm:h-13
                rounded-[999px]
                px-7
                bg-white/10
                border border-white/22
                backdrop-blur-[22px] backdrop-saturate-150
                shadow-[0_18px_55px_rgba(0,0,0,0.06)]
              "
              aria-hidden="true"
            >
              <span className="h-[8px] w-[140px] rounded-full bg-gradient-to-r from-white/25 via-white/70 to-white/25 opacity-80 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pill({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <span
      className={[
        "lg-border",
        "inline-flex items-center justify-center",
        "h-12 sm:h-13",
        "rounded-[999px]",
        "px-6 sm:px-7",
        "bg-white/10",
        "border border-white/22",
        "backdrop-blur-[22px] backdrop-saturate-150",
        "shadow-[0_18px_55px_rgba(0,0,0,0.06)]",
        "transition-transform duration-[900ms] ease-out hover:scale-[1.03] active:scale-[0.99]",
        "whitespace-nowrap",
        accent ? "text-[#c73f40] font-[700]" : "text-[#121212] font-[650]",
      ].join(" ")}
    >
      <span className="text-[13px] sm:text-[14px] leading-none">{children}</span>
    </span>
  );
}
