"use client";

import { useState } from "react";
import s from "./home.module.css";

const NEEDS = ["Отель", "Опт", "Логотип", "Сертификаты"];

// Заявка для бизнеса: уходит менеджеру в Telegram (app/api/lead).
export function HotelForm({ phone, phoneHref, hours, initial = "Отель" }: { phone: string; phoneHref: string; hours: string; initial?: string }) {
  const [needs, setNeeds] = useState<string[]>([initial]);
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
      className={s.form}
      onSubmit={async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
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
            body: JSON.stringify({ ...data, needs }),
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
      <fieldset className={s.needs}>
        <legend className="caps">Что нужно</legend>
        {NEEDS.map((n) => {
          const on = needs.includes(n);
          return (
            <button
              key={n}
              type="button"
              aria-pressed={on}
              onClick={() => setNeeds(on ? needs.filter((x) => x !== n) : [...needs, n])}
            >
              {n}
            </button>
          );
        })}
      </fieldset>
      <label className={s.field}>
        <span className="caps">Имя</span>
        <input name="name" autoComplete="name" placeholder="Как к вам обращаться" />
      </label>
      <label className={s.field}>
        <span className="caps">Телефон</span>
        <input name="phone" type="tel" autoComplete="tel" placeholder="+375 (__) ___-__-__" required aria-invalid={!!error} />
      </label>
      {error && <p className={s.formError}>{error}</p>}
      <div className={s.formFoot}>
        <button type="submit" className={s.btnLight} disabled={busy}>
          {busy ? "Отправляем…" : "Отправить заявку"}
        </button>
        <a href={phoneHref} className={s.formPhone}>
          или позвоните {phone}
        </a>
      </div>
    </form>
  );
}
