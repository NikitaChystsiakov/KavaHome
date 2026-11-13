import "server-only";
import { contacts } from "./collections";
import type { Product } from "./catalog";

// Заказ с витрины: создаётся в WooCommerce (раздел «Заказы», статус «на удержании» — ждёт звонка менеджера)
// и дублируется в Telegram. Ключи в .env: WOO_URL/WOO_KEY/WOO_SECRET (ключ с правом записи),
// TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID. ORDER_DRY_RUN=1 — ничего не отправлять (локальная проверка).

export type OrderLine = { model: string; color: string; size: string; qty: number };
export type OrderInput = {
  name: string;
  phone: string;
  delivery: "pickup" | "delivery";
  city?: string;
  address?: string;
  comment?: string;
  lines: OrderLine[];
};
export type PricedLine = OrderLine & { title: string; price: number; productId?: number; variationId?: number; sku?: string };

/** Цены и id берутся из каталога, а не из браузера. Неизвестные позиции отбрасываются. */
export function priceLines(input: OrderInput, products: Product[]): PricedLine[] {
  const out: PricedLine[] = [];
  for (const l of input.lines) {
    const p = products.find((x) => x.id === l.model);
    const color = p?.colors.find((c) => c.name === l.color);
    if (!p || !color) continue;
    const size = (color.sizes?.length ? color.sizes : p.sizes).find((z) => z.label === l.size);
    if (!size) continue;
    const qty = Math.max(1, Math.min(99, Math.round(l.qty)));
    out.push({
      ...l,
      qty,
      title: `${p.name} ${p.title}`,
      price: size.price,
      productId: p.source === "woo" ? color.id : undefined,
      variationId: p.source === "woo" && size.id && size.id !== color.id ? size.id : undefined,
      sku: size.sku,
    });
  }
  return out;
}

export async function createWooOrder(input: OrderInput, lines: PricedLine[]) {
  const url = process.env.WOO_URL;
  const key = process.env.WOO_KEY;
  const secret = process.env.WOO_SECRET;
  if (!url || !key || !secret) throw new Error("нет ключей WooCommerce");
  const inWoo = lines.filter((l) => l.productId);
  // позиции, которых нет в админке (заглушки витрины), — в примечание к заказу
  const extra = lines.filter((l) => !l.productId).map((l) => `${l.title}, ${l.color}, ${l.size} × ${l.qty} = ${l.price * l.qty} BYN`);
  const body = {
    status: "on-hold",
    set_paid: false,
    payment_method: "manual",
    payment_method_title: "Оплата по согласованию с менеджером",
    created_via: "kavahome-next",
    billing: {
      first_name: input.name,
      phone: input.phone,
      city: input.delivery === "delivery" ? (input.city ?? "") : "",
      address_1: input.delivery === "delivery" ? (input.address ?? "") : "Самовывоз",
      country: "BY",
    },
    shipping_lines: [
      {
        method_id: input.delivery === "pickup" ? "local_pickup" : "flat_rate",
        method_title: input.delivery === "pickup" ? `Самовывоз: ${contacts.pickupShort}` : "Доставка по Беларуси (стоимость назовёт менеджер)",
        total: "0",
      },
    ],
    line_items: inWoo.map((l) => ({ product_id: l.productId, ...(l.variationId ? { variation_id: l.variationId } : {}), quantity: l.qty })),
    customer_note: [input.comment, extra.length ? `Позиции не из админки:\n${extra.join("\n")}` : ""].filter(Boolean).join("\n\n"),
  };
  const res = await fetch(`${url.replace(/\/$/, "")}/wp-json/wc/v3/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Basic " + btoa(`${key}:${secret}`) },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`WooCommerce ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const order = (await res.json()) as { id: number; number: string };
  return order.number || String(order.id);
}

const esc = (s: string) => s.replace(/[&<>]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[ch]!);

export async function sendTelegram(input: OrderInput, lines: PricedLine[], number: string | null) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) throw new Error("нет ключей Telegram");
  const total = lines.reduce((n, l) => n + l.price * l.qty, 0);
  const text = [
    `<b>Заказ с сайта${number ? ` № ${esc(number)}` : ""}</b>`,
    "",
    ...lines.map((l) => `• ${esc(l.title)}, ${esc(l.color)}, ${esc(l.size)} × ${l.qty} = ${l.price * l.qty} BYN`),
    `<b>Итого: ${total} BYN</b> (без доставки)`,
    "",
    `${esc(input.name)}, ${esc(input.phone)}`,
    input.delivery === "pickup" ? `Самовывоз: ${esc(contacts.pickupShort)}` : `Доставка: ${esc([input.city, input.address].filter(Boolean).join(", "))}`,
    input.comment ? `Комментарий: ${esc(input.comment)}` : "",
    number ? "" : "⚠️ В WooCommerce заказ не создался — внесите вручную.",
  ]
    .filter((x, i, a) => x !== "" || a[i - 1] !== "")
    .join("\n");
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML", disable_web_page_preview: true }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Telegram ${res.status}: ${(await res.text()).slice(0, 200)}`);
}
