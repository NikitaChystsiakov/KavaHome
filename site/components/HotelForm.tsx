"use client";

import Link from "next/link";
import { Honeypot } from "./Honeypot";
import { useEffect, useState } from "react";
import s from "./home.module.css";

const NEEDS = ["Отель", "Опт", "Логотип", "Сертификаты"];

// Заявка для бизнеса: уходит менеджеру в Telegram (app/api/lead).
export function HotelForm({
  phone,
  phoneHref,
  hours,
  initial = "Отель",
  detailed = false,
  compact = false,
  moreHref,
}: {
  phone: string;
  phoneHref: string;
  hours: string;
  initial?: string;
  detailed?: boolean;
  compact?: boolean;
  moreHref?: string;
}) {
  const [needs, setNeeds] = useState<string[]>([initial]);
  const [item, setItem] = useState("");
  useEffect(() => {
    if (!detailed) return;
    const q = new URLSearchParams(window.location.search);
    const need = q.get("need");
    const raf = requestAnimationFrame(() => {
      if (need && NEEDS.includes(need)) setNeeds([need]);
      if (q.get("item")) {
        setItem(q.get("item")!.slice(0, 300));
        setNeeds([]);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [detailed]);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (sent) {
    return (
      <div className={s.formDone} role="status">
        <b>Заявка у менеджера.</b> Перезвоним в рабочее время: {hours}.
      </div>
    );
  }

  return (
    <form
      className={compact ? s.hotelsForm : s.form}
      onSubmit={async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(
          new FormData(e.currentTarget),
        ) as Record<string, string>;
        const tel = String(data.phone || "").replace(/\D/g, "");
        if (tel.length < 9) {
          setError("Проверьте телефон: нужен номер, по которому перезвонить.");
          return;
        }
        setError("");
        setBusy(true);
        try {
          const res = await fetch("/api/lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...data,
              needs: compact ? [] : needs,
              comment: compact ? "С главной, раздел «Для отелей и бизнеса»" : [item, data.comment].filter(Boolean).join(" — "),
            }),
          });
          if (!(await res.json()).ok) throw new Error();
          setSent(true);
        } catch {
          setError(`Заявка не отправилась. Позвоните, пожалуйста: ${phone}.`);
        } finally {
          setBusy(false);
        }
      }}
    >
      <Honeypot />
      {compact ? (
        <>
          <div className={s.hotelsRow}>
            <label className={s.field}>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                aria-label="Телефон"
                placeholder="Ваш телефон: +375 (__) ___-__-__"
                required
                aria-invalid={!!error}
              />
            </label>
            <button type="submit" className={s.btnLight} disabled={busy}>
              {busy ? "Отправляем…" : "Получить предложение"}
            </button>
          </div>
          {error && (
            <p className={s.formError} role="alert">
              {error}
            </p>
          )}
          <div className={s.hotelsRow}>
            {moreHref && (
              <Link href={moreHref} className={s.btnLine}>
                Подробнее для бизнеса
              </Link>
            )}
          </div>
          <p className={s.formNote}>
            Перезвоним в рабочее время: {hours}. Отправляя номер, вы соглашаетесь
            с{" "}
            <Link href="/privacy" style={{ textDecoration: "underline" }}>
              обработкой персональных данных
            </Link>
            .
          </p>
        </>
      ) : (
      <>
      {item && (
        <p>
          Уточнить цену: <strong>{item}</strong>
        </p>
      )}
      <fieldset className={s.needs}>
        <legend className="caps">Что нужно</legend>
        {NEEDS.map((n) => {
          const on = needs.includes(n);
          return (
            <button
              key={n}
              type="button"
              aria-pressed={on}
              onClick={() =>
                setNeeds(on ? needs.filter((x) => x !== n) : [...needs, n])
              }
            >
              {n}
            </button>
          );
        })}
      </fieldset>
      <label className={s.field}>
        <span className="caps">Имя</span>
        <input
          name="name"
          autoComplete="name"
          placeholder="Как к вам обращаться"
        />
      </label>
      <label className={s.field}>
        <span className="caps">Телефон</span>
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+375 (__) ___-__-__"
          required
          aria-invalid={!!error}
        />
      </label>
      {detailed && (
        <>
          <label className={s.field}>
            <span className="caps">Компания · необязательно</span>
            <input
              name="company"
              autoComplete="organization"
              placeholder="Название отеля или магазина"
            />
          </label>
          <label className={s.field}>
            <span className="caps">Ваша задача · необязательно</span>
            <textarea
              name="comment"
              rows={3}
              placeholder="Количество, размеры, желаемые сроки"
            />
          </label>
        </>
      )}
      {error && (
        <p className={s.formError} role="alert">
          {error}
        </p>
      )}
      <div className={s.formFoot}>
        <button type="submit" className={s.btnLight} disabled={busy}>
          {busy ? "Отправляем…" : "Отправить заявку"}
        </button>
        <a href={phoneHref} className={s.formPhone}>
          или позвоните {phone}
        </a>
      </div>
      <p style={{ fontSize: 12, color: "var(--ink-2)", gridColumn: "1 / -1" }}>
        Отправляя заявку, вы соглашаетесь с{" "}
        <Link href="/privacy" style={{ textDecoration: "underline" }}>
          обработкой персональных данных
        </Link>
        .
      </p>
      </>
      )}
    </form>
  );
}
