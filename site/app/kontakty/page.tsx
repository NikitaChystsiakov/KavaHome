import type { Metadata } from "next";
import { Shell } from "@/components/Shell";
import { MapBlock } from "@/components/MapBlock";
import { contacts } from "@/lib/collections";
import s from "@/components/info.module.css";

export const metadata: Metadata = {
  title: "Контакты — KAVA HOME",
  description: `Телефон ${contacts.phone}, ${contacts.email}. Шоурум и склад: ${contacts.pickup}. ${contacts.hours}.`,
};

export default function ContactsPage() {
  return (
    <Shell>
      <section className={s.section} style={{ paddingTop: "calc(var(--hdr) + clamp(40px, 7svh, 88px))" }} aria-labelledby="c-title">
        <div className={s.split}>
          <div className={s.stack}>
            <p className={`caps ${s.kicker}`} style={{ marginBottom: 0 }}>
              Контакты
            </p>
            <h1 id="c-title" className={s.h1}>
              Звоните, пишите, приезжайте
            </h1>
            <p className={s.lead}>Розница, опт и заказы для отелей — по одному номеру.</p>
            <dl className={s.rows}>
              <div>
                <dt>Телефон</dt>
                <dd>
                  <a href={contacts.phoneHref} className={s.phone}>
                    {contacts.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Почта</dt>
                <dd>
                  <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
                </dd>
              </div>
              <div>
                <dt>Часы работы</dt>
                <dd>{contacts.hours}</dd>
              </div>
              <div>
                <dt>Шоурум и склад</dt>
                <dd>{contacts.pickup}. Самовывоз заказов.</dd>
              </div>
              <div>
                <dt>Реквизиты</dt>
                <dd>{contacts.company}</dd>
              </div>
            </dl>
          </div>
          <MapBlock />
        </div>
      </section>
    </Shell>
  );
}
