// Каталог для прототипа главной. Модели, размеры и плотность — из прайса клиента от 2026-11-09.
// Цены — розничные заглушки (в прайсе только опт), на витрине помечены «цены примерные».
// Это заглушки: настоящие товары приходят из WooCommerce (lib/woo.ts) в тех же типах. Заглушки остаются
// запасным вариантом, пока раздел (например, халаты или QD) не заведён в админке, и для эскизов /v/*.

export type CategoryId = "bath" | "kitchen" | "mats" | "robes" | "sets" | "gifts" | "hotel"; // hotel — без пункта в меню, через чипсу «Для отелей»
export type PurposeId = "vannaya" | "kuhnya" | "banya-plyazh" | "halaty" | "kovriki" | "podarki" | "oteli";
export type FamilyId = "white" | "beige" | "brown" | "grey" | "graphite" | "green" | "pink";

export const categories: { id: CategoryId; label: string }[] = [
  { id: "bath", label: "Махровые полотенца" },
  { id: "kitchen", label: "Кухонные" },
  { id: "mats", label: "Коврики" },
  { id: "robes", label: "Халаты" },
  { id: "sets", label: "Наборы по 3 шт" },
  { id: "gifts", label: "Подарочные наборы QD" },
];

export const purposeChips: { id: PurposeId; label: string }[] = [
  { id: "vannaya", label: "Ванная" },
  { id: "kuhnya", label: "Кухня" },
  { id: "banya-plyazh", label: "Баня и пляж" },
  { id: "halaty", label: "Халаты" },
  { id: "kovriki", label: "Коврики" },
  { id: "podarki", label: "Наборы и подарки" },
  { id: "oteli", label: "Для отелей" },
];

export const families: { id: FamilyId; label: string; swatch: string }[] = [
  { id: "white", label: "белый", swatch: "#f6f3ee" },
  { id: "beige", label: "бежевый", swatch: "#d9c3ae" },
  { id: "brown", label: "коричневый", swatch: "#6e4a3f" },
  { id: "grey", label: "серый", swatch: "#a7a4a8" },
  { id: "graphite", label: "графит", swatch: "#4b4c51" },
  { id: "green", label: "зелёный и голубой", swatch: "#5f9aa2" },
  { id: "pink", label: "розовый и терракота", swatch: "#c07f8b" },
];

export type Size = {
  label: string;
  note: string;
  price: number;
  /** id вариации (или простого товара) в WooCommerce — для заказа */
  id?: number;
  sku?: string;
};
export type Color = {
  name: string;
  swatch: string;
  image: string;
  family: FamilyId;
  position?: string;
  /** товар WooCommerce (один цвет = один товар) */
  id?: number;
  slug?: string;
  images?: string[];
  /** размеры именно этого цвета: у некоторых цветов не все размеры модели */
  sizes?: Size[];
  /** отобранный кадр прототипа для веера на главной (фото из админки бывают с упаковкой) */
  cover?: { image: string; position?: string };
};
export type Product = {
  id: string;
  name: string;
  /** коллекция-город (slug из lib/collections), если есть */
  collection?: string;
  title: string;
  category: CategoryId;
  purposes: PurposeId[];
  density: number;
  sizes: Size[];
  colors: Color[];
  /** описание из админки (HTML), одно на модель */
  description?: string;
  /** откуда товар: из WooCommerce или заглушка прототипа */
  source?: "woo" | "demo";
};

const towel = (p30: number, p50: number, p70: number, big = { a: "30×60", b: "50×80", c: "70×130" }): Size[] => [
  { label: big.a, note: "для рук", price: p30 },
  { label: big.b, note: "для лица", price: p50 },
  { label: big.c, note: "банное", price: p70 },
];
const set = (price: number, sizes = "70×130, 50×80, 30×60"): Size => ({ label: "Набор 3 шт", note: sizes, price });

const STACK = "50% 74%";

export const products: Product[] = [
  {
    id: "verona",
    name: "Полотенце махровое",
    collection: "verona",
    title: "Верона",
    category: "bath",
    purposes: ["vannaya", "banya-plyazh", "podarki"],
    density: 420,
    sizes: [...towel(9, 18, 34), set(59)],
    colors: [
      { name: "изумруд", swatch: "#00838c", image: "/img/verona-emerald.webp", family: "green", position: STACK },
      { name: "бежевый", swatch: "#cdb9ae", image: "/img/verona-beige.webp", family: "beige", position: STACK },
      { name: "графит", swatch: "#55565b", image: "/img/verona-graphite.webp", family: "graphite", position: STACK },
      { name: "коричневый", swatch: "#7a5a55", image: "/img/verona-brown.webp", family: "brown", position: STACK },
      { name: "серый", swatch: "#a3a1aa", image: "/img/verona-grey.webp", family: "grey", position: STACK },
    ],
  },
  {
    id: "rimini",
    name: "Полотенце махровое",
    collection: "rimini",
    title: "Римини",
    category: "bath",
    purposes: ["vannaya", "banya-plyazh", "podarki"],
    density: 420,
    sizes: [...towel(9, 18, 34), set(59)],
    colors: [
      { name: "розовый", swatch: "#c07f8b", image: "/img/rimini-pink.webp", family: "pink", position: STACK },
      { name: "бежевый", swatch: "#dcc3b4", image: "/img/rimini-beige.webp", family: "beige", position: STACK },
      { name: "мятный", swatch: "#6f9fa8", image: "/img/rimini-mint.webp", family: "green", position: STACK },
      { name: "синий", swatch: "#6c82a0", image: "/img/rimini-blue.webp", family: "green", position: STACK },
      { name: "графит", swatch: "#4f5257", image: "/img/rimini-graphite.webp", family: "graphite", position: STACK },
      { name: "серый", swatch: "#a6a3a8", image: "/img/rimini-grey.webp", family: "grey", position: STACK },
    ],
  },
  {
    id: "venice",
    name: "Полотенце махровое",
    collection: "venice",
    title: "Венеция",
    category: "bath",
    purposes: ["vannaya", "banya-plyazh", "podarki"],
    density: 420,
    sizes: [...towel(9, 18, 34), { label: "100×150", note: "большое банное", price: 49 }, set(59)],
    colors: [
      { name: "бежевый", swatch: "#d7c6b6", image: "/img/venice-beige.webp", family: "beige", position: STACK },
      { name: "мятный", swatch: "#5f97a2", image: "/img/venice-mint.webp", family: "green", position: STACK },
      { name: "графит", swatch: "#4a4c51", image: "/img/venice-graphite.webp", family: "graphite", position: STACK },
      { name: "серый", swatch: "#a5a2ab", image: "/img/venice-grey.webp", family: "grey", position: STACK },
    ],
  },
  {
    id: "florence",
    name: "Полотенце махровое",
    collection: "florence",
    title: "Флоренция",
    category: "bath",
    purposes: ["vannaya", "banya-plyazh"],
    density: 450,
    sizes: towel(10, 20, 38, { a: "30×60", b: "50×90", c: "70×140" }),
    colors: [
      { name: "бежевый", swatch: "#c9a88f", image: "/img/florence-beige.webp", family: "beige", position: "50% 62%" },
      { name: "графит", swatch: "#3f3b40", image: "/img/florence-graphite.webp", family: "graphite", position: "50% 62%" },
      { name: "коричневый", swatch: "#4a2620", image: "/img/florence-brown.webp", family: "brown", position: "50% 62%" },
    ],
  },
  {
    id: "milan",
    name: "Полотенце махровое",
    collection: "milan",
    title: "Милан",
    category: "bath",
    purposes: ["vannaya", "banya-plyazh", "podarki"],
    density: 480,
    sizes: [...towel(10, 20, 38), set(64)],
    colors: [
      { name: "терракотовый", swatch: "#c0574a", image: "/img/milan-terra.webp", family: "pink", position: STACK },
      { name: "мятный", swatch: "#6fa3a6", image: "/img/milan-mint.webp", family: "green", position: STACK },
      { name: "графит", swatch: "#4f5157", image: "/img/milan-graphite.webp", family: "graphite", position: STACK },
      { name: "серый", swatch: "#9a999e", image: "/img/milan-grey.webp", family: "grey", position: STACK },
    ],
  },
  {
    id: "lyon",
    name: "Коврик для ванной",
    collection: "lyon",
    title: "Лион",
    category: "mats",
    purposes: ["kovriki", "vannaya"],
    density: 700,
    sizes: [{ label: "50×70", note: "у ванны или душа", price: 26 }],
    colors: [
      { name: "бежевый", swatch: "#cbb39d", image: "/img/lyon-beige.webp", family: "beige" },
      { name: "коричневый", swatch: "#4c2c24", image: "/img/lyon-brown.webp", family: "brown" },
      { name: "графит", swatch: "#44464c", image: "/img/lyon-graphite.webp", family: "graphite" },
      { name: "серый", swatch: "#9d9a9c", image: "/img/lyon-grey.webp", family: "grey" },
    ],
  },
  {
    id: "naples",
    name: "Полотенце вафельное",
    collection: "naples",
    title: "Неаполь",
    category: "kitchen",
    purposes: ["kuhnya"],
    density: 240,
    sizes: [{ label: "40×70", note: "кухонное", price: 8 }],
    colors: [
      { name: "беж + коричневый", swatch: "#a77f68", image: "/img/naples-brown.webp", family: "brown" },
      { name: "графит + серый", swatch: "#6e7178", image: "/img/naples-grey.webp", family: "graphite" },
    ],
  },
  {
    id: "bergamo",
    name: "Полотенце махровое",
    collection: "bergamo",
    title: "Бергамо",
    category: "hotel",
    purposes: ["oteli", "vannaya", "podarki"],
    density: 450,
    sizes: [...towel(13, 20, 38, { a: "40×70", b: "50×90", c: "70×140" }), set(69, "70×140, 50×90, 40×70")],
    colors: [{ name: "белый", swatch: "#f6f3ee", image: "/img/use-hotel.webp", family: "white", position: "50% 60%" }],
  },
  {
    id: "robe",
    name: "Халат махровый",
    title: "Kava",
    category: "robes",
    purposes: ["halaty", "banya-plyazh"],
    density: 450,
    sizes: [{ label: "46–62", note: "размеры", price: 239 }],
    colors: [{ name: "капучино", swatch: "#d8c6b4", image: "/img/use-robe.webp", family: "beige", position: "50% 40%" }],
  },
  {
    id: "turin",
    name: "Салфетка махровая",
    title: "Турин",
    category: "kitchen",
    purposes: ["kuhnya", "vannaya"],
    density: 450,
    sizes: [{ label: "30×30", note: "для рук и посуды", price: 5 }],
    colors: [{ name: "графит", swatch: "#4f5157", image: "/img/turin.webp", family: "graphite", position: "50% 60%" }],
  },
];

/** Карточка каталога = модель (решение 2026-11-12): цвета квадратами под фото, colorIndex — цвет, показанный первым. */
export type Card = { key: string; product: Product; colorIndex: number };

export function allCards(list: Product[] = products): Card[] {
  return list.map((p) => ({ key: p.id, product: p, colorIndex: 0 }));
}

/**
 * Спокойный порядок цветов (просьба Эллы 2026-11-12, «чтобы не было визуального шума» на главной):
 * первый цвет карточек чередуется бежевый → серый → бежевый…, дальше остальные нейтральные, яркие в конце.
 * Если нужного семейства у модели нет, берётся ближайший нейтральный, а следующая карточка чередует уже от него.
 */
const CALM: FamilyId[][] = [
  ["beige", "grey", "white", "graphite", "brown"],
  ["grey", "beige", "graphite", "white", "brown"],
];
const NEUTRAL: FamilyId[] = ["beige", "grey", "white", "graphite", "brown"];

export function calmColors(list: Product[]): Product[] {
  // чередуем от того, что реально встало первым у предыдущей карточки (у Флоренции, например, нет серого)
  let last: FamilyId = "grey";
  return list.map((p) => {
    if (p.colors.length < 2) return p;
    const want = CALM[last === "beige" ? 1 : 0];
    const rank = (f: FamilyId) => {
      const i = want.indexOf(f);
      return i < 0 ? want.length + NEUTRAL.length : i;
    };
    // стабильная сортировка: внутри одного семейства порядок из админки сохраняется
    const colors = p.colors
      .map((c, i) => ({ c, i }))
      .sort((a, b) => rank(a.c.family) - rank(b.c.family) || a.i - b.i)
      .map((x) => x.c);
    last = colors[0].family;
    return { ...p, colors };
  });
}

export function priceRange(p: Product): [number, number] {
  const prices = p.sizes.map((s) => s.price);
  return [Math.min(...prices), Math.max(...prices)];
}

export function hasSet(p: Product) {
  return p.sizes.some((s) => s.label.startsWith("Набор"));
}

// Подарочные коллекции QD (лист прайса): не города, отдельной подборкой.
export type GiftLine = { name: string; density: number; sizes: string; colors: { name: string; swatch: string }[]; from: number };

export const giftLines: GiftLine[] = [
  {
    name: "QD",
    density: 550,
    sizes: "50×90, 70×140",
    from: 18,
    colors: [
      { name: "ваниль", swatch: "#efe2c4" },
      { name: "капучино", swatch: "#c8ab90" },
      { name: "ментол", swatch: "#a9d6cc" },
      { name: "зелёный", swatch: "#2fa59b" },
      { name: "синий", swatch: "#4f6c94" },
    ],
  },
  {
    name: "QD Tiffani",
    density: 550,
    sizes: "50×90, 70×140",
    from: 22,
    colors: [
      { name: "ваниль", swatch: "#efe2c4" },
      { name: "серый", swatch: "#a6a4a8" },
      { name: "сиреневый", swatch: "#b3a0c4" },
      { name: "т. коричневый", swatch: "#5a3e35" },
    ],
  },
  {
    name: "QD Grilyaj",
    density: 550,
    sizes: "50×90, 70×140",
    from: 22,
    colors: [
      { name: "ваниль", swatch: "#efe2c4" },
      { name: "ореховый", swatch: "#94705a" },
      { name: "св. бежевый", swatch: "#e3d4c3" },
      { name: "серый", swatch: "#a6a4a8" },
    ],
  },
  {
    name: "QD Kirpich",
    density: 600,
    sizes: "50×90, 50×100, 70×140",
    from: 32,
    colors: [
      { name: "белый", swatch: "#f6f3ee" },
      { name: "серый", swatch: "#a6a4a8" },
      { name: "мокрый асфальт", swatch: "#5d5d61" },
      { name: "графит", swatch: "#45464b" },
      { name: "шоколад", swatch: "#4a2f27" },
    ],
  },
  {
    name: "QD Ricci",
    density: 600,
    sizes: "50×90, 70×140",
    from: 29,
    colors: [
      { name: "розовый", swatch: "#e1a9b1" },
      { name: "сиреневый", swatch: "#b3a0c4" },
      { name: "лавандово-серый", swatch: "#a7a1b4" },
    ],
  },
  {
    name: "QD Santini",
    density: 500,
    sizes: "50×90, 70×140",
    from: 29,
    colors: [
      { name: "розовый", swatch: "#e1a9b1" },
      { name: "фиолет", swatch: "#7c5c93" },
      { name: "св. серый", swatch: "#cfcdd0" },
      { name: "лавандово-серый", swatch: "#a7a1b4" },
      { name: "графит", swatch: "#45464b" },
    ],
  },
  {
    name: "QD Iris",
    density: 380,
    sizes: "50×90, 50×100, 70×140",
    from: 20,
    colors: [
      { name: "бежевый", swatch: "#dcc7b2" },
      { name: "капучино", swatch: "#c8ab90" },
      { name: "пыльная роза", swatch: "#cfa1a0" },
      { name: "графит", swatch: "#45464b" },
    ],
  },
];

// QD в каталоге: одна карточка на линию, цвета квадратами. Фото пока одно общее (рулоны QD со старого сайта),
// нарезано по рулонам; по каждой линии нужны свои фото от клиента.
const QD_FAMILY: Record<string, FamilyId> = {
  ваниль: "white",
  белый: "white",
  "св. бежевый": "beige",
  бежевый: "beige",
  капучино: "beige",
  ореховый: "brown",
  "т. коричневый": "brown",
  шоколад: "brown",
  серый: "grey",
  "св. серый": "grey",
  "лавандово-серый": "grey",
  "мокрый асфальт": "graphite",
  графит: "graphite",
  ментол: "green",
  зелёный: "green",
  синий: "green",
  розовый: "pink",
  "пыльная роза": "pink",
  сиреневый: "pink",
  фиолет: "pink",
};
const QD_PHOTO: Record<FamilyId, string> = {
  white: "/img/qd-vanilla.webp",
  beige: "/img/qd-peach.webp",
  brown: "/img/qd-peach.webp",
  grey: "/img/qd-lilac.webp",
  graphite: "/img/qd-lilac.webp",
  green: "/img/qd-mint.webp",
  pink: "/img/qd-peach.webp",
};
const qdPhoto = (name: string, family: FamilyId) => (/сирен|фиолет|лаванд/.test(name) ? "/img/qd-lilac.webp" : QD_PHOTO[family]);

for (const g of giftLines) {
  const sizes = g.sizes.split(", ");
  products.push({
    id: g.name.toLowerCase().replace(/\s+/g, "-"),
    name: "Подарочное полотенце",
    title: g.name,
    category: "gifts",
    purposes: ["podarki", "vannaya"],
    density: g.density,
    sizes: sizes.map((label, i) => ({ label, note: i === sizes.length - 1 ? "банное" : "для лица", price: g.from + i * 8 })),
    colors: g.colors.map((c) => {
      const family = QD_FAMILY[c.name] ?? "beige";
      return { name: c.name, swatch: c.swatch, image: qdPhoto(c.name, family), family, position: "50% 50%" };
    }),
  });
}

/** Данные коллекции для витрины главной: модель, цвета с фото, цена «от», размеры без наборов. */
export function forCollection(slug: string, list: Product[] = products) {
  // основная модель коллекции: не набор, если есть что-то кроме наборов
  const own = list.filter((p) => p.collection === slug);
  const product = own.find((p) => p.category !== "sets") ?? own[0];
  return {
    product,
    colors: product?.colors ?? [],
    from: product ? priceRange(product)[0] : 0,
    sizes: product?.sizes.filter((z) => !z.label.startsWith("Набор")).map((z) => z.label) ?? [],
    hasSet: product ? hasSet(product) || own.some((p) => p.category === "sets") : false,
  };
}
