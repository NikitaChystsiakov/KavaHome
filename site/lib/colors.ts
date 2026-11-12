import type { FamilyId } from "./catalog";

// Цвет квадратика и семейство для фильтра «Цвет» по названию цвета из админки (атрибут «Цвет»).
// В WooCommerce этого нет: Элла пишет только название. Новый цвет в админке без записи здесь
// получит нейтральный бежевый квадрат — добавить строку сюда.
// Оттенок конкретной коллекции, если он уже подобран на прототипе, берётся из lib/catalog.ts (см. lib/woo.ts).

export const COLORS: Record<string, { swatch: string; family: FamilyId }> = {
  белый: { swatch: "#f6f3ee", family: "white" },
  ваниль: { swatch: "#efe4cc", family: "white" },
  кремовый: { swatch: "#ece0c8", family: "white" },
  "св бежевый": { swatch: "#e2d3c1", family: "beige" },
  бежевый: { swatch: "#d7c6b6", family: "beige" },
  капучино: { swatch: "#c9b29a", family: "beige" },
  какао: { swatch: "#9a7663", family: "brown" },
  ореховый: { swatch: "#8a5f45", family: "brown" },
  коричневый: { swatch: "#6e4a3f", family: "brown" },
  "т коричневый": { swatch: "#4a2f27", family: "brown" },
  шоколад: { swatch: "#3f2620", family: "brown" },
  "св серый": { swatch: "#c4c2c4", family: "grey" },
  серый: { swatch: "#a5a2ab", family: "grey" },
  "лавандово-серый": { swatch: "#a39fb0", family: "grey" },
  "т серый": { swatch: "#77767c", family: "graphite" },
  "графитово-серый": { swatch: "#606168", family: "graphite" },
  "мокрый асфальт": { swatch: "#55565c", family: "graphite" },
  графит: { swatch: "#4b4c51", family: "graphite" },
  мятный: { swatch: "#6f9fa8", family: "green" },
  ментол: { swatch: "#9cc7bf", family: "green" },
  тиффани: { swatch: "#7fc4bd", family: "green" },
  изумруд: { swatch: "#00838c", family: "green" },
  зеленый: { swatch: "#3f6b4f", family: "green" },
  голубой: { swatch: "#9bb8cc", family: "green" },
  синий: { swatch: "#6c82a0", family: "green" },
  розовый: { swatch: "#c07f8b", family: "pink" },
  "п роза": { swatch: "#c79a98", family: "pink" },
  терракотовый: { swatch: "#c0574a", family: "pink" },
  брусника: { swatch: "#8e2f3c", family: "pink" },
  бордовый: { swatch: "#6b2632", family: "pink" },
  красный: { swatch: "#a8262b", family: "pink" },
  лаванда: { swatch: "#b3a6c6", family: "pink" },
  сиреневый: { swatch: "#a88fb5", family: "pink" },
  лиловый: { swatch: "#9c7fa6", family: "pink" },
  "св фиолет": { swatch: "#9d8bb8", family: "pink" },
  фиолет: { swatch: "#6c4f86", family: "pink" },
};

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е").replace(/\./g, "").replace(/\s+/g, " ").trim();

export function colorInfo(name: string) {
  return COLORS[norm(name)] ?? { swatch: "#d7c6b6", family: "beige" as FamilyId };
}

// Подпись к размеру: «30×60 — для рук». Для кухни и ковриков своя.
export function sizeNote(label: string, kind: "bath" | "kitchen" | "mats" = "bath") {
  if (kind === "mats") return "у ванны или душа";
  if (kind === "kitchen") return label === "30×30" ? "для рук и посуды" : "кухонное";
  const [w, h] = label.split("×").map(Number);
  if (!w || !h) return "";
  if (w <= 40) return "для рук";
  if (w <= 50) return "для лица";
  if (w <= 70) return "банное";
  return "большое банное";
}

/** Площадь размера для сортировки 30×60 → 50×80 → 70×130 → 100×150. */
export function sizeArea(label: string) {
  const [w, h] = label.split("×").map(Number);
  return w && h ? w * h : Number.MAX_SAFE_INTEGER;
}

const TR: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
  н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};
export function slugify(s: string) {
  return s
    .toLowerCase()
    .split("")
    .map((ch) => TR[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
