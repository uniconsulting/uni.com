import { NextRequest, NextResponse } from "next/server";

type LeadPayload = {
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  message?: string;

  // откуда пришло (для аналитики/контекста)
  source?: string; // например: "cta-1", "cta-2", "pricing", "demo-chat"
  page?: string; // pathname
  utm?: Record<string, string | undefined>;

  // антиспам (honeypot)
  hp?: string; // должен быть пустым
};

function asText(v: unknown, max = 200) {
  if (typeof v !== "string") return "";
  const s = v.trim();
  return s.length > max ? s.slice(0, max) : s;
}

function normalizePhone(raw: string) {
  // очень мягкая нормализация: оставляем цифры и +
  const s = raw.replace(/[^\d+]/g, "");
  return s.length > 30 ? s.slice(0, 30) : s;
}

function isProbablySpam(p: LeadPayload) {
  // honeypot
  if (p.hp && p.hp.trim().length > 0) return true;

  // слишком длинные поля
  if ((p.message?.length ?? 0) > 1000) return true;
  if ((p.name?.length ?? 0) > 120) return true;
  if ((p.company?.length ?? 0) > 200) return true;

  // если вообще ничего не оставили
  const hasContacts = !!(p.phone?.trim() || p.email?.trim());
  if (!hasContacts) return true;

  return false;
}

function getClientIp(req: NextRequest) {
  // Vercel обычно прокидывает x-forwarded-for
  const xff = req.headers.get("x-forwarded-for");
  if (!xff) return "unknown";
  return xff.split(",")[0].trim();
}

// Очень простой антифлуд. На serverless может сбрасываться между инстансами,
// но как “первая линия” работает.
const bucket = (globalThis as any).__lead_bucket as Map<string, { n: number; ts: number }> | undefined;
const leadBucket = bucket ?? new Map<string, { n: number; ts: number }>();
(globalThis as any).__lead_bucket = leadBucket;

function isRateLimited(ip: string) {
  const now = Date.now();
  const windowMs = 60_000; // 1 минута
  const limit = 8; // 8 запросов/мин на IP

  const cur = leadBucket.get(ip);
  if (!cur || now - cur.ts > windowMs) {
    leadBucket.set(ip, { n: 1, ts: now });
    return false;
  }
  cur.n += 1;
  leadBucket.set(ip, cur);
  return cur.n > limit;
}

async function sendToTelegram(text: string) {
  const token = process.env.LEAD_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.LEAD_TELEGRAM_CHAT_ID;

  if (!token || !chatId) return { ok: false, skipped: true as const };

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { ok: false, error: `Telegram error: ${res.status} ${body}` };
  }
  return { ok: true };
}

async function sendToCrm(payload: any) {
  const endpoint = process.env.LEAD_CRM_ENDPOINT;
  const token = process.env.LEAD_CRM_TOKEN;

  if (!endpoint) return { ok: false, skipped: true as const };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { ok: false, error: `CRM error: ${res.status} ${body}` };
  }
  return { ok: true };
}

function fmtTelegramMessage(p: Required<Pick<LeadPayload, "phone" | "email">> & LeadPayload) {
  const lines = [
    `<b>Новый лид ЮНИ</b>`,
    ``,
    `Источник: <b>${asText(p.source, 60) || "—"}</b>`,
    `Страница: ${asText(p.page, 120) || "—"}`,
    ``,
    `Имя: <b>${asText(p.name, 120) || "—"}</b>`,
    `Телефон: <b>${asText(p.phone, 40) || "—"}</b>`,
    `Email: <b>${asText(p.email, 120) || "—"}</b>`,
    `Компания: ${asText(p.company, 200) || "—"}`,
    ``,
    `Сообщение: ${asText(p.message, 1000) || "—"}`,
  ];

  const utm = p.utm ?? {};
  const utmKeys = Object.keys(utm).filter((k) => utm[k]);
  if (utmKeys.length) {
    lines.push("", "<b>UTM</b>");
    for (const k of utmKeys) lines.push(`${k}: ${asText(utm[k], 200)}`);
  }

  return lines.join("\n");
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let raw: any;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const payload: LeadPayload = {
    name: asText(raw?.name, 120),
    phone: normalizePhone(asText(raw?.phone, 60)),
    email: asText(raw?.email, 120),
    company: asText(raw?.company, 200),
    message: asText(raw?.message, 1000),
    source: asText(raw?.source, 60),
    page: asText(raw?.page, 140),
    utm: typeof raw?.utm === "object" && raw?.utm ? raw.utm : undefined,
    hp: asText(raw?.hp, 120),
  };

  if (isProbablySpam(payload)) {
    // Возвращаем "ок", чтобы не давать спамерам сигналов.
    return NextResponse.json({ ok: true });
  }

  const text = fmtTelegramMessage({
    ...payload,
    phone: payload.phone || "",
    email: payload.email || "",
  });

  const tg = await sendToTelegram(text);

  // CRM отправляем тем же payload, но можно адаптировать под amoCRM/битрикс и т.п.
  const crm = await sendToCrm({
    ...payload,
    ip,
    userAgent: req.headers.get("user-agent") || "",
    ts: new Date().toISOString(),
  });

  // Даже если CRM упала, Telegram обычно достаточно как первый канал
  const ok = (tg as any).ok || (crm as any).ok;

  return NextResponse.json({ ok, tg, crm });
}
