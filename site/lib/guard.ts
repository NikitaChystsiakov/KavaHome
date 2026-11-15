import "server-only";

// Защита форм заказа и заявки от спама: ловушка для ботов (components/Honeypot.tsx)
// и ограничение частоты с одного адреса. Счётчик живёт в памяти экземпляра сервера,
// поэтому это фильтр от простых ботов, а не строгий лимит.

/** Бот заполнил скрытое поле «website». */
export function isBot(body: unknown) {
  return (
    !!body &&
    typeof body === "object" &&
    String((body as Record<string, unknown>).website ?? "").trim() !== ""
  );
}

const hits = new Map<string, number[]>();
const WINDOW = 10 * 60_000;
const LIMIT = 5;

/** Больше 5 отправок за 10 минут с одного IP. */
export function tooMany(req: Request, scope: string) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > LIMIT;
}
