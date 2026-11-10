"use client";

import { useState } from "react";
import type { Collection } from "@/lib/collections";
import { forCollection } from "@/lib/catalog";
import { MiniPostcard } from "./MiniPostcard";
import { SwapPhoto } from "./SwapPhoto";
import { Arrow } from "./CollectionsRail";
import v from "./variants.module.css";

// Эскиз E «Цвет коллекции»: вторая половина окрашена в светлый тон выбранного цвета полотенца,
// огромное название города переходит через шов на фото. Выбор цвета меняет и фото, и тон половины.
export function ColorSplit({ items }: { items: Collection[] }) {
  const [i, setI] = useState(0);
  const [color, setColor] = useState(0);
  const n = items.length;
  const c = items[i];
  const d = forCollection(c.slug);
  const cur = d.colors[Math.min(color, d.colors.length - 1)] ?? { name: c.colors[0].name, image: c.image, swatch: c.colors[0].swatch, position: undefined };
  const go = (to: number) => {
    setI((to + n) % n);
    setColor(0);
  };

  return (
    <section id="kollekcii" className={v.tint} style={{ "--tint": cur.swatch } as React.CSSProperties} aria-labelledby="tint-title">
      <div className={v.tintPhoto}>
        <SwapPhoto src={cur.image} alt={`Коллекция ${c.city}, ${cur.name}`} sizes="(max-width: 760px) 100vw, 50vw" position={cur.position ?? "50% 70%"} eager />
      </div>
      <div className={v.tintPanel}>
        <div className={v.tintTop}>
          <h2 id="tint-title" className="caps">
            Коллекции · {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </h2>
          <div className={v.arrows}>
            <button type="button" onClick={() => go(i - 1)} aria-label="Предыдущая коллекция">
              <Arrow dir={-1} />
            </button>
            <button type="button" onClick={() => go(i + 1)} aria-label="Следующая коллекция">
              <Arrow dir={1} />
            </button>
          </div>
        </div>

        <p className={v.tintCity} key={c.slug} aria-hidden="true">
          {c.city}
        </p>

        <span className={v.tintPc} key={`pc-${c.slug}`} data-pc-host>
          <MiniPostcard c={c} num={String(i + 1).padStart(2, "0")} total={String(n).padStart(2, "0")} sizes="360px" />
        </span>

        <div className={v.tintBody}>
          <p className={v.tintMeta}>
            {d.product?.name.toLowerCase()} · {d.product?.density}&nbsp;г/м² · {d.sizes[0]} – {d.sizes[d.sizes.length - 1]}
          </p>
          <ul className={v.tintSw} aria-label="Цвет">
            {d.colors.map((x, k) => (
              <li key={x.name}>
                <button type="button" aria-pressed={x === cur} onClick={() => setColor(k)}>
                  <i style={{ background: x.swatch }} />
                  <span>{x.name}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className={v.tintBuy}>
            <a href={`?kol=${c.slug}#catalog`} data-filter-kol={c.slug} className={v.btn}>
              Смотреть коллекцию
              <Arrow dir={1} />
            </a>
            <span>от {d.from} BYN · примерно</span>
          </div>
        </div>

        <ol className={v.tintStrip} aria-label="Все коллекции">
          {items.map((x, k) => (
            <li key={x.slug}>
              <button type="button" aria-current={k === i ? "true" : undefined} onClick={() => go(k)}>
                {x.city}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
