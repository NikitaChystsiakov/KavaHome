"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { collections, contacts } from "@/lib/collections";
import { categories, purposeChips } from "@/lib/catalog";
import s from "./menu.module.css";

type Props = { open: boolean; onClose: () => void };

// Меню по бургеру: слева панель как у Zara Home — коллекции-города, назначение, бизнесу, контакты.
export function Menu({ open, onClose }: Props) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
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
          <p className={s.group}>Коллекции</p>
          <ul className={s.cities}>
            {collections.map((c, i) => (
              <li key={c.slug}>
                <a href={`/catalog?kol=${c.slug}`} data-filter-kol={c.slug} onClick={onClose}>
                  <i style={{ background: c.tone }} aria-hidden="true" />
                  <span className={s.cityName}>{c.city}</span>
                  <span className={s.cityMeta}>
                    {String(i + 1).padStart(2, "0")} · {c.latin}
                  </span>
                </a>
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
            <li>
              <Link href="/biznes" onClick={onClose}>
                Для отелей и опт
              </Link>
            </li>
            <li>
              <Link href="/biznes#logo" onClick={onClose}>
                Полотенца с логотипом
              </Link>
            </li>
            <li>
              <Link href="/biznes#certificate" onClick={onClose}>
                Подарочный сертификат
              </Link>
            </li>
          </ul>

          <p className={s.group}>Покупателям</p>
          <ul className={s.links}>
            <li>
              <Link href="/o-nas" onClick={onClose}>
                О бренде
              </Link>
            </li>
            <li>
              <Link href="/dostavka" onClick={onClose}>
                Доставка и оплата
              </Link>
            </li>
            <li>
              <Link href="/faq" onClick={onClose}>
                Вопросы и ответы
              </Link>
            </li>
            <li>
              <Link href="/kontakty" onClick={onClose}>
                Контакты
              </Link>
            </li>
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
