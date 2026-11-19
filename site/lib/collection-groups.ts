// Разделы страницы /kollekcii: города (lib/collections.ts), линии QD, халаты и прочие коллекции из админки.
// Всё, кроме городов, собирается из товаров WooCommerce по атрибуту «Коллекция»: завели новую коллекцию в админке —
// она сама появляется здесь и получает страницу /kollekcii/<slug> (каталог с включённым фильтром).
import { priceRange, type Product } from "./catalog";
import { collections } from "./collections";

export type ExtraCollection = {
  slug: string;
  /** id карточки основной модели: /catalog/<id> */
  productId: string;
  title: string;
  image: string;
  position: string;
  colors: { name: string; swatch: string }[];
  from: number;
  priced: boolean;
};

export const collectionTitle = (p: Product) => p.title.replace(/ Премиум$/, "");

// не города и не QD: сезонные и брендовые линии (CLAUDE.md: «Новогодняя»); новую такую линию добавить сюда
const SPECIAL = /^(новогодн|кава)/i;

/** Коллекции не из списка городов: по одной на значение атрибута «Коллекция». */
export function extraCollections(products: Product[]) {
  const cities = new Set(collections.map((c) => c.slug));
  const groups = new Map<string, Product[]>();
  for (const p of products) {
    if (!p.collection || cities.has(p.collection)) continue;
    groups.set(p.collection, [...(groups.get(p.collection) ?? []), p]);
  }
  const list: ExtraCollection[] = [...groups].map(([slug, items]) => {
    const main = items.find((p) => p.category !== "sets") ?? items[0];
    const woo = items.filter((p) => p.source === "woo");
    return {
      slug,
      productId: main.id,
      title: collectionTitle(main),
      image: main.colors[0]?.image ?? "",
      position: main.colors[0]?.position ?? "50% 50%",
      colors: main.colors.map((c) => ({ name: c.name, swatch: c.swatch })),
      from: woo.length ? Math.min(...woo.map((p) => priceRange(p)[0])) : 0,
      priced: woo.length > 0,
    };
  });
  const isQd = (c: ExtraCollection) => /^qd\b/i.test(c.title);
  const isSpecial = (c: ExtraCollection) => SPECIAL.test(c.title);
  return {
    /** города из админки, которых ещё нет в lib/collections.ts (Валенсия, Мадрид…) */
    cities: list.filter((c) => !isQd(c) && !isSpecial(c)),
    qd: list.filter(isQd),
    other: list.filter(isSpecial),
  };
}
