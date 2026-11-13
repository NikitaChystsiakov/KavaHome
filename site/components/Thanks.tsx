"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { contacts } from "@/lib/collections";
import { Logo } from "./Logo";
import { Stamp } from "./Stamp";
import s from "./thanks.module.css";

// Открытка «Спасибо»: прилетает лицом, переворачивается к письму, на марку ставится штемпель с номером заказа.
// Всё на CSS-анимациях; при prefers-reduced-motion сразу виден оборот со штемпелем.
export function Thanks({ order: initial = "" }: { order?: string }) {
  const [run, setRun] = useState(0);
  // номер заказа приходит из корзины в адресе (?n=); страница статичная, поэтому читаем после гидрации
  const [order, setOrder] = useState(initial);
  useEffect(() => {
    const n = new URLSearchParams(window.location.search).get("n");
    if (n) {
      const raf = requestAnimationFrame(() => setOrder(n.slice(0, 12)));
      return () => cancelAnimationFrame(raf);
    }
  }, []);

  return (
    <main className={s.page}>
      <p className={`caps ${s.eyebrow}`}>{order ? `Заказ № ${order} принят` : "Заказ принят"}</p>

      <div className={s.stage} key={run}>
        <div className={s.card}>
          <div className={s.inner}>
            <div className={`${s.face} ${s.front}`}>
              <Logo className={s.frontLogo} />
              <span className={s.frontLine}>Минск · махровые полотенца</span>
            </div>
            <div className={`${s.face} ${s.back}`}>
              <span className={s.postage} aria-hidden="true">
                <Logo className={s.postageLogo} />
                <span>KAVA HOME</span>
              </span>
              <div className={s.letter}>
                <p className={s.hello}>Спасибо за заказ!</p>
                <p>
                  Мы уже собираем его. Менеджер позвонит в рабочее время, чтобы подтвердить размер, цвет и доставку.
                </p>
                <p className={s.sign}>KAVA HOME</p>
              </div>
              <div className={s.addr}>
                <span className={s.line}>Кому: вам</span>
                <span className={s.line}>{order ? `Заказ № ${order}` : "Заказ с сайта"}</span>
                <span className={s.line}>Минск, ул. Рафиева, 55</span>
              </div>
              <Stamp
                id="thanks"
                ring="СПАСИБО · GRAZIE · KAVA HOME · МИНСК ·"
                center={order || "★"}
                sub="ЗАКАЗ"
                className={s.postmark}
                ink
              />
            </div>
          </div>
        </div>
      </div>

      <div className={s.after} key={`a${run}`}>
        <p className={s.text}>
          Позвоним по телефону из заказа: {contacts.hours}. Вопросы — <a href={contacts.phoneHref}>{contacts.phone}</a>.
        </p>
        <div className={s.btns}>
          <Link href="/catalog" className={s.btn}>
            Вернуться в каталог
          </Link>
          <button type="button" className={s.replay} onClick={() => setRun(run + 1)}>
            ↻ Показать ещё раз
          </button>
        </div>
      </div>
    </main>
  );
}
