import React from "react";

type InfoBlock = {
  title: React.ReactNode;
  text: string;
  flip?: boolean; // окно слева, текст справа
};

const BLOCKS: InfoBlock[] = [
  {
    title: "Не знаете, с чего начать?",
    text:
      "Представьте, что Вам необходимо составить вакансию. Опишите именно те функции, которые для Вас важны. Встроенный помощник составит должностную инструкцию, а далее…",
    flip: false,
  },
  {
    title: (
      <>
        Простые, понятные, <br />
        бесплатные уроки
      </>
    ),
    text:
      "Мы позаботились о том, чтобы Ваш опыт построения ИИ-команды принёс удовольствие. Обучающие материалы и подсказки будут рядом на каждом этапе.",
    flip: true,
  },
  {
    title: (
      <>
        Больше, чем кабинет <br />
        – это виртуальный офис
      </>
    ),
    text:
      "Управляйте ботами для Telegram, VK и Avito из единого интерфейса. Настраивайте поведение, подключайте базы знаний и анализируйте результаты.",
    flip: false,
  },
];

export default function InfoBlocks() {
  return (
    <section id="product" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-[1240px] px-4">
        {/* Общая LiquidGlass-рамка под все 3 карточки (как у плейсхолдера в Hero) */}
        <div
          className="
            relative mx-auto max-w-[1240px]
            rounded-[34px]
            border border-white/18
            bg-white/10
            p-[10px]
            shadow-[0_22px_70px_rgba(0,0,0,0.05)]
            backdrop-blur-[26px] backdrop-saturate-150
          "
        >
          {/* Лёгкий внутренний хайлайт */}
          <div className="pointer-events-none absolute inset-0 rounded-[34px] ring-1 ring-white/10" />

          <div className="relative space-y-4 md:space-y-6">
            {BLOCKS.map((b, idx) => (
              <InfoCard
                key={idx}
                title={b.title}
                text={b.text}
                flip={!!b.flip}
              />
            ))}
          </div>

          {/* Очень тонкая “пластика” внутри общего контейнера */}
          <div className="pointer-events-none absolute inset-0 rounded-[34px] bg-[radial-gradient(900px_420px_at_20%_0%,rgba(255,255,255,0.05),transparent_60%),radial-gradient(900px_420px_at_80%_100%,rgba(199,63,64,0.06),transparent_65%)] opacity-80" />
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  title,
  text,
  flip,
}: {
  title: React.ReactNode;
  text: string;
  flip: boolean;
}) {
  return (
    <article
      className="
        relative overflow-hidden
        rounded-[26px]
        border border-white/22
        bg-white/65
        shadow-[0_18px_55px_rgba(0,0,0,0.05)]
        backdrop-blur-[20px] backdrop-saturate-150
      "
    >
      {/* Внутренний soft-gradient (деликатно, чтобы не “мутнить” текст) */}
      <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(800px_260px_at_20%_10%,rgba(255,255,255,0.40),transparent_55%),radial-gradient(700px_280px_at_85%_90%,rgba(177,207,235,0.35),transparent_60%)]" />

      <div className="relative grid items-center gap-6 p-6 md:grid-cols-12 md:gap-10 md:p-10">
        {/* Медиа */}
        <div className={flip ? "md:col-span-6 md:order-1" : "md:col-span-6 md:order-2"}>
          <MediaPlaceholder />
        </div>

        {/* Текст */}
        <div className={flip ? "md:col-span-6 md:order-2" : "md:col-span-6 md:order-1"}>
          <h3 className="text-[20px] sm:text-[22px] md:text-[28px] font-[650] tracking-[-0.02em] leading-[1.06] text-[#121212]">
            {title}
          </h3>

          <p className="mt-3 text-[14px] sm:text-[15px] leading-[1.5] text-[#667085]">
            {text}
          </p>
        </div>
      </div>
    </article>
  );
}

function MediaPlaceholder() {
  return (
    <div
      className="
        relative
        rounded-[18px]
        border border-white/22
        bg-white/10
        p-[10px]
        shadow-[0_20px_60px_rgba(0,0,0,0.05)]
        backdrop-blur-[22px] backdrop-saturate-150
      "
    >
      <div className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-white/10" />

      {/* Белая вставка 16:9 */}
      <div
        className="
          relative overflow-hidden
          rounded-[12px]
          border border-white/22
          bg-white/75
          aspect-video
        "
      >
        <div className="absolute inset-0 grid place-items-center px-6 text-center">
          <div>
            <div className="text-[13px] font-semibold text-[#0f172a]/65">
              16:9 окно
            </div>
            <div className="mt-1 text-[12px] text-[#0f172a]/40">
              (вставим скрин/видео позже)
            </div>
          </div>
        </div>
      </div>

      {/* Тонкая внутренняя пластика */}
      <div className="pointer-events-none absolute inset-0 rounded-[12px] bg-[radial-gradient(700px_220px_at_30%_0%,rgba(255,255,255,0.06),transparent_60%),radial-gradient(700px_260px_at_80%_100%,rgba(199,63,64,0.05),transparent_65%)] opacity-80" />
    </div>
  );
}
