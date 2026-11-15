import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { MapBlock } from "@/components/MapBlock";
import { contacts } from "@/lib/collections";
import s from "@/components/editorial.module.css";
export const metadata: Metadata = {
  title: "Контакты и шоурум — KAVA HOME",
  description: `Телефон ${contacts.phone}. Шоурум и самовывоз: ${contacts.pickup}.`,
};
export default function ContactsPage() {
  return (
    <Shell>
      <header className={s.infoTop}>
        <p className="caps">Будем на связи</p>
        <h1>
          Звоните, пишите.
          <br />И приезжайте знакомиться.
        </h1>
        <p>
          Поможем выбрать полотенца для дома, подготовим заказ к самовывозу или
          обсудим поставку для вашего бизнеса.
        </p>
      </header>
      <section className={s.deliveryGrid} aria-label="Контактная информация">
        <div>
          <h2>Как нас найти</h2>
          <dl className={s.facts}>
            <div>
              <dt>Телефон</dt>
              <dd>
                <a href={contacts.phoneHref}>{contacts.phone}</a>
                <br />
                {contacts.hours}
              </dd>
            </div>
            <div>
              <dt>Почта</dt>
              <dd>
                <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
              </dd>
            </div>
            <div>
              <dt>Шоурум и склад</dt>
              <dd>
                {contacts.pickup}.<br />
                Перед поездкой согласуйте время посещения по телефону.
              </dd>
            </div>
            <div>
              <dt>Реквизиты</dt>
              <dd>
                {contacts.company}
                <br />
                Адрес компании отличается от адреса самовывоза.
              </dd>
            </div>
          </dl>
          <div className={s.jumpNav}>
            <Link href="/dostavka">Доставка и оплата ↗</Link>
            <Link href="/biznes#zayavka">Заявка для бизнеса ↗</Link>
          </div>
        </div>
        <MapBlock />
      </section>
    </Shell>
  );
}
