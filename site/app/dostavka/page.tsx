import type { Metadata } from "next";
import { Shell } from "@/components/Shell";
import { contacts } from "@/lib/collections";
import s from "@/components/editorial.module.css";
export const metadata: Metadata = {
  title: "Доставка и оплата — KAVA HOME",
  description:
    "Доставка по Беларуси, самовывоз из Волковичей. Оплата через ЕРИП или по реквизитам после подтверждения заказа.",
};
export default function DeliveryPage() {
  const q = encodeURIComponent(contacts.mapQuery);
  return (
    <Shell>
      <section className={s.dlv} aria-label="Доставка и оплата">
        <div className={s.dlvText}>
          <p className="caps">Доставка и оплата</p>
          <h1>
            Доставка по Беларуси
            <br />
            и самовывоз
          </h1>
          <p className={s.dlvLead}>
            Заказ оформляется без оплаты: менеджер позвонит, уточнит детали и
            согласует стоимость доставки до того, как вы заплатите.
          </p>
          <dl className={s.facts}>
            <div>
              <dt>Доставка</dt>
              <dd>Срок и стоимость зависят от заказа — сообщим до оплаты.</dd>
            </div>
            <div>
              <dt>Самовывоз</dt>
              <dd>{contacts.pickup}. Время приезда согласуйте по телефону.</dd>
            </div>
            <div>
              <dt>Оплата</dt>
              <dd>
                ЕРИП или произвольный платёж по реквизитам — пришлём после
                подтверждения заказа.
              </dd>
            </div>
            <div>
              <dt>Вопросы</dt>
              <dd>
                <a href={contacts.phoneHref}>{contacts.phone}</a> ·{" "}
                {contacts.hours}
              </dd>
            </div>
          </dl>
        </div>
        <div className={s.dlvMap}>
          <iframe
            src={`https://yandex.by/map-widget/v1/?ll=${contacts.mapPoint}&pt=${contacts.mapPoint},pm2dkm&z=14`}
            title={`Карта: ${contacts.pickup}`}
            allowFullScreen
          />
          <a
            href={`https://yandex.by/maps/?text=${q}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Построить маршрут ↗
          </a>
        </div>
      </section>
    </Shell>
  );
}
