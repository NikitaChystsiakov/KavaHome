"use client";

import { useRef, useState } from "react";
import type { Collection } from "@/lib/collections";
import { products, priceRange } from "@/lib/catalog";
import { MiniPostcard } from "./MiniPostcard";
import { SwapPhoto } from "./SwapPhoto";
import s from "./showcase.module.css";

// Эскиз A «Лента коллекций»: крупные фото полотенец каруселью, как у Zara.
// На каждом фото приколота открытка города (переворачивается). Под фото квадраты цветов меняют кадр.
// Сколько бы ни было коллекций, лента занимает одну и ту же высоту.
export function CollectionsRail({ items }: { items: Collection[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const total = String(items.length).padStart(2, "0");

  const step = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>("[data-rcard]");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 2) * (window.innerWidth > 760 ? 2 : 1), behavior: "smooth" });
  };

  return (
    <section id="kollekcii" className={s.rail} aria-labelledby="rail-title">
      <div className={s.railHead}>
        <h2 id="rail-title" className={s.railTitle}>
          Коллекции
        </h2>
        <p className={s.railNote}>
          {items.length} коллекций · у каждой своя открытка из города · цены примерные
        </p>
        <div className={s.arrows}>
          <button type="button" onClick={() => step(-1)} aria-label="Назад">
            <Arrow dir={-1} />
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Дальше">
            <Arrow dir={1} />
          </button>
        </div>
      </div>

      <div
        ref={track}
        className={s.track}
        onScroll={(e) => {
          const el = e.currentTarget;
          setProgress(el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth));
        }}
      >
        {items.map((c, i) => (
          <RailCard key={c.slug} c={c} num={String(i + 1).padStart(2, "0")} total={total} eager={i < 4} />
        ))}
      </div>
      <div className={s.progress} aria-hidden="true">
        <i style={{ transform: `scaleX(${0.12 + progress * 0.88})` }} />
      </div>
    </section>
  );
}

function RailCard({ c, num, total, eager }: { c: Collection; num: string; total: string; eager: boolean }) {
  const product = products.find((p) => p.collection === c.slug);
  const colors = product?.colors ?? c.colors.map((v) => ({ ...v, position: undefined }));
  const [cur, setCur] = useState(0);
  const from = product ? priceRange(product)[0] : c.colors[0].priceFrom;
  const color = colors[cur];

  return (
    <article className={s.rcard} data-rcard data-pc-host>
      <a href={`?kol=${c.slug}#catalog`} data-filter-kol={c.slug} className={s.rphoto} aria-label={`Коллекция ${c.city}, ${color.name}`}>
        <SwapPhoto src={color.image} alt="" sizes="(max-width: 760px) 78vw, 24vw" position={color.position ?? "50% 70%"} eager={eager} />
        {c.isNew && <span className={s.newBadge}>Новинка</span>}
      </a>
      <span className={s.rpc}>
        <MiniPostcard c={c} num={num} total={total} />
      </span>
      <div className={s.rinfo}>
        <h3 className={s.rcity}>{c.city}</h3>
        <p className={s.rmeta}>
          {color.name}
          {product ? ` · ${product.density} г/м²` : ""}
        </p>
        <ul className={s.rsw} aria-label={`Цвета коллекции ${c.city}`}>
          {colors.map((v, i) => (
            <li key={v.name}>
              <button type="button" aria-pressed={i === cur} aria-label={v.name} title={v.name} onClick={() => setCur(i)}>
                <i style={{ background: v.swatch }} />
              </button>
            </li>
          ))}
        </ul>
        <p className={s.rprice}>от {from} BYN</p>
      </div>
    </article>
  );
}

export function Arrow({ dir }: { dir: 1 | -1 }) {
  return (
    <svg viewBox="0 0 18 10" aria-hidden="true" style={{ transform: dir < 0 ? "scaleX(-1)" : undefined }}>
      <path d="M0 5h16M12 1l4 4-4 4" />
    </svg>
  );
}
