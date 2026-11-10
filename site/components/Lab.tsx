"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { collections, type Collection } from "@/lib/collections";
import { forCollection } from "@/lib/catalog";
import { MiniPostcard } from "./MiniPostcard";
import { SwapPhoto } from "./SwapPhoto";
import { Wheel } from "./Wheel";
import { Cotton } from "./Cotton";
import l from "./lab.module.css";

// Лаборатория приёмов показа коллекций (эскиз 2026-11-10, удалить после выбора).
// Пять живых приёмов без стрелок: полосы, колода на прокрутке, веер, стол, горизонтальная лента.

const pad = (n: number) => String(n).padStart(2, "0");
type V = React.CSSProperties & Record<`--${string}`, string | number>;

function info(c: Collection) {
  const d = forCollection(c.slug);
  const first = d.colors[0];
  return { ...d, photo: first?.image ?? c.image, pos: first?.position ?? c.imagePosition ?? "50% 70%" };
}

function Sw({ c }: { c: Collection }) {
  const d = forCollection(c.slug);
  return (
    <span className={l.sw}>
      {d.colors.map((x) => (
        <i key={x.name} style={{ background: x.swatch }} title={x.name} />
      ))}
    </span>
  );
}

function Line({ c }: { c: Collection }) {
  const d = forCollection(c.slug);
  return (
    <p className={l.line}>
      {d.product ? `${d.product.name.toLowerCase()} · ${d.product.density} г/м²` : c.facts.map((f) => f.value).join(" · ")}
    </p>
  );
}

function More({ c }: { c: Collection }) {
  return (
    <a href={`/?kol=${c.slug}#catalog`} className={l.more}>
      от {forCollection(c.slug).from} BYN <span>· смотреть коллекцию →</span>
    </a>
  );
}

// прогресс прокрутки секции 0..1 в CSS-переменную --p, наружу — номер текущей коллекции
function useScrollIndex(ref: React.RefObject<HTMLDivElement | null>, n: number, lead = 0) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
        el.style.setProperty("--p", p.toFixed(4));
        setIdx(Math.min(n - 1, Math.floor(p * n + lead)));
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [ref, n, lead]);
  return idx;
}

/* ───────── 1. Полосы ───────── */
function Strips({ items }: { items: Collection[] }) {
  const [a, setA] = useState(0);
  return (
    <div className={l.strips}>
      {items.map((c, k) => {
        const d = info(c);
        return (
          <div key={c.slug} className={l.strip} data-on={k === a} onPointerEnter={(e) => e.pointerType === "mouse" && setA(k)} onClick={() => setA(k)}>
            <Image src={d.photo} alt={`Коллекция ${c.city}`} fill sizes="(max-width: 760px) 100vw, 60vw" style={{ objectFit: "cover", objectPosition: d.pos }} quality={75} />
            <span className={l.stripName} aria-hidden="true">
              {c.city}
            </span>
            <div className={l.stripInfo}>
              <span className={l.num}>
                {pad(k + 1)} / {pad(items.length)}
              </span>
              <h3 className={l.bigCity}>{c.city}</h3>
              <Line c={c} />
              <Sw c={c} />
              <More c={c} />
            </div>
            <span className={l.stripPc} data-pc-host>
              <MiniPostcard c={c} num={pad(k + 1)} total={pad(items.length)} sizes="260px" />
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ───────── 7. Полосы 2.0: ширина полосы не зависит от числа коллекций ───────── */
function Spines({ items }: { items: Collection[] }) {
  // показываем, как будет при 15 коллекциях: к восьми городам добавлены повторы
  const many = [...items, ...items.slice(0, 7)];
  const [a, setA] = useState(0);
  return (
    <div className={l.spines}>
      <div className={l.spinesRow}>
        {many.map((c, k) => {
          const d = info(c);
          return (
            <div key={`${c.slug}-${k}`} className={l.spine} data-on={k === a} onPointerEnter={(e) => e.pointerType === "mouse" && setA(k)} onClick={() => setA(k)}>
              <Image src={d.photo} alt={`Коллекция ${c.city}`} fill sizes="(max-width: 760px) 80vw, 50vw" style={{ objectFit: "cover", objectPosition: d.pos }} quality={75} />
              <span className={l.spineLabel} aria-hidden="true">
                <small>{pad(k + 1)}</small>
                {c.city}
              </span>
              <div className={l.spineInfo}>
                <Cotton className={l.spineCotton} />
                <span className={l.num}>
                  {pad(k + 1)} / {pad(many.length)} · 100% хлопок
                </span>
                <h3 className={l.bigCity}>{c.city}</h3>
                <Line c={c} />
                <Sw c={c} />
                <More c={c} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────── 9. Гармошка на 15 коллекций: все в один экран, без прокрутки ───────── */
// Гармошка на телефоне: те же вертикальные полосы, что на компьютере, но ряд листается свайпом.
// Открытая полоса всегда по центру, соседние — узкие корешки с подписью. Ширины считаются
// непрерывно от позиции p, поэтому при свайпе одна полоса плавно закрывается, следующая открывается.
function AccSwipe({ items }: { items: Collection[] }) {
  const n = items.length;
  const box = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLElement | null)[]>([]);
  const cur = useRef(0);
  const target = useRef(0);
  const raf = useRef(0);
  const drag = useRef<{ x: number; p: number; moved: boolean; t: number; lx: number; v: number; id: number } | null>(null);
  const [a, setA] = useState(0);
  const STEP = 80; // пикселей свайпа на одну коллекцию

  const paint = useCallback(() => {
    const W = box.current?.clientWidth ?? 390;
    const c = 40; // корешок
    const A = Math.min(W * 0.66, 300); // открытая полоса
    const gap = 2;
    const p = cur.current;
    let x = 0;
    const xs: number[] = [];
    const ws: number[] = [];
    for (let k = 0; k < n; k++) {
      const o = Math.max(0, 1 - Math.abs(k - p));
      ws[k] = c + (A - c) * o;
      xs[k] = x;
      x += ws[k] + gap;
    }
    const total = x - gap;
    const i = Math.max(0, Math.min(n - 1, Math.floor(p)));
    const j = Math.min(n - 1, i + 1);
    const f = Math.max(0, Math.min(1, p - i));
    const centre = (xs[i] + ws[i] / 2) * (1 - f) + (xs[j] + ws[j] / 2) * f;
    const shift = Math.max(Math.min(W / 2 - centre, 0), W - total);
    els.current.forEach((el, k) => {
      if (!el) return;
      const o = Math.max(0, 1 - Math.abs(k - p));
      el.style.width = `${ws[k].toFixed(1)}px`;
      el.style.transform = `translateX(${(xs[k] + shift).toFixed(1)}px)`;
      el.style.setProperty("--o", o.toFixed(3));
      el.dataset.on = Math.abs(k - p) < 0.5 ? "true" : "false";
    });
    setA(Math.max(0, Math.min(n - 1, Math.round(p))));
  }, [n]);

  const go = useCallback(
    (t: number) => {
      target.current = Math.max(0, Math.min(n - 1, t));
      cancelAnimationFrame(raf.current);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tick = () => {
        const diff = target.current - cur.current;
        if (reduce || Math.abs(diff) < 0.002) {
          cur.current = target.current;
          paint();
          return;
        }
        cur.current += diff * 0.14;
        paint();
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    },
    [n, paint],
  );

  useEffect(() => {
    raf.current = requestAnimationFrame(paint);
    const onResize = () => requestAnimationFrame(paint);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", onResize);
    };
  }, [paint]);

  const c = items[a];
  const d = info(c);
  return (
    <div className={l.swipe}>
      <div
        ref={box}
        className={l.swipeRow}
        onPointerDown={(e) => {
          cancelAnimationFrame(raf.current);
          drag.current = { x: e.clientX, p: cur.current, moved: false, t: performance.now(), lx: e.clientX, v: 0, id: e.pointerId };
        }}
        onPointerMove={(e) => {
          const g = drag.current;
          if (!g) return;
          const dx = e.clientX - g.x;
          if (!g.moved && Math.abs(dx) > 6) {
            g.moved = true;
            box.current?.setPointerCapture(g.id);
          }
          if (!g.moved) return;
          const now = performance.now();
          g.v = (e.clientX - g.lx) / Math.max(1, now - g.t);
          g.lx = e.clientX;
          g.t = now;
          cur.current = Math.max(-0.3, Math.min(n - 0.7, g.p - dx / STEP));
          target.current = cur.current;
          paint();
        }}
        onPointerUp={(e) => {
          const g = drag.current;
          drag.current = null;
          if (!g) return;
          if (g.moved) return go(Math.round(cur.current - (g.v * 160) / STEP));
          const hit = (e.target as HTMLElement).closest<HTMLElement>("[data-k]");
          go(hit ? Number(hit.dataset.k) : Math.round(cur.current));
        }}
        onPointerCancel={() => {
          drag.current = null;
          go(Math.round(cur.current));
        }}
      >
        {items.map((x, k) => {
          const dx = info(x);
          return (
            <div
              key={`${x.slug}-${k}`}
              className={l.swipeItem}
              data-k={k}
              ref={(el) => {
                els.current[k] = el;
              }}
            >
              <Image src={dx.photo} alt={`Коллекция ${x.city}`} fill sizes="70vw" style={{ objectFit: "cover", objectPosition: dx.pos }} quality={75} draggable={false} />
              <span className={l.swipeLabel} aria-hidden="true">
                <small>{pad(k + 1)}</small>
                {x.city}
              </span>
            </div>
          );
        })}
      </div>
      <div className={l.swipeInfo} key={`${c.slug}-${a}`}>
        <span className={l.accKicker}>
          {pad(a + 1)} / {pad(n)} · 100% хлопок
        </span>
        <h3 className={l.accCity}>{c.city}</h3>
        <Line c={c} />
        <Sw c={c} />
        <a href={`/?kol=${c.slug}#catalog`} className={l.accMore}>
          Смотреть коллекцию · от {d.from} BYN
        </a>
      </div>
    </div>
  );
}

function Accordion15({ items }: { items: Collection[] }) {
  // 8 настоящих городов + повторы до 15: так будет выглядеть полный ассортимент (~15 линеек)
  const many = [...items, ...items.slice(0, 7)];
  const [a, setA] = useState(0);
  return (
    <>
    <AccSwipe items={many} />
    <div className={l.acc}>
      {many.map((c, k) => {
        const d = info(c);
        return (
          <div key={`${c.slug}-${k}`} className={l.accItem} data-on={k === a} onPointerEnter={(e) => e.pointerType === "mouse" && setA(k)} onClick={() => setA(k)}>
            <Image src={d.photo} alt={`Коллекция ${c.city}`} fill sizes="(max-width: 760px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: d.pos }} quality={75} />
            <span className={l.accLabel} aria-hidden="true">
              <small>{pad(k + 1)}</small>
              {c.city}
            </span>
            <div className={l.accInfo}>
              <span className={l.accKicker}>
                {pad(k + 1)} / {pad(many.length)} · 100% хлопок
              </span>
              <h3 className={l.accCity}>{c.city}</h3>
              <Line c={c} />
              <Sw c={c} />
              <a href={`/?kol=${c.slug}#catalog`} className={l.accMore}>
                Смотреть коллекцию · от {d.from} BYN
              </a>
            </div>
          </div>
        );
      })}
    </div>
    </>
  );
}

/* ───────── 2. Колода на прокрутке ───────── */
function ScrollDeck({ items }: { items: Collection[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const n = items.length;
  const idx = useScrollIndex(ref, n, 0.25);
  const c = items[idx];
  const d = info(c);
  return (
    <div ref={ref} className={l.deck} style={{ "--n": n } as V}>
      <div className={l.deckPin}>
        <div className={l.deckPhoto}>
          <SwapPhoto src={d.photo} alt={`Коллекция ${c.city}`} sizes="(max-width: 760px) 100vw, 50vw" position={d.pos} />
        </div>
        <div className={l.deckSide}>
          <div className={l.deckCards}>
            {items.map((x, k) => (
              <span
                key={x.slug}
                className={l.deckCard}
                data-last={k === n - 1}
                style={{ "--k": k, "--tilt": `${k % 2 ? 2.5 : -2}deg`, zIndex: n - k } as V}
                data-pc-host
              >
                <MiniPostcard c={x} num={pad(k + 1)} total={pad(n)} sizes="420px" />
              </span>
            ))}
          </div>
          <div className={l.deckInfo} key={c.slug}>
            <span className={l.num}>
              {pad(idx + 1)} / {pad(n)}
            </span>
            <h3 className={l.bigCity}>{c.city}</h3>
            <Line c={c} />
            <Sw c={c} />
            <More c={c} />
          </div>
          <ol className={l.deckRail} aria-hidden="true">
            {items.map((x, k) => (
              <li key={x.slug} data-on={k === idx}>
                {x.city}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

/* ───────── 3. Веер ───────── */
function Fan({ items }: { items: Collection[] }) {
  const [a, setA] = useState(0);
  const n = items.length;
  const c = items[a];
  const d = info(c);
  return (
    <div className={l.fan}>
      <div className={l.fanPhoto}>
        <SwapPhoto src={d.photo} alt={`Коллекция ${c.city}`} sizes="(max-width: 760px) 100vw, 56vw" position={d.pos} />
        <div className={l.fanInfo} key={c.slug}>
          <h3 className={l.bigCity}>{c.city}</h3>
          <Line c={c} />
          <Sw c={c} />
          <More c={c} />
        </div>
      </div>
      <div className={l.fanSide}>
        <p className={l.hint}>Наведите на открытку или коснитесь её</p>
        <div className={l.fanCards}>
          {items.map((x, k) => (
            <div
              key={x.slug}
              className={l.fanCard}
              data-on={k === a}
              style={{ "--r": k - (n - 1) / 2 } as V}
              onPointerEnter={(e) => e.pointerType === "mouse" && setA(k)}
              onPointerDown={() => setA(k)}
              data-pc-host={k === a ? "" : undefined}
            >
              <MiniPostcard c={x} num={pad(k + 1)} total={pad(n)} sizes="240px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────── 4. Стол ───────── */
// раскладка: фото-«полароиды» и открытки вперемешку, проценты от стола; m — телефон
const PHOTO_SPOTS = [
  { x: 3, y: 8, r: -4, mx: 2, my: 4 },
  { x: 27, y: 3, r: 3, mx: 50, my: 9 },
  { x: 52, y: 9, r: -2, mx: 4, my: 29 },
  { x: 76, y: 4, r: 4, mx: 52, my: 34 },
  { x: 8, y: 52, r: 3, mx: 3, my: 54 },
  { x: 32, y: 50, r: -3, mx: 51, my: 59 },
  { x: 57, y: 54, r: 2, mx: 5, my: 78 },
  { x: 80, y: 49, r: -4, mx: 50, my: 83 },
];

function Table({ items }: { items: Collection[] }) {
  const [off, setOff] = useState<Record<string, { x: number; y: number; z: number }>>({});
  const top = useRef(30);
  const drag = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);

  const handlers = (id: string) => ({
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      const o = off[id] ?? { x: 0, y: 0, z: 0 };
      top.current += 1;
      const z = top.current;
      drag.current = { id, sx: e.clientX, sy: e.clientY, ox: o.x, oy: o.y, moved: false };
      e.currentTarget.setPointerCapture(e.pointerId);
      setOff((s) => ({ ...s, [id]: { x: o.x, y: o.y, z } }));
    },
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      const g = drag.current;
      if (!g || g.id !== id) return;
      const dx = e.clientX - g.sx;
      const dy = e.clientY - g.sy;
      if (Math.abs(dx) + Math.abs(dy) > 4) g.moved = true;
      setOff((s) => ({ ...s, [id]: { x: g.ox + dx, y: g.oy + dy, z: s[id]?.z ?? 0 } }));
    },
    onPointerUp: () => {
      if (drag.current) setTimeout(() => (drag.current = null), 0);
    },
    onClickCapture: (e: React.MouseEvent) => {
      if (drag.current?.moved) e.preventDefault();
    },
  });

  const place = (id: string, base: { x: number; y: number; r: number; mx: number; my: number }) => {
    const o = off[id];
    return {
      "--x": `${base.x}%`,
      "--y": `${base.y}%`,
      "--mx": `${base.mx}%`,
      "--my": `${base.my}%`,
      "--r": `${base.r}deg`,
      "--dx": `${o?.x ?? 0}px`,
      "--dy": `${o?.y ?? 0}px`,
      zIndex: o?.z ?? 1,
    } as V;
  };

  return (
    <div className={l.table}>
      {items.map((c, k) => {
        const d = info(c);
        const s = PHOTO_SPOTS[k % PHOTO_SPOTS.length];
        return (
          <div key={c.slug}>
            <figure className={l.polaroid} style={place(`p-${c.slug}`, s)} {...handlers(`p-${c.slug}`)}>
              <span className={l.polaroidImg}>
                <Image src={d.photo} alt={`Коллекция ${c.city}`} fill sizes="(max-width: 760px) 45vw, 18vw" style={{ objectFit: "cover", objectPosition: d.pos }} quality={75} draggable={false} />
              </span>
              <figcaption>
                <b>{c.city}</b>
                <span>от {d.from} BYN</span>
              </figcaption>
            </figure>
            <span
              className={l.tablePc}
              style={place(`c-${c.slug}`, { x: s.x + 11, y: s.y + 26, r: -s.r * 2, mx: s.mx + 22, my: s.my + 10 })}
              data-pc-host
              {...handlers(`c-${c.slug}`)}
            >
              <MiniPostcard c={c} num={pad(k + 1)} total={pad(items.length)} sizes="220px" />
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ───────── 5. Горизонтальная лента на прокрутке ───────── */
function Ribbon({ items }: { items: Collection[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const n = items.length;
  const idx = useScrollIndex(ref, n);
  return (
    <div ref={ref} className={l.rib} style={{ "--n": n } as V}>
      <div className={l.ribPin}>
        <div className={l.ribTrack}>
          <div className={l.ribIntro}>
            <h3>Коллекции-города</h3>
            <p>Листайте вниз — города едут вбок</p>
          </div>
          {items.map((c, k) => {
            const d = info(c);
            return (
              <article key={c.slug} className={l.ribPanel} style={{ "--k": k } as V}>
                <div className={l.ribPhoto}>
                  <Image src={d.photo} alt={`Коллекция ${c.city}`} fill sizes="(max-width: 760px) 80vw, 40vw" style={{ objectFit: "cover", objectPosition: d.pos }} quality={75} />
                </div>
                <span className={l.ribCity} aria-hidden="true">
                  {c.city}
                </span>
                <span className={l.ribPc} data-pc-host>
                  <MiniPostcard c={c} num={pad(k + 1)} total={pad(n)} sizes="260px" />
                </span>
                <div className={l.ribMeta}>
                  <span className={l.num}>
                    {pad(k + 1)} / {pad(n)}
                  </span>
                  <Line c={c} />
                  <Sw c={c} />
                  <More c={c} />
                </div>
              </article>
            );
          })}
        </div>
        <div className={l.ribBar} aria-hidden="true">
          <span>{items[idx].city}</span>
          <i />
        </div>
      </div>
    </div>
  );
}

function FanFlow({ items }: { items: Collection[] }) {
  return <Wheel items={items} mode="flow" />;
}

const DEMOS = [
  {
    n: 8,
    title: "Веер-лента",
    term: "fan + coverflow",
    text: "Между веером и каруселью: дуга пологая, соседние открытки уходят вглубь, но не перекашиваются. Выбранная открытка ставит своё полотенце фоном на весь экран. Тянуть, свайпать, нажать на соседнюю; центральная переворачивается.",
    C: FanFlow,
  },
  {
    n: 9,
    title: "Гармошка на 15 коллекций",
    term: "accordion, full range",
    text: "Та же гармошка, но на 15 полос — столько линеек планирует KavaHome. Всё помещается в один экран без прокрутки: свёрнутая полоса около 65px, подпись влезает. Если коллекций станет больше 16, ряд начнёт листаться вбок (как в 7). На телефоне те же вертикальные полосы листаются свайпом: открытая всегда по центру.",
    C: Accordion15,
  },
  {
    n: 6,
    title: "Веер-колесо",
    term: "fan wheel, drag",
    text: "Веер на всю ширину: открытки с фото полотенец лежат по дуге, как карты в руке. Тянешь — колесо крутится, новые коллекции просто удлиняют дугу. Центральная переворачивается, на обороте «100% хлопок». По краям ветки хлопка.",
    C: Wheel,
  },
  {
    n: 7,
    title: "Полосы 2.0",
    term: "accordion + horizontal scroll",
    text: "Ширина полосы фиксирована, поэтому при 15 коллекциях полосы не сужаются, а ряд уходит вправо и листается. Подписи без плашек, как корешки. Здесь для примера 15 полос.",
    C: Spines,
  },
  {
    n: 1,
    title: "Полосы",
    term: "accordion gallery",
    text: "Прошлый раунд. Все коллекции видны сразу узкими полосами фото, наведение раскрывает одну.",
    C: Strips,
  },
  {
    n: 3,
    title: "Веер открыток",
    term: "fan layout",
    text: "Прошлый раунд. Веер на половине экрана — для сравнения с веером-колесом.",
    C: Fan,
  },
  {
    n: 2,
    title: "Колода на прокрутке",
    term: "pinned scroll",
    text: "Прошлый раунд. Прокрутка снимает открытки с колоды одну за другой.",
    C: ScrollDeck,
  },
  {
    n: 4,
    title: "Стол",
    term: "collage, drag",
    text: "Прошлый раунд. Полароиды и открытки на столе, их можно двигать.",
    C: Table,
  },
  {
    n: 5,
    title: "Лента на прокрутке",
    term: "horizontal scroll-jacking",
    text: "Прошлый раунд. Прокрутка вниз двигает города вбок.",
    C: Ribbon,
  },
];

export function Lab() {
  return (
    <>
      <section className={l.intro}>
        <h1>Лаборатория: раунд 3</h1>
        <p>
          Сверху два новых приёма: веер-лента (что-то среднее между веером и каруселью, фон — выбранное полотенце) и гармошка на 15 коллекций, чтобы было видно, как
          она переживёт полный ассортимент. Ниже прошлые приёмы для сравнения.
        </p>
        <ol>
          {DEMOS.map((d) => (
            <li key={d.title}>
              <a href={`#lab-${d.n}`}>
                {d.n}. {d.title}
              </a>
            </li>
          ))}
        </ol>
      </section>
      {DEMOS.map(({ n, title, term, text, C }) => (
        <section key={title} id={`lab-${n}`} className={l.demo}>
          <header className={l.band}>
            <b>{n}</b>
            <h2>{title}</h2>
            <small>{term}</small>
            <p>{text}</p>
          </header>
          <C items={collections} />
        </section>
      ))}
      <footer className={l.end}>Конец лаборатории. Какие номера понравились?</footer>
    </>
  );
}
