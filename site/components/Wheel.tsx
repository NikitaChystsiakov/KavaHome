"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Collection } from "@/lib/collections";
import { forCollection, products } from "@/lib/catalog";
import { citySymbol } from "./symbols";
import { Stamp } from "./Stamp";
import { Cotton, CottonSprig } from "./Cotton";
import { SwapPhoto } from "./SwapPhoto";
import w from "./wheel.module.css";

// Веер-колесо: открытки с фото полотенец разложены по дуге на всю ширину, как карты в руке.
// Колесо бесконечное: новые коллекции не сужают карточки, просто дуга становится длиннее.
// Крутится перетаскиванием, свайпом, горизонтальной прокруткой тачпада и кликом по соседней открытке.
// Центральная переворачивается (наведение на компьютере, тап на телефоне): на обороте письмо и «100% хлопок».

const pad = (n: number) => String(n).padStart(2, "0");
const wrap = (x: number, n: number) => ((((x + n / 2) % n) + n) % n) - n / 2;
// геометрия совпадает с --R в wheel.module.css
// flow — «веер-лента»: дуга пологая, соседние открытки разворачиваются к центру, фон — выбранное полотенце
type Mode = "fan" | "flow";
const geo = (mode: Mode) => {
  const m = window.innerWidth < 761;
  if (mode === "flow") return m ? { step: 12, R: 1300 } : { step: 6.4, R: 2600 };
  return m ? { step: 17, R: 760 } : { step: 10.5, R: 1400 };
};

function photoOf(c: Collection) {
  const first = forCollection(c.slug).colors[0];
  return { src: first?.image ?? c.image, pos: first?.position ?? c.imagePosition ?? "50% 70%" };
}

export function Wheel({ items, mode = "fan" }: { items: Collection[]; mode?: Mode }) {
  const n = items.length;
  const [active, setActive] = useState(0);
  const [flip, setFlip] = useState(false);
  // выбранный цвет в ленте: сбрасывается сам, когда в центр встаёт другая коллекция
  const [pick, setPick] = useState<{ slug: string; i: number } | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const cur = useRef(0);
  const target = useRef(0);
  const raf = useRef(0);
  const drag = useRef<{ x: number; rot: number; moved: boolean; t: number; lx: number; v: number; k: number | null; id: number } | null>(null);

  const arc = useCallback(() => {
    const g = geo(mode);
    return (g.R * g.step * Math.PI) / 180;
  }, [mode]);

  const paint = useCallback(() => {
    const { step } = geo(mode);
    cards.current.forEach((el, k) => {
      if (!el) return;
      const d = wrap(k - cur.current, n);
      const a = Math.abs(d);
      const near = Math.max(0, 1 - a);
      // в ленте открытки не разворачиваются в 3D (выглядели перекошенными трапециями):
      // только пологая дуга, соседние чуть меньше и спокойнее, центральная крупнее
      // соседние открытки уходят вглубь (translateZ), но не разворачиваются в 3D:
      // разворот по Y вместе с наклоном по дуге давал перекошенные трапеции
      const flow = mode === "flow" ? ` translateZ(${(-Math.min(a, 3) * 70).toFixed(1)}px)` : "";
      el.style.transform = `rotate(${(d * step).toFixed(3)}deg) translateY(${(-near * 7).toFixed(2)}%)${flow}`;
      el.style.opacity = a > n / 2 - 0.6 ? "0" : "1";
      el.style.zIndex = String(100 - Math.round(a * 10));
      el.dataset.on = a < 0.5 ? "true" : "false";
    });
    setActive(((Math.round(cur.current) % n) + n) % n);
  }, [n, mode]);

  const run = useCallback(() => {
    cancelAnimationFrame(raf.current);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      const diff = target.current - cur.current;
      if (reduce || Math.abs(diff) < 0.002) {
        cur.current = target.current;
        paint();
        return;
      }
      cur.current += diff * 0.13;
      paint();
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [paint]);

  const go = useCallback(
    (t: number) => {
      target.current = t;
      setFlip(false);
      run();
    },
    [run],
  );

  // первая раскладка, пересчёт при смене размера, горизонтальная прокрутка тачпадом
  useEffect(() => {
    const el = stage.current;
    raf.current = requestAnimationFrame(paint);
    const onResize = () => requestAnimationFrame(paint);
    let snap = 0;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      cancelAnimationFrame(raf.current);
      cur.current += e.deltaX / arc();
      target.current = cur.current;
      paint();
      clearTimeout(snap);
      snap = window.setTimeout(() => go(Math.round(cur.current)), 140);
    };
    window.addEventListener("resize", onResize);
    el?.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(snap);
      window.removeEventListener("resize", onResize);
      el?.removeEventListener("wheel", onWheel);
    };
  }, [paint, go, arc]);

  const c = items[active];
  const d = forCollection(c.slug);
  const ci = pick?.slug === c.slug ? Math.min(pick.i, Math.max(0, d.colors.length - 1)) : 0;
  const tone = d.colors[ci];
  const tonePhoto = tone ? { src: tone.image, pos: tone.position ?? "50% 70%" } : photoOf(c);

  return (
    <div className={w.wheel} data-mode={mode}>
      {mode === "flow" ? (
        <div className={w.bg} aria-hidden="true">
          <SwapPhoto src={tonePhoto.src} alt="" sizes="100vw" position={tonePhoto.pos} />
        </div>
      ) : (
        <>
          <Cotton className={w.cottonL} />
          <Cotton className={w.cottonR} />
        </>
      )}

      {mode === "flow" ? (
        <div className={w.panel}>
          <div className={w.panelIn} key={c.slug}>
            <p className={w.pKicker}>
              <span>
                Коллекция {pad(active + 1)} / {pad(n)}
              </span>
              <span className={w.pCotton}>
                <CottonSprig className={w.sprig} />
                100% хлопок
              </span>
            </p>
            <h3 className={w.pCity}>{c.city}</h3>
            <p className={w.pLine}>{d.product ? `${d.product.name}, ${d.product.density} г/м²` : c.facts.map((f) => f.value).join(", ")}</p>
            <dl className={w.pFacts}>
              {c.facts.map((f) => (
                <div key={f.term}>
                  <dt>{f.term}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
              {d.sizes.length > 0 && (
                <div>
                  <dt>Размеры</dt>
                  <dd>{d.sizes.length > 1 ? `${d.sizes[0]} – ${d.sizes[d.sizes.length - 1]}` : d.sizes[0]}</dd>
                </div>
              )}
            </dl>
            {d.colors.length > 0 && (
              <div className={w.pColors}>
                <p>
                  Цвет: <b>{tone?.name}</b>
                </p>
                <span className={w.pSw}>
                  {d.colors.map((x, k) => (
                    <button
                      key={x.name}
                      type="button"
                      aria-label={x.name}
                      aria-pressed={k === ci}
                      title={x.name}
                      style={{ background: x.swatch }}
                      onClick={() => setPick({ slug: c.slug, i: k })}
                    />
                  ))}
                </span>
              </div>
            )}
            <div className={w.pBuy}>
              <span className={w.pPrice}>от {d.from} BYN</span>
              <a href={`/?kol=${c.slug}#catalog`} data-filter-kol={c.slug} className={w.pMore}>
                Смотреть коллекцию
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className={w.head} key={c.slug}>
          <p className={w.kicker}>
            Коллекция {pad(active + 1)} из {pad(n)} · 100% хлопок
          </p>
          <h3 className={w.city}>{c.city}</h3>
          <p className={w.line}>
            {d.product ? `${d.product.name.toLowerCase()}, ${d.product.density} г/м²` : c.facts.map((f) => f.value).join(", ")}
            {d.sizes.length > 1 ? ` · ${d.sizes[0]} – ${d.sizes[d.sizes.length - 1]}` : d.sizes.length === 1 ? ` · ${d.sizes[0]}` : ""}
          </p>
          <div className={w.row}>
            <span className={w.sw}>
              {d.colors.map((x) => (
                <i key={x.name} style={{ background: x.swatch }} title={x.name} />
              ))}
            </span>
            <a href={`/?kol=${c.slug}#catalog`} className={w.more}>
              от {d.from} BYN · смотреть коллекцию →
            </a>
          </div>
        </div>
      )}

      <div
        ref={stage}
        className={w.stage}
        data-flip={flip}
        tabIndex={0}
        aria-label="Коллекции: тяните веер или нажмите на открытку"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(Math.round(target.current) + 1);
          if (e.key === "ArrowLeft") go(Math.round(target.current) - 1);
        }}
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
            stage.current?.setPointerCapture(g.id);
          }
          if (!g.moved) return;
          const now = performance.now();
          g.v = (e.clientX - g.lx) / Math.max(1, now - g.t);
          g.lx = e.clientX;
          g.t = now;
          cur.current = g.rot - dx / arc();
          target.current = cur.current;
          paint();
        }}
        onPointerUp={() => {
          const g = drag.current;
          drag.current = null;
          if (!g) return;
          if (g.moved) {
            go(Math.round(cur.current - (g.v * 180) / arc()));
            return;
          }
          if (g.k === null) {
            go(Math.round(cur.current));
            return;
          }
          const dk = wrap(g.k - cur.current, n);
          if (Math.abs(dk) < 0.5) {
            // центральная: тап переворачивает (на компьютере это делает наведение)
            if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) setFlip((f) => !f);
            go(Math.round(cur.current));
          } else go(Math.round(cur.current + dk));
        }}
        onPointerCancel={() => {
          drag.current = null;
          go(Math.round(cur.current));
        }}
        onClickCapture={(e) => {
          if (drag.current?.moved) e.preventDefault();
        }}
      >
        {items.map((x, k) => {
          const ph = mode === "flow" && k === active ? tonePhoto : photoOf(x);
          const sym = citySymbol(x.slug);
          const product = products.find((p) => p.collection === x.slug);
          const sizes = product?.sizes.map((z) => z.label.replace("Набор 3 шт", "набор")).join(" · ");
          return (
            <article
              key={x.slug}
              className={w.card}
              data-k={k}
              ref={(el) => {
                cards.current[k] = el;
              }}
            >
              <div className={w.inner}>
                <div className={`${w.face} ${w.front}`}>
                  <span className={w.photo}>
                    <Image src={ph.src} alt={`Коллекция ${x.city}`} fill sizes="(max-width: 760px) 60vw, 280px" style={{ objectFit: "cover", objectPosition: ph.pos }} quality={75} draggable={false} />
                    {x.isNew && <span className={w.isNew}>новинка</span>}
                  </span>
                  <span className={w.cap}>
                    <b>{x.city}</b>
                    <small>{x.latin}</small>
                  </span>
                  <span className={w.postage} style={{ "--tone": x.tone } as React.CSSProperties} aria-hidden="true">
                    {sym ? (
                      <svg viewBox={sym.viewBox} preserveAspectRatio="xMidYMid meet" style={{ "--sw": Number(sym.viewBox.split(" ")[2]) / 36 } as React.CSSProperties}>
                        <path d={sym.d} />
                      </svg>
                    ) : (
                      <b>{x.latin.charAt(0)}</b>
                    )}
                  </span>
                </div>
                <div className={`${w.face} ${w.back}`}>
                  <p className={w.hello}>Привет {x.from}!</p>
                  {product && (
                    <p className={w.letter}>
                      {product.name.replace("Полотенце ", "полотенце ").replace("Коврик для ванной", "коврик")}, {product.density}&nbsp;г/м²
                    </p>
                  )}
                  {sizes && <p className={w.letter}>{sizes}</p>}
                  <Stamp id={`wh-${x.slug}`} ring="ЧИСТЫЙ ХЛОПОК · KAVA HOME ·" center="100%" sub="ХЛОПОК" waves={false} className={w.cottonMark} ink />
                  <a href={`/?kol=${x.slug}#catalog`} className={w.backLink}>
                    от {forCollection(x.slug).from} BYN · смотреть
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p className={w.hint} aria-hidden="true">
        ← тяните веер или нажмите на соседнюю открытку →
      </p>
    </div>
  );
}
