import type { Metadata } from "next";
import { Shell } from "@/components/Shell";
import { PresentationScroll } from "@/components/PresentationScroll";
import { contacts } from "@/lib/collections";
import { SITE_URL } from "@/lib/site";
import s from "@/components/kontakty.module.css";

export const metadata: Metadata = {
  title: "Контакты KAVA HOME — телефон, шоурум и самовывоз под Минском",
  description: `Магазин полотенец KAVA HOME: ${contacts.phone} (${contacts.hours}). Шоурум и самовывоз: ${contacts.pickupShort}, Минский район. Доставка по Беларуси.`,
  alternates: { canonical: "/kontakty" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "KAVA HOME",
  description: "Магазин махровых и вафельных полотенец из 100% хлопка, наборы, халаты. Розница и опт.",
  url: SITE_URL,
  telephone: "+375291015858",
  email: contacts.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Брестское шоссе, 1",
    addressLocality: "д. Волковичи",
    addressRegion: "Минская область",
    addressCountry: "BY",
  },
  geo: { "@type": "GeoCoordinates", longitude: 27.401572, latitude: 53.81045 },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  areaServed: "BY",
};

export default function ContactsPage() {
  const q = encodeURIComponent(contacts.mapQuery);
  return (
    <Shell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <section className={s.screen} data-screen aria-labelledby="contacts-title">
        <div className={s.text}>
          <p className="caps">Контакты · KAVA HOME</p>
          <h1 id="contacts-title">
            Контакты магазина полотенец KAVA HOME
          </h1>
          <p className={s.lead}>
            Поможем выбрать полотенца из 100% хлопка, соберём заказ к самовывозу в шоуруме под Минском
            или обсудим поставку для бизнеса.
          </p>
          <a className={s.phone} href={contacts.phoneHref}>
            {contacts.phone}
          </a>
          <p className={s.hours}>{contacts.hours}</p>
          <dl className={s.facts}>
            <div>
              <dt>Шоурум и самовывоз</dt>
              <dd>
                {contacts.pickup}. Время приезда согласуйте по телефону.
              </dd>
            </div>
            <div>
              <dt>Почта</dt>
              <dd>
                <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
              </dd>
            </div>
            <div>
              <dt>Реквизиты</dt>
              <dd>{contacts.company}</dd>
            </div>
          </dl>
          <div className={s.btns}>
            <a className={s.btnInk} href={contacts.phoneHref}>
              Позвонить
            </a>
            <a className={s.btnLine} href="/dostavka">
              Доставка и оплата
            </a>
            <a className={s.btnLine} href="/biznes#zayavka">
              Для бизнеса
            </a>
          </div>
        </div>
        <div className={s.map}>
          <iframe
            src={`https://yandex.by/map-widget/v1/?ll=${contacts.mapPoint}&pt=${contacts.mapPoint},pm2dkm&z=14`}
            title={`Карта: ${contacts.pickup}`}
            allowFullScreen
          />
          <a href={`https://yandex.by/maps/?text=${q}`} target="_blank" rel="noopener noreferrer">
            Построить маршрут ↗
          </a>
        </div>
      </section>
      <PresentationScroll />
    </Shell>
  );
}
