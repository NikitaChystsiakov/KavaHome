import { getProducts } from "@/lib/woo";
import { createWooOrder, priceLines, sendTelegram, type OrderInput } from "@/lib/order";

// POST /api/order — заказ из корзины. Успех, если заказ дошёл хотя бы в одно место (WooCommerce или Telegram):
// менеджер всё равно перезвонит. Если не дошёл никуда — ошибка, и корзина просит позвонить.
export async function POST(req: Request) {
  let input: OrderInput;
  try {
    input = (await req.json()) as OrderInput;
  } catch {
    return Response.json({ ok: false, error: "Не удалось прочитать заказ" }, { status: 400 });
  }
  const name = String(input.name ?? "").trim().slice(0, 80);
  const phone = String(input.phone ?? "").trim().slice(0, 40);
  if (!name || phone.replace(/\D/g, "").length < 9 || !Array.isArray(input.lines) || !input.lines.length) {
    return Response.json({ ok: false, error: "Укажите имя и телефон" }, { status: 400 });
  }
  const clean: OrderInput = {
    name,
    phone,
    delivery: input.delivery === "delivery" ? "delivery" : "pickup",
    city: String(input.city ?? "").trim().slice(0, 80),
    address: String(input.address ?? "").trim().slice(0, 200),
    comment: String(input.comment ?? "").trim().slice(0, 1000),
    lines: input.lines.slice(0, 50),
  };
  const lines = priceLines(clean, await getProducts());
  if (!lines.length) return Response.json({ ok: false, error: "Товары из корзины не найдены в каталоге" }, { status: 400 });

  if (process.env.ORDER_DRY_RUN === "1") {
    console.log("[order] пробный заказ, не отправлен:", JSON.stringify({ ...clean, lines }));
    return Response.json({ ok: true, number: "ПРОБА" });
  }

  let number: string | null = null;
  try {
    number = await createWooOrder(clean, lines);
  } catch (e) {
    console.error("[order] WooCommerce:", e);
  }
  let telegram = false;
  try {
    await sendTelegram(clean, lines, number);
    telegram = true;
  } catch (e) {
    console.error("[order] Telegram:", e);
  }
  if (!number && !telegram) {
    return Response.json({ ok: false, error: "Заказ не отправился. Позвоните нам, пожалуйста." }, { status: 502 });
  }
  return Response.json({ ok: true, number });
}
