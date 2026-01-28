"use client";

import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer id="footer" className="relative pb-10 pt-10">
      {/* тонкий разделитель сверху */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/18" />

      <div className="mx-auto max-w-[1240px] px-4">
        {/* светлая футер-панель */}
        <div className="lg-border rounded-[52px] border border-white/18 bg-white/82 p-[12px] shadow-[0_22px_70px_rgba(0,0,0,0.06)] backdrop-blur-[22px] backdrop-saturate-150">
          <div className="relative rounded-[40px] lg-border border border-white/18 bg-white/82 p-7 sm:p-8">
            <div className="grid gap-10 lg:grid-cols-12">
              {/* 1) Бренд */}
              <div className="lg:col-span-5">
                <div className="flex items-center gap-3">
                  {/* круглый бейдж под лого (как в хедере) */}
                  <div className="lg-border h-12 w-12 rounded-full border border-white/18 bg-white/70 shadow-[0_12px_28px_rgba(0,0,0,0.06)] backdrop-blur-[14px] flex items-center justify-center">
                    {/* сюда можно вставить <Image ... /> */}
                    <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/45 bg-white/18 shadow-[0_10px_30px_rgba(0,0,0,0.05)] backdrop-blur-[18px]">
                  <img
                    src="brand/logo.svg"
                    alt="ЮНИ.ai"
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>

                  <div className="text-[#0f172a] font-semibold tracking-[-0.02em] text-[18px]">
                    ЮНИ.ai
                  </div>
                </div>

                <div className="mt-3 text-[#0f172a] text-[12px] sm:text-[13px] font-semibold">
                  СТЭП = Стабильность. Точность. Эффективность. Простота.
                </div>

                <div className="mt-5 space-y-2 text-[#0f172a] text-[12px] leading-[1.45]">
                  <div className="font-semibold">ООО "БЭНИФИТ"</div>
                  <div className="text-[#0f172a]/80">
                    ИНН: 7300031274 • ОГРН: 1247300003257
                  </div>
                  <div className="text-[#0f172a]/70">
                    зарегистрирована 04.04.2024 г. по адресу обл. Ульяновская, г. Ульяновск,
                    ул. Жигулевская, д. 17, кв. 4.
                  </div>
                </div>
              </div>

              {/* 2) Контакты */}
              <div className="lg:col-span-4">
                <div className="text-[#0f172a] text-[13px] font-semibold">Контакты</div>

                <ul className="mt-4 space-y-3 text-[12px] sm:text-[13px] text-[#0f172a]/80">
                  <li>
                    <a
                      className="transition-colors hover:text-[#c73f40]"
                      href="tel:+79955186942"
                    >
                      +7 (995) 518-69-42
                    </a>
                  </li>

                  <li className="flex flex-wrap items-center gap-2">
                    <a
                      className="transition-colors hover:text-[#c73f40]"
                      href="https://t.me/uni_smb"
                      target="_blank"
                      rel="noreferrer"
                    >
                      t.me/uni_smb
                    </a>
                    <span className="text-[#0f172a]/45">•</span>
                    <span className="text-[#0f172a]/65">Telegram</span>
                  </li>

                  <li>
                    <a
                      className="transition-colors hover:text-[#c73f40]"
                      href="mailto:uni.kit@mail.ru"
                    >
                      uni.kit@mail.ru
                    </a>
                  </li>

                  <li className="flex flex-wrap items-center gap-2">
                    <span className="text-[#0f172a]/65">Блог:</span>
                    <a
                      className="transition-colors hover:text-[#c73f40]"
                      href="https://t.me/uniconsulting"
                      target="_blank"
                      rel="noreferrer"
                    >
                      t.me/uniconsulting
                    </a>
                    <span className="text-[#0f172a]/45">•</span>
                    <span className="text-[#0f172a]/65">Telegram-канал</span>
                  </li>

                  <li>
                    <a
                      className="font-semibold text-[#0f172a] transition-colors hover:text-[#c73f40]"
                      href="https://t.me/uni_smb"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Сообщить о проблеме
                    </a>
                  </li>
                </ul>
              </div>

              {/* 3) Документы + 4) RU */}
              <div className="lg:col-span-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-[#0f172a] text-[13px] font-semibold">Документы</div>

                  {/* RU плашка */}
                  <div className="lg-border shrink-0 rounded-full border border-white/18 bg-white/70 px-3 py-1 text-[12px] font-semibold text-[#0f172a] shadow-[0_10px_26px_rgba(0,0,0,0.05)] backdrop-blur-[14px]">
                    RU
                  </div>
                </div>

                <div className="mt-1 text-[12px] text-[#0f172a]/60">
                  Продукт сделан в России
                </div>

                <ul className="mt-4 space-y-3 text-[12px] sm:text-[13px] text-[#0f172a]/80">
                  <li>
                    <Link className="transition-colors hover:text-[#c73f40]" href="#">
                      Политика конфиденциальности
                    </Link>
                  </li>
                  <li>
                    <Link className="transition-colors hover:text-[#c73f40]" href="#">
                      Согласие ОПД клиента
                    </Link>
                  </li>
                  <li>
                    <Link className="transition-colors hover:text-[#c73f40]" href="#">
                      Публичная оферта
                    </Link>
                  </li>
                  <li>
                    <Link className="transition-colors hover:text-[#c73f40]" href="#">
                      Политика cookies
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* нижняя строка */}
            <div className="mt-10">
              <div className="h-px w-full bg-black/10" />
              <div className="mt-4 text-center text-[12px] text-[#0f172a]/70">
                Copyright © 2026 Uni.ai (ООО "БЭНИФИТ")
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
