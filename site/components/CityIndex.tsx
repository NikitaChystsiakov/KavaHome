"use client";

import { useEffect, useRef, useState } from "react";
import type { Collection } from "@/lib/collections";
import { forCollection } from "@/lib/catalog";
import { MiniPostcard } from "./MiniPostcard";
import { SwapPhoto } from "./SwapPhoto";
import v from "./variants.module.css";

// Эскиз D «Указатель городов»: слева закреплённое фото, справа крупный список городов.
// Наведение (компьютер) или прокрутка (телефон) по городу меняет фото и открытку.
// Список растёт вместе с ассортиментом, фото остаётся на месте.
export function CityIndex({ items }: { items: Collection[] }) {
  const [active, setActive] = useState(0);
  const list = useRef<HTMLOListElement>(null);
  const c = items[active];
  const d = forCollection(c.slug);
  const cur = d.colors[0] ?? { name: c.colors[0].name, image: c.image, position: undefined };
  const total = String(items.length).padStart(2, "0");

  // при прокрутке активен город, который пересекает середину окна
  useEffect(() => {
    const rows = list.current?.querySelectorAll<HTMLElement>("[data-row]");
    if (!rows) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.row));
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <section id="kollekcii" className={v.idx} aria-labelledby="idx-title">
      <div className={v.idxPhoto}>
        <div className={v.idxPhotoIn}>
          <SwapPhoto src={cur.image} alt={`Коллекция ${c.city}, ${cur.name}`} sizes="(max-width: 760px) 100vw, 50vw" position={cur.position ?? "50% 70%"} eager />
          <span className={v.idxPc} key={c.slug} data-pc-host>
            <MiniPostcard c={c} num={String(active + 1).padStart(2, "0")} total={total} sizes="320px" />
          </span>
        </div>
      </div>

      <div className={v.idxBody}>
        <p className={v.idxHead}>
          <span id="idx-title">Коллекции</span>
          <span>{items.length} городов · цены примерные</span>
        </p>
        <ol ref={list} className={v.idxList}>
          {items.map((x, k) => {
            const dx = forCollection(x.slug);
            return (
              <li key={x.slug} data-row={k} data-active={k === active}>
                <a
                  href={`?kol=${x.slug}#catalog`}
                  data-filter-kol={x.slug}
                  onMouseEnter={() => setActive(k)}
                  onFocus={() => setActive(k)}
                >
                  <span className={v.idxNum}>{String(k + 1).padStart(2, "0")}</span>
                  <span className={v.idxCity}>
                    {x.city}
                    {x.isNew && <sup>новинка</sup>}
                  </span>
                  <span className={v.idxMeta}>
                    <span className={v.idxSw}>
                      {dx.colors.map((s) => (
                        <i key={s.name} style={{ background: s.swatch }} />
                      ))}
                    </span>
                    <span>
                      {dx.product ? `${dx.product.density} г/м² · ` : ""}от {dx.from} BYN
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
