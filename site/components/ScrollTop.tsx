"use client";

import { useEffect } from "react";

// Переход на другую страницу всегда начинается сверху. Next.js оставляет прежнюю прокрутку, если новая
// страница на этой высоте «видна» (шапка fixed, её он пропускает), поэтому логотип с длинной страницы
// приводил в середину главной или в подвал. Ссылка с data-top на ту же страницу (логотип на главной)
// плавно поднимает наверх. Ссылки с #якорем и «назад/вперёд» браузера не трогаем.
export function ScrollTop() {
  useEffect(() => {
    let timer = 0;
    const toTop = () => window.scrollTo({ top: 0, behavior: "instant" });
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.hash) return;
      const from = location.pathname;
      if (url.pathname === from) {
        if (a.hasAttribute("data-top")) window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      // ждём, пока Next сменит адрес (новая страница уже на месте), и поднимаемся наверх
      clearInterval(timer);
      const t0 = Date.now();
      timer = window.setInterval(() => {
        if (location.pathname !== from) {
          clearInterval(timer);
          toTop();
          requestAnimationFrame(toTop);
        } else if (Date.now() - t0 > 15000) clearInterval(timer);
      }, 30);
    };
    // capture: Link у Next гасит событие раньше, чем оно дойдёт до document
    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("click", onClick, true);
      clearInterval(timer);
    };
  }, []);
  return null;
}
