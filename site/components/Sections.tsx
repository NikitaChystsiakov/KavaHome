import { HotelForm } from "./HotelForm";
import { HeroVideo } from "./HeroVideo";
import Image from "next/image";
import Link from "next/link";
import { contacts } from "@/lib/collections";
import { purposeChips } from "@/lib/catalog";
import { categoryPages, categoryPath, purposeHref } from "@/lib/categories";
import { GiftCertificate } from "./GiftCertificate";
import { Logo } from "./Logo";
import s from "./home.module.css";

// Первый экран: два самых светлых кадра, логотип на всю ширину (рисует TopBar), предложение и назначения.
export function Hero() {
  return (
    <section className={s.hero} aria-label="KAVA HOME" data-screen>
      <div className={s.heroPhoto}>
        <HeroVideo alt="Полотенца и халаты KAVA HOME: стопки, рельеф, цвета" />
      </div>
      <div className={s.heroShade} />
      <h1 className="visually-hidden">
        Махровые полотенца из 100% хлопка в Минске — купить в KAVA HOME
      </h1>
      <div className={s.heroOffer} data-hero-offer>
        <p className={s.heroLead}>
          Махровые полотенца из&nbsp;100%&nbsp;хлопка
        </p>
        <p className={s.heroSub}>Минск · доставка по Беларуси</p>
        <div className={s.heroBtns}>
          <a href="#kollekcii" className={s.btnHero}>
            Смотреть коллекции
            <svg viewBox="0 0 10 14" aria-hidden="true">
              <path d="M5 0v12M1 8l4 4 4-4" />
            </svg>
          </a>
          <a href="#catalog" className={s.btnHeroGhost}>
            Каталог
          </a>
        </div>
      </div>
      <nav className={s.heroNav} aria-label="Назначение">
        {purposeChips.map((p) => (
          <a
            key={p.id}
            href={purposeHref(p.id)}
            data-filter-nazn={p.id}
            className="caps"
          >
            {p.label}
          </a>
        ))}
      </nav>
    </section>
  );
}

// Подарить (2026-11-17): только подарочный сертификат — открытка-превью и форма заявки (components/GiftCertificate.tsx).
export function Gifts() {
  return <GiftCertificate phone={contacts.phone} phoneHref={contacts.phoneHref} />;
}

// Для бизнеса на главной (2026-11-17): один экран — факты, поле «Телефон» с кнопкой «Получить предложение»
// и вторичная «Подробнее для бизнеса». Полная форма с направлениями только на /biznes.
const hotelFacts = [
  { big: "450–750", small: "г/м², плотная махра" },
  { big: "100%", small: "хлопок" },
  { big: "Логотип", small: "вышивка или жаккард" },
];

export function Hotels() {
  return (
    <section
      id="hotels"
      className={s.hotels}
      aria-labelledby="hotels-title"
      data-screen
    >
      <div className={s.hotelsPhoto}>
        <Image
          src="/img/hotel-main.webp"
          alt="Белые полотенца отельной линии"
          fill
          sizes="(max-width: 760px) 100vw, 40vw"
          style={{ objectFit: "cover", objectPosition: "50% 60%" }}
          quality={75}
        />
      </div>
      <div className={s.hotelsBody}>
        <h2 id="hotels-title" className={s.h2}>
          Для отелей и бизнеса
        </h2>
        <p className={s.hotelsLead}>
          Полотенца, халаты и коврики для номеров, спа и бассейнов, опт для
          магазинов. Менеджер подберёт модели и пришлёт цены.
        </p>
        <ul className={s.facts}>
          {hotelFacts.map((f) => (
            <li key={f.big}>
              <b>{f.big}</b>
              <span>{f.small}</span>
            </li>
          ))}
        </ul>
        <HotelForm
          compact
          moreHref="/biznes"
          phone={contacts.phone}
          phoneHref={contacts.phoneHref}
          hours={contacts.hours}
        />
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className={s.footer} data-screen>
      <div className={s.footCols}>
        <div>
          <p className="caps">Каталог</p>
          {categoryPages.map((c) => (
            <Link key={c.slug} href={categoryPath(c)}>
              {c.label}
            </Link>
          ))}
        </div>
        <div>
          <p className="caps">Покупателям</p>
          <Link href="/catalog">Каталог</Link>
          <Link href="/kollekcii">Коллекции</Link>
          <Link href="/dostavka">Доставка и оплата</Link>
          <Link href="/faq">Вопросы и ответы</Link>
          <Link href="/o-nas">О бренде</Link>
          <Link href="/korzina">Корзина</Link>
        </div>
        <div>
          <p className="caps">Бизнесу</p>
          <Link href="/biznes">Для отелей и санаториев</Link>
          <Link href="/biznes#opt">Опт</Link>
          <Link href="/biznes#logo">Полотенца с логотипом</Link>
          <Link href="/biznes#certificate">Подарочные сертификаты</Link>
        </div>
        <div>
          <p className="caps">Контакты</p>
          <a href={contacts.phoneHref} className={s.footPhone}>
            {contacts.phone}
          </a>
          <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
          <span>{contacts.hours}</span>
          <Link href="/kontakty">Шоурум: {contacts.pickupShort}</Link>
        </div>
      </div>
      <Logo className={s.footLogo} />
      <p className={s.legal}>
        {contacts.company} ·{" "}
        <Link href="/privacy">Политика обработки персональных данных</Link>
      </p>
    </footer>
  );
}
