"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type RoleKey = "sales" | "support" | "kb";

type Msg = {
  id: string;
  from: "user" | "ai";
  text: string;
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

const ROLES: { key: RoleKey; label: string }[] = [
  { key: "sales", label: "Отдел продаж" },
  { key: "support", label: "Тех-поддержка" },
  { key: "kb", label: "Справочник" },
];

const FAQ: Record<
  (typeof NICHES)[number],
  Record<RoleKey, string[]>
> = {
  "Автосервис": {
    sales: [
      "Здравствуйте, сколько стоит замена масла и фильтров?",
      "Есть свободное окно на сегодня после 17:00?",
      "Даёте гарантию на работы и запчасти?",
    ],
    support: [
      "Не открывается карточка клиента, что делать?",
      "Как перенести запись на другое время?",
      "Куда прикрепить фото дефекта по авто?",
    ],
    kb: [
      "Как у нас добавить комментарий к заказ-наряду в AmoCRM?",
      "Где лежит регламент по приёмке автомобиля?",
      "Как оформить возврат по запчасти?",
    ],
  },

  "Стоматологическая клиника": {
    sales: [
      "Здравствуйте, сколько стоит удаление зуба мудрости?",
      "Есть ли свободное окно на консультацию в ближайшие дни?",
      "Можно ли оплатить в рассрочку?",
    ],
    support: [
      "Как перенести запись пациента без потери слота?",
      "Куда загрузить снимок/КТ пациента?",
      "Как оформить возврат/отмену визита?",
    ],
    kb: [
      "Как у нас оформить повторный визит в CRM?",
      "Где регламент по стерилизации инструментов?",
      "Как правильно закрывать смену администратора?",
    ],
  },

  "Ремонт коммерческих помещений": {
    sales: [
      "Сколько будет стоить ремонт помещения 120 м² под ключ?",
      "Какие сроки по проекту и старту работ?",
      "Можно ли сделать смету в 2 вариантах бюджета?",
    ],
    support: [
      "Как согласовать изменения в смете после старта?",
      "Куда загружать фотоотчёты со стройки?",
      "Как оформить акт выполненных работ?",
    ],
    kb: [
      "Где наш шаблон договора под ремонтные работы?",
      "Какой порядок согласования материалов с заказчиком?",
      "Какие этапы контроля качества обязательны?",
    ],
  },

  "Обслуживание мобильных устройств": {
    sales: [
      "Сколько стоит замена экрана на iPhone 13?",
      "Сколько по времени занимает диагностика?",
      "Есть ли гарантия на замену дисплея?",
    ],
    support: [
      "Телефон не включается после падения, что проверить первым?",
      "Как оформить приёмку устройства в системе?",
      "Куда сохраняем фото состояния устройства до ремонта?",
    ],
    kb: [
      "Какие у нас правила по оригинальным и аналоговым запчастям?",
      "Где чек-лист при выдаче устройства клиенту?",
      "Как оформляется возврат по гарантии?",
    ],
  },

  "Аренда квартир": {
    sales: [
      "Здравствуйте, квартира свободна на ближайшие даты?",
      "Какие условия заселения и залога?",
      "Можно ли с животными?",
    ],
    support: [
      "Как продлить проживание, если гость уже заселён?",
      "Что делать, если гость не может попасть в квартиру?",
      "Куда фиксируем инциденты и ущерб?",
    ],
    kb: [
      "Где у нас инструкция по чек-ин/чек-ауту?",
      "Как оформлять возврат залога и в какие сроки?",
      "Какие правила уборки и приёмки после выезда?",
    ],
  },

  "Груминг": {
    sales: [
      "Сколько стоит комплекс для шпицa?",
      "Есть ли запись на выходные?",
      "Как подготовить питомца к грумингу?",
    ],
    support: [
      "Что делать, если клиент опаздывает на 30 минут?",
      "Куда заносим пожелания по стрижке?",
      "Как оформлять повторную запись?",
    ],
    kb: [
      "Какие у нас стандарты по инструментам и обработке?",
      "Где чек-лист мастера по породам?",
      "Как считаем доплаты за колтуны/сложность?",
    ],
  },

  "Производство (b2b)": {
    sales: [
      "Сможете сделать КП на партию 1000 единиц?",
      "Какие сроки производства и поставки?",
      "Есть ли отсрочка платежа для юрлиц?",
    ],
    support: [
      "Как отследить статус заказа по клиенту?",
      "Куда прикреплять спецификацию и чертежи?",
      "Как оформить рекламацию по качеству?",
    ],
    kb: [
      "Где регламент согласования ТЗ с производством?",
      "Какой порядок контроля качества на партии?",
      "Как оформляем закрывающие документы?",
    ],
  },

  "Онлайн-школа": {
    sales: [
      "Сколько стоит курс и что входит?",
      "Есть ли пробный урок/демо-доступ?",
      "Можно ли оплатить частями?",
    ],
    support: [
      "Не приходит письмо с доступом, что делать?",
      "Как восстановить пароль ученику?",
      "Куда писать по техническим проблемам урока?",
    ],
    kb: [
      "Где правила выдачи доступов и переносов уроков?",
      "Как оформлять возврат и в какие сроки?",
      "Где скрипт для менеджера по продажам?",
    ],
  },

  "Детейлинг-студия": {
    sales: [
      "Сколько стоит полировка и керамика на седан?",
      "Сколько по времени занимает услуга?",
      "Есть ли гарантия на покрытие?",
    ],
    support: [
      "Как перенести запись без потери предоплаты?",
      "Куда прикреплять фото до/после?",
      "Как оформить допработы по согласованию с клиентом?",
    ],
    kb: [
      "Где регламент по подготовке кузова под керамику?",
      "Какие материалы используем по стандарту?",
      "Как считаем доплату за сложные элементы?",
    ],
  },

  "Магазин одежды": {
    sales: [
      "Какие размеры есть в наличии и как садится модель?",
      "Есть ли доставка и примерка?",
      "Какие условия возврата?",
    ],
    support: [
      "Как изменить адрес доставки после заказа?",
      "Куда писать, если пришёл брак?",
      "Как проверить статус отправки?",
    ],
    kb: [
      "Где у нас регламент по возвратам и обменам?",
      "Как оформлять списание брака?",
      "Какие правила упаковки и маркировки?",
    ],
  },
};

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function safeTrim(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

async function getAliceAnswer(params: {
  niche: string;
  role: RoleKey;
  question: string;
}): Promise<string> {
  const apiUrl = process.env.NEXT_PUBLIC_ALICE_API_URL;
  const { niche, role, question } = params;

  // Если API не подключён, работаем в мок-режиме (без дисклеймера в UI).
  if (!apiUrl) {
    const roleLabel = ROLES.find((r) => r.key === role)?.label ?? role;
    return [
      `Понял контекст: ниша "${niche}", роль "${roleLabel}".`,
      `Ваш вопрос: "${question}"`,
      "",
      "Пример ответа (демо):",
      "1) Уточню пару деталей, чтобы ответить точно.",
      "2) Дам краткий ответ и следующий шаг.",
      "",
      "Если подключите Alice Ai по API, здесь будут реальные ответы модели.",
    ].join("\n");
  }

  // ВАЖНО: эндпоинт/формат могут отличаться. Подстрой под свой шлюз.
  // Здесь сделан безопасный базовый пример.
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ niche, role, message: question }),
  });

  if (!res.ok) {
    throw new Error(`Alice API error: ${res.status}`);
  }

  const data = (await res.json()) as { reply?: string; text?: string; answer?: string };
  return data.reply ?? data.text ?? data.answer ?? "Ответ получен, но формат не распознан.";
}

export default function DemoChatSection() {
  const [niche, setNiche] = useState<(typeof NICHES)[number]>("Автосервис");
  const [role, setRole] = useState<RoleKey>("sales");

  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [sending, setSending] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const faq = useMemo(() => {
    const byNiche = FAQ[niche] ?? FAQ["Автосервис"];
    return byNiche[role] ?? byNiche.sales;
  }, [niche, role]);

  useEffect(() => {
    // При смене ниши/роли начинаем “чистую” демо-сессию.
    setMessages([]);
    setDraft("");
  }, [niche, role]);

  useEffect(() => {
    // Автоскролл вниз
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, sending]);

  async function send(textRaw: string) {
    const text = safeTrim(textRaw);
    if (!text || sending) return;

    const userMsg: Msg = { id: uid(), from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setDraft("");
    setSending(true);

    try {
      const answer = await getAliceAnswer({ niche, role, question: text });
      const aiMsg: Msg = { id: uid(), from: "ai", text: answer };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      const aiMsg: Msg = {
        id: uid(),
        from: "ai",
        text:
          "Не удалось получить ответ от Alice Ai. Проверьте API URL и доступность сервиса.",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setSending(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    void send(draft);
  }

  return (
    <section id="demo-chat" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-[1240px] px-4">
        <div className="mx-auto max-w-[1240px]">
          {/* Внешняя LiquidGlass-панель (как в секции 3 инфо-блока) */}
          <div
            className="
              relative
              rounded-[34px]
              border border-white/18
              bg-white/10
              p-[10px]
              shadow-[0_22px_70px_rgba(0,0,0,0.05)]
              backdrop-blur-[26px] backdrop-saturate-150
            "
          >
            <div className="pointer-events-none absolute inset-0 rounded-[34px] ring-1 ring-white/10" />

            <div
              className="
                relative
                rounded-[27.5px]
                p-[2px]
                shadow-[0_30px_110px_rgba(0,0,0,0.10)]
                bg-[linear-gradient(90deg,rgba(177,207,235,0.85),rgba(199,63,64,0.55))]
              "
            >
              {/* Сам чат */}
              <div
                className="
                  relative overflow-hidden
                  rounded-[26px]
                  border border-black/5
                  bg-white
                "
              >
                <ChatHeader
                  niche={niche}
                  setNiche={setNiche}
                />

                {messages.length > 0 ? (
  <div className="bg-white px-4 py-3 md:px-6 border-b border-black/5">
    <div className="flex justify-center">
      <RolePills role={role} setRole={setRole} />
    </div>
  </div>
) : null}

                <div
                  ref={listRef}
                  className="
                    relative
                    h-[clamp(420px,60vh,620px)]
                    overflow-auto
                    bg-white
                  "
                >
                  {messages.length === 0 ? (
<div className="absolute inset-0 grid place-items-center px-6">
  <div className="text-center">
    <div className="text-[14px] sm:text-[15px] font-semibold text-[#101828]">
      Выберите нишу и роль, затем задайте вопрос
    </div>
    <div className="mt-1 text-[12px] sm:text-[13px] text-[#667085]">
      Для быстрого старта используйте FAQ-кнопки над строкой ввода.
    </div>

    <div className="lg-border mt-4 flex justify-center">
      <RolePills role={role} setRole={setRole} />
    </div>
  </div>
</div>

                  ) : (
                    <div className="px-5 py-6 md:px-7 md:py-7 space-y-3">
                      {messages.map((m) => (
                        <Bubble key={m.id} from={m.from} text={m.text} />
                      ))}

                      {sending ? (
                        <div className="flex justify-start">
                          <div
                            className=" 
                              lg-border
                              max-w-[78%]
                              rounded-[18px]
                              bg-[#f6f7f9]
                              px-4 py-3
                              text-[13px] text-[#667085]
                            "
                          >
                            Печатает...
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Композер */}
                <div className="lg-border bg-white px-4 pt-3 pb-4 md:px-6">
                  {/* FAQ-кнопки: раскладка без “перевеса” */}
                  <div className="lg-border mb-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {faq.slice(0, 3).map((q) => (
                      <FaqButton key={q} text={q} onClick={() => void send(q)} />
                    ))}
                  </div>

                  <form
                    onSubmit={onSubmit}
                    className="
                      lg-border
                      flex items-center gap-2
                      rounded-[999px]
                      bg-white
                      px-3 py-2
                      shadow-[0_10px_30px_rgba(0,0,0,0.04)]
                    "
                  >
                    <input
                      ref={inputRef}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Сообщение"
                      className="
                        flex-1 bg-transparent px-2
                        text-[14px] text-[#101828]
                        placeholder:text-[#98A2B3]
                        outline-none
                      "
                    />

                    <RoundIconButton
                      type="button"
                      ariaLabel="Записать голосовое"
                      variant="ghost"
                      onClick={() => {
                        // Здесь позже можно подключить реальную запись.
                        // Пока оставляем как декоративную кнопку.
                      }}
                    >
                      <MicIcon />
                    </RoundIconButton>

                    <RoundIconButton
                      type="submit"
                      ariaLabel="Отправить"
                      variant="primary"
                      disabled={sending || safeTrim(draft).length === 0}
                    >
                      <SendIcon />
                    </RoundIconButton>
                  </form>
                </div>
              </div>
            </div>

            {/* Внутренняя “пластика” на внешней панели */}
            <div className="pointer-events-none absolute inset-0 rounded-[34px] bg-[radial-gradient(900px_420px_at_20%_0%,rgba(255,255,255,0.05),transparent_60%),radial-gradient(900px_420px_at_80%_100%,rgba(199,63,64,0.06),transparent_65%)] opacity-80" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ChatHeader(props: { niche: string; setNiche: (v: any) => void }) {
  const { niche, setNiche } = props;

  return (
    <div className="border-b border-black/5">
      <div className="bg-[#f7f7f7] px-4 py-2 md:px-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="justify-self-start">
            <NicheDropdown value={niche} onChange={setNiche} />
          </div>

          <div className="justify-self-center text-center leading-tight">
            <div className="text-[14px] font-semibold tracking-[-0.01em] text-[#101828]">
              ЮНИ.ai
            </div>
            <div className="text-[12px] text-[#667085]">в сети</div>
          </div>

          <div className="justify-self-end">
            <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/45 bg-white/18 shadow-[0_10px_30px_rgba(0,0,0,0.05)] backdrop-blur-[18px]">
              <img
                src="brand/logo.svg"
                alt="ЮНИ.ai"
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RolePills(props: {
  role: RoleKey;
  setRole: (v: RoleKey) => void;
}) {
  const { role, setRole } = props;

  return (
    <div
      className="
        lg-border
        inline-flex flex-wrap items-center justify-center gap-1
        rounded-full
        bg-white
        p-1
        shadow-[0_8px_22px_rgba(0,0,0,0.04)]
      "
    >
      {ROLES.map((r) => (
        <button
          key={r.key}
          type="button"
          aria-pressed={role === r.key}
          onClick={() => setRole(r.key)}
          className={[
            "rounded-full px-4 py-2 text-[13px] font-semibold transition-[transform,background-color,color] duration-[900ms] ease-out active:scale-[0.99]",
            role === r.key
              ? "bg-[#c73f40] text-white shadow-[0_10px_26px_rgba(199,63,64,0.03)]"
              : "bg-transparent text-[#101828] hover:text-[#c73f40] hover:scale-[1.02]",
          ].join(" ")}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

function NicheDropdown(props: {
  value: string;
  onChange: (v: string) => void;
}) {
  const { value, onChange } = props;

  const [open, setOpen] = useState(false);

  const wrapRef = useRef<HTMLDivElement | null>(null); // контейнер кнопки
  const btnRef = useRef<HTMLButtonElement | null>(null); // сама кнопка
  const menuRef = useRef<HTMLDivElement | null>(null); // выпадающее меню (в портале)

  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const updatePos = React.useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const r = btn.getBoundingClientRect();
    const menuWidth = Math.min(360, window.innerWidth - 32); // как раньше, но управляемо

    // Позиция: под кнопкой, с отступом 8px
    const top = Math.round(r.bottom + 8);

    // Не даем уйти за правый край
    const left = Math.round(
      Math.min(r.left, window.innerWidth - 16 - menuWidth)
    );

    setPos({ top, left, width: menuWidth });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePos();
  }, [open, value, updatePos]);

  useEffect(() => {
    if (!open) return;

    const onScroll = () => updatePos();
    const onResize = () => updatePos();

    // capture=true чтобы ловить скроллы любых контейнеров
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, updatePos]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as Node | null;
      if (!t) return;

      const insideButton = !!wrapRef.current?.contains(t);
      const insideMenu = !!menuRef.current?.contains(t);

      if (!insideButton && !insideMenu) setOpen(false);
    }

    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);

    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          lg-border
          inline-flex h-10 items-center gap-2
          rounded-full
          bg-white
          pl-4 pr-3
          text-[14px]
          font-semibold
          text-[#101828]
          shadow-[0_8px_22px_rgba(0,0,0,0.04)]
          outline-none
        "
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {/* это даст “адаптивную” ширину под текст, но не позволит разнести всё */}
        <span className="whitespace-nowrap max-w-[52vw] truncate">{value}</span>
        <span className="text-[#667085]">
          <ChevronDownIcon />
        </span>
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              role="listbox"
              className="
                lg-border
                fixed z-[9999]
                overflow-hidden
                rounded-[16px]
                bg-white
                shadow-[0_18px_55px_rgba(0,0,0,0.10)]
              "
              style={{
                top: pos.top,
                left: pos.left,
                width: pos.width,
                maxWidth: "calc(100vw - 32px)",
              }}
            >
              <div className="max-h-[280px] overflow-auto p-2">
                {NICHES.map((n) => {
                  const active = n === value;
                  return (
                    <button
                      key={n}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        onChange(n);
                        setOpen(false);
                      }}
                      className={[
                        "w-full whitespace-nowrap rounded-[12px] px-3 py-2 text-left text-[14px] transition-colors",
                        active
                          ? "bg-[#c73f40]/10 text-[#c73f40] font-semibold"
                          : "hover:lg-border text-[#101828]",
                      ].join(" ")}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

function Bubble({ from, text }: { from: Msg["from"]; text: string }) {
  const isUser = from === "user";

  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={[
          "max-w-[78%] rounded-[18px] px-4 py-3 text-[13px] leading-[1.5] whitespace-pre-wrap",
          isUser
            ? "bg-[#c73f40] text-white shadow-[0_18px_55px_rgba(199,63,64,0.18)]"
            : "lg-border bg-[#f6f7f9] text-[#101828]",
        ].join(" ")}
      >
        {text}
      </div>
    </div>
  );
}

function FaqButton({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        lg-border
        group
        relative
        inline-flex w-full items-center justify-start
        rounded-full
        bg-white
        px-4 py-3
        text-left
        text-[13px]
        font-normal
        text-[#101828]
        shadow-[0_12px_34px_rgba(0,0,0,0.04)]
        transition-[transform,color,box-shadow]
        duration-[900ms]
        ease-out
        hover:scale-[1.02]
        hover:text-[#c73f40]
        active:scale-[0.99]
      "
      title={text}
    >
      <span className="truncate">{text}</span>

      {/* лёгкая “пластика” */}
      <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-[700ms] bg-[radial-gradient(500px_120px_at_30%_0%,rgba(255,255,255,0.75),transparent_60%)]" />
    </button>
  );
}

function RoundIconButton(props: {
  type: "button" | "submit";
  ariaLabel: string;
  variant: "primary" | "ghost";
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const { type, ariaLabel, variant, disabled, onClick, children } = props;

  const base =
    "grid h-10 w-10 place-items-center rounded-full transition-[transform,opacity,box-shadow] duration-[800ms] ease-out active:scale-[0.97]";
  const ghost =
    "lg-border bg-[#f3f4f6] text-[#475467] hover:scale-[1.05] hover:shadow-[0_10px_26px_rgba(0,0,0,0.03)]";
  const primary =
    "bg-[#c73f40] text-white hover:scale-[1.05] hover:shadow-[0_18px_55px_rgba(199,63,64,0.03)]";

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={[
        base,
        variant === "primary" ? primary : ghost,
        disabled ? "opacity-50 hover:scale-100 hover:shadow-none cursor-not-allowed" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* Icons */

function ChevronDownIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 10l5 5 5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 2L11 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2L15 22l-4-9-9-4L22 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
        d="M12 18v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
