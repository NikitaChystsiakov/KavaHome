"use client";

import { useEffect, useRef, useState } from "react";
import s from "./home.module.css";

// Фон первого экрана — ролик клиента (2026-11-19). Под ним сразу лежит кадр-постер (виден до загрузки,
// при «уменьшить движение» и экономии трафика), ролик подгружается после и плавно проявляется.
// Компьютер и планшет: три вертикали рядом (hero-wide, 16:9). Телефон: одна вертикаль (hero-tall, 9:16).
// Исходники монтажа лежат в «Видео/» (в git не входят), сборка — ffmpeg, см. scripts/hero-video.py.
export function HeroVideo({ alt }: { alt: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    if (calm || conn?.saveData) return;
    const phone = window.matchMedia("(max-width: 759px)").matches;
    setSrc(phone ? "/video/hero-tall.mp4" : "/video/hero-wide.mp4");
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || !src) return;
    v.muted = true;
    v.play().catch(() => {});
  }, [src]);

  return (
    <>
      <picture>
        <source media="(max-width: 759px)" srcSet="/video/hero-tall.jpg" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/video/hero-wide.jpg"
          alt={alt}
          fetchPriority="high"
          className={s.heroMedia}
        />
      </picture>
      {src && (
        <video
          ref={ref}
          className={`${s.heroMedia} ${s.heroVideo} ${ready ? s.heroVideoOn : ""}`}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onPlaying={() => setReady(true)}
        />
      )}
    </>
  );
}
