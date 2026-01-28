"use client";

import React from "react";

const ACCENT = "#c73f40";

const LINKS = {
  tgSupport: "https://t.me/uni_smb",
  tgChannel: "https://t.me/uniconsulting",
  tenchat: "https://m.tenchat.ru/u/xuxnFlqD",
  tgContact: "https://t.me/uni_smb",
  email: "mailto:uni.kit@mail.ru",
  phone: "tel:+79955186942",
  // документы (поставил безопасные заглушки - подставишь реальные пути/файлы)
  privacy: "#",
  opd: "#",
  offer: "#",
  cookies: "#",
};

export default function Footer() {
  return (
    <footer id="footer" className="relative w-full">
      <style>{`
        @keyframes ruShimmer {
          0% { transform: translateX(-120%); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateX(120%); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ru-shimmer::before { animation: none !important; }
        }
      `}</style>

      {/* цельная панель футера на всю ширину */}
      <div className="w-full bg-white/82 backdrop-blur-[22px] backdrop-saturate-150 border-t border-white/18 shadow-[0_-18px_60px_rgba(0,0,0,0.06)]">
        <div className="mx-auto max-w-[1240px] px-4 py-12 md:py-14">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
            {/* 1) Бренд */}
            <div className="lg:col-span-2">
              <a href="#top" className="group inline-flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                  <img
                    src="brand/logo.svg"
                    alt="ЮНИ.ai"
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>

                <div className="leading-tight">
                  <div className="text-[14px] font-semibold text-[#0f172a] transition-colors duration-300 group-hover:text-[#c73f40]">
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

              <div className="mt-4 space-y-1 text-[12px] leading-[1.5] text-black/65">
                <div>ООО "БЭНИФИТ"</div>
                <div>ИНН: 7300031274 • ОГРН: 1247300003257</div>
                <div>
                  зарегистрирована 04.04.2024 г. по адресу обл. Ульяновская, г.
                  Ульяновск, ул. Жигулевская, д. 17, кв. 4.
                </div>
              </div>

              {/* 5) RU плашка */}
              <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                <div className="relative overflow-hidden rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0f172a]">
                  <span className="relative z-[1]">RU</span>
                  <span className="pointer-events-none absolute inset-y-0 left-0 w-[1px] bg-black/10" />
                </div>

                <div className="relative overflow-hidden text-[12px] font-semibold text-[#0f172a]">
                  <span className="relative z-[1]">Продукт сделан в России</span>
                  <span
                    className="ru-shimmer pointer-events-none absolute inset-0"
                    aria-hidden="true"
                  />
                  <style>{`
                    .ru-shimmer::before{
                      content:"";
                      position:absolute;
                      top:-40%;
                      left:-60%;
                      width:40%;
                      height:180%;
                      background: linear-gradient(90deg, transparent, rgba(199,63,64,0.18), transparent);
                      transform: translateX(-120%);
                      animation: ruShimmer 2.8s ease-in-out infinite;
                    }
                  `}</style>
                </div>
              </div>
            </div>

            {/* 2) Контакты */}
            <div>
              <div className="text-[12px] font-semibold text-[#0f172a]">Контакты</div>
              <div className="mt-4 space-y-2 text-[12px] text-black/65">
                <a
                  href={LINKS.phone}
                  className="block font-semibold text-[#0f172a] transition-colors duration-300 hover:text-[#c73f40]"
                >
                  +7 (995) 518-69-42
                </a>

                <a
                  href={LINKS.tgContact}
                  target="_blank"
                  rel="noreferrer"
                  className="block transition-colors duration-300 hover:text-[#c73f40]"
                >
                  Telegram
                </a>

                <a
                  href={LINKS.email}
                  className="block transition-colors duration-300 hover:text-[#c73f40]"
                >
                  uni.kit@mail.ru
                </a>

                <a
                  href={LINKS.tgSupport}
                  target="_blank"
                  rel="noreferrer"
                  className="block transition-colors duration-300 hover:text-[#c73f40]"
                >
                  Сообщить о проблеме
                </a>
              </div>
            </div>

            {/* 3) Блог */}
            <div>
              <div className="text-[12px] font-semibold text-[#0f172a]">Блог</div>
              <div className="mt-4 space-y-2 text-[12px] text-black/65">
                <a
                  href={LINKS.tgChannel}
                  target="_blank"
                  rel="noreferrer"
                  className="block transition-colors duration-300 hover:text-[#c73f40]"
                >
                  Telegram-канал
                </a>
                <a
                  href={LINKS.tenchat}
                  target="_blank"
                  rel="noreferrer"
                  className="block transition-colors duration-300 hover:text-[#c73f40]"
                >
                  TenChat
                </a>
              </div>
            </div>

            {/* 4) Документы */}
            <div>
              <div className="text-[12px] font-semibold text-[#0f172a]">Документы</div>
              <div className="mt-4 space-y-2 text-[12px] text-black/65">
                <a
                  href={LINKS.privacy}
                  className="block transition-colors duration-300 hover:text-[#c73f40]"
                >
                  Политика конфиденциальности
                </a>
                <a
                  href={LINKS.opd}
                  className="block transition-colors duration-300 hover:text-[#c73f40]"
                >
                  Согласие ОПД клиента
                </a>
                <a
                  href={LINKS.offer}
                  className="block transition-colors duration-300 hover:text-[#c73f40]"
                >
                  Публичная оферта
                </a>
                <a
                  href={LINKS.cookies}
                  className="block transition-colors duration-300 hover:text-[#c73f40]"
                >
                  Политика cookies
                </a>
              </div>
            </div>
          </div>

          {/* нижняя строка */}
          <div className="mt-10 border-t border-black/10 pt-6 text-center text-[12px] text-black/55">
            Copyright © 2026 Uni.ai (ООО "БЭНИФИТ")
          </div>
        </div>
      </div>
    </footer>
  );
}
