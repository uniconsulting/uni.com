"use client";

import React from "react";

export default function Footer() {
  const linkCls =
    "text-[#0f172a]/80 hover:text-[#c73f40] transition-colors duration-300";

  return (
    <footer id="footer" className="relative w-full bg-white">
      <style>{`
        @keyframes ruShine {
          0%   { transform: translateX(-120%); opacity: 0; }
          20%  { opacity: .9; }
          50%  { opacity: .9; }
          80%  { opacity: .6; }
          100% { transform: translateX(120%); opacity: 0; }
        }
        @keyframes ruFloat {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-1px); }
        }
      `}</style>

      {/* лёгкий верхний разделитель (не “фрейм”, а просто граница футера) */}
      <div className="border-t border-black/5" />

      <div className="mx-auto max-w-[1240px] px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* BRAND */}
          <div className="lg:col-span-5">
            <a href="#top" className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
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

            <div className="mt-5 space-y-1 text-[12px] leading-[1.45] text-[#0f172a]/70">
              <div>ООО "БЭНИФИТ"</div>
              <div>ИНН: 7300031274 • ОГРН: 1247300003257</div>
              <div>
                зарегистрирована 04.04.2024 г. по адресу обл. Ульяновская, г.
                Ульяновск, ул. Жигулевская, д. 17, кв. 4.
              </div>
            </div>

            {/* RU плашка */}
            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-black/10 bg-[#0f172a]/[0.03] px-4 py-2 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
              <div
                className="relative isolate overflow-hidden rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-semibold text-[#0f172a]"
                style={{ animation: "ruFloat 2.8s ease-in-out infinite" }}
              >
                <span className="relative z-10">RU</span>
                <span
                  className="pointer-events-none absolute -inset-y-6 left-0 w-1/2 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.85),transparent)]"
                  style={{ animation: "ruShine 3.8s ease-in-out infinite" }}
                />
              </div>

              <div className="text-[12px] font-semibold text-[#0f172a]/80">
                Продукт сделан в России
              </div>
            </div>
          </div>

          {/* CONTACTS */}
          <div className="lg:col-span-3">
            <div className="text-[13px] font-semibold text-[#0f172a]">
              Контакты
            </div>

            <div className="mt-4 space-y-2 text-[12px]">
              <a className={linkCls} href="tel:+79955186942">
                +7 (995) 518-69-42
              </a>
              <div>
                <a
                  className={linkCls}
                  href="https://t.me/uni_smb"
                  target="_blank"
                  rel="noreferrer"
                >
                  Telegram: t.me/uni_smb
                </a>
              </div>
              <div>
                <a className={linkCls} href="mailto:uni.kit@mail.ru">
                  uni.kit@mail.ru
                </a>
              </div>
              <div>
                <a
                  className={linkCls}
                  href="https://t.me/uni_smb"
                  target="_blank"
                  rel="noreferrer"
                >
                  Сообщить о проблеме
                </a>
              </div>
            </div>
          </div>

          {/* BLOG */}
          <div className="lg:col-span-2">
            <div className="text-[13px] font-semibold text-[#0f172a]">Блог</div>

            <div className="mt-4 space-y-2 text-[12px]">
              <div>
                <a
                  className={linkCls}
                  href="https://t.me/uniconsulting"
                  target="_blank"
                  rel="noreferrer"
                >
                  Telegram-канал
                </a>
              </div>
              <div>
                <a
                  className={linkCls}
                  href="https://m.tenchat.ru/u/xuxnFlqD"
                  target="_blank"
                  rel="noreferrer"
                >
                  TenChat
                </a>
              </div>
            </div>
          </div>

          {/* DOCS */}
          <div className="lg:col-span-2">
            <div className="text-[13px] font-semibold text-[#0f172a]">
              Документы
            </div>

            <div className="mt-4 space-y-2 text-[12px]">
              <div>
                <a className={linkCls} href="/privacy">
                  Политика конфиденциальности
                </a>
              </div>
              <div>
                <a className={linkCls} href="/opd-consent">
                  Согласие ОПД клиента
                </a>
              </div>
              <div>
                <a className={linkCls} href="/offer">
                  Публичная оферта
                </a>
              </div>
              <div>
                <a className={linkCls} href="/cookies">
                  Политика cookies
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* bottom line */}
        <div className="mt-12 border-t border-black/5 pt-6 text-center text-[12px] text-[#0f172a]/60">
          Copyright © 2026 Uni.ai (ООО "БЭНИФИТ")
        </div>
      </div>
    </footer>
  );
}
