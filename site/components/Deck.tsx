"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Collection } from "@/lib/collections";
import { products, priceRange } from "@/lib/catalog";
import { citySymbol } from "./symbols";
import { Stamp } from "./Stamp";
import s from "./deck.module.css";

// Колода открыток: все городские коллекции на одном экране.
// Компьютер: при появлении экрана открытки раздаются из стопки на «стол», по наведению переворачиваются.
// Телефон: горизонтальная карусель с привязкой, переворот по тапу.
// На обороте: цвета квадратами, «от X BYN» и ссылка на коллекцию.

type Deal = "idle" | "stacked" | "dealt";

export function Deck({ items }: { items: Collection[] }) {
  const table = useRef<HTMLDivElement>(null);
  const [deal, setDeal] = useState<Deal>("idle");
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState<string | null>(null);
  const total = String(items.length).padStart(2, "0");

  // раздача: только на компьютере, без reduced-motion и только если экран ещё не виден
  useEffect(() => {
    const el = table.current;
    if (!el) return;
    const desktop = window.matchMedia("(min-width: 761px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const inView = (() => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    })();
    if (!desktop || reduce || inView) return;

    // каждая открытка запоминает, где центр стола относительно неё: оттуда она и вылетит
    const place = () => {
      const t = el.getBoundingClientRect();
      const cx = t.left + t.width / 2;
      const cy = t.top + t.height / 2;
      el.querySelectorAll<HTMLElement>("[data-slot]").forEach((slot) => {
        const r = slot.getBoundingClientRect();
        slot.style.setProperty("--dx", `${cx - (r.left + r.width / 2)}px`);
        slot.style.setProperty("--dy", `${cy - (r.top + r.height / 2)}px`);
      });
    };
    place();
    setDeal("stacked");

    // раздать, как только верх колоды прошёл 60% окна — даже если колоду проскочили якорем
    let timer = 0;
    let raf = 0;
    const check = () => {
      raf = 0;
      if (el.getBoundingClientRect().top > window.innerHeight * 0.6) return;
      window.removeEventListener("scroll", onScroll);
      setDeal("dealt");
      timer = window.setTimeout(() => setDeal("idle"), items.length * 90 + 1100);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [items.length]);

  // штемпели и марки прорисовываются, когда колода на экране
  useEffect(() => {
    const el = table.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.dataset.inview = "true";
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // карусель на телефоне: какая открытка в центре
  const onScroll = () => {
    const el = table.current;
    if (!el || window.innerWidth > 760) return;
    const slots = [...el.querySelectorAll<HTMLElement>("[data-slot]")];
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let dist = Infinity;
    slots.forEach((sl, i) => {
      const d = Math.abs(sl.offsetLeft + sl.offsetWidth / 2 - mid);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    if (best !== active) {
      setActive(best);
      setFlipped(null);
    }
  };

  const go = (i: number) => {
    const el = table.current;
    const slot = el?.querySelectorAll<HTMLElement>("[data-slot]")[i];
    if (!el || !slot) return;
    el.scrollTo({ left: slot.offsetLeft + slot.offsetWidth / 2 - el.clientWidth / 2, behavior: "smooth" });
  };

  return (
    <section id="kollekcii" className={s.deck} aria-labelledby="deck-title">
      <div className={s.head}>
        <h2 id="deck-title" className={s.title}>
          Открытки из {items.length} городов
        </h2>
        <p className={s.hint}>
          <span className={s.hintFine}>Наведите на открытку — на обороте цвета и цены</span>
          <span className={s.hintTouch}>Нажмите на открытку, чтобы перевернуть</span>
          <small>Цены примерные</small>
        </p>
      </div>

      <div ref={table} className={s.table} data-deal={deal} onScroll={onScroll}>
        {items.map((c, i) => (
          <DeckCard
            key={c.slug}
            c={c}
            i={i}
            num={String(i + 1).padStart(2, "0")}
            total={total}
            active={i === active}
            back={flipped === c.slug}
            onFlip={() => setFlipped(flipped === c.slug ? null : c.slug)}
          />
        ))}
      </div>

      <div className={s.pager} aria-hidden="true">
        <span className={s.counter}>
          {String(active + 1).padStart(2, "0")} / {total}
        </span>
        <span className={s.dots}>
          {items.map((c, i) => (
            <button key={c.slug} type="button" tabIndex={-1} data-on={i === active} onClick={() => go(i)} />
          ))}
        </span>
      </div>
    </section>
  );
}

// небольшой разброс, как у открыток, брошенных на стол
const TILT = [-1.2, 0.8, -0.6, 1.1, 0.7, -1, 0.5, -0.8, 1, -0.5, 0.9, -1.1, 0.6, -0.9, 1.2];
const STACK_TILT = [3, -4, 6, -2, 5, -5, 2, -3, 4, -6, 1, 3, -4, 5, -1];

type CardProps = {
  c: Collection;
  i: number;
  num: string;
  total: string;
  active: boolean;
  back: boolean;
  onFlip: () => void;
};

function DeckCard({ c, i, num, total, active, back, onFlip }: CardProps) {
  const sym = citySymbol(c.slug);
  const product = products.find((p) => p.collection === c.slug);
  const colors = product?.colors ?? c.colors.map((v) => ({ name: v.name, swatch: v.swatch }));
  const [from] = product ? priceRange(product) : [Math.min(...c.colors.map((v) => v.priceFrom))];
  const kind = product ? product.name.replace(/^Полотенце /, "").replace(/^Коврик для ванной/, "коврики") : "";

  return (
    <article
      className={s.slot}
      data-slot
      data-back={back}
      data-active={active}
      style={
        {
          "--i": i,
          "--r": `${TILT[i % TILT.length]}deg`,
          "--sr": `${STACK_TILT[i % STACK_TILT.length]}deg`,
          "--tone": c.tone,
        } as React.CSSProperties
      }
      aria-labelledby={`deck-${c.slug}`}
    >
      <div className={s.card}>
        {/* лицевая сторона: старинная открытка города, марка с символом, штемпель */}
        <div className={`${s.face} ${s.front}`}>
          <span className={s.frontImg}>
            <Image
              src={c.postcard?.src ?? c.image}
              alt=""
              fill
              sizes="(max-width: 760px) 80vw, 24vw"
              style={{ objectFit: "cover" }}
              quality={75}
            />
          </span>
          <span className={s.caption}>{c.postcard?.caption ?? `${c.latin} — KAVA HOME`}</span>
          <span className={s.postage} aria-hidden="true">
            {sym && (
              <svg
                viewBox={sym.viewBox}
                preserveAspectRatio="xMidYMid meet"
                style={{ "--sw": Number(sym.viewBox.split(" ")[2]) / 42 } as React.CSSProperties}
              >
                <path d={sym.d} pathLength={1} />
              </svg>
            )}
            <span>{c.latin}</span>
          </span>
          <Stamp
            id={`deck-${c.slug}`}
            ring={`${c.city.toUpperCase()} · ${c.latin} · KAVA HOME ·`}
            center={num}
            sub={`ИЗ ${total}`}
            className={s.postmark}
            ink
          />
          <button
            type="button"
            className={s.flip}
            onClick={() => {
              // на компьютере переворачивает наведение, клик не нужен
              if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
              onFlip();
            }}
            aria-expanded={back}
            aria-label={`Коллекция ${c.city}: перевернуть открытку, посмотреть цвета и цену`}
          />
        </div>

        {/* оборот: письмо, цвета, цена, ссылка */}
        <div className={`${s.face} ${s.back}`}>
          <div className={s.letter}>
            <p className={s.hello}>Привет {c.from}!</p>
            <ul className={s.swatches} aria-label={`Цвета коллекции ${c.city}`}>
              {colors.map((v) => (
                <li key={v.name} title={v.name}>
                  <i style={{ background: v.swatch }} />
                </li>
              ))}
            </ul>
            <p className={s.colorNames}>{colors.map((v) => v.name).join(", ")}</p>
          </div>
          <div className={s.addr}>
            <p className={s.backCity}>{c.city}</p>
            <p className={s.backMeta}>
              {kind}
              {product ? ` · ${product.density}\u00a0г/м²` : ""}
            </p>
            <p className={s.backPrice}>от {from} BYN</p>
            <a href={`?kol=${c.slug}#catalog`} data-filter-kol={c.slug} className={s.backLink}>
              Смотреть
              <svg viewBox="0 0 18 10" aria-hidden="true">
                <path d="M0 5h16M12 1l4 4-4 4" />
              </svg>
            </a>
          </div>
          <button type="button" className={s.unflip} onClick={onFlip} aria-label="Перевернуть обратно">
            ↺
          </button>
        </div>
      </div>
      <p className={s.label} id={`deck-${c.slug}`}>
        <b>{c.city}</b>
        <span className={s.labelMeta}>
          <span className={s.labelSw} aria-label={`${colors.length} ${plural(colors.length, "цвет", "цвета", "цветов")}`}>
            {colors.map((v) => (
              <i key={v.name} style={{ background: v.swatch }} />
            ))}
          </span>
          от {from} BYN
        </span>
      </p>
    </article>
  );
}

function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}
