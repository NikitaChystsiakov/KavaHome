"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Collection } from "@/lib/collections";
import { forCollection, products } from "@/lib/catalog";
import { citySymbol } from "./symbols";
import { Stamp } from "./Stamp";
import { SwapPhoto } from "./SwapPhoto";
import { CottonSprig } from "./Cotton";
import r from "./ring.module.css";

// Кольцо открыток в пространстве: все коллекции стоят по кругу, кольцо чуть наклонено,
// поэтому видно его целиком — передние открытки крупные, задние показывают оборот с письмом.
// Наведение на открытку ставит её полотенце фоном на весь экран, клик подвозит её вперёд,
// передняя переворачивается. Крутится перетаскиванием, свайпом, тачпадом и стрелками клавиатуры.
// Новые коллекции просто добавляют открытки в кольцо: радиус растёт сам.

const pad = (n: number) => String(n).padStart(2, "0");
const norm = (a: number) => ((((a + 180) % 360) + 360) % 360) - 180;

function photoOf(c: Collection) {
  const first = forCollection(c.slug).colors[0];
  return { src: first?.image ?? c.image, pos: first?.position ?? c.imagePosition ?? "50% 70%" };
}

export function Ring({ items }: { items: Collection[] }) {
  const n = items.length;
  const step = 360 / n;
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [flip, setFlip] = useState(false);
  // эскизные переключатели для сравнения: ?shape=orbit|cylinder&bg=photo|soft|plain
  const [shape, setShape] = useState<"cylinder" | "orbit">("cylinder");
  const [bgMode, setBgMode] = useState<"photo" | "soft" | "plain">("photo");
  const shapeRef = useRef<"cylinder" | "orbit">("cylinder");
  const scene = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const cur = useRef(0);
  const target = useRef(0);
  const raf = useRef(0);
  const drag = useRef<{ x: number; rot: number; moved: boolean; t: number; lx: number; v: number; k: number | null; id: number } | null>(null);

  const paint = useCallback(() => {
    ring.current?.style.setProperty("--rot", `${cur.current.toFixed(3)}deg`);
    const orbit = shapeRef.current === "orbit";
    const wide = window.innerWidth;
    const rx = Math.min(wide * (wide < 761 ? 0.34 : 0.33), 520);
    const ry = wide < 761 ? 70 : Math.min(150, window.innerHeight * 0.17);
    cards.current.forEach((el, k) => {
      if (!el) return;
      const a = norm(k * step + cur.current);
      const rad = (a * Math.PI) / 180;
      const front = (Math.cos(rad) + 1) / 2; // 1 спереди, 0 сзади
      if (orbit) {
        // орбита: открытки всегда смотрят на зрителя, задние меньше и выше
        el.style.transform = `translate(${(Math.sin(rad) * rx).toFixed(1)}px, ${(-(1 - front) * ry * 2).toFixed(1)}px) scale(${(0.48 + front * 0.62).toFixed(3)})`;
        el.style.zIndex = String(Math.round(front * 100));
      } else {
        el.style.transform = "";
        el.style.zIndex = "";
      }
      el.style.setProperty("--fog", (orbit ? 0.62 + front * 0.38 : 0.74 + front * 0.26).toFixed(3));
      el.dataset.on = Math.abs(a) < step / 2 ? "true" : "false";
    });
    setActive(((Math.round(-cur.current / step) % n) + n) % n);
  }, [n, step]);

  const run = useCallback(() => {
    cancelAnimationFrame(raf.current);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      const diff = target.current - cur.current;
      if (reduce || Math.abs(diff) < 0.02) {
        cur.current = target.current;
        paint();
        return;
      }
      cur.current += diff * 0.1;
      paint();
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [paint]);

  const snap = useCallback(
    (rot: number) => {
      target.current = Math.round(rot / step) * step;
      setFlip(false);
      run();
    },
    [run, step],
  );

  const bring = (k: number) => snap(cur.current - norm(k * step + cur.current));

  useEffect(() => {
    // читаем сразу: каталог потом переписывает адрес под свои фильтры
    const q = new URLSearchParams(window.location.search);
    const sh = q.get("shape") === "orbit" ? "orbit" : "cylinder";
    const b = q.get("bg");
    const id = requestAnimationFrame(() => {
      shapeRef.current = sh;
      setShape(sh);
      setBgMode(b === "soft" || b === "plain" ? b : "photo");
      paint();
    });
    return () => cancelAnimationFrame(id);
  }, [paint]);

  useEffect(() => {
    const el = scene.current;
    raf.current = requestAnimationFrame(paint);
    let t = 0;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      cancelAnimationFrame(raf.current);
      cur.current -= e.deltaX * 0.25;
      target.current = cur.current;
      paint();
      clearTimeout(t);
      t = window.setTimeout(() => snap(cur.current), 140);
    };
    el?.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(t);
      el?.removeEventListener("wheel", onWheel);
    };
  }, [paint, snap]);

  const shown = hover ?? active;
  const bg = photoOf(items[shown]);
  const tint = forCollection(items[shown].slug).colors[0]?.swatch ?? items[shown].tone;
  const c = items[active];
  const d = forCollection(c.slug);

  return (
    <div className={r.wrap} data-bg={bgMode} data-shape={shape} style={{ "--tint": tint } as React.CSSProperties}>
      <div className={r.bg} aria-hidden="true">
        <SwapPhoto src={bg.src} alt="" sizes="100vw" position={bg.pos} />
      </div>

      <div className={r.top}>
        <p className={r.caps}>Коллекции</p>
        <p className={r.cotton}>
          <CottonSprig className={r.sprig} />
          100% хлопок
        </p>
        <p className={r.caps}>
          {pad(active + 1)} / {pad(n)}
        </p>
      </div>

      <div
        ref={scene}
        className={r.scene}
        data-flip={flip}
        tabIndex={0}
        aria-label="Коллекции: тяните кольцо или нажмите на открытку"
        style={{ "--n": n } as React.CSSProperties}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") snap(target.current - step);
          if (e.key === "ArrowLeft") snap(target.current + step);
        }}
        onPointerLeave={() => setHover(null)}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          const card = (e.target as HTMLElement).closest<HTMLElement>("[data-k]");
          cancelAnimationFrame(raf.current);
          target.current = cur.current;
          drag.current = { x: e.clientX, rot: cur.current, moved: false, t: performance.now(), lx: e.clientX, v: 0, k: card ? Number(card.dataset.k) : null, id: e.pointerId };
        }}
        onPointerMove={(e) => {
          const g = drag.current;
          if (!g) return;
          const dx = e.clientX - g.x;
          if (!g.moved && Math.abs(dx) > 6) {
            g.moved = true;
            setHover(null);
            scene.current?.setPointerCapture(g.id);
          }
          if (!g.moved) return;
          const now = performance.now();
          g.v = (e.clientX - g.lx) / Math.max(1, now - g.t);
          g.lx = e.clientX;
          g.t = now;
          cur.current = g.rot + dx * 0.22;
          target.current = cur.current;
          paint();
        }}
        onPointerUp={() => {
          const g = drag.current;
          drag.current = null;
          if (!g) return;
          if (g.moved) return snap(cur.current + g.v * 120);
          if (g.k === null) return snap(cur.current);
          if (Math.abs(norm(g.k * step + cur.current)) < step / 2) {
            // передняя: тап переворачивает (на компьютере это делает наведение)
            if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) setFlip((f) => !f);
            return;
          }
          bring(g.k);
        }}
        onPointerCancel={() => {
          drag.current = null;
          snap(cur.current);
        }}
        onClickCapture={(e) => {
          if (drag.current?.moved) e.preventDefault();
        }}
      >
        <div className={r.float}>
          <div ref={ring} className={r.ring}>
            {items.map((x, k) => {
              const ph = photoOf(x);
              const sym = citySymbol(x.slug);
              const product = products.find((p) => p.collection === x.slug);
              const sizes = product?.sizes.map((z) => z.label.replace("Набор 3 шт", "набор")).join(" · ");
              return (
                <article
                  key={x.slug}
                  className={r.card}
                  data-k={k}
                  style={{ "--a": `${k * step}deg` } as React.CSSProperties}
                  ref={(el) => {
                    cards.current[k] = el;
                  }}
                  onPointerEnter={(e) => e.pointerType === "mouse" && !drag.current?.moved && setHover(k)}
                >
                  <div className={r.inner}>
                    <div className={`${r.face} ${r.front}`}>
                      <span className={r.photo}>
                        <Image src={ph.src} alt={`Коллекция ${x.city}`} fill sizes="(max-width: 760px) 40vw, 300px" style={{ objectFit: "cover", objectPosition: ph.pos }} quality={75} draggable={false} />
                        {x.isNew && <span className={r.isNew}>новинка</span>}
                      </span>
                      <span className={r.cap}>
                        <b>{x.city}</b>
                        <small>{x.latin}</small>
                      </span>
                      <span className={r.postage} style={{ "--tone": x.tone } as React.CSSProperties} aria-hidden="true">
                        {sym ? (
                          <svg viewBox={sym.viewBox} preserveAspectRatio="xMidYMid meet" style={{ "--sw": Number(sym.viewBox.split(" ")[2]) / 34 } as React.CSSProperties}>
                            <path d={sym.d} />
                          </svg>
                        ) : (
                          <b>{x.latin.charAt(0)}</b>
                        )}
                      </span>
                    </div>
                    <div className={`${r.face} ${r.back}`}>
                      <p className={r.hello}>Привет {x.from}!</p>
                      {product && (
                        <p className={r.letter}>
                          {product.name.replace("Полотенце ", "полотенце ").replace("Коврик для ванной", "коврик")}, {product.density}&nbsp;г/м²
                        </p>
                      )}
                      {sizes && <p className={r.letter}>{sizes}</p>}
                      <Stamp id={`rg-${x.slug}`} ring="ЧИСТЫЙ ХЛОПОК · KAVA HOME ·" center="100%" sub="ХЛОПОК" waves={false} className={r.mark} ink />
                      <span className={r.sign}>KAVA HOME</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <div className={r.info} key={c.slug}>
        <h3 className={r.city}>{c.city}</h3>
        <p className={r.line}>
          {d.product ? `${d.product.name.toLowerCase()} · ${d.product.density} г/м²` : c.facts.map((f) => f.value).join(" · ")}
          {d.sizes.length > 1 ? ` · ${d.sizes[0]} – ${d.sizes[d.sizes.length - 1]}` : d.sizes.length === 1 ? ` · ${d.sizes[0]}` : ""}
        </p>
        <span className={r.sw}>
          {d.colors.map((x) => (
            <i key={x.name} style={{ background: x.swatch }} title={x.name} />
          ))}
        </span>
        <a href={`?kol=${c.slug}#catalog`} data-filter-kol={c.slug} className={r.more}>
          Смотреть коллекцию · от {d.from} BYN
        </a>
      </div>
      <p className={r.hint} aria-hidden="true">
        Тяните кольцо · наведите на открытку
      </p>
    </div>
  );
}
