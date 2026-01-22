// src/components/sections/CTA1.tsx

export default function CTA1() {
  return (
    <section id="cta-1" className="relative pt-14 pb-10">
      <div className="mx-auto w-full max-w-[1240px] px-4">
        {/* Заголовки */}
        <div className="text-center">
          <h2 className="text-white font-semibold leading-[0.95] tracking-[-0.02em] text-[24px] sm:text-[32px] lg:text-[42px]">
            Первые ИИ-сотрудники
          </h2>

          <div className="mt-1 text-white font-semibold tracking-[-0.01em] text-[15px] sm:text-[28px] lg:text-[28px]">
            уже готовы работать бесплатно
          </div>
        </div>

        {/* Панель */}
        <div className="mt-10">
          <div
            className="
              relative isolate 
              overflow-hidden
              mx-auto
              w-full
              max-w-[740px]
              rounded-[999px]
              border
              border-white/35
              bg-white/14
              p-2
              backdrop-blur-[26px]
              shadow-[0_14px_60px_rgba(0,0,0,0.05)]
            "
          >
            <div
              className="
                flex
                relative 
                z-10
                items-center
                justify-center
                gap-4
                flex-wrap
                sm:flex-nowrap
              "
            >
              {/* Зарегистрироваться */}
              <a
                href="#"
                className="
                  lg-border
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  rounded-[999px]
                  bg-[#c73f40]
                  px-4
                  text-[13px]
                  font-semibold
                  text-white
                  transition-colors
                  duration-[1400ms]
                  ease-out
                  hover:bg-[#d55556]
                  active:bg-[#b43738]
                  whitespace-nowrap
                "
              >
                Зарегистрироваться
              </a>

              {/* Divider 1 */}
              <div className="hidden sm:block h-10 w-[3px] bg-neutral-150/100 blur-[0.2px]" />

              {/* Соц-кнопки */}
              <div className="flex items-center gap-3">
                {/* Google */}
                <a
                  href="#"
                  aria-label="Google"
                  className="
                    lg-border
                    grid
                    h-10
                    w-10
                    place-items-center
                    rounded-full
                    bg-[#9AA0A6]
                    text-[13px]
                    font-semibold
                    text-white
                    transition-transform
                    duration-[900ms]
                    ease-out
                    hover:scale-[1.08]
                    active:scale-[0.98]
                  "
                >
                  G
                </a>

                {/* Яндекс (наш красный) */}
                <a
                  href="#"
                  aria-label="Яндекс"
                  className="
                    lg-border
                    grid
                    h-10
                    w-10
                    place-items-center
                    rounded-full
                    bg-[#c73f40]
                    text-[13px]
                    font-semibold
                    text-white
                    transition-transform
                    duration-[900ms]
                    ease-out
                    hover:scale-[1.08]
                    active:scale-[0.98]
                  "
                >
                  Я
                </a>

                {/* VK */}
                <a
                  href="#"
                  aria-label="ВКонтакте"
                  className="
                    lg-border
                    grid
                    h-10
                    w-10
                    place-items-center
                    rounded-full
                    bg-[#0077FF]
                    text-[13px]
                    font-semibold
                    text-white
                    transition-transform
                    duration-[900ms]
                    ease-out
                    hover:scale-[1.08]
                    active:scale-[0.98]
                  "
                >
                  VK
                </a>
              </div>

              {/* Divider 2 */}
              <div className="hidden sm:block h-10 w-[3px] bg-neutral-150/100 blur-[0.2px]" />

              {/* Заказать звонок */}
              <a
                href="#"
                aria-label="Заказать звонок"
                className="
                  flex
                  items-center
                  gap-4
                  rounded-[999px]
                  pr-2
                "
              >
                <span
                  className="
                    lg-border
                    grid
                    h-10
                    w-10
                    place-items-center
                    rounded-full
                    bg-[#c73f40]
                    text-white
                    transition-transform
                    duration-[900ms]
                    ease-out
                    hover:scale-[1.08]
                    active:scale-[0.98]
                  "
                >
                  {/* Иконка телефона (stroke = currentColor) */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path
                      d="M21 16.5v2a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.5 2.68 2 2 0 0 1 3.5.5h2a2 2 0 0 1 2 1.72c.12.9.31 1.77.57 2.62a2 2 0 0 1-.45 2.11L6.7 7.87a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.85.26 1.72.45 2.62.57A2 2 0 0 1 21 16.5Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <PhoneIcon className="h-6 w-6 text-white" />
                  </svg>
                </span>

                <span className="text-[13px] font-semibold text-[#c73f40] whitespace-nowrap">
                  Заказать звонок
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
