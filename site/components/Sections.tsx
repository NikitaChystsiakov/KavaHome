import Image from "next/image";
import { contacts } from "@/lib/collections";
import { giftLines, purposeChips } from "@/lib/catalog";
import { HotelForm } from "./HotelForm";
import { Stamp } from "./Stamp";
import { Logo } from "./Logo";
import s from "./home.module.css";

// Первый экран: два самых светлых кадра, логотип на всю ширину (рисует TopBar), предложение и назначения.
export function Hero() {
  return (
    <section className={s.hero} aria-label="KAVA HOME" data-screen>
      <div className={s.heroPhoto}>
        <Image
          src="/img/florence-beige.webp"
          alt="Бежевые полотенца Флоренция с рельефом «ёлочка» на белом комоде"
          fill
          preload
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "50% 80%" }}
          quality={85}
        />
      </div>
      <div className={s.heroShade} />
      <h1 className="visually-hidden">KAVA HOME — махровые полотенца, коврики и наборы в Минске, доставка по Беларуси</h1>
      <div className={s.heroOffer} data-hero-offer>
        <p className={s.heroLead}>Махровые полотенца из&nbsp;100%&nbsp;хлопка</p>
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
          <a key={p.id} href={`?nazn=${p.id}#catalog`} data-filter-nazn={p.id} className="caps">
            {p.label}
          </a>
        ))}
      </nav>
    </section>
  );
}

// Подарить: две половины на один экран. Слева наборы QD (ведут в каталог на подборку QD), справа сертификат.
export function Gifts() {
  const from = Math.min(...giftLines.map((g) => g.from));
  const dens = giftLines.map((g) => g.density);
  return (
    <section id="gifts" className={s.gifts} aria-labelledby="gifts-title" data-screen>
      <div className={s.giftsHead}>
        <h2 id="gifts-title" className={s.h2}>
          Подарить
        </h2>
        <p className={s.giftsLead}>Полотенца дарят на новоселье, свадьбу и просто так. Если не знаете цвет — подарите сертификат.</p>
      </div>
      <div className={s.giftsGrid}>
        <a href="?kat=gifts#catalog" data-filter-kat="gifts" className={s.giftPhoto}>
          <Image
            src="/img/gift-qd.webp"
            alt="Подарочные полотенца QD: ментол, ваниль, персик, сирень"
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
            style={{ objectFit: "cover", objectPosition: "55% 45%" }}
            quality={75}
          />
          <span className={s.giftCaption}>
            <span className={s.giftKicker}>
              {giftLines.length} линий · {Math.min(...dens)}–{Math.max(...dens)} г/м²
            </span>
            <b>Подарочные наборы QD</b>
            <span className={s.giftNames}>{giftLines.map((g) => g.name.replace("QD ", "")).join(" · ")}</span>
            <span className={s.giftBuy}>
              <span>от {from} BYN</span>
              <span className={s.btnInk}>Выбрать набор</span>
            </span>
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

export function Hotels() {
  return (
    <section id="hotels" className={s.hotels} aria-labelledby="hotels-title" data-screen>
      <div className={s.hotelsPhoto}>
        <Image src="/img/hotel-main.webp" alt="Белые полотенца отельной линии" fill sizes="(max-width: 760px) 100vw, 40vw" style={{ objectFit: "cover", objectPosition: "50% 60%" }} quality={75} />
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

export function Footer() {
  return (
    <footer className={s.footer} data-screen>
      <div className={s.footCols}>
        <div>
          <h3 className="caps">Покупателям</h3>
          <a href="#catalog">Каталог</a>
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
