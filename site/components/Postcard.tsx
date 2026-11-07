"use client";

import Image from "next/image";
import { useState } from "react";
import type { Collection } from "@/lib/collections";
import { citySymbol } from "./symbols";
import type { CitySymbol } from "@/lib/collections";
import { Stamp } from "./Stamp";
import s from "./slide.module.css";

type Props = { c: Collection; num: string; total: string };

// Старинная открытка города. По клику переворачивается: на обороте письмо «Привет из…» про коллекцию.
export function Postcard({ c, num, total }: Props) {
  const [back, setBack] = useState(false);
  const sym = citySymbol(c.slug as CitySymbol);
  const colorNames = c.colors.map((v) => v.name).join(", ");

  return (
    <div className={s.cardWrap}>
      <button
        type="button"
        className={s.card}
        data-back={back}
        onClick={() => setBack(!back)}
        aria-pressed={back}
        aria-label={back ? `Показать открытку ${c.city}` : `Перевернуть открытку ${c.city}`}
      >
        <span className={`${s.face} ${s.front}`}>
          <span className={s.frontImg}>
            <Image src={c.postcard.src} alt="" fill sizes="(max-width: 760px) 60vw, 40vw" style={{ objectFit: "cover" }} quality={75} />
          </span>
          <span className={s.caption}>{c.postcard.caption}</span>
        </span>
        <span className={`${s.face} ${s.back}`}>
          <span className={s.letter}>
            <b>Привет {c.from}!</b> {c.facts.map((f) => `${f.term} — ${f.value}`).join(". ")}. Цвета: {colorNames}.
            <i>KAVA HOME</i>
          </span>
          <span className={s.address}>
            <span>Кому: вам</span>
            <span>Минск, KAVA HOME</span>
            <span>ул. Рафиева, 55</span>
          </span>
        </span>
      </button>

      <span className={s.postage} aria-hidden="true">
        <svg viewBox={sym.viewBox} preserveAspectRatio="xMidYMid meet">
          <path d={sym.d} pathLength={1} />
        </svg>
        <span>{c.latin}</span>
      </span>
      <Stamp
        id={`pm-${c.slug}`}
        ring={`${c.city.toUpperCase()} · ${c.latin} · ${c.country.toUpperCase()} · KAVA HOME ·`}
        center={num}
        sub={`ИЗ ${total}`}
        className={s.postmark}
      />
      <span className={s.flipHint} aria-hidden="true">
        {back ? "↺ к виду города" : "↻ перевернуть"}
      </span>
    </div>
  );
}
