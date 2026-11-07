"use client";

import { useState } from "react";
import s from "./home.module.css";

const NEEDS = ["Отель", "Опт", "Логотип", "Сертификаты"];

// Заявка для бизнеса. В прототипе отправка имитируется; в рабочей версии уходит в Telegram менеджеру.
export function HotelForm({ phone, phoneHref, hours }: { phone: string; phoneHref: string; hours: string }) {
  const [needs, setNeeds] = useState<string[]>(["Отель"]);
  const [sent, setSent] = useState(false);
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
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const tel = String(data.get("phone") || "").replace(/\D/g, "");
        if (tel.length < 9) {
          setError("Проверьте телефон: нужен номер, по которому перезвонить.");
          return;
        }
        setError("");
        setSent(true);
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
        <button type="submit" className={s.btnLight}>
          Отправить заявку
        </button>
        <a href={phoneHref} className={s.formPhone}>
          или позвоните {phone}
        </a>
      </div>
    </form>
  );
}
