"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type RoleKey = "sales" | "support" | "handbook";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const ACCENT = "#c73f40";

const ROLE_LABEL: Record<RoleKey, string> = {
  sales: "Отдел продаж",
  support: "Тех-поддержка",
  handbook: "Справочник",
};

const NICHES = [
  "Ремонт коммерческих помещений",
  "Автосервис",
  "Обслуживание мобильных устройств",
  "Аренда квартир",
  "Стоматологическая клиника",
  "Груминг",
  "Производство (b2b)",
  "Онлайн-школа",
  "Детейлинг-студия",
  "Магазин одежды",
] as const;

type Niche = (typeof NICHES)[number];

const FAQ: Record<Niche, Record<RoleKey, string[]>> = {
  "Ремонт коммерческих помещений": {
    sales: [
      "Здравствуйте, сколько стоит ремонт офиса 120 м² под ключ?",
      "Сколько занимает ремонт помещения в среднем?",
      "Можете посчитать смету по плану и ТЗ?",
    ],
    support: [
      "Как узнать статус работ по объекту?",
      "Как согласовать допработы, если появились в процессе?",
      "Куда отправить фото/видео для оценки?",
    ],
    handbook: [
      "Где у нас шаблон сметы и акта выполненных работ?",
      "Как оформить согласование допработ?",
      "Какой регламент по сдаче этапов?",
    ],
  },
  Автосервис: {
    sales: [
      "Здравствуйте, сколько стоит замена масла и фильтров?",
      "Есть свободное окно на сегодня после 17:00?",
      "Даете гарантию на работы и запчасти?",
    ],
    support: [
      "Как узнать статус заказа-наряда?",
      "После ремонта загорелся чек, что делать?",
      "Можно ли привезти свои запчасти?",
    ],
    handbook: [
      "Как у нас добавить комментарий к заказ-наряду в amoCRM?",
      "Где шаблон акта/заказ-наряда?",
      "Как оформить возврат/рекламацию?",
    ],
  },
  "Обслуживание мобильных устройств": {
    sales: [
      "Сколько стоит замена экрана на iPhone 13?",
      "Сколько времени занимает диагностика?",
      "Какая гарантия на ремонт?",
    ],
    support: [
      "Телефон греется после ремонта, это нормально?",
      "Как проверить статус ремонта?",
      "Что делать, если не работает Face ID?",
    ],
    handbook: [
      "Как оформить приём устройства и согласие клиента?",
      "Где чек-лист диагностики?",
      "Как фиксировать заменённые детали в системе?",
    ],
  },
  "Аренда квартир": {
    sales: [
      "Здравствуйте, есть ли 1-комнатная в центре на месяц?",
      "Какие условия по залогу и комиссии?",
      "Можно ли с животными?",
    ],
    support: [
      "Как записаться на просмотр?",
      "Какие документы нужны для заселения?",
      "Как продлить аренду на следующий месяц?",
    ],
    handbook: [
      "Где шаблон договора аренды и акта передачи?",
      "Как проверяем арендатора по регламенту?",
      "Какие правила по возврату залога?",
    ],
  },
  "Стоматологическая клиника": {
    sales: [
      "Здравствуйте, сколько стоит удаление зуба мудрости?",
      "Можно записаться на завтра после 18:00?",
      "Какая гарантия на имплантацию?",
    ],
    support: [
      "Как подготовиться к удалению зуба?",
      "Что делать, если болит после пломбы?",
      "Как отменить или перенести запись?",
    ],
    handbook: [
      "Где в CRM смотреть историю пациента?",
      "Как оформить возврат предоплаты?",
      "Как создать задачу врачу/администратору?",
    ],
  },
  Груминг: {
    sales: [
      "Сколько стоит стрижка шпица?",
      "Есть ли свободные окна на выходных?",
      "Можно ли сделать экспресс-услугу за 1 час?",
    ],
    support: [
      "Как подготовить питомца к грумингу?",
      "Что делать, если питомец агрессивный?",
      "Можно ли присутствовать на процедуре?",
    ],
    handbook: [
      "Как фиксируем особенности питомца в карточке клиента?",
      "Где прайс и регламент по породам?",
      "Как оформить предоплату и перенос записи?",
    ],
  },
  "Производство (b2b)": {
    sales: [
      "Здравствуйте, какие сроки производства партии 1000 шт?",
      "Можно получить КП и спецификацию?",
      "Какие условия оплаты и доставки?",
    ],
    support: [
      "Как отследить статус заказа и отгрузки?",
      "Как оформить рекламацию по партии?",
      "Куда отправлять техтребования/чертежи?",
    ],
    handbook: [
      "Где шаблон КП, договора и спецификации?",
      "Какой регламент согласования ТЗ клиента?",
      "Как ведём учёт изменений по версии спецификации?",
    ],
  },
  "Онлайн-школа": {
    sales: [
      "Здравствуйте, чем ваш курс отличается от других?",
      "Сколько длится обучение и есть ли рассрочка?",
      "Какие результаты у студентов?",
    ],
    support: [
      "Не получается войти в личный кабинет, что делать?",
      "Где найти домашние задания и записи уроков?",
      "Как получить сертификат?",
    ],
    handbook: [
      "Где шаблоны ответов поддержки и скрипты продаж?",
      "Как оформить возврат и заморозку обучения?",
      "Как добавить ученика в группу/поток?",
    ],
  },
  "Детейлинг-студия": {
    sales: [
      "Сколько стоит полировка кузова и керамика?",
      "Сколько времени занимает комплексная мойка?",
      "Есть ли гарантия на покрытие?",
    ],
    support: [
      "Как подготовить авто перед приездом?",
      "Можно ли оставить авто на ночь?",
      "Что делать, если пошли разводы после мойки?",
    ],
    handbook: [
      "Где прайс и чек-лист работ по пакетам?",
      "Как фиксировать состояние авто до/после?",
      "Как оформить претензию клиента по регламенту?",
    ],
  },
  "Магазин одежды": {
    sales: [
      "Есть ли размер M в этой модели?",
      "Какие условия доставки и примерки?",
      "Есть ли скидки при покупке 2+ вещей?",
    ],
    support: [
      "Как оформить возврат или обмен?",
      "Сколько дней доставка по городу?",
      "Где отследить заказ?",
    ],
    handbook: [
      "Где регламент возвратов и шаблоны ответов?",
      "Как оформить списание/перемещение товара?",
      "Как быстро проверить остатки по складам?",
    ],
  },
};

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

async function callAliceApi(args: {
  message: string;
  niche: Niche;
  role: RoleKey;
  history: Array<{ role: "user" | "assistant"; content: string }>;
}): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_ALICE_API_URL;

  // Если API URL не задан — работаем в демо-режиме (мок), чтобы UI всегда был “живым”.
  if (!baseUrl) {
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));
    const roleHint =
      args.role === "sales"
        ? "Как менеджер по продажам: "
        : args.role === "support"
        ? "Как техподдержка: "
        : "Как внутренний справочник: ";
    return (
      roleHint +
      `принял запрос по направлению “${args.niche}”. Если подключить Alice Ai по API, здесь будет реальный ответ модели.`
    );
  }

  // Ожидаемый контракт можно подстроить под вашу сторону. Сейчас максимально нейтрально.
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider: "Alice Ai",
      niche: args.niche,
      role: args.role,
      message: args.message,
      history: args.history,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Alice API error: ${res.status} ${text}`);
  }

  const data = (await res.json().catch(() => ({}))) as any;

  // Поддержим несколько вариантов ответа
  return (
    data.reply ||
    data.answer ||
    data.message ||
    "Ответ получен, но формат не распознан. Проверь контракт API."
  );
}

export default function DemoChatSection() {
  const [nicheOpen, setNicheOpen] = useState(false);
  const [niche, setNiche] = useState<Niche>("Автосервис");
  const [role, setRole] = useState<RoleKey>("sales");

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const faq = useMemo(() => FAQ[niche][role].slice(0, 3), [niche, role]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isSending]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!nicheOpen) return;
      const t = e.target as Node | null;
      if (!t) return;
      if (wrapRef.current && !wrapRef.current.contains(t)) setNicheOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [nicheOpen]);

  function resetConversation() {
    setMessages([]);
    setInput("");
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const userMsg: Message = { id: uid(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSending(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.text,
      }));

      const replyText = await callAliceApi({
        message: trimmed,
        niche,
        role,
        history,
      });

      const botMsg: Message = { id: uid(), role: "assistant", text: replyText };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e: any) {
      const botMsg: Message = {
        id: uid(),
        role: "assistant",
        text:
          "Не удалось получить ответ от Alice Ai. Проверьте API URL/доступность и CORS. " +
          (e?.message ? `(${e.message})` : ""),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section id="demo-chat" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-[1240px] px-4">
        <div className="mx-auto max-w-[1100px]">
          {/* Внешний “деликатный двойной кант” */}
          <div className="relative rounded-[48px] p-[2px] shadow-[0_30px_110px_rgba(0,0,0,0.10)]">
            <div className="pointer-events-none absolute inset-0 rounded-[48px] opacity-70 blur-[0.2px] bg-[linear-gradient(90deg,rgba(90,190,255,0.65),rgba(255,255,255,0.00),rgba(199,63,64,0.65))] animate-pulse" />
            <div className="pointer-events-none absolute inset-[1px] rounded-[47px] opacity-70 bg-[linear-gradient(90deg,rgba(90,190,255,0.35),rgba(255,255,255,0.00),rgba(199,63,64,0.35))]" />

            {/* Основной стеклянный контейнер */}
            <div className="relative overflow-hidden rounded-[46px] border border-white/30 bg-white/55 backdrop-blur-[26px] backdrop-saturate-150">
              {/* Header */}
              <div className="px-5 pt-5 md:px-6 md:pt-6">
                <div className="flex items-center justify-between gap-3">
                  {/* Niche dropdown */}
                  <div className="relative" ref={wrapRef}>
                    <button
                      type="button"
                      onClick={() => setNicheOpen((v) => !v)}
                      className="
                        inline-flex items-center gap-2
                        h-10 px-4
                        rounded-full
                        border border-black/10 bg-white/70
                        shadow-[0_12px_40px_rgba(0,0,0,0.06)]
                        backdrop-blur-[10px]
                        text-[13px] font-semibold text-black/80
                        transition-[transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                        hover:scale-[1.03] active:scale-[0.985]
                      "
                      aria-haspopup="listbox"
                      aria-expanded={nicheOpen}
                    >
                      <span className="truncate max-w-[190px] md:max-w-[240px]">
                        {niche ? niche : "Выбрать нишу"}
                      </span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        className="opacity-70"
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {nicheOpen && (
                      <div
                        className="
                          absolute left-0 mt-2 w-[320px] max-w-[calc(100vw-32px)]
                          rounded-[18px]
                          border border-black/10 bg-white/85
                          shadow-[0_18px_70px_rgba(0,0,0,0.12)]
                          backdrop-blur-[18px]
                          overflow-hidden
                          z-20
                        "
                        role="listbox"
                      >
                        <div className="max-h-[280px] overflow-auto py-2">
                          {NICHES.map((item) => {
                            const active = item === niche;
                            return (
                              <button
                                key={item}
                                type="button"
                                onClick={() => {
                                  setNiche(item);
                                  setNicheOpen(false);
                                  resetConversation();
                                }}
                                className={[
                                  "w-full text-left px-4 py-2.5 text-[13px] font-semibold",
                                  "transition-colors",
                                  active
                                    ? "text-black bg-black/5"
                                    : "text-black/80 hover:bg-black/5",
                                ].join(" ")}
                              >
                                {item}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Center title */}
                  <div className="text-center leading-tight">
                    <div className="text-[14px] md:text-[15px] font-extrabold text-black/85">
                      ЮНИ.ai
                    </div>
                    <div className="text-[11px] md:text-[12px] font-semibold text-black/45">
                      в сети
                    </div>
                  </div>

                  {/* Profile dot */}
                  <div className="h-10 w-10 rounded-full border border-black/10 bg-white/70 grid place-items-center shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                    <div className="h-3.5 w-3.5 rounded-full bg-black/60" />
                  </div>
                </div>

                {/* Role selector */}
                <div className="mt-4 flex items-center justify-center md:justify-start">
                  <div
                    className="
                      inline-flex items-center gap-1
                      rounded-full p-1
                      border border-black/10 bg-white/55
                      backdrop-blur-[10px]
                      shadow-[0_12px_40px_rgba(0,0,0,0.06)]
                    "
                    role="tablist"
                    aria-label="Роль ИИ-сотрудника"
                  >
                    {(Object.keys(ROLE_LABEL) as RoleKey[]).map((k) => {
                      const active = k === role;
                      return (
                        <button
                          key={k}
                          type="button"
                          onClick={() => {
                            setRole(k);
                            resetConversation();
                          }}
                          className={[
                            "h-9 px-3 md:px-4 rounded-full text-[12px] font-extrabold",
                            "transition-[transform,background-color,color] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                            "hover:scale-[1.02] active:scale-[0.985]",
                            active
                              ? "text-white"
                              : "text-black/70 hover:text-black/80",
                          ].join(" ")}
                          style={active ? { backgroundColor: ACCENT } : undefined}
                          role="tab"
                          aria-selected={active}
                        >
                          {ROLE_LABEL[k]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5 h-px bg-black/5" />
              </div>

              {/* Chat body */}
              <div className="px-5 md:px-6">
                <div className="h-[520px] md:h-[620px] py-6 overflow-auto">
                  {messages.length === 0 ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="max-w-[520px] text-center">
                        <div className="text-[14px] md:text-[15px] font-extrabold text-black/70">
                          Выберите нишу и роль, затем задайте вопрос
                        </div>
                        <div className="mt-2 text-[12px] md:text-[13px] font-semibold text-black/45">
                          Для быстрого старта используйте FAQ-кнопки над строкой ввода.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((m) => {
                        const isBot = m.role === "assistant";
                        return (
                          <div
                            key={m.id}
                            className={[
                              "flex",
                              isBot ? "justify-start" : "justify-end",
                            ].join(" ")}
                          >
                            <div
                              className={[
                                "max-w-[82%] md:max-w-[70%]",
                                "rounded-[18px] px-4 py-3",
                                "text-[13px] md:text-[14px] font-semibold leading-relaxed",
                                "shadow-[0_18px_60px_rgba(0,0,0,0.08)]",
                                isBot
                                  ? "text-white"
                                  : "text-black/80 border border-black/10 bg-white/75",
                              ].join(" ")}
                              style={isBot ? { backgroundColor: ACCENT } : undefined}
                            >
                              {m.text}
                            </div>
                          </div>
                        );
                      })}
                      {isSending && (
                        <div className="flex justify-start">
                          <div
                            className="rounded-[18px] px-4 py-3 text-[13px] md:text-[14px] font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.08)]"
                            style={{ backgroundColor: ACCENT }}
                          >
                            Печатает…
                          </div>
                        </div>
                      )}
                      <div ref={endRef} />
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom / input */}
              <div className="px-5 pb-5 md:px-6 md:pb-6">
                {/* FAQ buttons */}
                <div className="mb-3 flex flex-wrap gap-2">
                  {faq.map((q) => (
                    <button
                      key={q}
                      type="button"
                      disabled={isSending}
                      onClick={() => send(q)}
                      className="
                        inline-flex items-center
                        h-9 md:h-10
                        px-4 md:px-5
                        rounded-full
                        border border-black/10 bg-white/70
                        text-[12px] md:text-[13px] font-extrabold text-black/70
                        shadow-[0_12px_40px_rgba(0,0,0,0.06)]
                        backdrop-blur-[10px]
                        transition-[transform] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                        hover:scale-[1.03] active:scale-[0.985]
                        disabled:opacity-60 disabled:hover:scale-100
                      "
                      title={q}
                    >
                      <span className="truncate max-w-[280px] md:max-w-[340px]">
                        {q}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Input panel */}
                <div
                  className="
                    flex items-center gap-3
                    rounded-[22px]
                    border border-black/10 bg-white/70
                    shadow-[0_18px_70px_rgba(0,0,0,0.08)]
                    backdrop-blur-[18px]
                    px-3 py-2
                  "
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") send(input);
                    }}
                    placeholder="Сообщение"
                    className="
                      w-full bg-transparent
                      px-3 py-2
                      text-[14px] font-semibold text-black/70
                      placeholder:text-black/35
                      outline-none
                    "
                    disabled={isSending}
                    aria-label="Сообщение"
                  />

                  {/* Send button (inside panel) */}
                  <button
                    type="button"
                    onClick={() => send(input)}
                    disabled={isSending || !input.trim()}
                    className="
                      h-10 w-10 rounded-full
                      border border-black/10 bg-white/75
                      grid place-items-center
                      transition-[transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                      hover:scale-[1.05] active:scale-[0.98]
                      disabled:opacity-50 disabled:hover:scale-100
                    "
                    aria-label="Отправить"
                    title="Отправить"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className="text-black/60"
                    >
                      <path
                        d="M22 2L11 13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 2L15 22l-4-9-9-4 20-7z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* Mic button */}
                  <button
                    type="button"
                    onClick={() => {
                      // Заглушка под голос (по ТЗ нужна кнопка)
                      // Можно будет подключить WebSpeech/вашу запись позже
                    }}
                    className="
                      h-10 w-10 rounded-full
                      grid place-items-center
                      transition-[transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                      hover:scale-[1.05] active:scale-[0.98]
                    "
                    style={{ backgroundColor: ACCENT }}
                    aria-label="Микрофон"
                    title="Микрофон"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className="text-white"
                    >
                      <path
                        d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19 11a7 7 0 0 1-14 0"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 18v4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {/* мелкая подсказка под API */}
                <div className="mt-3 text-center text-[11px] font-semibold text-black/35">
                  {process.env.NEXT_PUBLIC_ALICE_API_URL
                    ? "Подключение: Alice Ai (API)"
                    : "Демо-режим: ответы сейчас моковые (задай NEXT_PUBLIC_ALICE_API_URL для реального API)."}
                </div>
              </div>
            </div>
          </div>

          {/* small spacing under component */}
          <div className="h-1" />
        </div>
      </div>
    </section>
  );
}
