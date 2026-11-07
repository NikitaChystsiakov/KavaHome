"use client";

import { useEffect } from "react";

// Листание как у презентации на компьютере: один жест колесом/тачпадом/клавишей — ровно один экран.
// На телефоне работает нативная привязка (scroll-snap) — свайп и так листает по экрану.
// Экран выше окна (например, «Для отелей» на низком ноутбуке) прокручивается внутри обычным способом.
export function PresentationScroll() {
  useEffect(() => {
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!desktop.matches) return;
    document.documentElement.dataset.paged = "true";

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hdr = () => (window.innerWidth < 761 ? 56 : 64);
    const screens = () => [...document.querySelectorAll<HTMLElement>("[data-screen]")];
    let busy = false;
    let acc = 0;
    let accTimer = 0;

    const targetOf = (el: HTMLElement) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return Math.min(max, el.getBoundingClientRect().top + window.scrollY - hdr());
    };
    const currentIndex = (list: HTMLElement[]) => {
      let best = 0;
      let bestD = Infinity;
      list.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        // экран «текущий», если он покрывает линию под шапкой
        const d = r.top <= hdr() + 2 && r.bottom > hdr() + 2 ? 0 : Math.abs(r.top - hdr());
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      return best;
    };
    const go = (to: number) => {
      const from = window.scrollY;
      if (Math.abs(to - from) < 2) return;
      busy = true;
      if (reduce) {
        window.scrollTo(0, to);
        setTimeout(() => (busy = false), 200);
        return;
      }
      const dur = 760;
      const t0 = performance.now();
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / dur);
        window.scrollTo(0, from + (to - from) * ease(t));
        if (t < 1) requestAnimationFrame(step);
        // гасим инерцию тачпада после перелистывания
        else setTimeout(() => (busy = false), 420);
      };
      requestAnimationFrame(step);
    };

    const page = (dir: 1 | -1, e?: Event) => {
      if (document.documentElement.style.overflow === "hidden") return false; // открыто меню
      const list = screens();
      const i = currentIndex(list);
      const cur = list[i].getBoundingClientRect();
      const vh = window.innerHeight;
      // внутри высокого экрана — обычная прокрутка до его края
      if (dir > 0 && cur.bottom > vh + 2) return false;
      if (dir < 0 && cur.top < hdr() - 2) return false;
      e?.preventDefault();
      if (busy) return true;
      const next = list[i + dir];
      if (next) go(targetOf(next));
      else if (dir < 0) go(0);
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      const list = screens();
      const cur = list[currentIndex(list)].getBoundingClientRect();
      const inside = dir > 0 ? cur.bottom > window.innerHeight + 2 : cur.top < hdr() - 2;
      if (inside) return; // нативная прокрутка внутри высокого экрана
      e.preventDefault();
      if (busy) return;
      acc += e.deltaY;
      clearTimeout(accTimer);
      accTimer = window.setTimeout(() => (acc = 0), 180);
      if (Math.abs(acc) >= 30) {
        acc = 0;
        page(dir);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable]")) return;
      if (["ArrowDown", "PageDown"].includes(e.key) || (e.key === " " && !e.shiftKey)) page(1, e);
      else if (["ArrowUp", "PageUp"].includes(e.key) || (e.key === " " && e.shiftKey)) page(-1, e);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      delete document.documentElement.dataset.paged;
    };
  }, []);
  return null;
}
