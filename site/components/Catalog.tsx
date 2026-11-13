"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { warm } from "@/lib/warm";
import { SwapPhoto } from "./SwapPhoto";
import type { Collection } from "@/lib/collections";
import {
  allCards,
  categories,
  families,
  hasSet,
  priceRange,
  purposeChips,
  type Card,
  type Product,
  type CategoryId,
  type FamilyId,
  type PurposeId,
} from "@/lib/catalog";
import s from "./catalog.module.css";

// Каталог по схеме Zara Home: слева меню категорий, сверху чипсы назначения, сетка от края до края с зазором 2px.
// Карточка = модель + цвет; квадраты цветов под карточкой мягко меняют фото на месте.
// Состояние фильтров в адресе (?kat=&nazn=&kol=&cvet=&vid=&sort=) — под рекламу на готовую подборку.

type Sort = "pop" | "cheap" | "dear";
type Filters = {
  q: string;
  kat: CategoryId | null;
  nazn: PurposeId | null;
  kol: string | null;
  cvet: FamilyId | null;
  sort: Sort;
  vid: number | null;
};
const EMPTY: Filters = { q: "", kat: null, nazn: null, kol: null, cvet: null, sort: "pop", vid: null };

function readUrl(): Filters {
  const q = new URLSearchParams(window.location.search);
  const pick = <T extends string>(key: string, ok: readonly string[]) => {
    const v = q.get(key);
    return v && ok.includes(v) ? (v as T) : null;
  };
  const vid = Number(q.get("vid"));
  return {
    q: q.get("q") ?? "",
    kat: pick<CategoryId>("kat", categories.map((c) => c.id)),
    nazn: pick<PurposeId>("nazn", purposeChips.map((c) => c.id)),
    kol: q.get("kol"),
    cvet: pick<FamilyId>("cvet", families.map((f) => f.id)),
    sort: pick<Sort>("sort", ["pop", "cheap", "dear"]) ?? "pop",
    vid: [1, 2, 4, 6].includes(vid) ? vid : null,
  };
}

function writeUrl(f: Filters) {
  const q = new URLSearchParams();
  if (f.q.trim()) q.set("q", f.q.trim());
  if (f.kat) q.set("kat", f.kat);
  if (f.nazn) q.set("nazn", f.nazn);
  if (f.kol) q.set("kol", f.kol);
  if (f.cvet) q.set("cvet", f.cvet);
  if (f.sort !== "pop") q.set("sort", f.sort);
  if (f.vid) q.set("vid", String(f.vid));
  const qs = q.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`);
}

// поиск: каждое слово запроса должно найтись в названии, коллекции, цвете или размере
function haystack(p: Product, city?: string) {
  return [p.name, p.title, city, ...p.colors.map((x) => x.name), ...p.sizes.map((z) => `${z.label} ${z.note}`), categories.find((c) => c.id === p.category)?.label]
    .join(" ")
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[xх*]/g, "×");
}

function match(c: Card, f: Filters, hay?: string) {
  const p = c.product;
  if (f.q.trim() && hay) {
    const words = f.q.toLowerCase().replace(/ё/g, "е").replace(/(\d)\s*[xх*]\s*(\d)/g, "$1×$2").split(/\s+/).filter(Boolean);
    if (!words.every((w) => hay.includes(w))) return false;
  }
  if (f.kat && (f.kat === "sets" ? !hasSet(p) : p.category !== f.kat)) return false;
  if (f.nazn && !p.purposes.includes(f.nazn)) return false;
  if (f.kol && p.collection !== f.kol) return false;
  if (f.cvet && !p.colors.some((x) => x.family === f.cvet)) return false;
  return true;
}

// page — отдельная страница /catalog: заголовок H1 и поле поиска (в шапке «Найти полотенце» ведёт сюда с ?poisk=1)
export function Catalog({ collections, products, page = false }: { collections: Collection[]; products?: Product[]; page?: boolean }) {
  const cards = useMemo(() => allCards(products), [products]);
  const hay = useMemo(
    () => new Map(cards.map((c) => [c.key, haystack(c.product, collections.find((x) => x.slug === c.product.collection)?.city)])),
    [cards, collections],
  );
  const search = useRef<HTMLInputElement>(null);
  const root = useRef<HTMLElement>(null);
  const [f, setF] = useState<Filters>(EMPTY);
  const [panel, setPanel] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    // фильтры из адреса читаются после гидрации (сервер отдаёт каталог без фильтров)
    // адрес читаем сразу: эффект синхронизации ниже может успеть переписать его до следующего кадра
    const initial = readUrl();
    const wantSearch = new URLSearchParams(window.location.search).has("poisk");
    const raf = requestAnimationFrame(() => {
      setF(initial);
      if (wantSearch) search.current?.focus();
    });
    const mq = window.matchMedia("(max-width: 760px)");
    const onMq = () => setMobile(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  // фильтр внутри каталога меняет высоту сетки: если начало каталога уже ушло вверх, возвращаемся к нему,
  // иначе страница «проваливается» в следующие разделы (подарки, отели)
  const keepTop = useRef(false);
  const update = useCallback((patch: Partial<Filters>) => {
    keepTop.current = true;
    setF((prev) => ({ ...prev, ...patch }));
  }, []);
  useEffect(() => {
    if (!keepTop.current) return;
    keepTop.current = false;
    const el = root.current;
    if (!el) return;
    const hdr = window.innerWidth < 761 ? 56 : 64;
    const top = el.getBoundingClientRect().top;
    if (top < hdr - 1) window.scrollTo({ top: window.scrollY + top - hdr, behavior: "instant" });
  }, [f]);

  // адрес обновляется после рендера: replaceState внутри setState задевает роутер Next
  const loaded = useRef(false);
  useEffect(() => {
    if (loaded.current) writeUrl(f);
    loaded.current = true;
  }, [f]);

  // ссылки-фильтры с других частей страницы (первый экран, оборот открытки, меню) работают без перезагрузки
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[data-filter-nazn], a[data-filter-kol], a[data-filter-kat]");
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      const next: Filters = {
        ...EMPTY,
        vid: f.vid,
        nazn: (a.dataset.filterNazn as PurposeId) ?? null,
        kol: a.dataset.filterKol ?? null,
        kat: (a.dataset.filterKat as CategoryId) ?? null,
      };
      setF(next);
      root.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [f.vid]);

  const list = useMemo(() => {
    // при фильтре по цвету карточка сразу показывает цвет этого семейства
    const out = cards
      .filter((c) => match(c, f, hay.get(c.key)))
      .map((c) => {
        if (f.cvet) return { ...c, colorIndex: Math.max(0, c.product.colors.findIndex((x) => x.family === f.cvet)) };
        // поиск по цвету: карточка сразу показывает найденный цвет
        const words = f.q.toLowerCase().replace(/ё/g, "е").split(/\s+/).filter((w) => w.length > 2);
        const i = words.length ? c.product.colors.findIndex((x) => words.some((w) => x.name.toLowerCase().replace(/ё/g, "е").includes(w))) : -1;
        return i > 0 ? { ...c, colorIndex: i } : c;
      });
    if (f.sort === "cheap") out.sort((a, b) => priceRange(a.product)[0] - priceRange(b.product)[0]);
    if (f.sort === "dear") out.sort((a, b) => priceRange(b.product)[0] - priceRange(a.product)[0]);
    return out;
  }, [f, cards, hay]);

  const cols = f.vid ?? (mobile ? 2 : 4);
  const views = mobile ? [1, 2] : [2, 4, 6];
  const active = [
    f.kat && { key: "kat", label: categories.find((c) => c.id === f.kat)!.label },
    f.kol && { key: "kol", label: collections.find((c) => c.slug === f.kol)?.city ?? f.kol },
    f.cvet && { key: "cvet", label: families.find((x) => x.id === f.cvet)!.label },
    f.q.trim() && { key: "q", label: `«${f.q.trim()}»` },
  ].filter(Boolean) as { key: keyof Filters; label: string }[];

  return (
    <section id="catalog" ref={root} className={s.catalog} aria-labelledby="catalog-title" data-screen>
      <aside className={s.side} data-open={panel}>
        <div className={s.sideInner}>
          {page ? (
            <h1 id="catalog-title" className={s.title}>
              Каталог
            </h1>
          ) : (
            <h2 id="catalog-title" className={s.title}>
              Каталог
            </h2>
          )}
          <nav aria-label="Категории">
            <ul className={s.cats}>
              <li>
                <button type="button" aria-pressed={!f.kat} onClick={() => update({ kat: null })}>
                  Все товары
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <button type="button" aria-pressed={f.kat === c.id} onClick={() => update({ kat: f.kat === c.id ? null : c.id })}>
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <p className={s.group}>Коллекции</p>
          <ul className={s.cities}>
            {collections.map((c) => (
              <li key={c.slug}>
                <button type="button" aria-pressed={f.kol === c.slug} onClick={() => update({ kol: f.kol === c.slug ? null : c.slug })}>
                  {c.city}
                </button>
              </li>
            ))}
          </ul>

          <p className={s.group}>Цвет</p>
          <ul className={s.families}>
            {families.map((x) => (
              <li key={x.id}>
                <button
                  type="button"
                  aria-pressed={f.cvet === x.id}
                  aria-label={x.label}
                  title={x.label}
                  onClick={() => update({ cvet: f.cvet === x.id ? null : x.id })}
                >
                  <i style={{ background: x.swatch }} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className={s.main}>
        <p className={s.mTitle} aria-hidden="true">
          Каталог
        </p>
        <div className={s.bar}>
          <ul className={s.chips} aria-label="Назначение">
            {purposeChips.map((p) => (
              <li key={p.id}>
                <button type="button" aria-pressed={f.nazn === p.id} onClick={() => update({ nazn: f.nazn === p.id ? null : p.id })}>
                  {p.label}
                </button>
              </li>
            ))}
          </ul>
          <div className={s.tools}>
            <label className={s.find}>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="8.5" cy="8.5" r="6" />
                <path d="M13 13l5 5" />
              </svg>
              <span className="visually-hidden">Поиск по каталогу</span>
              <input
                ref={search}
                type="search"
                value={f.q}
                placeholder="Цвет, коллекция, размер"
                onChange={(e) => setF((prev) => ({ ...prev, q: e.target.value }))}
              />
            </label>
            <button type="button" className={s.filtersBtn} aria-expanded={panel} onClick={() => setPanel(!panel)}>
              Фильтры{active.length ? ` (${active.length})` : ""}
            </button>
            <label className={s.sort}>
              <span className="visually-hidden">Сортировка</span>
              <select value={f.sort} onChange={(e) => update({ sort: e.target.value as Sort })}>
                <option value="pop">Популярные</option>
                <option value="cheap">Сначала дешевле</option>
                <option value="dear">Сначала дороже</option>
              </select>
            </label>
            <div className={s.views} role="group" aria-label="Плотность сетки">
              <span className="caps">Вид</span>
              {views.map((v) => (
                <button key={v} type="button" aria-pressed={cols === v} aria-label={`${v} в ряд`} onClick={() => update({ vid: v })}>
                  <ViewIcon n={v} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={s.status}>
          <span>
            {list.length} {plural(list.length, "товар", "товара", "товаров")}
          </span>
          {active.map((a) => (
            <button key={a.key} type="button" className={s.tag} onClick={() => update({ [a.key]: a.key === "q" ? "" : null })}>
              {a.label} <span aria-hidden="true">×</span>
              <span className="visually-hidden">убрать фильтр</span>
            </button>
          ))}
          {(active.length > 0 || f.nazn) && (
            <button type="button" className={s.reset} onClick={() => update({ ...EMPTY, vid: f.vid })}>
              Сбросить всё
            </button>
          )}
          {f.nazn === "oteli" && (
            <a href="/biznes" className={s.reset}>
              Опт и полотенца с логотипом — заявка ниже
            </a>
          )}
        </div>

        {list.length ? (
          <ul className={s.grid} style={{ "--cols": cols } as React.CSSProperties} data-cols={cols}>
            {list.map((c, i) => (
              <li key={`${c.key}-${c.colorIndex}`}>
                <CatalogCard card={c} eager={i < 4} cols={cols} />
              </li>
            ))}
          </ul>
        ) : (
          <div className={s.empty}>
            <p>Под эти фильтры ничего нет.</p>
            <button type="button" className={s.reset} onClick={() => update({ ...EMPTY, vid: f.vid })}>
              Сбросить фильтры
            </button>
          </div>
        )}
        <p className={s.note}>
          Размер выбирается в карточке товара.
          {list.some((c) => c.product.source !== "woo") && " Цены подарочных наборов и халатов уточняются."}
        </p>
      </div>
    </section>
  );
}

// Карточка: фото, название, квадраты цветов, цена «от – до».
// Клик по квадрату: новое фото натягивается шторкой поверх старого, когда загрузится (без белой паузы).
// При наведении на карточку остальные цвета подгружаются заранее.
export function CatalogCard({ card, eager, cols }: { card: Card; eager: boolean; cols: number }) {
  const p = card.product;
  const [cur, setCur] = useState(card.colorIndex);
  const color = p.colors[cur];
  const [min, max] = priceRange(p);
  const href = `/catalog/${p.id}?cvet=${encodeURIComponent(color.name)}`;
  const sizes = cols >= 6 ? "(max-width: 760px) 50vw, 16vw" : cols >= 4 ? "(max-width: 760px) 50vw, 25vw" : "(max-width: 760px) 100vw, 50vw";
  const prefetch = () => warm(p.colors.map((v) => v.image), sizes);

  return (
    <article className={s.item} onPointerEnter={p.colors.length > 1 ? prefetch : undefined} onFocus={p.colors.length > 1 ? prefetch : undefined}>
      <a href={href} className={s.media} tabIndex={-1} aria-hidden="true">
        <SwapPhoto src={color.image} alt={`${p.name} ${p.title}, ${color.name}`} sizes={sizes} position={color.position ?? "50% 50%"} eager={eager} />
      </a>
      <div className={s.info}>
        <a href={href} className={s.name}>
          {p.name} {p.title}
        </a>
        <p className={s.meta}>
          {color.name} · {p.density} г/м²
        </p>
        {p.colors.length > 1 && (
          <ul className={s.swatches} aria-label="Цвет">
            {p.colors.map((v, i) => (
              <li key={v.name}>
                <button type="button" aria-pressed={i === cur} aria-label={v.name} title={v.name} onClick={() => setCur(i)}>
                  <i style={{ background: v.swatch }} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className={s.price}>{min === max ? `${min} BYN` : `${min} – ${max} BYN`}</p>
      </div>
    </article>
  );
}

function ViewIcon({ n }: { n: number }) {
  // ровно столько столбиков, сколько карточек в ряд
  const gap = n > 4 ? 1 : 1.5;
  const w = (16 - gap * (n - 1)) / n;
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={i * (w + gap)} y="0" width={w} height="16" />
      ))}
    </svg>
  );
}

function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}
