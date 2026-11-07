// Данные главной для прототипа. Позже приходят из WooCommerce REST API.
// Факты — только то, что видно на фото клиента. Цены — заглушки до прайса (придёт 2026-11-09).

export type CitySymbol = "verona" | "rimini" | "venice" | "florence" | "milan" | "lyon" | "naples";

export type ColorVariant = {
  name: string;
  swatch: string;
  image: string;
  priceFrom: number;
};

export type Collection = {
  slug: string;
  city: string;
  latin: string;
  country: string;
  countryLatin: string;
  /** координаты города для подписи открытки */
  coords: string;
  tone: string;
  /** светлая панель: текст чернилами, а не белым */
  light?: boolean;
  image: string;
  imagePosition?: string;
  facts: { term: string; value: string }[];
  colors: ColorVariant[];
};

export const collections: Collection[] = [
  {
    slug: "verona",
    city: "Верона",
    latin: "VERONA",
    country: "Италия",
    countryLatin: "ITALIA",
    coords: "45°26′ с. ш. · 10°59′ в. д.",
    tone: "#00757d",
    image: "/img/verona.webp",
    imagePosition: "50% 70%",
    facts: [
      { term: "Бордюр", value: "атласные полосы" },
      { term: "Где", value: "ванная, кухня" },
    ],
    colors: [
      { name: "изумруд", swatch: "#00838c", image: "/img/verona-emerald.webp", priceFrom: 18 },
      { name: "бежевый", swatch: "#cdb9ae", image: "/img/verona-beige.webp", priceFrom: 18 },
      { name: "графит", swatch: "#55565b", image: "/img/verona-graphite.webp", priceFrom: 18 },
      { name: "коричневый", swatch: "#7a5a55", image: "/img/verona-brown.webp", priceFrom: 18 },
      { name: "серый", swatch: "#a3a1aa", image: "/img/verona-grey.webp", priceFrom: 18 },
    ],
  },
  {
    slug: "rimini",
    city: "Римини",
    latin: "RIMINI",
    country: "Италия",
    countryLatin: "ITALIA",
    coords: "44°03′ с. ш. · 12°34′ в. д.",
    tone: "#9a5f6d",
    image: "/img/rimini.webp",
    imagePosition: "50% 50%",
    facts: [
      { term: "Бордюр", value: "сетка металлизированной нитью" },
      { term: "Шильдик", value: "KAVA на бордюре" },
    ],
    colors: [
      { name: "розовый", swatch: "#c07f8b", image: "/img/rimini-pink.webp", priceFrom: 20 },
      { name: "бежевый", swatch: "#dcc3b4", image: "/img/rimini-beige.webp", priceFrom: 20 },
      { name: "мятный", swatch: "#6f9fa8", image: "/img/rimini-mint.webp", priceFrom: 20 },
      { name: "синий", swatch: "#6c82a0", image: "/img/rimini-blue.webp", priceFrom: 20 },
      { name: "графит", swatch: "#4f5257", image: "/img/rimini-graphite.webp", priceFrom: 20 },
      { name: "серый", swatch: "#a6a3a8", image: "/img/rimini-grey.webp", priceFrom: 20 },
    ],
  },
  {
    slug: "venice",
    city: "Венеция",
    latin: "VENEZIA",
    country: "Италия",
    countryLatin: "ITALIA",
    coords: "45°26′ с. ш. · 12°20′ в. д.",
    tone: "#4d7884",
    image: "/img/venice.webp",
    imagePosition: "50% 55%",
    facts: [
      { term: "Бордюр", value: "тканая волна" },
      { term: "Где", value: "ванная" },
    ],
    colors: [
      { name: "мятный", swatch: "#5f97a2", image: "/img/venice-mint.webp", priceFrom: 20 },
      { name: "бежевый", swatch: "#d7c6b6", image: "/img/venice-beige.webp", priceFrom: 20 },
      { name: "графит", swatch: "#4a4c51", image: "/img/venice-graphite.webp", priceFrom: 20 },
      { name: "серый", swatch: "#a5a2ab", image: "/img/venice-grey.webp", priceFrom: 20 },
    ],
  },
  {
    slug: "florence",
    city: "Флоренция",
    latin: "FIRENZE",
    country: "Италия",
    countryLatin: "ITALIA",
    coords: "43°46′ с. ш. · 11°15′ в. д.",
    tone: "#d8c2ac",
    light: true,
    image: "/img/florence.webp",
    imagePosition: "40% 50%",
    facts: [
      { term: "Рельеф", value: "«ёлочка» по всему полотну" },
      { term: "Где", value: "ванная" },
    ],
    colors: [
      { name: "бежевый", swatch: "#c9a88f", image: "/img/florence-beige.webp", priceFrom: 24 },
      { name: "графит", swatch: "#3f3b40", image: "/img/florence-graphite.webp", priceFrom: 24 },
      { name: "коричневый", swatch: "#4a2620", image: "/img/florence-brown.webp", priceFrom: 24 },
    ],
  },
  {
    slug: "milan",
    city: "Милан",
    latin: "MILANO",
    country: "Италия",
    countryLatin: "ITALIA",
    coords: "45°28′ с. ш. · 9°11′ в. д.",
    tone: "#b0503f",
    image: "/img/milan.webp",
    imagePosition: "50% 40%",
    facts: [
      { term: "Рельеф", value: "жаккард «соты»" },
      { term: "Шильдик", value: "KAVA на бордюре" },
    ],
    colors: [
      { name: "терракотовый", swatch: "#c0574a", image: "/img/milan-terra.webp", priceFrom: 22 },
      { name: "мятный", swatch: "#6fa3a6", image: "/img/milan-mint.webp", priceFrom: 22 },
      { name: "графит", swatch: "#4f5157", image: "/img/milan-graphite.webp", priceFrom: 22 },
      { name: "серый", swatch: "#9a999e", image: "/img/milan-grey.webp", priceFrom: 22 },
    ],
  },
  {
    slug: "lyon",
    city: "Лион",
    latin: "LYON",
    country: "Франция",
    countryLatin: "FRANCE",
    coords: "45°45′ с. ш. · 4°51′ в. д.",
    tone: "#5a4a44",
    image: "/img/lyon.webp",
    imagePosition: "50% 50%",
    facts: [
      { term: "Что это", value: "коврик для ванной" },
      { term: "Рельеф", value: "дуги, как своды" },
    ],
    colors: [
      { name: "бежевый", swatch: "#cbb39d", image: "/img/lyon-beige.webp", priceFrom: 26 },
      { name: "коричневый", swatch: "#4c2c24", image: "/img/lyon-brown.webp", priceFrom: 26 },
      { name: "графит", swatch: "#44464c", image: "/img/lyon-graphite.webp", priceFrom: 26 },
      { name: "серый", swatch: "#9d9a9c", image: "/img/lyon-grey.webp", priceFrom: 26 },
    ],
  },
  {
    slug: "naples",
    city: "Неаполь",
    latin: "NAPOLI",
    country: "Италия",
    countryLatin: "ITALIA",
    coords: "40°51′ с. ш. · 14°16′ в. д.",
    tone: "#cbbcaf",
    light: true,
    image: "/img/naples.webp",
    imagePosition: "50% 45%",
    facts: [
      { term: "Ткань", value: "вафельная" },
      { term: "Где", value: "кухня" },
    ],
    colors: [
      { name: "беж + коричневый", swatch: "#a77f68", image: "/img/naples-brown.webp", priceFrom: 9 },
      { name: "графит + серый", swatch: "#6e7178", image: "/img/naples-grey.webp", priceFrom: 9 },
    ],
  },
];

export const purposes = [
  { label: "Ванная", href: "/catalog?naznachenie=vannaya" },
  { label: "Кухня", href: "/catalog?naznachenie=kuhnya" },
  { label: "Баня и пляж", href: "/catalog?naznachenie=banya-plyazh" },
  { label: "Халаты", href: "/catalog?naznachenie=halaty" },
  { label: "Коврики", href: "/catalog?naznachenie=kovriki" },
  { label: "Наборы и подарки", href: "/catalog?naznachenie=podarki" },
  { label: "Для отелей", href: "/#hotels" },
];

export const contacts = {
  phone: "+375 (29) 101-58-58",
  phoneHref: "tel:+375291015858",
  email: "kavahometextile@gmail.com",
  hours: "Пн–Пт, 9:00–18:00",
  company: "ООО «Альянс Бетон Групп», УНП 692126463, Минск, ул. Рафиева, 55",
};
