import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { MapBlock } from "@/components/MapBlock";
import { contacts } from "@/lib/collections";
import s from "@/components/info.module.css";

export const metadata: Metadata = {
  title: "Доставка и оплата — KAVA HOME",
  description: `Доставка полотенец KAVA HOME по всей Беларуси и самовывоз из шоурума: ${contacts.pickup}. Платить при оформлении не нужно: менеджер подтверждает заказ по телефону, оплата через ЕРИП.`,
};

// Со слов Эллы 2026-11-13: доставка по всей РБ, самовывоз/шоурум/склад в Волковичах.
// Оплата (Элла через Никиту, 2026-11-13): ЕРИП или произвольный платёж; онлайн-оплата — вторым этапом.
// Стоимость и сроки доставки пока не названы — их сообщает менеджер (обновить, когда пришлют).
const steps = [
  { title: "Выбираете", text: "Цвет и размер в карточке товара, добавляете в корзину." },
  { title: "Оформляете", text: "Имя, телефон и способ получения. Без оплаты на сайте и регистрации." },
  { title: "Подтверждаем", text: "Менеджер звонит в рабочее время: уточняет заказ, доставку и оплату." },
  { title: "Получаете", text: "Доставкой по Беларуси или самовывозом из шоурума." },
];

export default function DeliveryPage() {
  return (
    <Shell>
      <section className={s.section} style={{ paddingTop: "calc(var(--hdr) + clamp(40px, 7svh, 88px))" }} aria-labelledby="d-title">
        <p className={`caps ${s.kicker}`}>Покупателям</p>
        <h1 id="d-title" className={s.h1} style={{ marginBottom: "clamp(32px, 6svh, 64px)" }}>
          Доставка и оплата
        </h1>
        <ol className={s.steps}>
          {steps.map((x, i) => (
            <li key={x.title}>
              <b>{i + 1}</b>
              <span>{x.title}</span>
              <p>{x.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`${s.section} ${s.paper}`} aria-labelledby="ways-title">
        <div className={s.split}>
          <div className={s.stack}>
            <h2 id="ways-title" className={s.h2}>
              Как получить заказ
            </h2>
            <dl className={s.rows}>
              <div>
                <dt>Доставка</dt>
                <dd>По всей Беларуси. Стоимость и срок менеджер назовёт при подтверждении заказа.</dd>
              </div>
              <div>
                <dt>Самовывоз</dt>
                <dd>
                  Шоурум и склад: {contacts.pickup}. Время, когда удобно забрать заказ, согласуем по телефону.
                </dd>
              </div>
              <div>
                <dt>Оплата</dt>
                <dd>Через ЕРИП или произвольным платежом по реквизитам: менеджер пришлёт данные для оплаты после подтверждения заказа. Оплаты картой на сайте пока нет.</dd>
              </div>
              <div>
                <dt>Вопросы</dt>
                <dd>
                  <a href={contacts.phoneHref}>{contacts.phone}</a>, {contacts.hours}
                </dd>
              </div>
            </dl>
            <Link href="/catalog" className={s.btnInk} style={{ alignSelf: "start", marginTop: 8 }}>
              Выбрать полотенца
            </Link>
          </div>
          <MapBlock />
        </div>
      </section>
    </Shell>
  );
}
