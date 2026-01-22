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

          <div className="mt-9 sm:mt-10">
            {/* Glass capsule (как у хедера) */}
            <div className="mx-auto w-fit rounded-[999px] border border-white/40 bg-white/15 p-2 shadow-[0_18px_70px_rgba(0,0,0,0.14)] backdrop-blur-[24px]">
              <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-3">
                {/* Register */}
                <a
                  href={LINKS.register}
                  className={[
                    "relative inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-semibold text-white",
                    "bg-[#c73f40] shadow-[0_16px_44px_rgba(199,63,64,0.30)]",
                    "overflow-hidden",
                    "transition-colors duration-[1000ms] ease-out",
                    "hover:bg-[#d25554] active:bg-[#b43738]",
                    "before:absolute before:inset-0 before:rounded-full before:pointer-events-none",
                    "before:bg-[linear-gradient(180deg,rgba(255,255,255,0.35),rgba(255,255,255,0))] before:opacity-70",
                  ].join(" ")}
                >
                  Зарегистрироваться
                </a>

                {/* Social buttons */}
                {[
                  { label: "G", href: LINKS.register },
                  { label: "Я", href: LINKS.register },
                  { label: "VK", href: LINKS.register },
                ].map((b) => (
                  <a
                    key={b.label}
                    href={b.href}
                    className={[
                      "relative grid h-12 w-12 place-items-center rounded-full",
                      "border border-white/40 bg-white/16 text-white",
                      "shadow-[0_10px_28px_rgba(0,0,0,0.14)] backdrop-blur-[18px]",
                      "overflow-hidden",
                      liquidTransition,
                      "hover:scale-[1.08] hover:bg-white/22 hover:shadow-[0_18px_42px_rgba(0,0,0,0.18)]",
                      "active:scale-[0.98]",
                      "before:absolute before:inset-0 before:rounded-full before:pointer-events-none",
                      "before:bg-[radial-gradient(120%_90%_at_30%_10%,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0)_60%)]",
                      "before:opacity-60",
                    ].join(" ")}
                    aria-label={b.label}
                    title={b.label}
                  >
                    <span className="text-[14px] font-semibold">{b.label}</span>
                  </a>
                ))}

                {/* Call */}
                <button
                  type="button"
                  onClick={() => setCallOpen(true)}
                  className={[
                    "group inline-flex items-center gap-3 rounded-full pr-3 pl-1 py-1",
                    liquidTransition,
                    "hover:scale-[1.04] active:scale-[0.98]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "relative grid h-12 w-12 place-items-center rounded-full",
                      "bg-[#c73f40] text-white",
                      "shadow-[0_16px_44px_rgba(199,63,64,0.25)]",
                      "overflow-hidden",
                      "transition-colors duration-[1000ms] ease-out",
                      "group-hover:bg-[#d25554] group-active:bg-[#b43738]",
                      "before:absolute before:inset-0 before:rounded-full before:pointer-events-none",
                      "before:bg-[linear-gradient(180deg,rgba(255,255,255,0.30),rgba(255,255,255,0))] before:opacity-70",
                    ].join(" ")}
                  >
                    <PhoneIcon className="h-5 w-5" />
                  </span>

                  <span className="whitespace-nowrap text-[15px] font-semibold text-white">
                    Заказать звонок
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CallModal open={callOpen} onClose={() => setCallOpen(false)} />
    </>
  );
}
