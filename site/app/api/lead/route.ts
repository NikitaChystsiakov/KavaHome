// POST /api/lead — заявка «Для бизнеса» (отели, опт, логотип, сертификаты) менеджеру в Telegram.
// ORDER_DRY_RUN=1 — не отправлять (локальная проверка).
const esc = (s: string) => s.replace(/[&<>]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[ch]!);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Не удалось прочитать заявку" }, { status: 400 });
  }
  const name = String(body.name ?? "").trim().slice(0, 80);
  const phone = String(body.phone ?? "").trim().slice(0, 40);
  const company = String(body.company ?? "").trim().slice(0, 120);
  const comment = String(body.comment ?? "").trim().slice(0, 1000);
  const needs = (Array.isArray(body.needs) ? body.needs : []).map(String).slice(0, 6);
  if (phone.replace(/\D/g, "").length < 9) return Response.json({ ok: false, error: "Проверьте телефон" }, { status: 400 });

  const text = [
    "<b>Заявка «Для бизнеса»</b>",
    needs.length ? `Интересует: ${esc(needs.join(", "))}` : "",
    `${esc(name || "Без имени")}, ${esc(phone)}`,
    company ? `Компания: ${esc(company)}` : "",
    comment ? `Комментарий: ${esc(comment)}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  if (process.env.ORDER_DRY_RUN === "1") {
    console.log("[lead] пробная заявка, не отправлена:\n" + text);
    return Response.json({ ok: true });
  }
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) {
    console.error("[lead] нет ключей Telegram, заявка потеряна:\n" + text);
    return Response.json({ ok: false, error: "Заявка не отправилась" }, { status: 503 });
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML" }),
    signal: AbortSignal.timeout(15_000),
  }).catch(() => null);
  if (!res?.ok) return Response.json({ ok: false, error: "Заявка не отправилась" }, { status: 502 });
  return Response.json({ ok: true });
}
