import React from "react";

const NICHES: string[] = [
  "Ремонт коммерческих помещений",
  "Автосервис",
  "Обслуживание мобильных устройств",
  "Аренда квартир",
  "Стоматологическая клиника",
  "Груминг",
  "Производство (b2b)",
  "Онлайн-школа",
  "Детейлинг-студия",
  "Магазин одежды",
  "И ещё десятки ниш",
];

export default function NichesBlock() {
  return (
    <section id="niches" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-[1240px] px-4">
        {/* Заголовок (весь белый) */}
        <div className="mx-auto max-w-[980px] text-center">
          <h2 className="text-white leading-[0.95] tracking-[-0.02em]">
            <span className="block text-[42px] sm:text-[58px] md:text-[72px] font-[700]">
              Готовые настройки
            </span>
            <span className="mt-2 block text-[34px] sm:text-[48px] md:text-[60px] font-[700]">
              для самых разных направлений
            </span>
          </h2>
        </div>

        <div className="relative mt-10 md:mt-12">
          {/* Мягкая “тень-подложка” под облако пилюль (как в референсе) */}
          <div
            className="
              pointer-events-none absolute left-1/2 top-1/2
              h-[260px] w-[980px] -translate-x-1/2 -translate-y-1/2
              rounded-[999px]
              bg-black/10 blur-[70px] opacity-40
            "
          />

          {/* Пилюли */}
          <div className="relative mx-auto flex max-w-[980px] flex-wrap justify-center gap-x-4 gap-y-4">
            {NICHES.map((label) => (
              <Pill key={label}>{label}</Pill>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  const isMore = typeof children === "string" && children.includes("десятки");

  return (
    <span
      className={`
        ${isMore ? "px-8" : "px-7"}
        inline-flex select-none items-center justify-center
        rounded-full py-3
        text-[14px] sm:text-[15px] font-[650]
        whitespace-nowrap
        ${isMore ? "text-[#0f172a]/70" : "text-[#0f172a]/85"}
        border border-white/22 bg-white/10
        backdrop-blur-[22px] backdrop-saturate-150
        shadow-[0_18px_55px_rgba(0,0,0,0.06)]
        transition-transform duration-[900ms] ease-out
        hover:scale-[1.03] active:scale-[0.99]
        lg-border
        relative
      `}
    >
      {isMore ? (
        <>
          {/* маленький “дорогой” акцент внутри пилюли */}
          <span className="relative z-10">{children}</span>
          <span className="pointer-events-none absolute inset-0 rounded-full">
            <span className="absolute left-1/2 top-1/2 h-[6px] w-[140px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,rgba(199,63,64,0.25),rgba(177,207,235,0.55),rgba(199,63,64,0.25))] blur-[0.2px]" />
          </span>
        </>
      ) : (
        children
      )}
    </span>
  );
}
