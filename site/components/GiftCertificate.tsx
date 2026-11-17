"use client";

import Link from "next/link";
import { useState } from "react";
import { Honeypot } from "./Honeypot";
import { Logo } from "./Logo";
import { Stamp } from "./Stamp";
import g from "./gifts.module.css";

const STEPS = [
  "Укажите, кому и от кого, и сумму",
  "Менеджер перезвонит и согласует оформление и оплату",
  "Получите сертификат и подарите",
];

// Подарить = подарочный сертификат (2026-11-17). Слева открытка, которая заполняется вместе с формой,
// справа шаги и форма. Заявка уходит менеджеру в Telegram через /api/lead, как у «Для бизнеса».
export function GiftCertificate({
  phone,
  phoneHref,
}: {
  phone: string;
  phoneHref: string;
}) {
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [amount, setAmount] = useState("");
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
          name: from,
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
      setError(`Заявка не отправилась. Позвоните, пожалуйста: ${phone}.`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      id="gifts"
      className={g.section}
      aria-labelledby="gifts-title"
      data-screen
    >
      <div className={g.stage}>
        <div className={g.back} aria-hidden="true" />
        <div className={g.card} role="img" aria-label="Подарочный сертификат KAVA HOME">
          <div className={g.cardTop}>
            <Logo className={g.cardLogo} />
            <Stamp
              id="cert"
              ring="ПОДАРОК · REGALO · СЕРТИФИКАТ · KAVA HOME ·"
              center="★"
              sub="МИНСК"
              className={g.stamp}
            />
          </div>
          <p className={g.kicker}>Подарочный сертификат</p>
          <p className={g.amount} data-empty={!amount || undefined}>
            {amount || "100"}
            <small>BYN</small>
          </p>
          <div className={g.lines}>
            <span data-empty={!to || undefined}>
              Кому <em>{to || "маме"}</em>
            </span>
            <span data-empty={!from || undefined}>
              От кого <em>{from || "с любовью"}</em>
            </span>
          </div>
        </div>
      </div>

      <div className={g.side}>
        <p className={`caps ${g.eyebrow}`}>Подарочный сертификат</p>
        <h2 id="gifts-title" className={g.title}>
          Подарить
        </h2>
        <p className={g.lead}>
          Не знаете цвет или размер — подарите сертификат: получатель сам
          выберет полотенца. Срок действия и условия уточнит менеджер.
        </p>
        <ol className={g.steps}>
          {STEPS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>

        {sent ? (
          <p className={g.done} role="status">
            <b>Заявка у менеджера.</b> Перезвоним в рабочее время, уточним
            детали и расскажем, как оплатить.
          </p>
        ) : (
          <form className={g.form} onSubmit={submit}>
            <Honeypot />
            <label className={g.field}>
              <span className="caps">Кому</span>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                maxLength={30}
                placeholder="маме"
                autoComplete="off"
              />
            </label>
            <label className={g.field}>
              <span className="caps">От кого</span>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                maxLength={30}
                placeholder="с любовью"
                autoComplete="off"
              />
            </label>
            <label className={g.field}>
              <span className="caps">Номинал, BYN</span>
              <input
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value.replace(/\D/g, "").slice(0, 5))
                }
                inputMode="numeric"
                placeholder="100"
                autoComplete="off"
              />
            </label>
            <label className={g.field}>
              <span className="caps">Телефон для связи</span>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+375 (__) ___-__-__"
                required
                aria-invalid={!!error}
              />
            </label>
            {error && (
              <p className={g.error} role="alert">
                {error}
              </p>
            )}
            <div className={g.foot}>
              <button type="submit" className={g.btn} disabled={busy}>
                {busy ? "Отправляем…" : "Заказать сертификат"}
              </button>
              <a href={phoneHref} className={g.phone}>
                или позвоните {phone}
              </a>
            </div>
            <p className={g.note}>
              Оплата по согласованию с менеджером. Отправляя заявку, вы
              соглашаетесь с{" "}
              <Link href="/privacy">обработкой персональных данных</Link>.
              Сертификаты для компаний —{" "}
              <Link href="/biznes#certificate">на странице для бизнеса</Link>.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
