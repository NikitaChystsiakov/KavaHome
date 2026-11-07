import Image from "next/image";
import { contacts, purposes } from "@/lib/collections";
import { HotelForm } from "./HotelForm";
import { Stamp } from "./Stamp";
import { Logo } from "./Logo";
import s from "./home.module.css";

export function Hero({ count }: { count: number }) {
  return (
    <section className={s.hero} aria-label="KAVA HOME" data-screen>
      <div className={`${s.heroPhoto} ${s.heroFirst}`}>
        <Image
          src="/img/hero-florence.webp"
          alt="Бежевое полотенце Флоренция на кресле"
          fill
          preload
          sizes="(max-width: 760px) 100vw, 50vw"
          style={{ objectFit: "cover", objectPosition: "45% 60%" }}
          quality={85}
        />
      </div>
      <div className={s.heroPhoto}>
        <Image
          src="/img/hero-verona-tex.webp"
          alt="Махра полотенца Верона изумруд крупным планом"
          fill
          preload
          sizes="(max-width: 760px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
          quality={85}
        />
      </div>
      <div className={s.heroShade} />
      <h1 className="visually-hidden">KAVA HOME — махровые полотенца, коврики и наборы из Минска</h1>
      <div className={s.heroOffer} data-hero-offer>
        <p className={s.heroLead}>Махровые полотенца собственного производства</p>
        <p className={s.heroSub}>Минск · доставка по Беларуси</p>
        <a href="#verona" className={s.btnHero}>
          Выбрать коллекцию
          <svg viewBox="0 0 10 14" aria-hidden="true">
            <path d="M5 0v12M1 8l4 4 4-4" />
          </svg>
        </a>
      </div>
      <nav className={s.heroNav} aria-label="Назначение">
        {purposes.map((p) => (
          <a key={p.label} href={p.href} className="caps">
            {p.label}
          </a>
        ))}
      </nav>
      <span className={`caps ${s.heroNext}`}>{count} коллекций-городов</span>
    </section>
  );
}

const tiles = [
  { label: "Ванная", note: "банные, для рук и лица", img: "/img/use-bath.webp", href: "/catalog?naznachenie=vannaya", big: true },
  { label: "Кухня", note: "вафельные и махровые", img: "/img/naples-grey.webp", href: "/catalog?naznachenie=kuhnya" },
  { label: "Коврики", note: "коллекция Лион", img: "/img/use-mats.webp", href: "/catalog?naznachenie=kovriki" },
  { label: "Наборы", note: "по 3 штуки, подарочные", img: "/img/naples-stack.webp", href: "/catalog?naznachenie=podarki" },
  { label: "Для отелей", note: "белая линия, ваш логотип", img: "/img/use-hotel.webp", href: "#hotels" },
];

export function Purposes() {
  return (
    <section className={s.purposes} aria-labelledby="purposes-title" data-screen>
      <div className={s.purposesHead}>
        <h2 id="purposes-title" className={s.h2}>
          Что ищете
        </h2>
        <a href="/catalog" className={`caps ${s.link}`}>
          Весь каталог
        </a>
      </div>
      <div className={s.mosaic}>
        {tiles.map((t) => (
          <a key={t.label} href={t.href} className={s.tile} data-big={t.big ? "true" : undefined}>
            <Image src={t.img} alt="" fill sizes={t.big ? "(max-width: 760px) 100vw, 50vw" : "(max-width: 760px) 50vw, 25vw"} style={{ objectFit: "cover" }} quality={75} />
            <span className={s.tileText}>
              <b>{t.label}</b>
              <span>{t.note}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function Hotels() {
  return (
    <section id="hotels" className={s.hotels} aria-labelledby="hotels-title" data-screen>
      <div className={s.hotelsPhoto}>
        <Image src="/img/hotel-main.webp" alt="Белые полотенца отельной линии на тёмном столе" fill sizes="(max-width: 760px) 100vw, 40vw" style={{ objectFit: "cover", objectPosition: "50% 60%" }} quality={75} />
      </div>
      <div className={s.hotelsBody}>
        <h2 id="hotels-title" className={s.h2}>
          Для отелей и бизнеса
        </h2>
        <p className={s.hotelsLead}>
          Белая отельная линия Бергамо и Марсель, опт для магазинов и полотенца с вашим логотипом. Менеджер подберёт
          модели и пришлёт цены.
        </p>
        <dl className={s.lines}>
          <div>
            <dt>Отели и гостевые дома</dt>
            <dd>белая отельная линия</dd>
          </div>
          <div>
            <dt>Опт</dt>
            <dd>цены по запросу</dd>
          </div>
          <div>
            <dt>Ваш логотип</dt>
            <dd>вышивка или жаккард</dd>
          </div>
          <div>
            <dt>Сертификаты</dt>
            <dd>для подарков сотрудникам и клиентам</dd>
          </div>
        </dl>
        <figure className={s.badge}>
          <span className={s.badgeImg}>
            <Image src="/img/hotel-badge.webp" alt="Шильдик KAVA на бордюре полотенца" fill sizes="220px" style={{ objectFit: "cover", objectPosition: "60% 70%" }} quality={75} />
          </span>
          <figcaption>Сейчас здесь шильдик KAVA. На вашем заказе будет ваш логотип.</figcaption>
        </figure>
        <HotelForm phone={contacts.phone} phoneHref={contacts.phoneHref} hours={contacts.hours} />
      </div>
    </section>
  );
}

export function Gifts() {
  return (
    <section className={s.gifts} aria-labelledby="gifts-title" data-screen>
      <div className={s.giftsHead}>
        <h2 id="gifts-title" className={s.h2}>
          Подарить
        </h2>
        <p>Полотенца дарят на новоселье, свадьбу и просто так. Если не знаете цвет — подарите сертификат.</p>
      </div>
      <div className={s.giftsGrid}>
        <a href="/catalog?naznachenie=podarki" className={s.giftPhoto}>
          <Image src="/img/gift-qd.webp" alt="Подарочные полотенца QD: ментол, ваниль, лаванда, сирень" fill sizes="(max-width: 760px) 100vw, 50vw" style={{ objectFit: "cover" }} quality={75} />
          <span className={s.giftCaption}>
            <b>Подарочные наборы</b>
            <span>QD · ментол · ваниль · лаванда · сирень</span>
            <span className={`caps ${s.giftLink}`}>Выбрать набор</span>
          </span>
        </a>
        <a href="/certificate" className={s.cert}>
          <span className={s.certTop}>
            <Logo className={s.certLogo} />
            <Stamp id="cert" ring="ПОДАРОК · REGALO · СЕРТИФИКАТ · KAVA HOME ·" center="★" sub="МИНСК" className={s.certStamp} />
          </span>
          <span className={s.certTitle}>Подарочный сертификат</span>
          <span className={s.certLines}>
            <span>Кому</span>
            <span>От кого</span>
            <span>Номинал</span>
          </span>
          <span className={s.btnInk}>Заказать сертификат</span>
        </a>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className={s.footer} data-screen>
      <div className={s.footCols}>
        <div>
          <h3 className="caps">Покупателям</h3>
          <a href="/catalog">Каталог</a>
          <a href="/dostavka">Доставка и оплата</a>
          <a href="/faq">Вопросы и ответы</a>
          <a href="/o-brende">О бренде</a>
        </div>
        <div>
          <h3 className="caps">Бизнесу</h3>
          <a href="#hotels">Для отелей</a>
          <a href="#hotels">Опт</a>
          <a href="#hotels">Полотенца с логотипом</a>
          <a href="/certificate">Подарочный сертификат</a>
        </div>
        <div>
          <h3 className="caps">Контакты</h3>
          <a href={contacts.phoneHref} className={s.footPhone}>
            {contacts.phone}
          </a>
          <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
          <span>{contacts.hours}</span>
        </div>
      </div>
      <Logo className={s.footLogo} />
      <p className={s.legal}>{contacts.company}</p>
    </footer>
  );
}
