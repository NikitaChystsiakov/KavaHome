import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { collections } from "./collections";
import { calmColors, products as demo, type CategoryId, type Color, type Product, type PurposeId, type Size } from "./catalog";
import { colorInfo, sizeArea, sizeNote, slugify } from "./colors";

// WooCommerce = админка. Витрина читает товары через REST API v3 (ключи в .env: WOO_URL, WOO_KEY, WOO_SECRET)
// и переводит их в типы прототипа (lib/catalog.ts), поэтому компоненты не знают, откуда данные.
//
// В админке один цвет = один товар: вариативный (вариации = размеры) или простой (набор 3 шт).
// На витрине товары склеиваются в модель по «Коллекция» + вид изделия (начало названия до коллекции):
// «Полотенце махровое Верона Премиум, изумруд» → модель «Полотенце махровое» + «Верона Премиум», цвет «изумруд».
//
// Кэш: тег "woo" сбрасывает вебхук WooCommerce (app/api/revalidate), иначе обновление раз в час.
// WOO_DRAFTS=1 — показывать и черновики (локально, пока каталог не опубликован).

export const WOO_TAG = "woo";

type WooAttr = { id: number; name: string; slug: string; options: string[]; option?: string };
type WooProduct = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  type: "simple" | "variable" | string;
  status: string;
  price: string;
  description: string;
  short_description: string;
  menu_order: number;
  categories: { id: number; name: string; slug: string }[];
  attributes: WooAttr[];
  images: { id: number; src: string; alt: string }[];
};
type WooVariation = { id: number; sku: string; price: string; status: string; attributes: { name: string; option: string }[] };
/** вариация из Store API: цены в копейках, размер — в attributes или строкой «Размер: 30×60» */
type StoreVariation = {
  id: number;
  parent: number;
  sku: string;
  variation?: string;
  attributes?: { name: string; terms?: { name: string }[] }[];
  prices: { price: string; currency_minor_unit: number };
};

/** Вариации опубликованных товаров одним-двумя запросами Store API вместо запроса на каждый товар. */
async function storeVariations(): Promise<Map<number, WooVariation[]>> {
  const map = new Map<number, WooVariation[]>();
  const list = await all<StoreVariation>("products", { type: "variation" }, "store");
  for (const v of list) {
    const size =
      v.attributes?.find((a) => a.name === "Размер")?.terms?.[0]?.name ??
      v.variation?.match(/Размер:\s*([^,]+)/)?.[1]?.trim() ??
      "";
    const price = Number(v.prices.price) / 10 ** (v.prices.currency_minor_unit ?? 2);
    if (!map.has(v.parent)) map.set(v.parent, []);
    map.get(v.parent)!.push({ id: v.id, sku: v.sku, price: String(price), status: "publish", attributes: [{ name: "Размер", option: size }] });
  }
  return map;
}

const PURPOSE: Record<string, PurposeId> = {
  vannaya: "vannaya",
  kuhnya: "kuhnya",
  "banya-i-plyazh": "banya-plyazh",
  halaty: "halaty",
  kovriki: "kovriki",
  "nabory-i-podarki": "podarki",
  "dlya-otelej": "oteli",
};

function config() {
  const url = process.env.WOO_URL;
  const key = process.env.WOO_KEY;
  const secret = process.env.WOO_SECRET;
  return url && key && secret ? { url: url.replace(/\/$/, ""), auth: "Basic " + btoa(`${key}:${secret}`) } : null;
}

// Хостинг виртуальный и медленный (ответ 1–15 с): таймаут, один повтор и страницы по очереди, а не залпом.
async function woo<T>(path: string, params: Record<string, string | number> = {}, api: "v3" | "store" = "v3") {
  const c = config()!;
  const q = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]));
  const url = `${c.url}/wp-json/wc/${api === "v3" ? "v3" : "store/v1"}/${path}?${q}`;
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json", ...(api === "v3" ? { Authorization: c.auth } : {}) },
        signal: AbortSignal.timeout(25_000),
      });
      if (!res.ok) throw new Error(`WooCommerce ${path}: ${res.status} ${(await res.text()).slice(0, 200)}`);
      return { data: (await res.json()) as T, pages: Number(res.headers.get("x-wp-totalpages") ?? 1) };
    } catch (e) {
      if (attempt >= 1) throw e;
    }
  }
}

async function all<T>(path: string, params: Record<string, string | number> = {}, api: "v3" | "store" = "v3") {
  const out: T[] = [];
  for (let page = 1, pages = 1; page <= pages; page++) {
    const r = await woo<T[]>(path, { ...params, per_page: 100, page }, api);
    out.push(...r.data);
    pages = r.pages;
  }
  return out;
}

/** Ограничение параллельных запросов: виртуальный хостинг не любит десятки сразу. */
async function pool<T, R>(items: T[], n: number, fn: (x: T) => Promise<R>) {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) {
        const k = i++;
        out[k] = await fn(items[k]);
      }
    }),
  );
  return out;
}

const attr = (p: WooProduct, name: string) => p.attributes.find((a) => a.name === name)?.options ?? [];
const money = (s: string) => Math.round(Number(s) || 0);

/** Товары WooCommerce, сгруппированные в модели витрины. null — ключей нет. При недоступном API — исключение. */
export async function getWooProducts(): Promise<Product[] | null> {
  "use cache";
  cacheTag(WOO_TAG);
  cacheLife("hours");

  if (!config()) return null;
  const drafts = process.env.WOO_DRAFTS === "1";

  // ошибка не ловится здесь: иначе пустой результат закэшируется на час
  const raw = await all<WooProduct>("products", { status: drafts ? "any" : "publish", orderby: "menu_order", order: "asc" });
  // товары витрины = с атрибутом «Коллекция»; старые позиции прошлого разработчика его не имеют
  const ours = raw.filter((p) => attr(p, "Коллекция").length && (p.status === "publish" || (drafts && p.status === "draft")));

  // опубликованные — пачкой через Store API; черновики и всё, что пачка не вернула, — по товару через v3
  let variations = new Map<number, WooVariation[]>();
  if (!drafts) {
    try {
      variations = await storeVariations();
    } catch (e) {
      console.error("[woo] Store API вариации:", e);
    }
  }
  await pool(
    ours.filter((p) => p.type === "variable" && !variations.get(p.id)?.every((v) => v.attributes[0].option)),
    2,
    async (p) => {
      try {
        variations.set(p.id, await all<WooVariation>(`products/${p.id}/variations`));
      } catch (e) {
        console.error(`[woo] вариации ${p.sku}:`, e);
      }
    },
  );

  // группировка: коллекция + вид изделия
  type Item = { p: WooProduct; kind: string; title: string; coll: string; color: string };
  const groups = new Map<string, Item[]>();
  for (const p of ours) {
    const coll = attr(p, "Коллекция")[0];
    const color = attr(p, "Цвет")[0] ?? "";
    const at = p.name.indexOf(coll);
    const kind = (at > 0 ? p.name.slice(0, at) : p.name.split(",")[0]).trim();
    const title = (at >= 0 ? p.name.slice(at) : coll).split(",")[0].trim();
    const key = `${coll}|${kind}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push({ p, kind, title, coll, color });
  }

  const out: Product[] = [];
  const ids = new Set<string>();
  for (const items of groups.values()) {
    const { kind, title, coll } = items[0];
    const city = collections.find((c) => c.city === coll);
    const collSlug = city?.slug ?? slugify(coll);
    const cats = new Set(items.flatMap((x) => x.p.categories.map((c) => c.slug)));
    const isSet = /набор/i.test(kind) && items.every((x) => x.p.type === "simple");
    const category: CategoryId = isSet
      ? "sets"
      : /коврик/i.test(kind)
        ? "mats"
        : /халат/i.test(kind)
          ? "robes"
          : /^qd/i.test(coll)
            ? "gifts"
            : cats.has("kuhnya")
              ? "kitchen"
              : cats.has("dlya-otelej")
                ? "hotel"
                : "bath";
    const noteKind = category === "mats" ? "mats" : category === "kitchen" ? "kitchen" : "bath";

    // для подписи набора: размеры основной модели той же коллекции («70×140, 50×90, 40×70»)
    const towelSizes = () => {
      const towel = [...groups.values()].find((g) => g[0].coll === coll && g !== items && g[0].p.type === "variable");
      const labels = new Set(towel?.flatMap((x) => attr(x.p, "Размер")) ?? []);
      return [...labels].sort((a, b) => sizeArea(b) - sizeArea(a)).join(", ");
    };

    const demoProduct = demo.find((d) => d.collection === collSlug && (d.category === "sets") === isSet);
    const colors: Color[] = items.map(({ p, color }) => {
      let sizes: Size[];
      if (p.type === "variable") {
        sizes = (variations.get(p.id) ?? [])
          .filter((v) => v.status === "publish" || drafts)
          .map((v) => {
            const label = v.attributes.find((a) => a.name === "Размер")?.option ?? "";
            return { label, note: sizeNote(label, noteKind), price: money(v.price), id: v.id, sku: v.sku };
          })
          .filter((s) => s.label && s.price > 0)
          .sort((a, b) => sizeArea(a.label) - sizeArea(b.label));
      } else {
        sizes = [{ label: isSet ? "Набор 3 шт" : "1 шт", note: isSet ? towelSizes() : "", price: money(p.price), id: p.id, sku: p.sku }];
      }
      const known = demoProduct?.colors.find((c) => c.name === color);
      const info = colorInfo(color);
      const images = p.images.map((i) => i.src);
      return {
        name: color,
        swatch: known?.swatch ?? info.swatch,
        family: known?.family ?? info.family,
        image: images[0] ?? known?.image ?? "/img/use-hotel.webp",
        position: "50% 50%",
        id: p.id,
        slug: p.slug,
        images,
        sizes,
        cover: known ? { image: known.image, position: known.position } : undefined,
      };
    });
    const sellable = colors.filter((c) => c.sizes?.length);
    if (!sellable.length) continue;

    // размеры модели = все размеры её цветов, цена размера — самая низкая среди цветов
    const bySize = new Map<string, Size>();
    for (const s of sellable.flatMap((c) => c.sizes!)) {
      const cur = bySize.get(s.label);
      if (!cur || s.price < cur.price) bySize.set(s.label, { label: s.label, note: s.note, price: s.price });
    }

    let id = isSet ? `${collSlug}-nabor` : collSlug;
    if (ids.has(id)) id = `${collSlug}-${slugify(kind)}`;
    ids.add(id);

    const density = parseInt(attr(items[0].p, "Плотность")[0] ?? "", 10) || 0;
    out.push({
      id,
      name: isSet ? "Набор полотенец" : kind,
      title,
      collection: collSlug,
      category,
      purposes: [...cats].map((c) => PURPOSE[c]).filter(Boolean),
      density,
      sizes: [...bySize.values()].sort((a, b) => sizeArea(a.label) - sizeArea(b.label)),
      colors: sellable,
      description: items[0].p.description,
      source: "woo",
    });
  }
  // порядок «популярные»: сначала полотенца и коврики по маршруту коллекций (lib/collections.ts), потом наборы
  const route = (p: Product) => {
    const i = collections.findIndex((c) => c.slug === p.collection);
    return i < 0 ? collections.length : i;
  };
  return out.sort((a, b) => Number(a.category === "sets") - Number(b.category === "sets") || route(a) - route(b));
}

/**
 * Каталог витрины: товары из WooCommerce, а разделы, которых в админке ещё нет (халаты, QD…), — заглушками прототипа.
 * Без ключей или при ошибке API — целиком заглушки, чтобы витрина не падала.
 */
export async function getProducts(): Promise<Product[]> {
  let live: Product[] | null = null;
  try {
    live = await getWooProducts();
  } catch (e) {
    console.error("[woo] товары не загрузились, показываю заглушки:", e);
  }
  if (!live?.length) return calmColors(demo);
  const have = new Set(live.map((p) => p.category));
  return calmColors([...live, ...demo.filter((d) => !have.has(d.category)).map((d) => ({ ...d, source: "demo" as const }))]);
}
