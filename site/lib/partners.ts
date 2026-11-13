// Партнёры и маркетплейсы — со слов Эллы (2026-11-13). Логотипы взяты с сайтов партнёров и перекрашиваются
// на витрине в цвет логотипа KAVA (маска), поэтому подходят и SVG, и PNG с прозрачным фоном.
// Нет логотипа — logo не задан, показывается надпись тем же цветом. ЦУМ и Веста — файлы от Эллы (2026-11-13).

export type Partner = {
  name: string;
  kind: string;
  logo?: string;
  /** пропорция логотипа (ширина / высота), чтобы все стояли на одной визуальной высоте */
  ratio: number;
  /** множитель площади для логотипов, где много пустоты (у ЦУМ длинные тонкие линии) */
  boost?: number;
};

/** Отели, курорты и спорт: полотенца повышенной плотности 500 г/м². */
export const hotels: Partner[] = [
  { name: "Европа", kind: "гостиница", logo: "/partners/europe.svg", ratio: 0.75 },
  { name: "Минск", kind: "отель", logo: "/partners/minsk.png", ratio: 1 },
  { name: "Веста", kind: "загородный комплекс", logo: "/partners/vesta.png", ratio: 1.3 },
  { name: "Альфа Радон", kind: "медицинский спа-курорт", logo: "/partners/alfaradon.png", ratio: 1 },
  { name: "Плисса", kind: "санаторно-курортный комплекс", logo: "/partners/plissa.svg", ratio: 1.56 },
  { name: "World Class", kind: "фитнес-клуб", logo: "/partners/worldclass.svg", ratio: 3.55 },
];

/** Торговые сети Беларуси, где продаются полотенца. */
export const stores: Partner[] = [
  { name: "Корона", kind: "торговая сеть", logo: "/partners/korona.svg", ratio: 1 },
  { name: "Green", kind: "гипермаркеты", logo: "/partners/green.svg", ratio: 3 },
  { name: "ProStore", kind: "гипермаркеты", logo: "/partners/prostore.svg", ratio: 5.93 },
  { name: "Гиппо", kind: "гипермаркеты", logo: "/partners/gippo.svg", ratio: 3.36 },
  { name: "ЦУМ", kind: "универмаг", logo: "/partners/tsum.png", ratio: 5.83, boost: 1.7 },
];

export type Marketplace = Partner & { url: string; photo: string; position?: string };

export const marketplaces: Marketplace[] = [
  {
    name: "Wildberries",
    kind: "маркетплейс",
    logo: "/partners/wb.svg",
    ratio: 6.66,
    url: "https://www.wildberries.by/brands/312307295-kava-home/tekstil-dlya-doma",
    photo: "/img/verona-beige.webp",
    position: "50% 74%",
  },
  { name: "Ozon", kind: "маркетплейс", logo: "/partners/ozon.svg", ratio: 4.6, url: "https://ozon.by/brand/kava-home-textile-101191106/", photo: "/img/rimini-grey.webp", position: "50% 74%" },
  { name: "Emall", kind: "маркетплейс", logo: "/partners/emall.svg", ratio: 2.94, url: "https://emall.by/brands/44647", photo: "/img/venice-mint.webp", position: "50% 74%" },
];

/** Средняя оценка бренда на маркетплейсах (Элла, 2026-11-13). */
export const rating = "4,9";
