"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Honeypot } from "./Honeypot";
import { Logo } from "./Logo";
import { Stamp } from "./Stamp";
import g from "./gifts.module.css";

const STEPS = [
  { title: "Заполните открытку", text: "Кому, от кого и сумма" },
  { title: "Мы позвоним", text: "Менеджер согласует оформление и оплату" },
  { title: "Дарите", text: "Получите сертификат и вручите" },
];
const QUICK = ["50", "100", "150", "200"];

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
          kind: "certificate",
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
        <Image
          src="/img/florence-beige.webp"
          alt=""
          fill
          sizes="(max-width: 760px) 100vw, 55vw"
          quality={70}
          className={g.bg}
          style={{ objectFit: "cover", objectPosition: "50% 78%" }}
        />
        <div className={g.veil} aria-hidden="true" />
        <div className={g.pack}>
          <div className={g.envelope} aria-hidden="true">
            <i className={g.flapL} />
            <i className={g.flapR} />
          </div>
          <div
            className={g.card}
            role="img"
            aria-label="Подарочный сертификат KAVA HOME"
          >
            <div className={g.cardTop}>
              <Logo className={g.cardLogo} />
              <div className={g.postage}>
                <span className={g.photoStamp}>
                  <Image
                    src="/img/florence-beige.webp"
                    alt=""
                    fill
                    sizes="160px"
                    quality={60}
                    style={{ objectFit: "cover", objectPosition: "50% 78%" }}
                  />
                  <b>KAVA</b>
                </span>
                <Stamp
                  id="cert"
                  ring="ПОДАРОК · REGALO · СЕРТИФИКАТ · KAVA HOME ·"
                  center="★"
                  sub="МИНСК"
                  className={g.stamp}
                />
              </div>
            </div>
            <p className={g.kicker}>
              <span>Подарочный сертификат</span>
              <i aria-hidden="true" />
              <span>Минск</span>
            </p>
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
          <span className={g.seal} aria-hidden="true">
            K
          </span>
        </div>
      </div>

      <div className={g.side}>
        <p className={`caps ${g.eyebrow}`}>Подарочный сертификат</p>
        <h2 id="gifts-title" className={g.title}>
          Подарить
          <span className="visually-hidden"> подарочный сертификат на полотенца</span>
        </h2>
        <p className={g.lead}>
          Не знаете цвет или размер — подарите сертификат: получатель сам
          выберет полотенца. Срок действия и условия уточнит менеджер.
        </p>
        <ol className={g.steps}>
          {STEPS.map((x) => (
            <li key={x.title}>
              <b>{x.title}</b>
              <span>{x.text}</span>
            </li>
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
            <p className={`caps ${g.formTitle}`}>Заполните открытку — она слева</p>
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
            <span className={g.quick}>
                <em>Сумма:</em>
                {QUICK.map((q) => (
                  <button
                    key={q}
                    type="button"
                    data-on={amount === q || undefined}
                    onClick={() => setAmount(q)}
                  >
                    {q}
                  </button>
                ))}
              </span>

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
