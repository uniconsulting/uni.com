"use client";

import React from "react";

export default function Hero() {
  return (
    <section id="top" className="relative pt-16 pb-10 md:pt-24 md:pb-16">
      <div className="mx-auto max-w-[1240px] px-4">
        {/* Заголовок (по ТЗ: весь белый) */}
<h1 className="premium-title mx-auto max-w-[980px] text-center text-white leading-[0.94] tracking-[-0.02em]">
  <span className="block text-[44px] sm:text-[60px] md:text-[74px] font-[600]">
    Кабинет твоей
  </span>

  <span className="block text-[44px] sm:text-[60px] md:text-[74px] font-[600]">
    <span className="premium-word" data-text="команды">
      команды
    </span>{" "}
    ИИ-агентов
  </span>
</h1>

        {/* Плейсхолдер видео/скрина */}
        <div className="mt-8 md:mt-12">
          <div
            className="
              relative mx-auto max-w-[980px]
              rounded-[34px]
              border border-white/18
              bg-white/10
              p-[10px]
              shadow-[0_22px_70px_rgba(0,0,0,0.05)]
              backdrop-blur-[26px]
            "
          >
            {/* Лёгкий внутренний хайлайт для “дороговизны” */}
            <div className="pointer-events-none absolute inset-0 rounded-[34px] ring-1 ring-white/10" />

            {/* Белая вставка 16:9 */}
            <div
              className="
                relative overflow-hidden
                rounded-[26px]
                border border-white/22
                bg-white/75
                aspect-video
              "
            >
              <div className="absolute inset-0 grid place-items-center px-6 text-center">
                <div>
                  <div className="text-[13px] font-semibold text-[#0f172a]/70">
                    Тут будет скрин / видео платформы
                  </div>
                  <div className="mt-1 text-[12px] text-[#0f172a]/45">
                    (вставим позже, когда пришлёшь картинку)
                  </div>
                </div>
              </div>
            </div>

            {/* Очень тонкая “подложка-пластика” внутри контейнера */}
            <div className="pointer-events-none absolute inset-0 rounded-[34px] bg-[radial-gradient(900px_420px_at_20%_0%,rgba(255,255,255,0.05),transparent_60%),radial-gradient(900px_420px_at_80%_100%,rgba(199,63,64,0.05),transparent_65%)] opacity-80" />
          </div>
        </div>
      </div>
    </section>
  );
}
