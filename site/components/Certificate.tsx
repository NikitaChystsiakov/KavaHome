"use client";

import Link from "next/link";
import { useState } from "react";
import { Honeypot } from "./Honeypot";
import { Stamp } from "./Stamp";
import s from "./home.module.css";

// Подарочный сертификат прямо на главной: заполняется как открытка (кому, от кого, номинал),
// заявка уходит менеджеру через /api/lead (тот же канал, что у «Для бизнеса»).
export function Certificate({ phoneHint }: { phoneHint: string }) {
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<
      string,
      string
    >;
    if (String(data.phone || "").replace(/\D/g, "").length < 9) {
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
          website: data.website,
          name: data.name,
          phone: data.phone,
          needs: ["Сертификаты"],
          comment: [
            `Кому: ${to || "—"}`,
            `От кого: ${from || "—"}`,
            `Номинал: ${amount ? `${amount} BYN` : "—"}`,
          ].join("; "),
        }),
      });
      if (!(await res.json()).ok) throw new Error();
      setSent(true);
    } catch {
      setError(`Заявка не отправилась. Позвоните, пожалуйста: ${phoneHint}.`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={s.cert} data-sent={sent || undefined}>
      <Stamp
        id="cert"
        ring="ПОДАРОК · REGALO · СЕРТИФИКАТ · KAVA HOME ·"
        center="★"
        sub="МИНСК"
        className={s.certStamp}
      />
      <p className={`caps ${s.certEyebrow}`}>Открытка-сертификат</p>
      <h3 className={s.certTitle}>Подарочный сертификат</h3>

      {sent ? (
        <p className={s.certDone} role="status">
          <b>Заявка у менеджера.</b> Позвоним в рабочее время, уточним детали и
          расскажем, как оплатить. Сертификат для{" "}
          <em>{to || "вашего получателя"}</em>.
        </p>
      ) : (
        <form className={s.certForm} onSubmit={submit}>
          <Honeypot />
          <div className={s.certLines}>
            <label>
              <span>Кому</span>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                maxLength={40}
                placeholder="маме"
                autoComplete="off"
              />
            </label>
            <label>
              <span>От кого</span>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                maxLength={40}
                placeholder="с любовью"
                autoComplete="off"
              />
            </label>
            <label>
              <span>Номинал, BYN</span>
              <input
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value.replace(/[^\d]/g, "").slice(0, 5))
                }
                inputMode="numeric"
                placeholder="100"
                autoComplete="off"
              />
            </label>
          </div>

          {open ? (
            <div className={s.certOrder}>
              <label className={s.certPhone}>
                <span className="caps">Телефон для связи</span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+375 (__) ___-__-__"
                  required
                  autoFocus
                  aria-invalid={!!error}
                />
              </label>
              <input name="name" type="hidden" value={from} readOnly />
              <button type="submit" className={s.btnInk} disabled={busy}>
                {busy ? "Отправляем…" : "Отправить заявку"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={s.btnInk}
              onClick={() => setOpen(true)}
            >
              Заказать сертификат
            </button>
          )}
          {error && (
            <p className={s.certError} role="alert">
              {error}
            </p>
          )}
          {open && (
            <p className={s.certNote}>
              Оплата по согласованию с менеджером. Отправляя заявку, вы
              соглашаетесь с{" "}
              <Link href="/privacy">обработкой персональных данных</Link>.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
