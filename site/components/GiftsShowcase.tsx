"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import s from "./home.module.css";

export type GiftLineView = {
  key: string;
  name: string;
  density: number;
  colors: { name: string; swatch: string }[];
  sizes: string[];
  price: string;
  href: string;
};

// «Подарить» на компьютере: наведение на линию QD в списке показывает её на плашке поверх фото —
// цвета с названиями, размеры, плотность, цена — и палитру полосой по низу фото.
// До наведения плашка говорит обо всех линиях сразу. На телефоне плашки нет, только список.
export function GiftsShowcase({
  lines,
  head,
  cert,
}: {
  lines: GiftLineView[];
  head: ReactNode;
  cert: ReactNode;
}) {
  const [cur, setCur] = useState<number | null>(null);
  const line = cur === null ? null : lines[cur];
  const dens = lines.map((l) => l.density).filter(Boolean);
  const palette = line
    ? line.colors
    : lines.flatMap((l) => l.colors.slice(0, 2));

  return (
    <>
      <Link
        href={line?.href ?? "/catalog?kat=gifts"}
        className={s.giftPhoto}
        aria-label={line ? `${line.name}: открыть` : "Все подарочные наборы QD"}
      >
        <Image
          src="/img/gift-qd.webp"
          alt="Подарочные полотенца QD: ментол, ваниль, персик, сирень"
          fill
          sizes="(max-width: 760px) 100vw, 55vw"
          style={{ objectFit: "cover", objectPosition: "0% 50%" }}
          quality={75}
        />
        <span className={s.giftTag} key={line?.key ?? "all"}>
          {line ? (
            <>
              <span className={s.giftKicker}>
                {line.density ? `${line.density} г/м² · ` : ""}
                {line.sizes.join(", ")}
              </span>
              <b>{line.name}</b>
              <span className={s.giftColors}>
                {line.colors.map((c) => (
                  <span key={c.name}>
                    <i style={{ background: c.swatch }} />
                    {c.name}
                  </span>
                ))}
              </span>
              <span className={s.giftBuy}>
                <span>{line.price}</span>
                <span className={s.giftMore}>
                  Открыть
                  <svg viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M1 6h10M7 2l4 4-4 4" />
                  </svg>
                </span>
              </span>
            </>
          ) : (
            <>
              <span className={s.giftKicker}>
                {lines.length} линий
                {dens.length > 0 &&
                  ` · ${Math.min(...dens)}–${Math.max(...dens)} г/м²`}
              </span>
              <b>Подарочные наборы QD</b>
              <span className={s.giftHint}>
                Наведите на линию в списке — покажем её цвета и размеры
              </span>
              <span className={s.giftMore}>
                Смотреть все
                <svg viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M1 6h10M7 2l4 4-4 4" />
                </svg>
              </span>
            </>
          )}
        </span>
        <span className={s.giftPalette} aria-hidden="true">
          {palette.map((c, i) => (
            <i key={`${c.name}-${i}`} style={{ background: c.swatch }} />
          ))}
        </span>
      </Link>
      <div className={s.giftsSide}>
        {head}
        <ul
          className={s.giftList}
          aria-label="Подарочные линии QD"
          onMouseLeave={() => setCur(null)}
        >
          {lines.map((l, i) => (
            <li key={l.key} data-active={cur === i || undefined}>
              <Link
                href={l.href}
                onMouseEnter={() => setCur(i)}
                onFocus={() => setCur(i)}
                onBlur={() => setCur(null)}
              >
                <b>{l.name}</b>
                <span className={s.giftSwatches} aria-hidden="true">
                  {l.colors.slice(0, 6).map((c) => (
                    <i key={c.name} style={{ background: c.swatch }} />
                  ))}
                </span>
                <span className={s.giftDensity}>
                  {l.density ? `${l.density} г/м²` : ""}
                </span>
                <svg viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M1 6h10M7 2l4 4-4 4" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
        {cert}
      </div>
    </>
  );
}
