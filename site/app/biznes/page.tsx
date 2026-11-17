import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Partners } from "@/components/Partners";
import { HotelForm } from "@/components/HotelForm";
import { contacts } from "@/lib/collections";
import s from "@/components/editorial.module.css";
export const metadata: Metadata = {
  title: "Для отелей и бизнеса — KAVA HOME",
  description:
    "Текстиль для отелей и спа, оптовые поставки, вышивка и жаккард с логотипом. Обсудите задачу с KAVA HOME.",
};
const offers = [
  {
    id: "hotels",
    num: "01",
    title: "Для отелей и спа",
    text: "Махровые полотенца, халаты и коврики для номеров, спа и бассейнов: белые и цветные, плотностью 450–500 г/м². Подберём модели, размеры и количество под ваш отель.",
    action: "Подобрать для отеля",
    need: "Отель",
    href: "/catalog?nazn=oteli",
    more: "Смотреть в каталоге",
  },
  {
    id: "opt",
    num: "02",
    title: "Оптовые поставки",
    text: "Для магазинов и компаний. Условия обсуждаем индивидуально: расскажите об ассортименте и объёме, а мы подготовим предложение.",
    action: "Обсудить опт",
    need: "Опт",
    href: "/catalog",
    more: "Весь ассортимент",
  },
  {
    id: "logo",
    num: "03",
    title: "Ваш логотип на текстиле",
    text: "Вышивка или жаккард с символикой отеля, клуба или компании. Способ нанесения, тираж и сроки согласуем под вашу задачу.",
    action: "Обсудить нанесение",
    need: "Логотип",
  },
  {
    id: "certificate",
    num: "04",
    title: "Подарочные сертификаты",
    text: "Когда хочется оставить выбор получателю. Уточните у менеджера варианты оформления и условия заказа сертификатов для сотрудников и клиентов.",
    action: "Узнать о сертификате",
    need: "Сертификаты",
  },
];
export default function BusinessPage() {
  return (
    <Shell>
      <section className={s.hero}>
        <div className={s.heroText}>
          <p className="caps">KAVA HOME · Для бизнеса</p>
          <h1>
            Забота о гостях
            <br />
            начинается с деталей
          </h1>
          <p className={s.lead}>
            Текстиль для отелей, санаториев и фитнес-клубов. Оптовые поставки и
            полотенца с вашим логотипом.
          </p>
          <a className={s.textLink} href="#zayavka">
            Обсудить вашу задачу ↗
          </a>
          <div className={s.heroFoot}>
            <a href={contacts.phoneHref}>{contacts.phone}</a>
            <span>Индивидуальные условия</span>
          </div>
        </div>
        <figure className={s.heroImage}>
          <Image
            src="/img/hotel-main.webp"
            alt="Белые махровые полотенца отельной линии"
            fill
            preload
            sizes="(max-width: 900px) 100vw, 50vw"
            quality={85}
          />
          <figcaption>Для номеров, спа и ежедневной заботы</figcaption>
        </figure>
      </section>
      <nav className={s.jumpNav} aria-label="Направления бизнеса">
        {offers.map((o) => (
          <a href={`#${o.id}`} key={o.id}>
            {o.title} ↓
          </a>
        ))}
      </nav>
      <section
        className={`${s.section} ${s.paper}`}
        aria-label="Что мы предлагаем"
      >
        {offers.map((o) => (
          <article className={s.service} id={o.id} key={o.id}>
            <span>{o.num}</span>
            <h2>{o.title}</h2>
            <div>
              <p>{o.text}</p>
              <a
                className={s.textLink}
                href={`/biznes?need=${encodeURIComponent(o.need)}#zayavka`}
              >
                {o.action} ↗
              </a>
              {o.href && (
                <div className={s.serviceLinks}>
                  <Link href={o.href}>{o.more}</Link>
                </div>
              )}
            </div>
          </article>
        ))}
      </section>
      <Partners title="С нами работают" photo={false} />
      <section className={s.formSection} id="zayavka">
        <div>
          <p className="caps">Начнём с разговора</p>
          <h2>Какая у вас задача?</h2>
          <p>
            Можно оставить только телефон. Если уже знаете количество, размеры
            или сроки — расскажите об этом, чтобы мы подготовились к разговору.
          </p>
        </div>
        <div>
          <HotelForm
            phone={contacts.phone}
            phoneHref={contacts.phoneHref}
            hours={contacts.hours}
            detailed
          />
        </div>
      </section>
    </Shell>
  );
}
