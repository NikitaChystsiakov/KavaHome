import Image from "next/image";
import { legKm, type Collection } from "@/lib/collections";
import { Postcard } from "./Postcard";
import s from "./slide.module.css";

type Props = { c: Collection; index: number; all: Collection[] };

// Слайд-остановка тура: кадр полотенца | панель в тон с открыткой, городом и цветами.
export function CitySlide({ c, index, all }: Props) {
  const num = String(index + 1).padStart(2, "0");
  const total = String(all.length).padStart(2, "0");
  const minPrice = Math.min(...c.colors.map((v) => v.priceFrom));
  const prev = all[index - 1];
  const km = prev ? legKm[`${prev.slug}-${c.slug}`] : undefined;

  return (
    <section
      id={c.slug}
      className={s.slide}
      data-slide
      data-screen
      data-light={c.light ? "true" : "false"}
      style={{ "--tone": c.tone, "--len": c.city.length } as React.CSSProperties}
      aria-labelledby={`${c.slug}-title`}
    >
      <div className={s.photo}>
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
        <div className={s.visual}>
          <Postcard c={c} num={num} total={total} />
        </div>

        <div className={s.body}>
          <h2 id={`${c.slug}-title`} className={s.city}>
            {c.city}
          </h2>
          <p className={s.where}>
            <span>{c.country}</span>
            <span className={s.coords}>{c.coords}</span>
            <span className={s.leg}>
              {prev ? `${km} км от ${prev.from.replace(/^из /, "")}` : "начало маршрута"}
            </span>
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
              <li key={v.name} style={{ "--i": i } as React.CSSProperties}>
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
            <a href={`/catalog/${c.slug}`} className={s.btn}>
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

        <ol className={s.route} aria-label="Маршрут коллекций">
          {all.map((x, i) => {
            const prevX = all[i - 1];
            const leg = prevX ? legKm[`${prevX.slug}-${x.slug}`] : undefined;
            return (
              <li key={x.slug} aria-current={x.slug === c.slug ? "step" : undefined} data-done={i < index}>
                {leg && <span className={s.routeKm}>{leg} км</span>}
                <a href={`#${x.slug}`}>{x.city}</a>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
