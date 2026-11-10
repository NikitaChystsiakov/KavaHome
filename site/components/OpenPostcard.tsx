"use client";

import { useEffect, useRef, useState } from "react";
import type { Collection } from "@/lib/collections";
import { forCollection } from "@/lib/catalog";
import { citySymbol } from "./symbols";
import { Stamp } from "./Stamp";
import { SwapPhoto } from "./SwapPhoto";
import { Arrow } from "./CollectionsRail";
import v from "./variants.module.css";

// Эскиз C «Открытка во весь экран»: весь блок — одна раскрытая открытка.
// Лицо (слева) — фото полотенца с подписью «Saluti da …», оборот (справа) — письмо, марки-цвета, цена.
// Смена коллекции переворачивает открытку; клик по марке меняет фото на этот цвет.
type Turn = "idle" | "out" | "in";

export function OpenPostcard({ items }: { items: Collection[] }) {
  const [i, setI] = useState(0);
  const [color, setColor] = useState(0);
  const [turn, setTurn] = useState<Turn>("idle");
  const timers = useRef<number[]>([]);
  const n = items.length;
  const c = items[i];
  const d = forCollection(c.slug);
  const cur = d.colors[Math.min(color, d.colors.length - 1)] ?? { name: c.colors[0].name, image: c.image, swatch: c.colors[0].swatch, position: undefined };
  const sym = citySymbol(c.slug);
  const latin = c.latin.charAt(0) + c.latin.slice(1).toLowerCase();

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const go = (to: number) => {
    const next = (to + n) % n;
    if (next === i || turn !== "idle") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setI(next);
      setColor(0);
      return;
    }
    // открытка поворачивается ребром, в этот момент меняется содержимое, и она доворачивается обратно
    setTurn("out");
    timers.current.push(
      window.setTimeout(() => {
        setI(next);
        setColor(0);
        setTurn("in");
      }, 300),
      window.setTimeout(() => setTurn("idle"), 760),
    );
  };

  return (
    <section id="kollekcii" className={v.open} aria-labelledby="open-title">
      <div className={v.openHead}>
        <h2 id="open-title" className={v.openTitle}>
          Коллекции
        </h2>
        <ol className={v.tabs} aria-label="Города">
          {items.map((x, k) => (
            <li key={x.slug}>
              <button type="button" aria-current={k === i ? "true" : undefined} onClick={() => go(k)}>
                {x.city}
              </button>
            </li>
          ))}
        </ol>
        <div className={v.arrows}>
          <button type="button" onClick={() => go(i - 1)} aria-label="Предыдущая коллекция">
            <Arrow dir={-1} />
          </button>
          <button type="button" onClick={() => go(i + 1)} aria-label="Следующая коллекция">
            <Arrow dir={1} />
          </button>
        </div>
      </div>

      <div className={v.bigWrap}>
        <article className={v.big} data-turn={turn} aria-live="polite">
          <div className={v.bigFront}>
            <div className={v.bigPhoto}>
              <SwapPhoto src={cur.image} alt={`Коллекция ${c.city}, ${cur.name}`} sizes="(max-width: 760px) 100vw, 55vw" position={cur.position ?? "50% 70%"} eager />
              {c.isNew && <span className={v.newBadge}>Новинка</span>}
            </div>
            <p className={v.bigCaption}>
              <span>Saluti da {latin}</span>
              <span>{c.postcard?.caption ?? `${c.country} · KAVA HOME`}</span>
            </p>
          </div>

          <div className={v.bigBack}>
            <div className={v.bigLetter}>
              <p className={v.bigHello}>Привет {c.from}!</p>
              <p>
                {c.facts.map((f) => `${f.term} — ${f.value}`).join(". ")}.
                {d.product ? ` ${d.product.name.replace("Полотенце ", "Полотенце ").toLowerCase()}, ${d.product.density} г/м².` : ""}
              </p>
              <p className={v.bigPick}>Выберите цвет — каждая марка своего цвета:</p>
              <ul className={v.stamps} aria-label={`Цвета коллекции ${c.city}`}>
                {d.colors.map((x, k) => (
                  <li key={x.name}>
                    <button type="button" aria-pressed={x === cur} onClick={() => setColor(k)} title={x.name}>
                      <i style={{ background: x.swatch }} />
                      <span>{x.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className={v.bigAddr}>
              <span className={v.bigPostage} style={{ "--tone": c.tone } as React.CSSProperties} aria-hidden="true">
                {sym ? (
                  <svg viewBox={sym.viewBox} preserveAspectRatio="xMidYMid meet" style={{ "--sw": Number(sym.viewBox.split(" ")[2]) / 46 } as React.CSSProperties}>
                    <path d={sym.d} />
                  </svg>
                ) : (
                  <b>{c.latin.charAt(0)}</b>
                )}
                <small>{c.latin}</small>
              </span>
              <Stamp
                id={`open-${c.slug}`}
                ring={`${c.city.toUpperCase()} · KAVA HOME · МИНСК ·`}
                center={String(i + 1).padStart(2, "0")}
                sub={`ИЗ ${String(n).padStart(2, "0")}`}
                className={v.bigMark}
                ink
              />
              <dl className={v.bigLines}>
                <div>
                  <dt>Размеры</dt>
                  <dd>
                    {d.sizes.length > 1 ? `${d.sizes[0]} – ${d.sizes[d.sizes.length - 1]}` : d.sizes[0]}
                    {d.hasSet ? " и набор" : ""}
                  </dd>
                </div>
                <div>
                  <dt>Цвет</dt>
                  <dd>{cur.name}</dd>
                </div>
                <div>
                  <dt>Цена</dt>
                  <dd>от {d.from} BYN · примерно</dd>
                </div>
              </dl>
              <a href={`?kol=${c.slug}#catalog`} data-filter-kol={c.slug} className={v.btn}>
                Смотреть «{c.city}»
                <Arrow dir={1} />
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
