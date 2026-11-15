import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { PartnerLogo } from "@/components/Partners";
import { stores, marketplaces, rating } from "@/lib/partners";
import s from "@/components/editorial.module.css";

export const metadata: Metadata = {
  title: "О бренде — KAVA HOME",
  description:
    "Полотенца KAVA HOME: натуральный хлопок, фактуры и спокойные оттенки. Для дома, подарка и гостиниц Беларуси.",
};

export default function AboutPage() {
  return (
    <Shell>
      <section className={s.hero}>
        <div className={s.heroText}>
          <p className="caps">О бренде · KAVA HOME</p>
          <h1>
            Вещи, с которыми
            <br />
            хорошо дома
          </h1>
          <p className={s.lead}>
            Мягкая махра, знакомые оттенки, любимое полотенце после душа. Мы
            выбираем текстиль для этих простых ежедневных моментов.
          </p>
          <Link href="/catalog" className={s.textLink}>
            Найти своё полотенце <span>↗</span>
          </Link>
          <div className={s.heroFoot}>
            <span>100% хлопок</span>
            <span>Больше трёх лет в Беларуси</span>
          </div>
        </div>
        <figure className={s.heroImage}>
          <Image
            src="/img/florence.webp"
            alt="Бежевые полотенца Флоренция на туалетном столике"
            fill
            preload
            sizes="(max-width: 900px) 100vw, 50vw"
            quality={85}
          />
          <figcaption>Флоренция · фактура «ёлочка»</figcaption>
        </figure>
      </section>
      <section className={`${s.section} ${s.paper}`}>
        <div className={s.sectionHead}>
          <p className="caps">Знакомство в деталях</p>
          <h2>
            Не только цвет.
            <br />
            Ещё и ощущение.
          </h2>
          <p>
            Махровые и вафельные полотенца, коврики и наборы. У каждой коллекции
            — свой рисунок и плотность.
          </p>
        </div>
        <div className={s.detailsGrid}>
          <figure className={s.texture}>
            <Image
              src="/img/hero-verona-tex.webp"
              alt="Махровая фактура полотенца Верона крупным планом"
              fill
              sizes="(max-width: 760px) 100vw, 54vw"
              quality={85}
            />
            <figcaption>01 / Натуральный хлопок</figcaption>
          </figure>
          <div className={s.detailText}>
            <span className="caps">То, что касается кожи</span>
            <h3>
              Сначала —<br />
              прикосновение
            </h3>
            <p>
              Состав и плотность указаны в каждой карточке. Можно выбрать лёгкое
              вафельное полотенце для кухни или более плотную махру для ванной.
            </p>
            <Link className={s.textLink} href="/catalog?kat=bath">
              Махровые полотенца ↗
            </Link>
          </div>
          <div className={s.detailText}>
            <span className="caps">Всё складывается</span>
            <h3>
              Один оттенок.
              <br />
              Разные размеры.
            </h3>
            <p>
              Полотенца для рук, лица и тела можно подобрать в одной коллекции.
              А если хочется готовое сочетание — выбрать набор из трёх.
            </p>
            <Link className={s.textLink} href="/catalog?kat=sets">
              Посмотреть наборы ↗
            </Link>
          </div>
          <figure className={s.texture}>
            <Image
              src="/img/venice-beige.webp"
              alt="Набор бежевых полотенец Венеция разных размеров"
              fill
              sizes="(max-width: 760px) 100vw, 46vw"
              quality={85}
            />
            <figcaption>02 / Цвет, который объединяет</figcaption>
          </figure>
        </div>
      </section>
      <section className={s.section}>
        <div className={s.sectionHead}>
          <p className="caps">Рядом с вами</p>
          <h2>
            В магазинах Беларуси.
            <br />И у вас дома.
          </h2>
          <p>
            KAVA HOME можно найти в торговых сетях и заказать онлайн. Выбирайте
            удобный способ покупки.
          </p>
        </div>
        <ul className={s.logos}>
          {stores.map((p) => (
            <li key={p.name}>
              <PartnerLogo p={p} area={3500} />
              <span>{p.name}</span>
            </li>
          ))}
        </ul>
        <div className={s.marketRow}>
          <p>
            <b>{rating}</b>
            <span>Оценка бренда на маркетплейсах</span>
          </p>
          <div>
            {marketplaces.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {p.name} ↗
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className={s.paths} aria-label="Выбрать направление">
        <Link href="/catalog">
          <span className="caps">Для себя и близких</span>
          <h2>Выбрать для дома</h2>
          <span>Перейти в каталог ↗</span>
        </Link>
        <Link href="/biznes">
          <span className="caps">Для вашего дела</span>
          <h2>Обсудить поставку</h2>
          <span>Отели, магазины и компании ↗</span>
        </Link>
      </section>
    </Shell>
  );
}
