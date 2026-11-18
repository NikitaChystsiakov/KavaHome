"use client";

import { useEffect } from "react";

// Листание как у презентации на компьютере: один жест колесом/тачпадом/клавишей — ровно один экран.
// На телефоне работает нативная привязка (scroll-snap) — свайп и так листает по экрану; в каталоге она выключена.
// Экран выше окна (каталог) прокручивается внутри обычным способом, но не дальше своего края.
export function PresentationScroll({ snapMobile = true }: { snapMobile?: boolean }) {
  useEffect(() => {
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine)");
    const html = document.documentElement;
    if (!desktop.matches) {
      // страницы с высокими экранами (Для бизнеса) на телефоне листаются обычной прокруткой
      if (!snapMobile) return;
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

    // идёт анимация перелистывания
    let animating = false;
    // жест уже отработал (перелистнули или упёрлись в край каталога): хвост инерции тачпада и
    // продолжающееся вращение колеса гасим, пока не будет паузы или нового толчка
    let spent = false;
    let lastT = 0;
    let lastAbs = 0;
    let rise = 0;
    let acc = 0;
    // границы нативной прокрутки внутри высокого экрана: плавная прокрутка браузера догоняет
    // несколько событий колеса сразу и иначе проскакивает край — отсюда торчал кусок «Подарить»
    let limit: { min: number; max: number; until: number } | null = null;

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
    const current = () => {
      const list = screens();
      const i = currentIndex(list);
      return { list, i, el: list[i], r: list[i].getBoundingClientRect() };
    };
    // экран выше окна и мы ещё не у его края в эту сторону
    const insideTall = (r: DOMRect, dir: number) =>
      dir > 0 ? r.bottom > window.innerHeight + 2 : r.top < hdr() - 2;
    const setLimit = (el: HTMLElement, ms: number) => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      limit = {
        min: top - hdr(),
        max: top + el.offsetHeight - window.innerHeight,
        until: performance.now() + ms,
      };
    };

    // у html стоит scroll-behavior: smooth — без behavior: "instant" каждый кадр запускал бы свою
    // плавную прокрутку и тут же обрывал её, отсюда было дёрганье
    const jump = (y: number) => window.scrollTo({ top: y, behavior: "instant" });
    const go = (to: number) => {
      const from = window.scrollY;
      limit = null;
      if (Math.abs(to - from) < 2) return;
      animating = true;
      spent = true;
      if (reduce) {
        jump(to);
        setTimeout(() => (animating = false), 200);
        return;
      }
      const dur = 760;
      const t0 = performance.now();
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / dur);
        jump(from + (to - from) * ease(t));
        if (t < 1) requestAnimationFrame(step);
        else animating = false;
      };
      requestAnimationFrame(step);
    };

    const page = (dir: 1 | -1) => {
      const { list, i } = current();
      const vh = window.innerHeight;
      const next = list[i + dir];
      // вверх в высокий экран (каталог) — к его нижнему краю, а не в начало
      if (next && dir < 0 && next.offsetHeight > vh - hdr() + 2) {
        go(next.getBoundingClientRect().bottom + window.scrollY - vh);
      } else if (next) go(targetOf(next));
      else if (dir < 0) go(0);
    };

    // внутри вложенной прокручиваемой панели (фильтры каталога) колесо листает её, а не страницу
    const innerScroller = (t: EventTarget | null, dy: number) => {
      for (let el = t instanceof Element ? (t as HTMLElement) : null; el && el !== document.body; el = el.parentElement) {
        if (el.scrollHeight <= el.clientHeight + 1) continue;
        const oy = getComputedStyle(el).overflowY;
        if (oy !== "auto" && oy !== "scroll") continue;
        // дошла до края в эту сторону — отдаём странице (не перелистываем, см. ниже)
        return dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0;
      }
      return false;
    };

    const menuOpen = () => document.documentElement.style.overflow === "hidden";

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY) || menuOpen()) return;
      if (innerScroller(e.target, e.deltaY)) return;
      const px = Math.abs(
        e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY,
      );
      // новый жест: пауза в потоке событий или новый толчок посреди затухающей инерции
      const now = performance.now();
      const gap = now - lastT;
      lastT = now;
      rise = gap < 200 && px > lastAbs + 3 ? rise + 1 : 0;
      lastAbs = px;
      if (gap > 200 || (rise >= 2 && px >= 8 && !animating)) {
        spent = false;
        acc = 0;
      }
      if (animating || spent) {
        e.preventDefault();
        return;
      }

      const dir = e.deltaY > 0 ? 1 : -1;
      const { el, r } = current();
      if (insideTall(r, dir)) {
        // нативная прокрутка внутри высокого экрана, но не дальше его края
        const remain = dir > 0 ? r.bottom - window.innerHeight : hdr() - r.top;
        setLimit(el, 450);
        if (px >= remain) {
          e.preventDefault();
          jump(window.scrollY + dir * remain);
          spent = true;
        }
        return;
      }
      e.preventDefault();
      acc += e.deltaY;
      if (Math.abs(acc) >= 30) {
        acc = 0;
        page(dir);
      }
    };

    // догоняем плавную прокрутку браузера: вышла за край высокого экрана — ставим ровно на край
    const onScroll = () => {
      if (!limit || animating) return;
      if (performance.now() > limit.until) {
        limit = null;
        return;
      }
      const y = window.scrollY;
      if (y > limit.max + 1) jump(limit.max);
      else if (y < limit.min - 1) jump(limit.min);
      else return;
      spent = true;
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest?.("input, textarea, select, button, [contenteditable]") && e.key === " ") return;
      if (t.closest?.("input, textarea, select, [contenteditable]") || menuOpen()) return;
      let dir: 1 | -1 | 0 = 0;
      if (["ArrowDown", "PageDown"].includes(e.key) || (e.key === " " && !e.shiftKey)) dir = 1;
      else if (["ArrowUp", "PageUp"].includes(e.key) || (e.key === " " && e.shiftKey)) dir = -1;
      if (!dir) return;
      const { el, r } = current();
      if (insideTall(r, dir)) {
        // стрелки и PageDown внутри каталога — обычная прокрутка, но с остановкой на краю
        setLimit(el, 900);
        return;
      }
      e.preventDefault();
      if (!animating) page(dir);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      delete document.documentElement.dataset.paged;
    };
  }, [snapMobile]);
  return null;
}
