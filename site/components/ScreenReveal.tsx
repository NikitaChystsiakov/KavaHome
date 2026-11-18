"use client";

import { useEffect } from "react";

// Появление содержимого экранов: когда экран с data-reveal попадает в окно, ему ставится data-in,
// а элементы внутри с data-r плавно выезжают (стили в about.module.css). Без JS всё видно сразу:
// скрытое состояние включается только после того, как html получил data-reveal-ready.
export function ScreenReveal() {
  useEffect(() => {
    const html = document.documentElement;
    const items = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    if (!items.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) (e.target as HTMLElement).dataset.in = "true";
      },
      { threshold: 0.3 },
    );
    // экраны, уже стоящие в окне при загрузке, показываем сразу, остальные ждут своего часа
    items.forEach((el) => io.observe(el));
    html.dataset.revealReady = "true";
    return () => {
      io.disconnect();
      delete html.dataset.revealReady;
    };
  }, []);
  return null;
}
