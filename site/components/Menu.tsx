"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { collections, contacts, purposes } from "@/lib/collections";
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
                <a href={`/#${c.slug}`} onClick={onClose}>
                  <i style={{ background: c.tone }} aria-hidden="true" />
                  <span className={s.cityName}>{c.city}</span>
                  <span className={s.cityMeta}>
                    {String(i + 1).padStart(2, "0")} · {c.latin}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p className={s.group}>Что ищете</p>
          <ul className={s.links}>
            {purposes
              .filter((p) => p.label !== "Для отелей")
              .map((p) => (
                <li key={p.label}>
                  <a href={p.href} onClick={onClose}>
                    {p.label}
                  </a>
                </li>
              ))}
          </ul>

          <p className={s.group}>Бизнесу</p>
          <ul className={s.links}>
            <li>
              <Link href="/#hotels" onClick={onClose}>
                Для отелей и опт
              </Link>
            </li>
            <li>
              <Link href="/#hotels" onClick={onClose}>
                Полотенца с логотипом
              </Link>
            </li>
            <li>
              <a href="/certificate" onClick={onClose}>
                Подарочный сертификат
              </a>
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
