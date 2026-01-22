// src/components/sections/CTA1.tsx
"use client";

import React, { useState } from "react";
import CallModal from "../ui/CallModal";

const LINKS = {
  register: "https://uni-ai.online/register",
};

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M8.7 10.3c1.3 2.5 3.5 4.7 6 6l1.9-1.9c.3-.3.8-.4 1.2-.2 1.1.4 2.3.7 3.6.8.6.1 1 .6 1 1.2V20c0 .7-.6 1.2-1.3 1.2C11 21.2 2.8 13 2.8 2.9 2.8 2.2 3.4 1.6 4.1 1.6H7c.6 0 1.1.4 1.2 1 .1 1.2.4 2.5.8 3.6.1.4 0 .9-.3 1.2L6.9 9.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const liquidTransition =
  "transition-[transform,box-shadow,background-color,border-color] duration-[900ms] [transition-timing-function:cubic-bezier(.2,1,.2,1)]";

export default function CTA1() {
  const [callOpen, setCallOpen] = useState(false);

  return (
    <>
      <section className="relative pt-16 sm:pt-20 pb-10">
        <div className="mx-auto max-w-[1240px] px-4 text-center">
          <h2 className="text-white text-[40px] leading-[1.05] sm:text-[56px] font-semibold tracking-[-0.02em]">
            Первые ИИ-сотрудники
          </h2>

          <p className="mt-3 text-white/85 text-[16px] sm:text-[20px] font-medium">
            уже готовы работать бесплатно
          </p>

          <div className="mx-auto w-full max-w-[1240px] px-4">
            {/* стеклянная панель */}
            <div
    className="
      mx-auto
      w-full
      rounded-[999px]
      border border-white/35
      bg-white/14
      p-3
      backdrop-blur-[26px]
      shadow-[0_14px_60px_rgba(0,0,0,0.14)]
    "
  >
    <div className="flex items-center justify-center gap-4">
      {/* 1) Зарегистрироваться */}
      <a
        href="https://uni-ai.online/register"
        className="
          lg-border
          inline-flex
          h-14
          items-center
          justify-center
          rounded-[999px]
          bg-[#c73f40]
          px-10
          text-[18px]
          font-semibold
          text-white
          transition-colors
          duration-[1200ms]
          hover:bg-[#d55556]
          active:bg-[#b43738]
        "
      >
        Зарегистрироваться
      </a>

      {/* divider #1 */}
      <div className="hidden sm:block h-10 w-px bg-white/30" />

      {/* 2) G / Я / VK */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="
            lg-border
            grid
            h-14
            w-14
            place-items-center
            rounded-full
            bg-[#9AA0A6]
            text-[18px]
            font-semibold
            text-white
          "
          aria-label="Google"
        >
          G
        </button>

        <button
          type="button"
          className="
            lg-border
            grid
            h-14
            w-14
            place-items-center
            rounded-full
            bg-[#c73f40]
            text-[18px]
            font-semibold
            text-white
          "
          aria-label="Яндекс"
        >
          Я
        </button>

        <button
          type="button"
          className="
            lg-border
            grid
            h-14
            w-14
            place-items-center
            rounded-full
            bg-[#0077FF]
            text-[18px]
            font-semibold
            text-white
          "
          aria-label="ВКонтакте"
        >
          VK
        </button>
      </div>

      {/* divider #2 */}
      <div className="hidden sm:block h-10 w-px bg-white/30" />

      {/* 3) Заказать звонок */}
      <button
        type="button"
        onClick={() => {/* твой handler */}}
        className="flex items-center gap-4 rounded-[999px] pr-2"
        aria-label="Заказать звонок"
      >
        <span
          className="
            lg-border
            grid
            h-14
            w-14
            place-items-center
            rounded-full
            bg-[#c73f40]
            text-white
          "
        >
          {/* твоя иконка телефона */}
          {/* <PhoneIcon className="h-6 w-6" /> */}
        </span>

        <span className="text-[18px] font-semibold text-[#c73f40]">
          Заказать звонок
        </span>
      </button>
    </div>
  </div>
</div>
</section>
        
      <CallModal open={callOpen} onClose={() => setCallOpen(false)} />
    </>
  );
}
