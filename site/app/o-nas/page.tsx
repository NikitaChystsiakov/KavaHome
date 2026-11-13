import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Partners, Marketplaces } from "@/components/Partners";
import { rating, stores } from "@/lib/partners";
import s from "@/components/info.module.css";

export const metadata: Metadata = {
  title: "О бренде KAVA HOME — махровые полотенца из 100% хлопка",
  description:
    "KAVA HOME больше трёх лет: полотенца из 100% хлопка плотностью 420–500 г/м² в сетях Корона, Green, ProStore, Гиппо, ЦУМ, на Wildberries, Ozon и Emall (оценка 4,9), в отелях и санаториях Беларуси.",
};

// Тексты — по ответам Эллы 2026-11-13. Название бренда не объясняем (просьба клиента).
const reasons = [
  {
    title: "100% натуральный хлопок",
    text: "Полотенца из высококачественного узбекского хлопка: прочного, экологичного и гипоаллергенного. Подходят даже для чувствительной и детской кожи.",
    photo: "/img/hero-verona-tex.webp",
    position: "50% 50%",
  },
  {
    title: "Плотность 420–500 г/м²",
    text: "В меру плотные и пушистые: мгновенно впитывают влагу и при этом быстро сохнут.",
    photo: "/img/venice-beige.webp",
    position: "50% 74%",
  },
  {
    title: "Аккуратный пошив",
    text: "Ровные швы, никаких торчащих ниток и стойкое окрашивание: полотенца держат форму и цвет после десятков интенсивных стирок.",
    photo: "/img/hotel-badge.webp",
    position: "60% 70%",
  },
];

// спокойная палитра — оттенки из ответа Эллы
const palette = [
  { name: "графит", hex: "#4b4c51", ink: "#f8f2e8" },
  { name: "бежевый", hex: "#d9c3ae", ink: "#2a2222" },
  { name: "мятный", hex: "#8fb8b4", ink: "#2a2222" },
  { name: "изумруд", hex: "#00747c", ink: "#f8f2e8" },
  { name: "шоколад", hex: "#5a3b31", ink: "#f8f2e8" },
  { name: "белый", hex: "#f6f3ee", ink: "#2a2222" },
];

const who = [
  {
    title: "Для себя и семьи",
    text: "Берут наборы из 2, 3 или 8–10 полотенец — для тела, лица, рук и кухни, — чтобы обновить домашний текстиль в едином стиле.",
    photo: "/img/use-bath.webp",
    href: "/catalog?kat=sets",
    more: "Наборы",
  },
  {
    title: "В подарок",
    text: "Коллекции приходят в эстетичной упаковке, есть готовые подарочные наборы. Их выбирают на новоселье, свадьбу, день рождения или просто как знак заботы.",
    photo: "/img/gift-qd.webp",
    href: "/catalog?kat=gifts",
    more: "Подарочные наборы",
  },
  {
    title: "Отели, санатории, фитнес-клубы",
    text: "Для гостиниц, курортов и спортивных клубов — полотенца повышенной плотности 500 г/м².",
    photo: "/img/use-hotel.webp",
    href: "/biznes",
    more: "Для бизнеса",
  },
];

export default function AboutPage() {
  return (
    <Shell>
      <section className={s.hero} aria-labelledby="about-title">
        <div className={s.heroText}>
          <div>
            <p className={`caps ${s.kicker}`}>О бренде</p>
            <h1 id="about-title" className={s.h1}>
              Наполняем уютом дома уже больше трёх лет
            </h1>
          </div>
          <p className={s.lead}>
            За это время KAVA HOME вырос в крупного и надёжного поставщика домашнего и профессионального текстиля. Наши полотенца
            продаются во всех крупнейших торговых сетях Беларуси и на маркетплейсах, ими пользуются отели, санатории и фитнес-клубы.
          </p>
          <dl className={s.lines}>
            <div>
              <dt>3+ года</dt>
              <dd>на рынке Беларуси</dd>
            </div>
            <div>
              <dt>{rating}</dt>
              <dd>средняя оценка на Wildberries, Ozon и Emall</dd>
            </div>
            <div>
              <dt>{stores.length} сетей</dt>
              <dd>{stores.map((x) => x.name).join(", ")}</dd>
            </div>
            <div>
              <dt>420–500 г/м²</dt>
              <dd>плотность махры</dd>
            </div>
          </dl>
        </div>
        <div className={s.heroPhoto}>
          <Image
            src="/img/florence.webp"
            alt="Полотенца Флоренция в интерьере"
            fill
            preload
            sizes="(max-width: 960px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
            quality={85}
          />
        </div>
      </section>

      <section className={`${s.section} ${s.paper}`} aria-labelledby="why-title">
        <div className={s.secHead}>
          <h2 id="why-title" className={s.h2}>
            Почему выбирают нас
          </h2>
          <p className={s.text}>Доверие покупателей и крупных партнёров держится на честном качестве материалов и продуманности каждого изделия.</p>
        </div>
        <ol className={s.reasons}>
          {reasons.map((r, i) => (
            <li key={r.title} className={s.reason}>
              <div className={s.reasonPhoto}>
                <Image src={r.photo} alt="" fill sizes="(max-width: 960px) 100vw, 22vw" style={{ objectFit: "cover", objectPosition: r.position }} quality={75} />
              </div>
              <div className={s.reasonBody}>
                <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={s.h3}>{r.title}</h3>
                <p>{r.text}</p>
              </div>
            </li>
          ))}
          <li className={s.reason}>
            <ul className={s.palette} aria-label="Оттенки">
              {palette.map((c) => (
                <li key={c.name} style={{ background: c.hex, color: c.ink }}>
                  {c.name}
                </li>
              ))}
            </ul>
            <div className={s.reasonBody}>
              <span className={s.num}>04</span>
              <h3 className={s.h3}>Спокойная палитра</h3>
              <p>
                Благородные оттенки — графит, бежевый, мятный, изумруд, шоколад, классический белый — и фактуры легко вписываются в
                современную ванную, кухню или спа-зону.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section className={s.section} aria-labelledby="who-title">
        <div className={s.secHead}>
          <h2 id="who-title" className={s.h2}>
            Кто покупает KAVA HOME
          </h2>
          <p className={s.text}>Ассортимент закрывает потребности и розничных покупателей, и гостиниц, и велнес-индустрии.</p>
        </div>
        <ul className={s.who}>
          {who.map((w) => (
            <li key={w.title}>
              <Link href={w.href} className={s.whoItem}>
                <span className={s.whoPhoto}>
                  <Image src={w.photo} alt="" fill sizes="(max-width: 960px) 100vw, 33vw" style={{ objectFit: "cover" }} quality={75} />
                </span>
                <span className={s.whoBody}>
                  <span className={s.h3}>{w.title}</span>
                  <p>{w.text}</p>
                  <span className={s.more}>{w.more} →</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Partners />
      <Marketplaces />

      <div className={s.cta}>
        <p className={s.h3}>Выберите цвет и размер в каталоге</p>
        <Link href="/catalog" className={s.btnInk}>
          Перейти в каталог
        </Link>
      </div>
    </Shell>
  );
}
