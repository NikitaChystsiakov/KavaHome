"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cart, cartCount, cartTotal, plural, useCart, type CartItem } from "@/lib/cart";
import s from "./cart.module.css";

// Панель «Добавлено в корзину» под шапкой, как у Zara Home: товар, итог и два действия. Сама прячется через 6 с.
export function CartAdded() {
  const list = useCart();
  const [item, setItem] = useState<CartItem | null>(null);

  useEffect(() => {
    let t = 0;
    const on = (e: Event) => {
      const key = (e as CustomEvent<string>).detail;
      setItem(cart.get().find((x) => x.key === key) ?? null);
      window.clearTimeout(t);
      t = window.setTimeout(() => setItem(null), 6000);
    };
    window.addEventListener("kava:added", on);
    return () => {
      window.removeEventListener("kava:added", on);
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setItem(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [item]);

  const n = cartCount(list);
  return (
    <div className={s.added} data-open={!!item} role="status" aria-live="polite">
      {item && (
        <>
          <div className={s.addedHead}>
            <span className="caps">Добавлено в корзину</span>
            <button type="button" onClick={() => setItem(null)} aria-label="Закрыть">
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
          </div>
          <div className={s.addedItem}>
            <span className={s.addedPhoto}>
              <Image src={item.image} alt="" fill sizes="80px" style={{ objectFit: "cover", objectPosition: item.position ?? "50% 50%" }} />
            </span>
            <span>
              <b>{item.name}</b>
              <span className={s.muted}>
                {item.color} · {item.size}
              </span>
              <span>{item.price} BYN</span>
            </span>
          </div>
          <p className={s.addedSum}>
            В корзине {n} {plural(n, "товар", "товара", "товаров")} на {cartTotal(list)} BYN
          </p>
          <div className={s.addedBtns}>
            <Link href="/korzina" className={s.btnInk} onClick={() => setItem(null)}>
              Оформить заказ
            </Link>
            <button type="button" className={s.btnLine} onClick={() => setItem(null)}>
              Продолжить покупки
            </button>
          </div>
        </>
      )}
    </div>
  );
}
