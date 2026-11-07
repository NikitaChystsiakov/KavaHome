import Image from "next/image";
import type { Collection, CitySymbol } from "@/lib/collections";
import { citySymbol } from "./symbols";
import { Stamp } from "./Stamp";
import s from "./home.module.css";

type Props = { c: Collection; index: number; all: Collection[] };

// Слайд-открытка коллекции: кадр | панель в тон полотенца.
export function CitySlide({ c, index, all }: Props) {
  const sym = citySymbol(c.slug as CitySymbol);
  const num = String(index + 1).padStart(2, "0");
  const minPrice = Math.min(...c.colors.map((v) => v.priceFrom));

  return (
    <section
      id={c.slug}
      className={s.slide}
      data-slide
      data-light={c.light ? "true" : "false"}
      style={{ "--tone": c.tone, "--len": c.city.length } as React.CSSProperties}
      aria-labelledby={`${c.slug}-title`}
    >
      <div className={s.slidePhoto}>
        <Image
          src={c.image}
          alt={`Коллекция ${c.city}, полотенца крупным планом`}
          fill
          sizes="(max-width: 760px) 100vw, 50vw"
          style={{ objectFit: "cover", objectPosition: c.imagePosition }}
          quality={75}
        />
      </div>

      <div className={s.panel}>
        <div className={s.postcard}>
          <figure className={s.postage} aria-hidden="true">
            <span className={s.postNum}>№ {num}</span>
            <svg className={s.symbol} viewBox={sym.viewBox} preserveAspectRatio="xMidYMid meet">
              <path d={sym.d} pathLength={1} />
            </svg>
            <figcaption className={s.postName}>
              {c.latin}
              <small>{c.countryLatin}</small>
            </figcaption>
          </figure>
          <Stamp id={c.slug} ru={c.city.toUpperCase()} latin={c.latin} country={c.country.toUpperCase()} className={s.stamp} />
        </div>

        <div className={s.panelBody}>
          <h2 id={`${c.slug}-title`} className={s.city}>
            {c.city}
          </h2>
          <p className={s.where}>
            {c.country} <span aria-hidden="true">·</span> <span className={s.coords}>{c.coords}</span>
          </p>
          <dl className={s.facts}>
            {c.facts.map((f) => (
              <div key={f.term}>
                <dt>{f.term}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>

          <ul className={s.ribbon} aria-label={`Цвета коллекции ${c.city}`}>
            {c.colors.map((v, i) => (
              <li key={v.name}>
                <a href={`/catalog/${c.slug}?color=${encodeURIComponent(v.name)}`} className={s.chip} data-on={i === 0}>
                  <span className={s.chipImg}>
                    <Image src={v.image} alt="" fill sizes="96px" style={{ objectFit: "cover", objectPosition: "35% 72%" }} quality={75} />
                  </span>
                  <span className={s.chipName}>{v.name}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className={s.buy}>
            <a href={`/catalog/${c.slug}`} className={s.btnSolid}>
              <span>Смотреть «{c.city}»</span>
              <svg viewBox="0 0 18 10" aria-hidden="true">
                <path d="M0 5h16M12 1l4 4-4 4" />
              </svg>
            </a>
            <p className={s.price}>
              от {minPrice} BYN
              <small>цена примерная</small>
            </p>
          </div>
        </div>

        <ol className={s.route} aria-label="Коллекции">
          {all.map((x) => (
            <li key={x.slug} aria-current={x.slug === c.slug ? "true" : undefined}>
              <a href={`#${x.slug}`}>{x.city}</a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
