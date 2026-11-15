import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { MapBlock } from "@/components/MapBlock";
import { contacts } from "@/lib/collections";
import s from "@/components/editorial.module.css";
export const metadata: Metadata = {
  title: "Доставка и оплата — KAVA HOME",
  description:
    "Доставка по Беларуси, самовывоз из Волковичей. Оплата через ЕРИП или по реквизитам после подтверждения заказа.",
};
export default function DeliveryPage() {
  return (
    <Shell>
      <header className={s.infoTop}>
        <p className="caps">Покупателям</p>
        <h1>
          Из нашего шоурума —<br />к вам домой
        </h1>
        <p>
          Доставляем по Беларуси. Заказ оформляется без оплаты: сначала менеджер
          уточнит детали и согласует всё с вами.
        </p>
      </header>
      <section className={s.deliveryGrid} aria-label="Доставка и оплата">
        <div>
          <h2>Как получить и оплатить</h2>
          <dl className={s.facts}>
            <div>
              <dt>Доставка</dt>
              <dd>
                По всей Беларуси. Стоимость и срок зависят от заказа — менеджер
                сообщит их до оплаты.
              </dd>
            </div>
            <div>
              <dt>Самовывоз</dt>
              <dd>
                {contacts.pickup}. Пожалуйста, согласуйте время приезда по
                телефону.
              </dd>
            </div>
            <div>
              <dt>Оплата</dt>
              <dd>
                Через ЕРИП или произвольным платежом по реквизитам. Данные для
                оплаты пришлём после подтверждения заказа.
              </dd>
            </div>
            <div>
              <dt>Есть вопрос?</dt>
              <dd>
                <a href={contacts.phoneHref}>{contacts.phone}</a>
                <br />
                {contacts.hours}
              </dd>
            </div>
          </dl>
        </div>
        <MapBlock />
      </section>
      <section className={`${s.section} ${s.paper}`}>
        <div className={s.sectionHead}>
          <p className="caps">Без регистрации</p>
          <h2>Три простых шага</h2>
          <p>Цвет, размер и способ получения подтвердим с вами по телефону.</p>
        </div>
        <ol className={s.steps}>
          <li>
            <span>01</span>
            <h3>Выберите</h3>
            <p>Добавьте нужный цвет и размер в корзину.</p>
          </li>
          <li>
            <span>02</span>
            <h3>Оставьте телефон</h3>
            <p>Менеджер уточнит заказ, стоимость доставки и оплату.</p>
          </li>
          <li>
            <span>03</span>
            <h3>Получите заказ</h3>
            <p>Доставкой или самовывозом в согласованное время.</p>
          </li>
        </ol>
        <Link href="/catalog" className={s.textLink}>
          Перейти к полотенцам ↗
        </Link>
      </section>
    </Shell>
  );
}
