import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { WOO_TAG } from "@/lib/woo";

// POST /api/revalidate — вебхук WooCommerce: товар создан, изменён или удалён → каталог витрины обновляется
// при следующем заходе, а не через час. В админке: WooCommerce → Настройки → Дополнительно → Веб-хуки,
// по вебхуку на «Товар создан / обновлён / удалён», адрес доставки https://<сайт>/api/revalidate,
// секрет = WOO_WEBHOOK_SECRET из переменных окружения. Woo подписывает тело: base64(HMAC-SHA256(тело, секрет))
// в заголовке X-WC-Webhook-Signature.
export async function POST(req: Request) {
  const secret = process.env.WOO_WEBHOOK_SECRET;
  if (!secret)
    return Response.json({ ok: false, error: "WOO_WEBHOOK_SECRET не задан" }, { status: 503 });

  const body = await req.text();
  const sign = req.headers.get("x-wc-webhook-signature") ?? "";
  // при сохранении вебхука Woo шлёт проверочный запрос «webhook_id=…» без подписи: отвечаем 200, ничего не сбрасывая
  if (!sign && /^webhook_id=\d+$/.test(body.trim())) return Response.json({ ok: true, ping: true });

  const a = Buffer.from(sign);
  const b = Buffer.from(createHmac("sha256", secret).update(body).digest("base64"));
  if (a.length !== b.length || !timingSafeEqual(a, b))
    return Response.json({ ok: false, error: "неверная подпись" }, { status: 401 });

  // посетитель получит прежний каталог, пока новый загружается в фоне; следующий — уже новый
  revalidateTag(WOO_TAG, "max");
  return Response.json({ ok: true, revalidated: WOO_TAG });
}
