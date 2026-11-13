"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cart, cartCount, cartTotal, plural, useCart } from "@/lib/cart";
import { contacts } from "@/lib/collections";
import s from "./cart.module.css";

// Корзина и заявка на одной странице: слева товары, справа бумажная карточка оформления.
// Онлайн-оплаты нет: заказ уходит менеджеру (Telegram, копия в WooCommerce), он перезванивает и подтверждает; оплата ЕРИП.
export function CartPage() {
  const list = useCart();
  const router = useRouter();
  const [delivery, setDelivery] = useState<"delivery" | "pickup">("delivery");
  const [error, setError] = useState("");
  const [bad, setBad] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const n = cartCount(list);
  const total = cartTotal(list);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const wrong = [
      !data.name?.trim() && "name",
      (data.phone ?? "").replace(/\D/g, "").length < 9 && "phone",
      delivery === "delivery" && !data.city?.trim() && "city",
    ].filter(Boolean) as string[];
    setBad(wrong);
    if (wrong.length) {
      setError(wrong.includes("phone") ? "Проверьте телефон: нужен номер, по которому перезвонить." : "Заполните отмеченные поля.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          delivery,
          lines: list.map((x) => ({ model: x.model, color: x.color, size: x.size, qty: x.qty })),
        }),
      });
      const out = (await res.json()) as { ok: boolean; number?: string; error?: string };
      if (!out.ok) throw new Error(out.error);
      cart.clear();
      router.push(`/spasibo${out.number ? `?n=${encodeURIComponent(out.number)}` : ""}`);
    } catch (err) {
      setError(`${(err as Error).message || "Заказ не отправился."} Позвоните: ${contacts.phone}.`);
      setBusy(false);
    }
  };

  return (
    <div className={s.page}>
      <div className={s.head}>
        <h1 className={s.title}>Корзина</h1>
        {n > 0 && (
          <span className={s.muted}>
            {n} {plural(n, "товар", "товара", "товаров")} · {total} BYN
          </span>
        )}
      </div>

      {n === 0 ? (
        <div className={s.empty}>
          <p>В корзине пока пусто. Выберите полотенца в каталоге: цвет и размер — в карточке товара.</p>
          <Link href="/catalog" className={s.btnInk}>
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className={s.layout}>
          <ul className={s.list}>
            {list.map((x) => (
              <li key={x.key} className={s.row}>
                <Link href={x.href} className={s.rowPhoto} tabIndex={-1} aria-hidden="true">
                  <Image src={x.image} alt="" fill sizes="112px" style={{ objectFit: "cover", objectPosition: x.position ?? "50% 50%" }} />
                </Link>
                <div className={s.rowInfo}>
                  <Link href={x.href} className={s.rowName}>
                    {x.name}
                  </Link>
                  <span className={s.muted}>
                    {x.color} · {x.size}
                    {x.note && x.note !== x.size ? ` · ${x.note}` : ""}
                  </span>
                  <span className={s.muted}>{x.price} BYN за шт.</span>
                  <div className={s.rowTools}>
                    <span className={s.qty}>
                      <button type="button" aria-label="Меньше" onClick={() => cart.setQty(x.key, x.qty - 1)}>
                        −
                      </button>
                      <span aria-live="polite">{x.qty}</span>
                      <button type="button" aria-label="Больше" onClick={() => cart.setQty(x.key, x.qty + 1)}>
                        +
                      </button>
                    </span>
                    <button type="button" className={s.remove} onClick={() => cart.remove(x.key)}>
                      Удалить
                    </button>
                  </div>
                </div>
                <p className={s.rowPrice}>{x.price * x.qty} BYN</p>
              </li>
            ))}
          </ul>

          <aside className={s.checkout} aria-labelledby="checkout-title">
            <h2 id="checkout-title">Оформление</h2>
            <p className={s.lead}>Платить сейчас не нужно. Менеджер перезвонит, подтвердит заказ и доставку, оплата через ЕРИП.</p>
            <form className={s.form} onSubmit={submit} noValidate>
              <label className={s.field}>
                <span>Имя</span>
                <input name="name" autoComplete="name" aria-invalid={bad.includes("name")} />
              </label>
              <label className={s.field}>
                <span>Телефон</span>
                <input name="phone" type="tel" autoComplete="tel" placeholder="+375 (__) ___-__-__" aria-invalid={bad.includes("phone")} />
              </label>
              <fieldset className={s.ways}>
                <legend>Получение</legend>
                <label className={s.way}>
                  <input type="radio" name="way" checked={delivery === "delivery"} onChange={() => setDelivery("delivery")} />
                  <span>
                    Доставка по Беларуси
                    <small>Стоимость и срок менеджер назовёт при звонке</small>
                  </span>
                </label>
                <label className={s.way}>
                  <input type="radio" name="way" checked={delivery === "pickup"} onChange={() => setDelivery("pickup")} />
                  <span>
                    Самовывоз из шоурума
                    <small>{contacts.pickupShort}</small>
                  </span>
                </label>
              </fieldset>
              {delivery === "delivery" && (
                <>
                  <label className={s.field}>
                    <span>Город</span>
                    <input name="city" autoComplete="address-level2" aria-invalid={bad.includes("city")} />
                  </label>
                  <label className={s.field}>
                    <span>Адрес</span>
                    <input name="address" autoComplete="street-address" placeholder="Улица, дом, квартира" />
                  </label>
                </>
              )}
              <label className={s.field}>
                <span>Комментарий</span>
                <textarea name="comment" rows={2} placeholder="Удобное время звонка, подарочная упаковка…" />
              </label>

              <dl className={s.sum}>
                <div>
                  <dt>Товары, {n} шт.</dt>
                  <dd>{total} BYN</dd>
                </div>
                <div>
                  <dt>{delivery === "pickup" ? "Самовывоз" : "Доставка"}</dt>
                  <dd>{delivery === "pickup" ? "д. Волковичи" : "назовёт менеджер"}</dd>
                </div>
                <div className={s.total}>
                  <dt>Итого</dt>
                  <dd>{total} BYN</dd>
                </div>
              </dl>

              {error && (
                <p className={s.error} role="alert">
                  {error}
                </p>
              )}
              <button type="submit" className={s.btnInk} disabled={busy}>
                {busy ? "Отправляем…" : "Отправить заказ"}
              </button>
              <p className={s.fine}>
                Нажимая «Отправить заказ», вы соглашаетесь с <Link href="/privacy">обработкой персональных данных</Link>.
              </p>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}
