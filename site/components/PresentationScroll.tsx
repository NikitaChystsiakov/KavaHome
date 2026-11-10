"use client";

import { useEffect } from "react";

// Листание как у презентации на компьютере: один жест колесом/тачпадом/клавишей — ровно один экран.
// На телефоне работает нативная привязка (scroll-snap) — свайп и так листает по экрану; в каталоге она выключена.
// Экран выше окна (например, «Для отелей» на низком ноутбуке) прокручивается внутри обычным способом.
export function PresentationScroll() {
  useEffect(() => {
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine)");
    const html = document.documentElement;
    if (!desktop.matches) {
      // телефон: нативная привязка к экранам; внутри каталога выключается — он длинный и меняет высоту от фильтров
      html.dataset.snap = "true";
      const cat = document.getElementById("catalog");
      const io = new IntersectionObserver(([e]) => (html.dataset.snap = e.isIntersecting ? "free" : "true"), {
        rootMargin: "-45% 0px -45% 0px",
      });
      if (cat) io.observe(cat);
      return () => {
        io.disconnect();
        delete html.dataset.snap;
      };
    }
    html.dataset.paged = "true";

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hdr = () => (window.innerWidth < 761 ? 56 : 64);
    const screens = () => [...document.querySelectorAll<HTMLElement>("[data-screen]")];
    let busy = false;
    let acc = 0;
    let accTimer = 0;
    // дошли до края высокого экрана: ждём паузы в прокрутке, чтобы инерция тачпада не перелистнула сама
    let edge = false;
    let edgeTimer = 0;
    const holdEdge = () => {
      edge = true;
      clearTimeout(edgeTimer);
      edgeTimer = window.setTimeout(() => (edge = false), 220);
    };

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
    // у html стоит scroll-behavior: smooth — без behavior: "instant" каждый кадр запускал бы свою
    // плавную прокрутку и тут же обрывал её, отсюда было дёрганье
    const jump = (y: number) => window.scrollTo({ top: y, behavior: "instant" });
    const go = (to: number) => {
      const from = window.scrollY;
      if (Math.abs(to - from) < 2) return;
      busy = true;
      if (reduce) {
        jump(to);
        setTimeout(() => (busy = false), 200);
        return;
      }
      const dur = 760;
      const t0 = performance.now();
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / dur);
        jump(from + (to - from) * ease(t));
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
      // вверх в высокий экран (каталог) — к его нижнему краю, а не в начало
      if (next && dir < 0 && next.offsetHeight > vh - hdr() + 2) {
        go(next.getBoundingClientRect().bottom + window.scrollY - vh);
      } else if (next) go(targetOf(next));
      else if (dir < 0) go(0);
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      const list = screens();
      const cur = list[currentIndex(list)].getBoundingClientRect();
      const inside = dir > 0 ? cur.bottom > window.innerHeight + 2 : cur.top < hdr() - 2;
      if (inside) {
        // нативная прокрутка внутри высокого экрана, но не дальше его края
        const remain = dir > 0 ? cur.bottom - window.innerHeight : hdr() - cur.top;
        const px = Math.abs(e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY);
        if (px >= remain) {
          e.preventDefault();
          window.scrollTo({ top: window.scrollY + dir * remain, behavior: "instant" });
          holdEdge();
        }
        return;
      }
      e.preventDefault();
      if (edge) {
        holdEdge();
        return;
      }
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
      if (t.closest?.("input, textarea, select, [contenteditable]")) return;
      if (["ArrowDown", "PageDown"].includes(e.key) || (e.key === " " && !e.shiftKey)) page(1, e);
      else if (["ArrowUp", "PageUp"].includes(e.key) || (e.key === " " && e.shiftKey)) page(-1, e);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      clearTimeout(accTimer);
      clearTimeout(edgeTimer);
      delete document.documentElement.dataset.paged;
    };
  }, []);
  return null;
}
