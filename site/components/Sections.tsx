import { HotelForm } from "./HotelForm";
import Image from "next/image";
import Link from "next/link";
import { contacts } from "@/lib/collections";
import { priceRange, purposeChips, type Product } from "@/lib/catalog";
import { Certificate } from "./Certificate";
import { GiftsShowcase, type GiftLineView } from "./GiftsShowcase";
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
            href={`?nazn=${p.id}#catalog`}
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

// Подарить (2026-11-17): слева фото во весь рост, при наведении на набор в списке показывается его фото, цвета,
// размеры и цена; справа заголовок, наборы по 3 шт (категория «Наборы» из админки) и сертификат открыткой.
// QD сюда не входят: это обычные полотенца, они в каталоге по назначению.
export function Gifts({ items = [] }: { items?: Product[] }) {
  const lines: GiftLineView[] = items.map((p) => {
    const [min, max] = priceRange(p);
    return {
      key: p.id,
      name: p.title,
      meta: "3 шт",
      density: p.density,
      colors: p.colors.map((c) => ({ name: c.name, swatch: c.swatch })),
      sizes: [`3 полотенца: ${p.sizes[0]?.note ?? ""}`.replace(/: $/, "")],
      price:
        p.source !== "woo" || !min
          ? "Цена по запросу"
          : min === max
            ? `${min} BYN`
            : `от ${min} BYN`,
      href: `/catalog/${p.id}`,
      image: p.colors[0]?.image,
      position: p.colors[0]?.position,
    };
  });
  return (
    <section
      id="gifts"
      className={s.gifts}
      aria-labelledby="gifts-title"
      data-screen
    >
      <GiftsShowcase
        lines={lines}
        head={
          <div className={s.giftsHead}>
            <p className={`caps ${s.giftEyebrow}`}>Подарки · сертификат</p>
            <h2 id="gifts-title" className={s.h2}>
              Подарить
            </h2>
            <p className={s.giftsLead}>
              Полотенца дарят на новоселье, свадьбу и просто так. Если не
              знаете цвет — подарите сертификат.
            </p>
          </div>
        }
        cert={<Certificate phoneHint={contacts.phone} />}
      />
    </section>
  );
}

// Для бизнеса на главной (2026-11-17): один экран — факты, поле «Телефон» с кнопкой «Получить предложение»
// и вторичная «Подробнее для бизнеса». Полная форма с направлениями только на /biznes.
const hotelFacts = [
  { big: "450–500", small: "г/м², плотная махра" },
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
          <h3 className="caps">Покупателям</h3>
          <Link href="/catalog">Каталог</Link>
          <Link href="/kollekcii">Коллекции</Link>
          <Link href="/dostavka">Доставка и оплата</Link>
          <Link href="/faq">Вопросы и ответы</Link>
          <Link href="/o-nas">О бренде</Link>
          <Link href="/korzina">Корзина</Link>
        </div>
        <div>
          <h3 className="caps">Бизнесу</h3>
          <Link href="/biznes">Для отелей и санаториев</Link>
          <Link href="/biznes#opt">Опт</Link>
          <Link href="/biznes#logo">Полотенца с логотипом</Link>
          <Link href="/biznes#certificate">Подарочные сертификаты</Link>
        </div>
        <div>
          <h3 className="caps">Контакты</h3>
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
