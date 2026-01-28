"use client";

import React from "react";

export default function FooterSection() {
  const linkBase =
    "text-[#0f172a] transition-colors duration-500 hover:text-[#c73f40]";

  return (
    <footer id="footer" className="relative w-full">
      <style>{`
        @keyframes ruBorderShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* цельный светлый футер на всю ширину */}
      <div className="relative w-full bg-white/82 lg-border border-t border-white/18 backdrop-blur-[26px]">
        {/* мягкий световой рисунок (внутри того же футера, без отдельных фреймов) */}
        <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(900px_240px_at_15%_0%,rgba(15,23,42,0.06),transparent_60%),radial-gradient(900px_240px_at_85%_100%,rgba(199,63,64,0.06),transparent_65%)]" />

        <div className="relative mx-auto max-w-[1240px] px-4 pt-12 pb-7">
          <div className="grid gap-10 lg:grid-cols-4">
            {/* 1) Бренд */}
            <div className="lg:col-span-1">
              <a href="#top" className="inline-flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-black/10 bg-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-[18px]">
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
                  <div className="text-[11px] text-[#0f172a]/70">
                    Системы для SMB с ИИ японского качества
                  </div>
                </div>
              </a>

              <div className="mt-5 text-[12px] font-semibold text-[#0f172a]">
                СТЭП = Стабильность. Точность. Эффективность. Простота.
              </div>

              <div className="mt-5 space-y-1 text-[12px] text-[#0f172a]/75 leading-[1.5]">
                <div className="font-semibold text-[#0f172a]">ООО "БЭНИФИТ"</div>
                <div>ИНН: 7300031274 • ОГРН: 1247300003257</div>
                <div>
                  зарегистрирована 04.04.2024 г. по адресу
                  <br />
                  обл. Ульяновская, г. Ульяновск, ул. Жигулевская, д. 17, кв. 4.
                </div>
              </div>

              {/* RU pill */}
              <div className="mt-6">
                <div
                  className={[
                    "inline-flex items-center",
                    "rounded-full p-[1px]",
                    "bg-[linear-gradient(90deg,#ffffff,#3b82f6,#ef4444,#ffffff)]",
                    "bg-[length:220%_220%]",
                    "shadow-[0_10px_26px_rgba(0,0,0,0.06)]",
                  ].join(" ")}
                  style={{ animation: "ruBorderShift 6s ease-in-out infinite" }}
                >
                  <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2">
                    <span className="text-[11px] font-semibold text-[#0f172a]">
                      RU
                    </span>
                    <span className="text-[11px] text-[#0f172a]/75">
                      Продукт сделан в России
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2/3/4: Контакты / Блог / Документы (одинаковый интервал по сетке) */}
            <div className="grid gap-10 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
              {/* Контакты */}
              <div>
                <div className="text-[12px] font-semibold text-[#0f172a]">
                  Контакты
                </div>

                <div className="mt-4 space-y-2 text-[12px] text-[#0f172a]/75">
                  <div className="text-[#0f172a] font-semibold">
                    +7 (995) 518-69-42
                  </div>

                  <a
                    className={linkBase}
                    href="https://t.me/uni_smb"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Telegram: t.me/uni_smb
                  </a>

                  <a className={linkBase} href="mailto:uni.kit@mail.ru">
                    uni.kit@mail.ru
                  </a>

                  <a
                    className={linkBase}
                    href="https://t.me/uni_smb"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Сообщить о проблеме
                  </a>
                </div>
              </div>

              {/* Блог */}
              <div>
                <div className="text-[12px] font-semibold text-[#0f172a]">
                  Блог
                </div>

                <div className="mt-4 space-y-2 text-[12px] text-[#0f172a]/75">
                  <a
                    className={linkBase}
                    href="https://t.me/uniconsulting"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Telegram-канал: t.me/uniconsulting
                  </a>

                  <a
                    className={linkBase}
                    href="https://m.tenchat.ru/u/xuxnFlqD"
                    target="_blank"
                    rel="noreferrer"
                  >
                    TenChat
                  </a>
                </div>
              </div>

              {/* Документы */}
              <div>
                <div className="text-[12px] font-semibold text-[#0f172a]">
                  Документы
                </div>

                <div className="mt-4 space-y-2 text-[12px] text-[#0f172a]/75">
                  <a className={linkBase} href="/privacy">
                    Политика конфиденциальности
                  </a>
                  <a className={linkBase} href="/opd-consent">
                    Согласие ОПД клиента
                  </a>
                  <a className={linkBase} href="/offer">
                    Публичная оферта
                  </a>
                  <a className={linkBase} href="/cookies">
                    Политика cookies
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* нижняя строка */}
          <div className="mt-10 border-t border-black/5 pt-6">
            <div className="text-center text-[12px] text-[#0f172a]/60">
              Copyright © 2026 Uni.ai (ООО "БЭНИФИТ")
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
