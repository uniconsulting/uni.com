import React from "react";

export default function FooterSection() {
  const linkClass =
    "text-[#0f172a]/80 hover:text-[#c73f40] transition-colors duration-500";

  return (
    <footer className="relative w-full bg-white/82">
      <style>{`
        @keyframes ruBorderShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* мягкий световой фон, без внутренних фреймов */}
      <div className="pointer-events-none absolute inset-0 opacity-80 bg-[radial-gradient(900px_420px_at_20%_0%,rgba(59,130,246,0.10),transparent_60%),radial-gradient(900px_420px_at_80%_100%,rgba(199,63,64,0.10),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/5" />

      <div className="relative mx-auto max-w-[1240px] px-4 py-12 md:py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          {/* Бренд */}
          <div className="lg:max-w-[520px]">
            <a href="#top" className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-black/10 bg-white/55 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-[18px]">
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

            <div className="mt-5 text-[12px] font-semibold text-[#0f172a]/85">
              СТЭП = Стабильность. Точность. Эффективность. Простота.
            </div>

            <div className="mt-5 space-y-1 text-[12px] text-[#0f172a]/70">
              <div>ООО "БЭНИФИТ"</div>
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
                className="inline-flex rounded-full p-[1px] shadow-[0_14px_45px_rgba(0,0,0,0.08)]"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,1), rgba(59,130,246,1), rgba(199,63,64,1), rgba(255,255,255,1))",
                  backgroundSize: "260% 100%",
                  animation: "ruBorderShift 6.5s ease-in-out infinite",
                }}
                aria-label="Продукт сделан в России"
              >
                <div className="rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-[#0f172a]">
                  RU · Продукт сделан в России
                </div>
              </div>
            </div>
          </div>

          {/* Правая часть: 3 раздела с одинаковым интервалом */}
          <div className="ml-auto grid grid-cols-1 sm:grid-cols-3 gap-7 sm:gap-x-7">
            {/* Контакты */}
            <div>
              <div className="text-[12px] font-semibold text-[#0f172a]">
                Контакты
              </div>
              <div className="mt-4 space-y-2 text-[12px]">
                <div>
                  <a className={linkClass} href="tel:+79955186942">
                    +7 (995) 518-69-42
                  </a>
                </div>
                <div>
                  <a
                    className={linkClass}
                    href="https://t.me/uni_smb"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Telegram
                  </a>
                </div>
                <div>
                  <a className={linkClass} href="mailto:uni.kit@mail.ru">
                    uni.kit@mail.ru
                  </a>
                </div>
                <div>
                  <a
                    className={linkClass}
                    href="https://t.me/uni_smb"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Сообщить о проблеме
                  </a>
                </div>
              </div>
            </div>

            {/* Блог */}
            <div>
              <div className="text-[12px] font-semibold text-[#0f172a]">
                Блог
              </div>
              <div className="mt-4 space-y-2 text-[12px]">
                <div>
                  <a
                    className={linkClass}
                    href="https://t.me/uniconsulting"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Telegram-канал
                  </a>
                </div>
                <div>
                  <a
                    className={linkClass}
                    href="https://m.tenchat.ru/u/xuxnFlqD"
                    target="_blank"
                    rel="noreferrer"
                  >
                    TenChat
                  </a>
                </div>
              </div>
            </div>

            {/* Документы */}
            <div>
              <div className="text-[12px] font-semibold text-[#0f172a]">
                Документы
              </div>
              <div className="mt-4 space-y-2 text-[12px]">
                <div>
                  <a className={linkClass} href="/privacy">
                    Политика конфиденциальности
                  </a>
                </div>
                <div>
                  <a className={linkClass} href="/opd-consent">
                    Согласие ОПД клиента
                  </a>
                </div>
                <div>
                  <a className={linkClass} href="/offer">
                    Публичная оферта
                  </a>
                </div>
                <div>
                  <a className={linkClass} href="/cookies">
                    Политика cookies
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя строка */}
        <div className="mt-10 border-t border-black/5 pt-6 text-center text-[12px] text-[#0f172a]/65">
          Copyright © 2026 Uni.ai (ООО "БЭНИФИТ")
        </div>
      </div>
    </footer>
  );
}
