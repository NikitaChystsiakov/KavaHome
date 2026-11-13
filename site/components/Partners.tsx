import Image from "next/image";
import {
  hotels,
  marketplaces,
  rating,
  stores,
  type Partner,
} from "@/lib/partners";
import s from "./partners.module.css";

// «Нам доверяют»: логотипы партнёров в цвет логотипа KAVA. Классическая таблица с тонкими линиями,
// рядом фото отельной линии. Маркетплейсы — отдельным блоком с общей оценкой и ссылками на магазин бренда.

/** Логотип одной «оптической» площади: широкие ниже, круглые выше. Нет файла — надпись антиквой. */
export function PartnerLogo({ p, area = 5600 }: { p: Partner; area?: number }) {
  const w = Math.min(Math.sqrt(area * (p.boost ?? 1) * p.ratio), 190);
  const h = Math.min(w / p.ratio, 88);
  const style = {
    "--w": `${Math.round(h * p.ratio)}px`,
    "--h": `${Math.round(h)}px`,
  } as React.CSSProperties;
  if (!p.logo) {
    return (
      <span className={s.word} style={style} role="img" aria-label={p.name}>
        {p.name}
      </span>
    );
  }
  return (
    <span
      className={s.logo}
      role="img"
      aria-label={p.name}
      style={{
        ...style,
        WebkitMaskImage: `url(${p.logo})`,
        maskImage: `url(${p.logo})`,
      }}
    />
  );
}

/** photo={false} — без фото рядом (на странице, где то же фото уже стоит первым экраном): отели одной строкой. */
export function Partners({
  screen = false,
  title = "Отели, курорты и магазины",
  photo = true,
}: {
  screen?: boolean;
  title?: string;
  photo?: boolean;
}) {
  return (
    <section
      className={s.partners}
      aria-labelledby="partners-title"
      {...(screen ? { "data-screen": true } : {})}
    >
      <div className={s.head}>
        <div>
          <p className={`caps ${s.kicker}`}>Нам доверяют</p>
          <h2 id="partners-title" className={s.h2}>
            {title}
          </h2>
        </div>
        <p className={s.lead}>
          Более трёх лет KAVA HOME поставляет полотенца в&nbsp;крупнейшие
          торговые сети Беларуси. Текстиль повышенной плотности 500&nbsp;г/м²
          выбирают гостиницы, курорты и&nbsp;фитнес-клубы.
        </p>
      </div>

      <div className={s.hotels} data-photo={photo || undefined}>
        {photo && (
          <figure className={s.photo}>
            <Image
              src="/img/hotel-main.webp"
              alt="Белые полотенца отельной линии"
              fill
              sizes="(max-width: 760px) 100vw, 34vw"
              style={{ objectFit: "cover", objectPosition: "50% 60%" }}
              quality={75}
            />
            <figcaption>
              <span className="caps">Для отелей</span>
              <b>500 г/м²</b>
              <span>сохраняют форму и цвет после десятков стирок</span>
            </figcaption>
          </figure>
        )}
        <ul className={s.grid}>
          {hotels.map((p) => (
            <li key={p.name} className={s.cell}>
              <span className={s.mark}>
                <PartnerLogo p={p} />
              </span>
              <span className={s.name}>{p.name}</span>
              <span className={s.kind}>{p.kind}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={s.stores}>
        <p className={`caps ${s.storesTitle}`}>
          В магазинах{" "}
          <br />
          Беларуси
        </p>
        <ul className={s.row}>
          {stores.map((p) => (
            <li key={p.name} title={`${p.name} — ${p.kind}`}>
              <PartnerLogo p={p} area={3800} />
              <span className="visually-hidden">{p.kind}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Stars() {
  return (
    <span className={s.stars} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20">
          <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6L10 15l-5.4 3 1.2-6L1.3 7.8l6.1-.7z" />
        </svg>
      ))}
    </span>
  );
}

export function Marketplaces({ screen = false }: { screen?: boolean }) {
  return (
    <section
      className={s.market}
      aria-labelledby="market-title"
      {...(screen ? { "data-screen": true } : {})}
    >
      <div className={s.score}>
        <p className={`caps ${s.kicker}`}>Мы на маркетплейсах</p>
        <h2 id="market-title" className={s.h2}>
          Покупатели ставят
        </h2>
        <p className={s.big}>
          {rating}
          <Stars />
        </p>
        <p className={s.lead}>
          Средняя оценка бренда на Wildberries, Ozon и Emall. Если вам удобнее
          там — KAVA HOME есть и на маркетплейсах.
        </p>
      </div>
      <ul className={s.shops}>
        {marketplaces.map((m) => (
          <li key={m.name}>
            <a
              href={m.url}
              target="_blank"
              rel="noopener noreferrer"
              className={s.shop}
            >
              <span className={s.shopPhoto}>
                <Image
                  src={m.photo}
                  alt=""
                  fill
                  sizes="(max-width: 760px) 100vw, 22vw"
                  style={{
                    objectFit: "cover",
                    objectPosition: m.position ?? "50% 50%",
                  }}
                  quality={75}
                />
              </span>
              <span className={s.shopLogo}>
                <PartnerLogo p={m} area={3000} />
              </span>
              <span className={s.shopText}>
                <span>Магазин KAVA HOME</span>
                <span className={s.shopGo}>
                  Открыть на {m.name}
                  <svg viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M3 9l6-6M4 3h5v5" />
                  </svg>
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
