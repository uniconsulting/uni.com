"use client";

import React from "react";

export default function FooterSection() {
  return (
    <footer id="footer" className="relative mt-16 w-full">
      <style>{`
        @keyframes ruShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* цельная светлая панель на всю ширину */}
      <div className="w-full border-t border-white/18 bg-white/86 backdrop-blur-[18px] backdrop-saturate-150">
        <div className="mx-auto max-w-[1240px] px-4 py-12">
          {/* сетка */}
          <div className="grid gap-10 lg:grid-cols-12">
            {/* БРЕНД */}
            <div className="lg:col-span-5">
              <a href="#top" className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-black/10 bg-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-[18px]">
                  <img
                    src="brand/logo.svg"
                    alt="ЮНИ.ai"
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>

                <div className="leading-tight">
                  <div className="text-[14px] font-semibold text-[#0f172a]">ЮНИ.ai</div>
                  <div className="text-[11px] text-[#0f172a]/70">
                    Системы для SMB с ИИ японского качества
                  </div>
                </div>
              </a>

              <div className="mt-5 text-[12px] font-semibold text-[#0f172a]/80">
                СТЭП = Стабильность. Точность. Эффективность. Простота.
              </div>

              <div className="mt-6 space-y-1 text-[12px] text-[#0f172a]/80">
                <div className="font-semibold text-[#0f172a]">ООО "БЭНИФИТ"</div>
                <div>ИНН: 7300031274 • ОГРН: 1247300003257</div>
                <div>
                  зарегистрирована 04.04.2024 г. по адресу
                  <br />
                  обл. Ульяновская, г. Ульяновск, ул. Жигулевская, д. 17, кв. 4.
                </div>
              </div>

              {/* RU плашка */}
              <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/18 bg-white/70 px-4 py-2 shadow-[0_12px_35px_rgba(0,0,0,0.06)] backdrop-blur-[18px]">
                <span
                  className="inline-flex h-7 items-center justify-center rounded-full px-3 text-[12px] font-semibold text-[#0f172a]"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, rgba(199,63,64,0.16), rgba(15,23,42,0.06), rgba(199,63,64,0.16))",
                    backgroundSize: "220% 220%",
                    animation: "ruShimmer 6.5s ease-in-out infinite",
                  }}
                >
                  RU
                </span>
                <span className="text-[12px] font-semibold text-[#0f172a]/80">
                  Продукт сделан в России
                </span>
              </div>
            </div>

            {/* КОНТАКТЫ */}
            <div className="lg:col-span-2">
              <div className="text-[12px] font-semibold text-[#0f172a]">Контакты</div>
              <div className="mt-4 space-y-3 text-[12px] text-[#0f172a]/80">
                <a
                  href="tel:+79955186942"
                  className="block font-semibold text-[#0f172a] transition-colors duration-300 hover:text-[#c73f40]"
                >
                  +7 (995) 518-69-42
                </a>

                <a
                  href="https://t.me/uni_smb"
                  target="_blank"
                  rel="noreferrer"
                  className="block transition-colors duration-300 hover:text-[#c73f40]"
                >
                  Telegram
                </a>

                <a
                  href="mailto:uni.kit@mail.ru"
                  className="block transition-colors duration-300 hover:text-[#c73f40]"
                >
                  uni.kit@mail.ru
                </a>

                <a
                  href="https://t.me/uni_smb"
                  target="_blank"
                  rel="noreferrer"
                  className="block transition-colors duration-300 hover:text-[#c73f40]"
                >
                  Сообщить о проблеме
                </a>
              </div>
            </div>

            {/* БЛОГ */}
            <div className="lg:col-span-2">
              <div className="text-[12px] font-semibold text-[#0f172a]">Блог</div>
              <div className="mt-4 space-y-3 text-[12px] text-[#0f172a]/80">
                <a
                  href="https://t.me/uniconsulting"
                  target="_blank"
                  rel="noreferrer"
                  className="block transition-colors duration-300 hover:text-[#c73f40]"
                >
                  Telegram-канал
                </a>

                <a
                  href="https://m.tenchat.ru/u/xuxnFlqD"
                  target="_blank"
                  rel="noreferrer"
                  className="block transition-colors duration-300 hover:text-[#c73f40]"
                >
                  TenChat
                </a>
              </div>
            </div>

            {/* ДОКУМЕНТЫ */}
            <div className="lg:col-span-3">
              <div className="text-[12px] font-semibold text-[#0f172a]">Документы</div>
              <div className="mt-4 space-y-3 text-[12px] text-[#0f172a]/80">
                <a href="/privacy" className="block transition-colors duration-300 hover:text-[#c73f40]">
                  Политика конфиденциальности
                </a>
                <a href="/opd-consent" className="block transition-colors duration-300 hover:text-[#c73f40]">
                  Согласие ОПД клиента
                </a>
                <a href="/offer" className="block transition-colors duration-300 hover:text-[#c73f40]">
                  Публичная оферта
                </a>
                <a href="/cookies" className="block transition-colors duration-300 hover:text-[#c73f40]">
                  Политика cookies
                </a>
              </div>
            </div>
          </div>

          {/* нижняя строка */}
          <div className="mt-12 border-t border-white/18 pt-6 text-center text-[12px] text-[#0f172a]/70">
            Copyright © 2026 Uni.ai (ООО "БЭНИФИТ")
          </div>
        </div>
      </div>
    </footer>
  );
}
