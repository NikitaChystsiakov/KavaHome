"use client";

import Image from "next/image";
import { useState } from "react";
import s from "./showcase.module.css";

// Фото с мягкой сменой: старый кадр остаётся на месте, пока новый не загрузится и не раскодируется,
// затем новый «натягивается» поверх мягкой шторкой слева направо. Белой паузы между кадрами нет.
// Прямой кроссфейд не годится: кадры разных цветов сняты не в одной точке и дают «призрак».
// Слои держим по ключу src: кадр, ставший основой, не пересоздаётся и не мигает.
type Props = { src: string; alt: string; sizes: string; position?: string; eager?: boolean };
type Shot = { src: string; pos: string };

export function SwapPhoto({ src, alt, sizes, position = "50% 50%", eager }: Props) {
  const [base, setBase] = useState<Shot>({ src, pos: position });
  const [top, setTop] = useState<Shot | null>(null);
  // какой кадр уже загружен и раскодирован — только он может проявляться
  const [ready, setReady] = useState<string | null>(null);
  const [want, setWant] = useState(src);
  const phase = top && ready === top.src ? "in" : "wait";

  // новый src (производное состояние, без эффекта)
  if (src !== want) {
    setWant(src);
    if (src === base.src) {
      setTop(null);
    } else {
      // если прошлый кадр уже проявлялся — фиксируем его основой, чтобы не откатываться назад
      if (top && phase === "in") setBase(top);
      setTop({ src, pos: position });
      setReady(null);
    }
  }
  const loaded = (e: React.SyntheticEvent<HTMLImageElement>, isTop: boolean) => {
    const img = e.currentTarget;
    img.dataset.loaded = "true";
    const s0 = img.dataset.src;
    if (!s0 || !isTop) return;
    img
      .decode()
      .catch(() => {})
      .then(() => setReady(s0));
  };

  const shots = top ? [base, top] : [base];

  return (
    <span className={s.swap}>
      {shots.map((x) => {
        const isTop = x === top;
        return (
          <Image
            key={x.src}
            src={x.src}
            alt={isTop || !top ? alt : ""}
            fill
            sizes={sizes}
            className={s.pic}
            data-src={x.src}
            data-phase={isTop ? phase : undefined}
            loading={eager || isTop ? "eager" : "lazy"}
            onLoad={(e) => loaded(e, isTop)}
            onAnimationEnd={
              isTop
                ? () => {
                    setBase(x);
                    setTop(null);
                  }
                : undefined
            }
            style={{ objectFit: "cover", objectPosition: x.pos }}
            quality={75}
          />
        );
      })}
    </span>
  );
}
