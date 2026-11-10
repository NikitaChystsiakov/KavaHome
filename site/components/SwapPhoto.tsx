"use client";

import Image from "next/image";
import { useState } from "react";
import s from "./showcase.module.css";

// Фото с мягкой сменой (fade-through): старый кадр гаснет в молочный, новый проявляется после загрузки.
// Прямой кроссфейд не годится: кадры разных цветов сняты не в одной точке и дают «призрак».
type Props = { src: string; alt: string; sizes: string; position?: string; eager?: boolean };

export function SwapPhoto({ src, alt, sizes, position = "50% 50%", eager }: Props) {
  const [shown, setShown] = useState(src);
  const [prev, setPrev] = useState<string | null>(null);
  const [ready, setReady] = useState(true);

  // новый src: запоминаем старый кадр как подложку (производное состояние, без эффекта)
  if (src !== shown) {
    setPrev(shown);
    setShown(src);
    setReady(false);
  }

  return (
    <span className={s.swap}>
      {prev && (
        <Image
          key={`p-${prev}`}
          src={prev}
          alt=""
          fill
          sizes={sizes}
          className={s.under}
          data-gone={ready}
          style={{ objectFit: "cover", objectPosition: position }}
          quality={75}
        />
      )}
      <Image
        key={`c-${shown}`}
        src={shown}
        alt={alt}
        fill
        sizes={sizes}
        className={s.layer}
        data-ready={ready}
        loading={eager ? "eager" : "lazy"}
        onLoad={() => setReady(true)}
        onTransitionEnd={() => ready && setPrev(null)}
        style={{ objectFit: "cover", objectPosition: position }}
        quality={75}
      />
    </span>
  );
}
