"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Collection } from "@/lib/collections";
import { forCollection } from "@/lib/catalog";
import z from "./zara.module.css";

// Максимально простой вариант в духе Zara Home: ряд крупных фото от края до края с зазором 2px,
// мелкие прописные подписи, стрелки справа. Наведение показывает второй цвет коллекции.
export function ZaraRow({ items }: { items: Collection[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const on = () => setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 4 });
    const raf = requestAnimationFrame(on);
    el.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  const move = (dir: number) => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>("[data-card]");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 2), behavior: "smooth" });
  };

  return (
    <section className={z.zara} aria-labelledby="zara-title">
      <div className={z.head}>
        <h2 id="zara-title" className={z.title}>
          Коллекции
        </h2>
        <span className={z.count}>{items.length} городов · 100% хлопок</span>
        <div className={z.arrows}>
          <button type="button" onClick={() => move(-1)} disabled={edge.start} aria-label="Назад">
            <svg viewBox="0 0 12 20">
              <path d="M10 2 2 10l8 8" />
            </svg>
          </button>
          <button type="button" onClick={() => move(1)} disabled={edge.end} aria-label="Вперёд">
            <svg viewBox="0 0 12 20">
              <path d="m2 2 8 8-8 8" />
            </svg>
          </button>
        </div>
      </div>
      <div ref={track} className={z.track}>
        {items.map((c) => {
          const d = forCollection(c.slug);
          const a = d.colors[0];
          const b = d.colors[1];
          return (
            <a key={c.slug} href={`?kol=${c.slug}#catalog`} data-filter-kol={c.slug} className={z.card} data-card>
              <span className={z.media}>
                <Image src={a?.image ?? c.image} alt={`Коллекция ${c.city}`} fill sizes="(max-width: 760px) 72vw, 25vw" style={{ objectFit: "cover", objectPosition: a?.position ?? "50% 70%" }} quality={75} />
                {b && (
                  <Image src={b.image} alt="" fill sizes="(max-width: 760px) 72vw, 25vw" className={z.alt} style={{ objectFit: "cover", objectPosition: b.position ?? "50% 70%" }} quality={75} />
                )}
                {c.isNew && <span className={z.isNew}>Новинка</span>}
              </span>
              <span className={z.meta}>
                <span className={z.name}>{c.city}</span>
                <span className={z.price}>от {d.from} BYN</span>
              </span>
              <span className={z.sub}>{d.product ? `${d.product.name.toLowerCase()} · ${d.product.density} г/м²` : c.facts[0]?.value}</span>
              <span className={z.sw}>
                {d.colors.map((x) => (
                  <i key={x.name} style={{ background: x.swatch }} />
                ))}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
