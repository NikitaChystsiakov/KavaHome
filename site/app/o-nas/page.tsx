import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { PartnerLogo } from "@/components/Partners";
import { PresentationScroll } from "@/components/PresentationScroll";
import { ScreenReveal } from "@/components/ScreenReveal";
import { stores, hotels, marketplaces, rating } from "@/lib/partners";
import s from "@/components/about.module.css";

export const metadata: Metadata = {
  title: "О бренде KAVA HOME — полотенца из 100% хлопка, Минск",
  description:
    "Полотенца KAVA HOME из 100% хлопка: махровые и вафельные, наборы, халаты. Купить полотенца оптом и в розницу в Минске, доставка по Беларуси, поставки для отелей.",
};

const strip = [
  { big: "100%", small: "натуральный хлопок" },
  { big: "25", small: "коллекций с городскими названиями" },
  { big: "3+ года", small: "в магазинах и отелях Беларуси" },
  { big: "4,9", small: "оценка покупателей на маркетплейсах" },
];

const feel = [
  {
    t: "Хлопок",
    d: "Мягкая махра и лёгкая вафля из 100% хлопка. Состав указан в каждой карточке.",
  },
  {
    t: "Плотность",
    d: "От лёгких полотенец для кухни до плотной махры для ванной: выбирайте по ощущениям.",
  },
  {
    t: "Фактура",
    d: "У каждой коллекции свой рисунок: гладкая махра, «ёлочка», вафельное плетение.",
  },
];

// кадры стопок выровнены (одинаковый размер и высота полотенец), чтобы три карточки читались как ряд
const mpPhotos: Record<string, string> = {
  Wildberries: "/img/mp-wb-2.webp",
  Ozon: "/img/mp-ozon-2.webp",
  Emall: "/img/mp-emall-2.webp",
};

const panels = [
  { name: "Бежевый", dot: "#d8c3a5", src: "/img/venice-beige.webp", pos: "50% 60%" },
  { name: "Серый", dot: "#b4b3b1", src: "/img/venice-grey.webp", pos: "50% 60%" },
  { name: "Мятный", dot: "#a9c9b8", src: "/img/venice-mint.webp", pos: "50% 60%" },
  { name: "Графит", dot: "#5c5a5b", src: "/img/venice-graphite.webp", pos: "50% 60%" },
];

export default function AboutPage() {
  return (
    <Shell>
      <section className={s.hero} data-screen data-reveal aria-labelledby="about-title">
        <div className={s.heroMain}>
          <div className={s.heroText}>
            <p className={`caps ${s.kicker}`} data-r style={{ "--i": 0 } as React.CSSProperties}>
              О бренде · KAVA HOME
            </p>
            <h1 id="about-title" data-r style={{ "--i": 1 } as React.CSSProperties}>
              Вещи, с которыми <em>хорошо дома</em>
              <span className="visually-hidden"> — полотенца KAVA HOME</span>
            </h1>
            <p className={s.lead} data-r style={{ "--i": 2 } as React.CSSProperties}>
              Мягкая махра, знакомые оттенки, любимое полотенце после душа. Мы
              выбираем текстиль для этих простых ежедневных моментов.
            </p>
            <Link
              href="/catalog"
              className={s.textLink}
              data-r
              style={{ "--i": 3 } as React.CSSProperties}
            >
              Найти своё полотенце <span>↗</span>
            </Link>
          </div>
          <figure className={s.heroPhoto}>
            <Image
              src="/img/florence.webp"
              alt="Бежевые полотенца Флоренция на туалетном столике"
              fill
              preload
              sizes="(max-width: 900px) 100vw, 55vw"
              quality={85}
              data-r="wipe"
            />
            <div className={s.seal} aria-hidden="true">
              <b>100%</b>
              <span>хлопок</span>
            </div>
            <figcaption>Флоренция · фактура «ёлочка»</figcaption>
          </figure>
        </div>
        <dl className={s.strip}>
          {strip.map((f, i) => (
            <div key={f.big} data-r style={{ "--i": i + 3 } as React.CSSProperties}>
              <dt>{f.big}</dt>
              <dd>{f.small}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={s.feel} data-screen data-reveal aria-labelledby="feel-title">
        <figure className={s.feelPhoto}>
          <Image
            src="/img/hero-verona-tex.webp"
            alt="Махровая фактура полотенца Верона крупным планом"
            fill
            sizes="(max-width: 900px) 100vw, 55vw"
            quality={85}
            data-r="wipe"
          />
          <figcaption>Верона · махровая фактура крупным планом</figcaption>
        </figure>
        <div className={s.feelBody}>
          <p className={`caps ${s.kicker}`} data-r style={{ "--i": 0 } as React.CSSProperties}>
            Знакомство в деталях
          </p>
          <h2 id="feel-title" className={s.h2} data-r style={{ "--i": 1 } as React.CSSProperties}>
            Не только цвет.
            <br />
            Ещё и ощущение.
          </h2>
          <ol className={s.feelList}>
            {feel.map((f, i) => (
              <li key={f.t} data-r style={{ "--i": i + 2 } as React.CSSProperties}>
                <span>0{i + 1}</span>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </li>
            ))}
          </ol>
          <Link
            className={s.textLink}
            href="/catalog/mahrovye-polotenca"
            data-r
            style={{ "--i": 5 } as React.CSSProperties}
          >
            Махровые полотенца <span>↗</span>
          </Link>
        </div>
      </section>

      <section className={s.colors} data-screen data-reveal aria-labelledby="colors-title">
        <div className={s.colorsHead}>
          <div>
            <p className={`caps ${s.kicker}`} data-r style={{ "--i": 0 } as React.CSSProperties}>
              Один оттенок — разные размеры
            </p>
            <h2 id="colors-title" className={s.h2} data-r style={{ "--i": 1 } as React.CSSProperties}>
              Любимый цвет в каждой коллекции
            </h2>
          </div>
          <p data-r style={{ "--i": 2 } as React.CSSProperties}>
            Полотенца для рук, лица и тела можно подобрать в одном оттенке.
            А если хочется готовое сочетание, выберите набор из трёх.
          </p>
        </div>
        <div className={s.panels}>
          {panels.map((p, i) => (
            <figure
              key={p.name}
              className={s.panel}
              tabIndex={0}
              data-r
              style={{ "--i": i + 2 } as React.CSSProperties}
            >
              <Image
                src={p.src}
                alt={`Полотенца Венеция, цвет ${p.name.toLowerCase()}`}
                fill
                sizes="(max-width: 900px) 50vw, 40vw"
                quality={80}
                loading="eager"
                style={{ objectPosition: p.pos }}
              />
              <figcaption>
                <span className={s.dot} style={{ background: p.dot }} />
                {p.name}
                <em>· Венеция</em>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className={s.colorsFoot} data-r="fade" style={{ "--i": 6 } as React.CSSProperties}>
          <span>Венеция · на примере одной коллекции</span>
          <Link className={s.textLink} href="/catalog/nabory-polotenec">
            Посмотреть наборы <span>↗</span>
          </Link>
        </div>
      </section>

      <section className={s.where} data-screen data-reveal aria-labelledby="where-title">
        <div className={s.whereHead}>
          <div>
            <p className={`caps ${s.kicker}`} data-r style={{ "--i": 0 } as React.CSSProperties}>
              Где купить
            </p>
            <h2 id="where-title" className={s.h2} data-r style={{ "--i": 1 } as React.CSSProperties}>
              В магазинах Беларуси и на маркетплейсах
            </h2>
          </div>
          <p className={s.score} data-r style={{ "--i": 2 } as React.CSSProperties}>
            <b>{rating}</b>
            <span>
              средняя оценка
              <br />
              на маркетплейсах
            </span>
          </p>
        </div>
        <div className={s.mpRow}>
          {marketplaces.map((p, i) => (
            <a
              key={p.name}
              className={s.mp}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              data-r
              style={{ "--i": i + 2 } as React.CSSProperties}
            >
              <Image
                src={mpPhotos[p.name] ?? p.photo}
                alt={`Полотенца KAVA HOME на ${p.name}`}
                fill
                sizes="(max-width: 900px) 100vw, 33vw"
                quality={80}
                loading="eager"
                style={{ objectPosition: "50% 50%" }}
              />
              <div className={s.mpPlate}>
                <PartnerLogo p={p} area={3000} />
                <span>Смотреть на {p.name} ↗</span>
              </div>
            </a>
          ))}
        </div>
        <ul className={s.shops} data-r="fade" style={{ "--i": 5 } as React.CSSProperties}>
          {stores.map((p) => (
            <li key={p.name} title={p.name}>
              <PartnerLogo p={p} area={3000} />
            </li>
          ))}
        </ul>
      </section>

      <section className={s.hotels} data-screen data-reveal aria-labelledby="hotels-title">
        <figure className={s.hotelsPhoto}>
          <Image
            src="/img/hotel-main.webp"
            alt="Белые махровые полотенца отельной линии"
            fill
            sizes="(max-width: 900px) 100vw, 45vw"
            quality={80}
            style={{ objectPosition: "50% 65%" }}
            data-r="wipe"
          />
          <figcaption>
            <b>450–750</b> г/м² · плотность для отелей и спа
          </figcaption>
        </figure>
        <div className={s.hotelsBody}>
          <p className={`caps ${s.kicker}`} data-r style={{ "--i": 0 } as React.CSSProperties}>
            Сотрудничаем с гостиницами
          </p>
          <h2 id="hotels-title" className={s.h2} data-r style={{ "--i": 1 } as React.CSSProperties}>
            Нас выбирают отели,
            <br />
            курорты и клубы
          </h2>
          <p className={s.hotelsLead} data-r style={{ "--i": 2 } as React.CSSProperties}>
            Плотная махра выдерживает частые стирки и сохраняет форму и цвет.
            Для номеров, бассейнов и спа-зон.
          </p>
          <ul className={s.hotelGrid}>
            {hotels.map((p, i) => (
              <li key={p.name} data-r style={{ "--i": i + 3 } as React.CSSProperties}>
                <PartnerLogo p={p} area={3200} />
                <span>{p.name}</span>
              </li>
            ))}
          </ul>
          <Link
            className={s.textLink}
            href="/biznes"
            data-r
            style={{ "--i": 9 } as React.CSSProperties}
          >
            Поставки для отелей <span>↗</span>
          </Link>
        </div>
      </section>

      <section className={s.paths} data-screen data-reveal aria-labelledby="paths-title">
        <div className={s.pathsHead}>
          <div>
            <p className={`caps ${s.kicker}`} data-r style={{ "--i": 0 } as React.CSSProperties}>
              Опт и розница
            </p>
            <h2 id="paths-title" className={s.h2} data-r style={{ "--i": 1 } as React.CSSProperties}>
              Полотенца оптом и в розницу
              <br />
              в Минске и по Беларуси
            </h2>
          </div>
          <p data-r style={{ "--i": 2 } as React.CSSProperties}>
            Махровые и вафельные полотенца, халаты и коврики из 100% хлопка.
            Частным покупателям: каталог и доставка. Отелям, магазинам и
            компаниям: оптовые поставки и вышивка с логотипом.
          </p>
        </div>
        <Link href="/catalog" className={s.path} data-r style={{ "--i": 2 } as React.CSSProperties}>
          <div className={s.pathPhoto}>
            <Image
              src="/img/use-bath.webp"
              alt="Тёмно-серые махровые полотенца с жаккардовой каймой у ванны"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              quality={80}
              style={{ objectPosition: "50% 70%" }}
            />
            <span className={s.tag}>Розница</span>
          </div>
          <div className={s.pathBody}>
            <h3>Купить полотенца для дома</h3>
            <ul>
              <li>Махровые и вафельные полотенца, наборы, халаты и коврики</li>
              <li>Заказ на сайте без предоплаты, менеджер подтвердит по телефону</li>
              <li>Доставка по Беларуси или самовывоз из Волковичей</li>
              <li>Оплата через ЕРИП или по реквизитам</li>
            </ul>
            <span className={s.pathGo}>Перейти в каталог ↗</span>
          </div>
        </Link>
        <Link href="/biznes" className={s.path} data-r style={{ "--i": 3 } as React.CSSProperties}>
          <div className={s.pathPhoto}>
            <Image
              src="/img/use-hotel.webp"
              alt="Стопка белых махровых полотенец для отеля"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              quality={80}
              style={{ objectPosition: "50% 65%" }}
            />
            <span className={s.tag}>Опт и бизнес</span>
          </div>
          <div className={s.pathBody}>
            <h3>Полотенца оптом для отелей и магазинов</h3>
            <ul>
              <li>Оптовые поставки без минимальной партии</li>
              <li>Текстиль для отелей, спа, санаториев и фитнес-клубов</li>
              <li>Вышивка и жаккард с вашим логотипом</li>
              <li>Подарочные сертификаты для сотрудников и клиентов</li>
            </ul>
            <span className={s.pathGo}>Запросить оптовые цены ↗</span>
          </div>
        </Link>
      </section>
      <ScreenReveal />
      <PresentationScroll snapMobile={false} />
    </Shell>
  );
}
