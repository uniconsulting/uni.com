"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Role = "sales" | "support" | "handbook";

type Message = {
  id: string;
  from: "user" | "ai";
  text: string;
  ts: number;
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

const ROLE_LABEL: Record<Role, string> = {
  sales: "Отдел продаж",
  support: "Тех-поддержка",
  handbook: "Справочник",
};

// FAQ под каждую нишу/роль: можно расширять сколько угодно
const FAQ: Partial<Record<(typeof NICHES)[number], Record<Role, string[]>>> = {
  "Стоматологическая клиника": {
    sales: [
      "Здравствуйте, сколько стоит удаление зуба мудрости?",
      "Можно записаться на сегодня, есть свободные окна?",
      "Какие акции сейчас действуют на чистку?",
    ],
    support: [
      "Не проходит оплата на сайте, что проверить?",
      "Не приходит SMS с подтверждением записи",
      "Как отменить/перенести запись без звонка?",
    ],
    handbook: [
      "Какие услуги входят в первичную консультацию?",
      "Правила возврата предоплаты",
      "Какой стандарт ответа в чате в нерабочее время?",
    ],
  },
  Автосервис: {
    sales: [
      "Сколько стоит диагностика подвески и когда можно приехать?",
      "Есть ли гарантия на работы и запчасти?",
      "Сориентируйте по срокам ремонта, если оставить авто сегодня",
    ],
    support: [
      "Не вижу статус заказ-наряда, что делать?",
      "Клиенту не пришло уведомление о готовности",
      "Как исправить номер телефона в карточке клиента?",
    ],
    handbook: [
      "Как у нас добавить комментарий к заказ-наряду в amoCRM?",
      "Шаблон: что писать клиенту при переносе сроков",
      "Регламент: как фиксировать согласование работ",
    ],
  },
};

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function getFallbackFaq(niche: string, role: Role) {
  // Универсальные подсказки, если для ниши нет явного словаря
  if (role === "sales") {
    return [
      `Здравствуйте! Подскажите по стоимости и срокам для "${niche}"`,
      "Есть ли свободное время/окна на сегодня или завтра?",
      "Можно коротко: что входит в услугу и какие условия?",
    ];
  }
  if (role === "support") {
    return [
      "Не получается выполнить действие в кабинете, поможете?",
      "Как быстро решить типовую ошибку пользователя?",
      "Куда смотреть логи/статус интеграции?",
    ];
  }
  return [
    "Где найти инструкцию по процессу для сотрудников?",
    "Какой у нас стандарт ответов клиенту в этом кейсе?",
    "Какая последовательность действий по регламенту?",
  ];
}

// Заглушка под Alice AI: позже подменишь на реальный fetch к вашему API
async function askAliceAi(payload: {
  niche: string;
  role: Role;
  message: string;
}): Promise<string> {
  // Пример, куда подключаться:
  // const r = await fetch("/api/alice", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(payload) });
  // const data = await r.json(); return data.answer;

  // Временная имитация “умного” ответа
  await new Promise((res) => setTimeout(res, 650));
  const { niche, role, message } = payload;

  const roleTone =
    role === "sales"
      ? "Понял. Давайте уточню пару деталей и сориентирую по стоимости и срокам."
      : role === "support"
      ? "Ок, давайте разберемся. Скажи, на каком шаге и что именно видишь?"
      : "Отвечаю по внутренним правилам и инструкции.";

  return `${roleTone}\n\nКонтекст: ниша "${niche}".\nЗапрос: ${message}`;
}

export default function DemoChatSection({
  initialNiche = "Автосервис",
  initialRole = "sales",
  onNicheChange,
}: {
  initialNiche?: (typeof NICHES)[number];
  initialRole?: Role;
  onNicheChange?: (niche: (typeof NICHES)[number]) => void;
}) {
  const [niche, setNiche] = useState<(typeof NICHES)[number]>(initialNiche);
  const [role, setRole] = useState<Role>(initialRole);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // dropdown
  const [openNiche, setOpenNiche] = useState(false);
  const nicheBtnRef = useRef<HTMLButtonElement | null>(null);
  const nicheDropRef = useRef<HTMLDivElement | null>(null);

  // auto-scroll
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const faq = useMemo(() => {
    const dict = FAQ[niche];
    return dict?.[role] ?? getFallbackFaq(niche, role);
  }, [niche, role]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!openNiche) return;
      const t = e.target as Node;
      if (nicheBtnRef.current?.contains(t)) return;
      if (nicheDropRef.current?.contains(t)) return;
      setOpenNiche(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [openNiche]);

  useEffect(() => {
    // скролл вниз при новых сообщениях
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, isTyping]);

  function applyNiche(n: (typeof NICHES)[number]) {
    setNiche(n);
    onNicheChange?.(n);
    setOpenNiche(false);

    // аккуратно “сбрасываем контекст”, чтобы демо выглядело чисто
    setMessages([]);
    setInput("");
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = {
      id: uid(),
      from: "user",
      text: trimmed,
      ts: Date.now(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const answer = await askAliceAi({ niche, role, message: trimmed });
      const aiMsg: Message = {
        id: uid(),
        from: "ai",
        text: answer,
        ts: Date.now(),
      };
      setMessages((m) => [...m, aiMsg]);
    } catch {
      const aiMsg: Message = {
        id: uid(),
        from: "ai",
        text: "Не получилось получить ответ от модели. Попробуйте ещё раз.",
        ts: Date.now(),
      };
      setMessages((m) => [...m, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <section id="demo-chat" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-[1240px] px-4">
        <div className="mx-auto max-w-[1100px]">
          {/* Внешний “деликатный двойной акцент” по контуру (голубой слева, красный справа), зациклено */}
          <div className="demoBorder relative rounded-[48px] p-[2px] shadow-[0_30px_110px_rgba(0,0,0,0.10)]">
            <div
              className="
                relative overflow-hidden
                rounded-[46px]
                border border-white/30
                bg-white/55
                backdrop-blur-[26px] backdrop-saturate-150
              "
            >
              {/* мягкая пластика */}
              <div className="pointer-events-none absolute inset-0 opacity-80 demoInnerSheen" />

              {/* TOP BAR */}
              <div className="relative flex items-center justify-between px-4 sm:px-6 py-3">
                {/* left: choose niche */}
                <div className="relative">
                  <button
                    ref={nicheBtnRef}
                    type="button"
                    onClick={() => setOpenNiche((v) => !v)}
                    className="
                      inline-flex items-center gap-2
                      rounded-full
                      border border-black/10
                      bg-white/75
                      px-4 py-2
                      text-[14px] font-[500] text-[#111827]/80
                      backdrop-blur-[18px] backdrop-saturate-150
                      shadow-[0_12px_40px_rgba(0,0,0,0.06)]
                      transition-[transform] duration-[700ms] ease-out
                      hover:scale-[1.03] active:scale-[0.99]
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70
                    "
                    aria-haspopup="listbox"
                    aria-expanded={openNiche}
                  >
                    <span>Выбрать нишу</span>
                    <ChevronDown />
                  </button>

                  {openNiche && (
                    <div
                      ref={nicheDropRef}
                      className="
                        absolute left-0 mt-3 z-20
                        w-[320px] max-w-[82vw]
                        rounded-[22px]
                        border border-white/40
                        bg-white/80
                        backdrop-blur-[22px] backdrop-saturate-150
                        shadow-[0_26px_90px_rgba(0,0,0,0.12)]
                        overflow-hidden
                      "
                      role="listbox"
                    >
                      <div className="px-3 py-2 text-[12px] text-[#0f172a]/55">
                        Выберите направление, чтобы увидеть стиль ответов
                      </div>
                      <div className="max-h-[320px] overflow-auto px-2 pb-2">
                        {NICHES.map((n) => {
                          const active = n === niche;
                          return (
                            <button
                              key={n}
                              type="button"
                              onClick={() => applyNiche(n)}
                              className={`
                                w-full text-left
                                rounded-[16px]
                                px-3 py-2
                                text-[14px]
                                transition-colors duration-200
                                ${active ? "bg-black/5 text-[#111827]" : "hover:bg-black/5 text-[#111827]/85"}
                              `}
                            >
                              {n}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* center: brand */}
                <div className="text-center leading-tight">
                  <div className="text-[14px] font-[700] tracking-[-0.01em] text-[#0f172a]/85">
                    юни.ai
                  </div>
                  <div className="mt-[1px] text-[12px] text-[#0f172a]/45">
                    в сети
                  </div>
                </div>

                {/* right: profile */}
                <div className="flex items-center gap-2">
                  <div
                    className="
                      h-9 w-9 rounded-full
                      border border-black/10
                      bg-white/70
                      grid place-items-center
                      text-[13px] font-[800] text-[#0f172a]/70
                      shadow-[0_14px_45px_rgba(0,0,0,0.08)]
                    "
                    aria-label="Профиль"
                    title="Профиль"
                  >
                    U
                  </div>
                </div>
              </div>

              {/* ROLE SELECTOR (отдельно, чтобы не ломать референс top-bar) */}
              <div className="relative px-4 sm:px-6 pb-3">
                <div
                  className="
                    inline-flex items-center gap-1
                    rounded-full
                    border border-black/10
                    bg-white/70
                    p-1
                    backdrop-blur-[18px] backdrop-saturate-150
                    shadow-[0_14px_50px_rgba(0,0,0,0.07)]
                  "
                  role="tablist"
                  aria-label="Роль ИИ-сотрудника"
                >
                  {(["sales", "support", "handbook"] as Role[]).map((r) => {
                    const active = r === role;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setRole(r);
                          setMessages([]);
                          setInput("");
                        }}
                        className={`
                          relative rounded-full px-4 py-2
                          text-[13px] font-[600]
                          transition-[transform,background-color,color] duration-[700ms] ease-out
                          hover:scale-[1.03] active:scale-[0.99]
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70
                          ${active ? "bg-white text-[#0f172a]" : "bg-transparent text-[#0f172a]/60 hover:text-[#c73f40]"}
                        `}
                        role="tab"
                        aria-selected={active}
                      >
                        {ROLE_LABEL[r]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CHAT AREA */}
              <div
                className="
                  relative mx-4 sm:mx-6
                  rounded-[28px]
                  border border-black/10
                  bg-white/75
                  overflow-hidden
                "
              >
                <div
                  ref={scrollRef}
                  className="h-[420px] md:h-[520px] overflow-auto px-4 sm:px-6 py-5"
                >
                  {messages.length === 0 ? (
                    <div className="mt-2 text-center text-[13px] text-[#0f172a]/35">
                      Выберите нишу и роль, затем задайте вопрос или нажмите на подсказку ниже
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((m) => (
                        <ChatBubble key={m.id} from={m.from} text={m.text} />
                      ))}

                      {isTyping && (
                        <div className="flex justify-start">
                          <div
                            className="
                              rounded-[18px] rounded-bl-[6px]
                              bg-[#c73f40]
                              text-white
                              px-4 py-3
                              shadow-[0_16px_50px_rgba(199,63,64,0.18)]
                            "
                          >
                            <TypingDots />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* BOTTOM: FAQ + INPUT */}
                <div className="border-t border-black/10 bg-white/55 px-4 sm:px-6 py-4">
                  {/* FAQ chips */}
                  <div className="mb-3 flex gap-2 overflow-auto pb-1">
                    {faq.slice(0, 4).map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => send(q)}
                        className="
                          shrink-0
                          rounded-full
                          border border-black/10
                          bg-white/70
                          px-4 py-2
                          text-[13px] font-[500]
                          text-[#0f172a]/75
                          shadow-[0_14px_45px_rgba(0,0,0,0.06)]
                          backdrop-blur-[18px] backdrop-saturate-150
                          transition-[transform,color,background-color] duration-[850ms] ease-out
                          hover:scale-[1.04] hover:text-[#c73f40]
                          active:scale-[0.99]
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70
                        "
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* input row */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="Сообщение"
                        className="
                          w-full
                          rounded-full
                          border border-black/10
                          bg-white/80
                          px-5 py-4 pr-[92px]
                          text-[15px]
                          text-[#0f172a]/85
                          placeholder:text-[#0f172a]/35
                          outline-none
                          shadow-[0_18px_60px_rgba(0,0,0,0.06)]
                          backdrop-blur-[18px] backdrop-saturate-150
                          focus:border-black/15
                        "
                      />
                      <button
                        type="button"
                        onClick={() => send(input)}
                        disabled={isTyping}
                        className="
                          absolute right-3 top-1/2 -translate-y-1/2
                          h-10 w-10 rounded-full
                          border border-black/10
                          bg-black/5
                          grid place-items-center
                          text-[#0f172a]/55
                          transition-[transform,background-color,color] duration-[750ms] ease-out
                          hover:scale-[1.06] hover:bg-black/7 hover:text-[#0f172a]/75
                          active:scale-[0.99]
                          disabled:opacity-40 disabled:hover:scale-100
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70
                        "
                        aria-label="Отправить"
                        title="Отправить"
                      >
                        <SendIcon />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="
                        h-12 w-12 rounded-full
                        bg-[#c73f40]
                        text-white
                        grid place-items-center
                        shadow-[0_18px_60px_rgba(199,63,64,0.22)]
                        transition-[transform] duration-[850ms] ease-out
                        hover:scale-[1.06] active:scale-[0.99]
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70
                      "
                      aria-label="Микрофон (демо)"
                      title="Микрофон (демо)"
                      onClick={() => {
                        // пока демо
                        setMessages((m) => [
                          ...m,
                          {
                            id: uid(),
                            from: "ai",
                            text: "Микрофон подключим позже. Сейчас это просто UI.",
                            ts: Date.now(),
                          },
                        ]);
                      }}
                    >
                      <MicIcon />
                    </button>
                  </div>
                </div>
              </div>

              <div className="h-6" />
            </div>
          </div>

          <style jsx>{`
            .demoBorder {
              background: linear-gradient(
                90deg,
                rgba(177, 207, 235, 0.65),
                rgba(177, 207, 235, 0.18),
                rgba(199, 63, 64, 0.55),
                rgba(199, 63, 64, 0.18),
                rgba(177, 207, 235, 0.65)
              );
              background-size: 260% 260%;
              animation: demoBorderShift 10s ease-in-out infinite;
            }
            @keyframes demoBorderShift {
              0% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0% 50%;
              }
            }
            .demoInnerSheen {
              background: radial-gradient(
                  900px 420px at 18% 0%,
                  rgba(255, 255, 255, 0.26),
                  transparent 60%
                ),
                radial-gradient(
                  900px 420px at 82% 100%,
                  rgba(199, 63, 64, 0.08),
                  transparent 62%
                );
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}

function ChatBubble({ from, text }: { from: "user" | "ai"; text: string }) {
  const isAI = from === "ai";
  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
      <div
        className={`
          max-w-[86%] whitespace-pre-wrap
          px-4 py-3
          text-[14px] leading-[1.45]
          shadow-[0_16px_50px_rgba(0,0,0,0.08)]
          ${isAI
            ? "rounded-[18px] rounded-bl-[6px] bg-[#c73f40] text-white shadow-[0_16px_50px_rgba(199,63,64,0.18)]"
            : "rounded-[18px] rounded-br-[6px] bg-white text-[#0f172a]/85 border border-black/10"}
        `}
      >
        {text}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="typingDots" aria-label="Печатает">
      <span />
      <span />
      <span />
      <style jsx>{`
        .typingDots {
          display: inline-flex;
          gap: 6px;
          align-items: center;
          height: 18px;
        }
        .typingDots span {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.88);
          animation: td 1.25s ease-in-out infinite;
        }
        .typingDots span:nth-child(2) {
          animation-delay: 0.12s;
        }
        .typingDots span:nth-child(3) {
          animation-delay: 0.24s;
        }
        @keyframes td {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.55;
          }
          50% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.5 9.5L12 15l5.5-5.5"
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
      />
      <path
        d="M22 2L15 22l-4-9-9-4 20-7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M19 11a7 7 0 0 1-14 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 18v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 22h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
