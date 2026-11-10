"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Collection } from "@/lib/collections";
import { products, priceRange } from "@/lib/catalog";
import { MiniPostcard } from "./MiniPostcard";
import { SwapPhoto } from "./SwapPhoto";
import { Arrow } from "./CollectionsRail";
import s from "./showcase.module.css";

// Эскиз B «Витрина»: место одно, меняется содержимое.
// Слева большое фото полотенца, справа стопка открыток, город, цвета, цена. «Дальше» — верхняя открытка
// улетает со стопки, фото мягко меняется на следующую коллекцию. Внизу полоса со всеми городами.
export function CollectionsStage({ items, id = "kollekcii" }: { items: Collection[]; id?: string }) {
  const [i, setI] = useState(0);
  const [color, setColor] = useState(0);
  const [leaving, setLeaving] = useState<{ slug: string; dir: 1 | -1 } | null>(null);
  const strip = useRef<HTMLOListElement>(null);
  const n = items.length;
  const total = String(n).padStart(2, "0");
  const c = items[i];
  const product = products.find((p) => p.collection === c.slug);
  const colors = product?.colors ?? c.colors.map((v) => ({ ...v, position: undefined }));
  const cur = colors[Math.min(color, colors.length - 1)];
  const from = product ? priceRange(product)[0] : c.colors[0].priceFrom;
  const sizes = product?.sizes.map((z) => z.label).filter((l) => !l.startsWith("Набор"));

  const go = useCallback(
    (to: number, dir: 1 | -1) => {
      const next = (to + n) % n;
      if (next === i) return;
      setLeaving({ slug: items[i].slug, dir });
      setI(next);
      setColor(0);
      window.setTimeout(() => setLeaving(null), 600);
    },
    [i, n, items],
  );

  // активный город в полосе всегда виден
  // прокручиваем только саму полосу: scrollIntoView двигал бы всю страницу (при загрузке уводил к витрине)
  useEffect(() => {
    const row = strip.current;
    const el = row?.querySelector<HTMLElement>(`[data-i="${i}"]`);
    if (!row || !el) return;
    const x = el.getBoundingClientRect().left - row.getBoundingClientRect().left + row.scrollLeft;
    row.scrollTo({ left: x - (row.clientWidth - el.offsetWidth) / 2, behavior: "smooth" });
  }, [i]);

  // свайп по фото на телефоне
  const touch = useRef<number | null>(null);

  // стопка: верхняя открытка + две следующие выглядывают из-под неё
  const stack = [0, 1, 2].map((k) => ({ c: items[(i + k) % n], pos: k }));

  return (
    <section
      id={id}
      data-screen
      className={s.stage}
      aria-labelledby="stage-title"
      aria-roledescription="карусель"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(i + 1, 1);
        if (e.key === "ArrowLeft") go(i - 1, -1);
      }}
    >
      <div
        className={s.stagePhoto}
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current === null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          touch.current = null;
          if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
        }}
      >
        <SwapPhoto src={cur.image} alt={`Коллекция ${c.city}, ${cur.name}`} sizes="(max-width: 760px) 100vw, 55vw" position={cur.position ?? "50% 70%"} eager />
        {c.isNew && <span className={s.newBadge}>Новинка</span>}
      </div>

      <div className={s.stagePanel}>
        <div className={s.stageTop}>
          <h2 id="stage-title" className="caps">
            Коллекции
          </h2>
          <span className={s.counter}>
            {String(i + 1).padStart(2, "0")} / {total}
          </span>
          <div className={s.arrows}>
            <button type="button" onClick={() => go(i - 1, -1)} aria-label="Предыдущая коллекция">
              <Arrow dir={-1} />
            </button>
            <button type="button" onClick={() => go(i + 1, 1)} aria-label="Следующая коллекция">
              <Arrow dir={1} />
            </button>
          </div>
        </div>

        <div className={s.stack}>
          {leaving && leaving.dir === 1 && (
            <span key={`out-${leaving.slug}`} className={s.stackCard} data-pos="out" data-dir={leaving.dir}>
              <MiniPostcard c={items.find((x) => x.slug === leaving.slug)!} num="" total={total} sizes="420px" />
            </span>
          )}
          {stack
            .slice()
            .reverse()
            .map(({ c: x, pos }) => (
              <span key={x.slug} className={s.stackCard} data-pos={pos} data-pc-host={pos === 0 ? "" : undefined} data-enter={pos === 0 && leaving?.dir === -1 ? "back" : undefined}>
                <MiniPostcard c={x} num={String(items.indexOf(x) + 1).padStart(2, "0")} total={total} sizes="420px" />
              </span>
            ))}
        </div>

        <div className={s.stageText} key={c.slug}>
          <p className={s.stageCountry}>
            {c.country} · {c.coords}
          </p>
          <p className={s.stageCity}>{c.city}</p>
          <p className={s.stageMeta}>
            {product?.name.toLowerCase()}
            {product ? ` · ${product.density} г/м²` : ""}
            {sizes?.length ? ` · ${sizes[0]} – ${sizes[sizes.length - 1]}` : ""}
          </p>
          <ul className={s.stageSw} aria-label={`Цвета коллекции ${c.city}`}>
            {colors.map((v, k) => (
              <li key={v.name}>
                <button type="button" aria-pressed={v === cur} onClick={() => setColor(k)}>
                  <i style={{ background: v.swatch }} />
                  <span>{v.name}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className={s.stageBuy}>
            <a href={`?kol=${c.slug}#catalog`} data-filter-kol={c.slug} className={s.stageBtn}>
              Смотреть «{c.city}»
              <Arrow dir={1} />
            </a>
            <p className={s.stagePrice}>
              от {from} BYN<small>цена примерная</small>
            </p>
          </div>
        </div>

        <ol ref={strip} className={s.strip} aria-label="Все коллекции">
          {items.map((x, k) => (
            <li key={x.slug}>
              <button type="button" data-i={k} aria-current={k === i ? "true" : undefined} onClick={() => go(k, k > i ? 1 : -1)}>
                <i style={{ background: (products.find((p) => p.collection === x.slug)?.colors[0].swatch ?? x.tone) }} />
                {x.city}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
