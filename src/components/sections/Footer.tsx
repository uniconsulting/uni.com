"use client";

import React from "react";

const ACCENT = "#c73f40";

export default function FooterSection() {
  return (
    <footer id="footer" className="relative">
      <style>{`
        .footer-link {
          transition: color 360ms ease;
        }
        .footer-link:hover {
          color: ${ACCENT};
        }

        @keyframes ruSheen {
          0% { transform: translateX(-120%); opacity: 0; }
          15% { opacity: 1; }
          55% { opacity: 1; }
          100% { transform: translateX(120%); opacity: 0; }
        }

        .ru-badge {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }
        .ru-badge::before {
          content: "";
          position: absolute;
          inset: -40%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(199,63,64,0.18) 38%,
            rgba(199,63,64,0.30) 50%,
            rgba(199,63,64,0.18) 62%,
            transparent 100%
          );
          transform: translateX(-120%);
          animation: ruSheen 5.2s ease-in-out infinite;
          pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .ru-badge::before { animation: none !important; }
        }
      `}</style>

      {/* светлая панель на всю ширину */}
      <div className="w-full border-t border-white/18 bg-white/82">
        {/* лёгкий “стеклянный” слой */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(1100px_280px_at_20%_0%,rgba(199,63,64,0.10),transparent_60%),radial-gradient(1100px_280px_at_80%_100%,rgba(15,23,42,0.06),transparent_65%)]" />

          <div className="relative mx-auto max-w-[1240px] px-4 py-14 md:py-16">
            <div className="lg-border rounded-[52px] border border-white/18 bg-white/70 shadow-[0_22px_70px_rgba(0,0,0,0.06)] backdrop-blur-[22px] backdrop-saturate-150">
              <div className="px-6 py-8 sm:px-10 sm:py-10">
                <div className="grid gap-10 lg:grid-cols-12">
                  {/* BRAND */}
                  <div className="lg:col-span-5">
                    <a href="#top" className="inline-flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-black/10 bg-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.05)] backdrop-blur-[18px]">
                        <img
                          src="brand/logo.svg"
                          alt="ЮНИ.ai"
                          className="h-full w-full object-cover"
                          draggable={false}
                        />
                      </div>

                      <div className="leading-tight">
                        <div className="text-[14px] font-semibold text-[#0f172a]">
                          ЮНИ.ai
                        </div>
                        <div className="text-[11px] text-black/60">
                          Системы для SMB с ИИ японского качества
                        </div>
                      </div>
                    </a>

                    <div className="mt-5 text-[12px] font-semibold text-[#0f172a]">
                      СТЭП = Стабильность. Точность. Эффективность. Простота.
                    </div>

                    <div className="mt-5 space-y-1 text-[12px] leading-[1.4] text-black/65">
                      <div>ООО "БЭНИФИТ"</div>
                      <div>ИНН: 7300031274 • ОГРН: 1247300003257</div>
                      <div>
                        зарегистрирована 04.04.2024 г. по адресу обл. Ульяновская, г. Ульяновск, ул. Жигулевская, д. 17, кв. 4.
                      </div>
                    </div>

                    {/* RU плашка */}
                    <div className="mt-6">
                      <div className="ru-badge inline-flex items-center gap-3 rounded-[20px] border border-white/18 bg-white/70 px-4 py-2 shadow-[0_12px_35px_rgba(0,0,0,0.05)]">
                        <div className="grid h-8 w-8 place-items-center rounded-full border border-black/10 bg-white/80 text-[12px] font-semibold text-[#0f172a]">
                          RU
                        </div>
                        <div className="text-[12px] font-semibold text-[#0f172a]">
                          Продукт сделан в России
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CONTACTS */}
                  <div className="lg:col-span-4">
                    <div className="text-[13px] font-semibold text-[#0f172a]">
                      Контакты
                    </div>

                    <div className="mt-4 space-y-2 text-[12px] text-black/70">
                      <a className="footer-link block" href="tel:+79955186942">
                        +7 (995) 518-69-42
                      </a>

                      <a
                        className="footer-link block"
                        href="https://t.me/uni_smb"
                        target="_blank"
                        rel="noreferrer"
                      >
                        t.me/uni_smb
                      </a>

                      <a className="footer-link block" href="mailto:uni.kit@mail.ru">
                        uni.kit@mail.ru
                      </a>

                      <a
                        className="footer-link block"
                        href="https://t.me/uniconsulting"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Блог: t.me/uniconsulting
                      </a>

                      <a
                        className="footer-link inline-flex items-center"
                        href="https://t.me/uni_smb"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Сообщить о проблеме
                      </a>
                    </div>
                  </div>

                  {/* DOCS */}
                  <div className="lg:col-span-3">
                    <div className="text-[13px] font-semibold text-[#0f172a]">
                      Документы
                    </div>

                    <div className="mt-4 space-y-2 text-[12px] text-black/70">
                      <a className="footer-link block" href="/privacy">
                        Политика конфиденциальности
                      </a>
                      <a className="footer-link block" href="/opd-consent">
                        Согласие ОПД клиента
                      </a>
                      <a className="footer-link block" href="/offer">
                        Публичная оферта
                      </a>
                      <a className="footer-link block" href="/cookies">
                        Политика cookies
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-10 border-t border-black/5 pt-6">
                  <div className="text-[12px] text-black/55">
                    Copyright © 2026 Uni.ai (ООО "БЭНИФИТ")
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* нижний мягкий блик */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[160px] opacity-60 bg-[radial-gradient(1000px_260px_at_50%_0%,rgba(0,0,0,0.06),transparent_65%)]" />
        </div>
      </div>
    </footer>
  );
}
