"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { collections, contacts } from "@/lib/collections";
import { categories, purposeChips } from "@/lib/catalog";
import s from "./menu.module.css";

type Props = { open: boolean; onClose: () => void };

// Главные разделы — первыми: до 2026-11-15 «Доставка» и «Для бизнеса» стояли в самом конце меню, после городов и категорий.
const mainLinks = [
  { href: "/catalog", label: "Весь каталог" },
  { href: "/kollekcii", label: "Коллекции" },
  { href: "/dostavka", label: "Доставка и оплата" },
  { href: "/biznes", label: "Для отелей и бизнеса" },
  { href: "/o-nas", label: "О бренде" },
  { href: "/faq", label: "Вопросы и ответы" },
  { href: "/kontakty", label: "Контакты и шоурум" },
];

const businessLinks = [
  { href: "/biznes#hotels", label: "Для отелей" },
  { href: "/biznes#opt", label: "Опт для магазинов" },
  { href: "/biznes#logo", label: "Полотенца с логотипом" },
  { href: "/biznes#certificate", label: "Подарочный сертификат" },
];

// Меню по бургеру: слева панель как у Zara Home — главные разделы, коллекции-города, каталог, назначение, бизнесу.
export function Menu({ open, onClose }: Props) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const focusable = panel.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [open, onClose]);

  return (
    <div className={s.root} data-open={open} aria-hidden={!open} inert={!open}>
      <button className={s.scrim} type="button" aria-label="Закрыть меню" tabIndex={-1} onClick={onClose} />
      <div ref={panel} className={s.panel} role="dialog" aria-modal="true" aria-label="Меню">
        <div className={s.head}>
          <button type="button" className={s.close} onClick={onClose} aria-label="Закрыть меню">
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 4l12 12M16 4L4 16" />
            </svg>
          </button>
        </div>

        <nav className={s.nav} aria-label="Разделы">
          <ul className={s.main}>
            {mainLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={onClose}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className={s.group}>Коллекции-города</p>
          <ul className={s.cities}>
            {collections.map((c, i) => (
              <li key={c.slug}>
                <Link href={`/kollekcii/${c.slug}`} onClick={onClose}>
                  <i style={{ background: c.tone }} aria-hidden="true" />
                  <span className={s.cityName}>{c.city}</span>
                  <span className={s.cityMeta}>
                    {String(i + 1).padStart(2, "0")} · {c.latin}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <p className={s.group}>Каталог</p>
          <ul className={s.links}>
            {categories.map((c) => (
              <li key={c.id}>
                <a href={`/catalog?kat=${c.id}`} data-filter-kat={c.id} onClick={onClose}>
                  {c.label}
                </a>
              </li>
            ))}
          </ul>

          <p className={s.group}>Что ищете</p>
          <ul className={s.links}>
            {purposeChips
              .filter((p) => p.id !== "oteli")
              .map((p) => (
                <li key={p.id}>
                  <a href={`/catalog?nazn=${p.id}`} data-filter-nazn={p.id} onClick={onClose}>
                    {p.label}
                  </a>
                </li>
              ))}
          </ul>

          <p className={s.group}>Бизнесу</p>
          <ul className={s.links}>
            {businessLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={onClose}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.foot}>
          <a href={contacts.phoneHref} className={s.phone}>
            {contacts.phone}
          </a>
          <span>{contacts.hours}</span>
        </div>
      </div>
    </div>
  );
}
