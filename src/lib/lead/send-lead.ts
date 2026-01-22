export type LeadPayload = {
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  message?: string;
  source?: string;
  page?: string;
  utm?: Record<string, string | undefined>;
  hp?: string;
};

export async function sendLead(payload: LeadPayload) {
  const res = await fetch("/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  return { status: res.status, ...data };
}
