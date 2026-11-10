"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { Menu } from "./Menu";
import s from "./home.module.css";

// Шапка и логотип. На первом экране логотип на всю ширину поверх светлых кадров; при прокрутке
// он уменьшается и уезжает в центр шапки.
export function TopBar({ compact = false }: { compact?: boolean }) {
  const bar = useRef<HTMLElement>(null);
  const logo = useRef<HTMLAnchorElement>(null);
  const [menu, setMenu] = useState(false);
  const closeMenu = useCallback(() => setMenu(false), []);

  useEffect(() => {
    const el = logo.current;
    const hdr = bar.current;
    if (!el || !hdr) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const mobile = vw < 760;
      const p = compact ? 1 : Math.min(1, Math.max(0, window.scrollY / (vh * 0.55)));
      const e = 1 - Math.pow(1 - p, 3);
      // на десктопе лого вписывается между шапкой и блоком предложения (контур лого ≈ 0.44 его ширины)
      const offer = document.querySelector<HTMLElement>("[data-hero-offer]");
      const offerTop = offer ? offer.getBoundingClientRect().top + window.scrollY : vh;
      const top = (mobile ? 56 : 64) + 20;
      const avail = Math.max(120, offerTop - 20 - top);
      const big = Math.min(mobile ? vw * 0.86 : vw * 0.84, 1400, mobile ? 9999 : avail / 0.44);
      const small = mobile ? 84 : 116;
      const scale = 1 + (small / big - 1) * e;
      const hdrH = mobile ? 56 : 64;
      const yBig = mobile ? hdrH + (vh - hdrH) * 0.4 : top + avail / 2;
      const y = yBig + (hdrH / 2 - yBig) * e;
      el.style.width = `${big}px`;
      el.style.transform = `translate(-50%, -50%) translateY(${y}px) scale(${scale})`;
      hdr.dataset.solid = p >= 0.9 ? "true" : "false";
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [compact]);

  return (
    <>
      <header ref={bar} className={s.bar} data-solid="false">
        <div className={s.barLeft}>
          <button className={s.burger} type="button" aria-label="Открыть меню" aria-expanded={menu} onClick={() => setMenu(true)}>
            <span />
          </button>
          <Link href="/#catalog" className={`caps ${s.hideMobile}`}>
            Каталог
          </Link>
          <Link href="/#hotels" className={`caps ${s.hideMobile}`}>
            Для отелей
          </Link>
        </div>
        <div className={s.barRight}>
          <a href="/search" className={`${s.barLink} ${s.search}`} aria-label="Поиск">
            <svg className={s.icon} viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="6" />
              <path d="M13 13l5 5" />
            </svg>
            <span className={s.hideMobile}>Найти полотенце</span>
          </a>
          <a href="/cart" className={`caps ${s.barLink}`} aria-label="Корзина, 0 товаров">
            <svg className={s.icon} viewBox="0 0 20 20" aria-hidden="true">
              <path d="M3.5 6.5h13l-1 11h-11z" />
              <path d="M7 6.5V5a3 3 0 0 1 6 0v1.5" />
            </svg>
            <span className={s.hideMobile}>Корзина</span>
            <b className={s.count}>0</b>
          </a>
        </div>
      </header>
      <Link ref={logo} href="/" className={s.logo} aria-label="KAVA HOME, на главную">
        <Logo />
      </Link>
      <Menu open={menu} onClose={closeMenu} />
    </>
  );
}
