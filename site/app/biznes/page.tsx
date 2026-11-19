import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Trust } from "@/components/Partners";
import { HotelForm } from "@/components/HotelForm";
import { PresentationScroll } from "@/components/PresentationScroll";
import { contacts } from "@/lib/collections";
import s from "@/components/biznes.module.css";

export const metadata: Metadata = {
  title: "Полотенца и текстиль для отелей, спа и опт — KAVA HOME",
  description:
    "Полотенца, халаты и коврики для отелей, санаториев и фитнес-клубов, опт для магазинов, вышивка и жаккард с логотипом. Предложение за рабочий день.",
};

const facts = [
  { big: "450–750", small: "г/м² — плотная махра для номеров и спа" },
  { big: "3+ года", small: "поставок в крупные торговые сети Беларуси" },
  { big: "Без минимума", small: "партии: условия обсуждаем под ваш объём" },
  { big: "Ваш логотип", small: "вышивка или жаккард на любой модели" },
];

const offers = [
  {
    id: "hotels",
    num: "01",
    title: "Текстиль для отелей и спа",
    text: "Махровые полотенца, халаты и коврики для номеров, бассейнов и спа-зон. Белые и цветные, 450–750 г/м²: держат форму и цвет после частых стирок.",
    action: "Подобрать для отеля",
    need: "Отель",
    photo: "/img/use-hotel.webp",
    alt: "Стопка белых махровых полотенец в номере отеля",
    pos: "50% 60%",
    href: "/catalog/polotenca-dlya-otelej",
    more: "Смотреть в каталоге",
  },
  {
    id: "opt",
    num: "02",
    title: "Полотенца оптом для магазинов",
    text: "Поставки для магазинов, салонов и компаний: 25 коллекций, десятки цветов, наборы по 3 штуки. Цены и условия опта менеджер присылает под ваш ассортимент и объём.",
    action: "Запросить оптовые цены",
    need: "Опт",
    photo: "/img/naples-stack.webp",
    alt: "Сложенные махровые полотенца разных цветов",
    pos: "50% 40%",
    href: "/catalog",
    more: "Весь ассортимент",
  },
  {
    id: "logo",
    num: "03",
    title: "Полотенца с вашим логотипом",
    text: "Вышивка или жаккардовое тканьё с символикой отеля, клуба или компании. Способ нанесения, тираж и сроки согласуем заранее, до запуска в работу.",
    action: "Обсудить нанесение",
    need: "Логотип",
    photo: "/img/jacquard-logo.webp",
    alt: "Белое махровое полотенце с жаккардовым логотипом отеля",
    pos: "50% 30%",
  },
  {
    id: "certificate",
    num: "04",
    title: "Подарочные сертификаты",
    text: "Корпоративный подарок сотрудникам и клиентам, когда выбор лучше оставить получателю. Менеджер расскажет про оформление и условия заказа.",
    action: "Узнать о сертификате",
    need: "Сертификаты",
    photo: "/img/florence-beige.webp",
    alt: "Подарочный набор полотенец",
    pos: "50% 50%",
  },
];

const steps = [
  {
    t: "Оставляете заявку",
    d: "Достаточно телефона. Если знаете количество, размеры или сроки, напишите: мы подготовимся к разговору.",
  },
  {
    t: "Менеджер перезванивает",
    d: `В рабочее время (${contacts.hours}) уточнит задачу и ответит на вопросы.`,
  },
  {
    t: "Получаете предложение",
    d: "Подбор моделей, цены и условия поставки: по почте или в мессенджере.",
  },
];

export default function BusinessPage() {
  return (
    <Shell>
      <section className={s.hero} data-screen aria-labelledby="biz-title">
        <div className={s.heroMain}>
          <div className={s.heroText}>
            <p className={`caps ${s.kicker}`}>KAVA HOME · Для бизнеса</p>
            <h1 id="biz-title">
              Текстиль для отелей, спа&nbsp;и&nbsp;магазинов
            </h1>
            <p className={s.lead}>
              Полотенца, халаты и коврики для номеров и бассейнов, оптовые
              поставки и вышивка с логотипом. Менеджер подберёт модели и
              пришлёт предложение в течение рабочего дня.
            </p>
            <div className={s.heroCta}>
              <a className={s.btn} href="#zayavka">
                Получить предложение
              </a>
              <a className={s.btnLine} href={contacts.phoneHref}>
                {contacts.phone}
              </a>
            </div>
          </div>
          <div className={s.mosaic} aria-hidden="false">
            <figure className={s.mosaicBig}>
              <Image
                src="/img/hotel-main.webp"
                alt="Белые махровые полотенца отельной линии"
                fill
                preload
                sizes="(max-width: 900px) 100vw, 30vw"
                quality={80}
                style={{ objectFit: "cover", objectPosition: "50% 70%" }}
              />
            </figure>
            <figure>
              <Image
                src="/img/use-robe.webp"
                alt="Белый махровый халат"
                fill
                sizes="(max-width: 900px) 50vw, 15vw"
                quality={75}
                style={{ objectFit: "cover", objectPosition: "50% 35%" }}
              />
            </figure>
            <figure>
              <Image
                src="/img/use-bath.webp"
                alt="Полотенца с жаккардовой каймой у ванны"
                fill
                sizes="(max-width: 900px) 50vw, 15vw"
                quality={75}
                style={{ objectFit: "cover", objectPosition: "50% 60%" }}
              />
            </figure>
          </div>
        </div>
        <dl className={s.facts}>
          {facts.map((f) => (
            <div key={f.big}>
              <dt>{f.big}</dt>
              <dd>{f.small}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        className={s.offers}
        aria-labelledby="offers-title"
        data-screen
      >
        <header className={s.offersHead}>
          <p className={`caps ${s.kicker}`}>Что мы предлагаем</p>
          <h2 id="offers-title">Чем мы можем быть полезны вашему бизнесу</h2>
        </header>
        <div className={s.offerGrid}>
          {offers.map((o) => (
            <article className={s.offer} id={o.id} key={o.id}>
              <div className={s.offerPhoto}>
                <Image
                  src={o.photo}
                  alt={o.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 25vw"
                  quality={75}
                  style={{ objectFit: "cover", objectPosition: o.pos }}
                />
                <span className={s.num}>{o.num}</span>
              </div>
              <div className={s.offerBody}>
                <h3>{o.title}</h3>
                <p>{o.text}</p>
                <div className={s.offerLinks}>
                  <a
                    className={s.offerCta}
                    href={`/biznes?need=${encodeURIComponent(o.need)}#zayavka`}
                  >
                    {o.action}
                    <svg viewBox="0 0 12 12" aria-hidden="true">
                      <path d="M3 9l6-6M4 3h5v5" />
                    </svg>
                  </a>
                  {o.href && <Link href={o.href}>{o.more}</Link>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Trust />

      <section
        className={s.request}
        id="zayavka"
        aria-labelledby="request-title"
        data-screen
      >
        <div className={s.requestText}>
          <p className={`caps ${s.kicker}`}>Заявка для бизнеса</p>
          <h2 id="request-title">
            Получите предложение по текстилю для вашего отеля или магазина
          </h2>
          <p className={s.requestLead}>
            Подберём полотенца, халаты и коврики, рассчитаем тираж с вашим
            логотипом и назовём цены. Работаем с отелями, санаториями,
            фитнес-клубами и магазинами по всей Беларуси.
          </p>
          <ol className={s.steps}>
            {steps.map((st, i) => (
              <li key={st.t}>
                <span>{i + 1}</span>
                <div>
                  <b>{st.t}</b>
                  <p>{st.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className={s.requestCard}>
          <h3>Оставьте заявку</h3>
          <HotelForm
            phone={contacts.phone}
            phoneHref={contacts.phoneHref}
            hours={contacts.hours}
            detailed
          />
        </div>
      </section>
      <PresentationScroll snapMobile={false} />
    </Shell>
  );
}
