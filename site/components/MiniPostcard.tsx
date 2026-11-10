"use client";

import Image from "next/image";
import { useState } from "react";
import type { Collection } from "@/lib/collections";
import { products } from "@/lib/catalog";
import { citySymbol } from "./symbols";
import { Stamp } from "./Stamp";
import s from "./showcase.module.css";

// Открытка города как фирменная деталь поверх фото полотенца.
// Лицо: старинная открытка; если её нет (новая коллекция из админки) — фото самого полотенца в рамке открытки.
// Оборот: письмо «Привет из …» с размерами. Переворот: наведение на родителя с data-pc-host или тап по открытке.
export function MiniPostcard({ c, num, total, sizes = "240px" }: { c: Collection; num: string; total: string; sizes?: string }) {
  const [back, setBack] = useState(false);
  const sym = citySymbol(c.slug);
  const product = products.find((p) => p.collection === c.slug);
  const sizeLine = product?.sizes.map((z) => z.label.replace("Набор 3 шт", "набор")).join(" · ");
  const front = c.postcard?.src ?? c.colors[0]?.image ?? c.image;

  return (
    <span className={s.pc} data-back={back} data-fallback={!c.postcard}>
      <span className={s.pcInner}>
        <span className={`${s.pcFace} ${s.pcFront}`}>
          <span className={s.pcImg}>
            <Image src={front} alt="" fill sizes={sizes} style={{ objectFit: "cover", objectPosition: c.postcard ? "50% 50%" : "50% 70%" }} quality={75} />
          </span>
          <span className={s.pcCaption}>{c.postcard?.caption ?? `Saluti da ${c.latin.charAt(0) + c.latin.slice(1).toLowerCase()}`}</span>
          <span className={s.pcStamp} style={{ "--tone": c.tone } as React.CSSProperties} aria-hidden="true">
            {sym ? (
              <svg viewBox={sym.viewBox} preserveAspectRatio="xMidYMid meet" style={{ "--sw": Number(sym.viewBox.split(" ")[2]) / 40 } as React.CSSProperties}>
                <path d={sym.d} />
              </svg>
            ) : (
              <b>{c.latin.slice(0, 1)}</b>
            )}
          </span>
          <Stamp id={`pc-${c.slug}`} ring={`${c.city.toUpperCase()} · KAVA HOME ·`} center={num} sub={`ИЗ ${total}`} className={s.pcMark} ink />
        </span>
        <span className={`${s.pcFace} ${s.pcBack}`}>
          <span className={s.pcHello}>Привет {c.from}!</span>
          {product && (
            <span className={s.pcLine}>
              {product.name.replace("Полотенце ", "").replace("Коврик для ванной", "коврик")}, {product.density}&nbsp;г/м²
            </span>
          )}
          {sizeLine && <span className={s.pcLine}>{sizeLine}</span>}
          <span className={s.pcSign}>KAVA HOME</span>
        </span>
      </span>
      <button
        type="button"
        className={s.pcBtn}
        aria-pressed={back}
        aria-label={`Перевернуть открытку ${c.city}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // на компьютере переворачивает наведение
          if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
          setBack(!back);
        }}
      />
    </span>
  );
}
