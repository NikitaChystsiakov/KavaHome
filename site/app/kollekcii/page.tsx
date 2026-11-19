import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { forCollection, priceRange } from "@/lib/catalog";
import { extraCollections, type ExtraCollection } from "@/lib/collection-groups";
import { collections } from "@/lib/collections";
import { stories } from "@/lib/stories";
import { getProducts } from "@/lib/woo";
import { Shell } from "@/components/Shell";
import s from "@/components/collection.module.css";

export const metadata: Metadata = {
  title: "Коллекции полотенец: города, QD, халаты — KAVA HOME",
  description:
    "Коллекции KAVA HOME: полотенца-города (Верона, Венеция, Милан и другие), линейка QD и махровые халаты. 100% хлопок, доставка по Беларуси.",
  alternates: { canonical: "/kollekcii" },
};

const pad = (n: number) => String(n).padStart(2, "0");

// Все города маршрута: фото полотенца и поверх старинная открытка (если есть), цвета, «от X BYN».
export default async function CollectionsPage() {
  const list = await getProducts();
  const { cities, qd, other } = extraCollections(list);
  const robes = list.filter((p) => p.category === "robes");
  return (
    <Shell>
      <section className={s.indexTop}>
        <div>
          <p className="caps">KAVA HOME · {collections.length + cities.length} городов</p>
          <h1>
            Коллекции<span className="visually-hidden"> полотенец KAVA HOME</span>
          </h1>
        </div>
        <p>
          Города, линейка QD и халаты. Откройте коллекцию — откроется карточка
          с цветами, размерами и ценами.
        </p>
      </section>
      <div className={s.groupHead}>
        <h2>Города</h2>
        <p>
          Каждая коллекция названа в честь города и повторяет что-то из его
          характера: волну каналов, кладку купола, своды старых улиц.
        </p>
      </div>
      <ul className={s.cities}>
        {collections.map((c, i) => {
          const d = forCollection(c.slug, list);
          const woo = d.product?.source === "woo";
          return (
            <li key={c.slug}>
              <Link href={`/catalog/${d.product?.id ?? c.slug}`} className={s.city}>
                <span className={s.cityImg}>
                  <Image
                    src={c.image}
                    alt={`Полотенца коллекции ${c.city}`}
                    fill
                    sizes="(max-width: 1100px) 50vw, 25vw"
                    style={{ objectFit: "cover", objectPosition: c.imagePosition ?? "50% 50%" }}
                    quality={70}
                    loading={i < 4 ? "eager" : "lazy"}
                  />
                  {c.postcard && (
                    <span className={s.cityCard}>
                      <span>
                        <Image
                          src={c.postcard.src}
                          alt=""
                          fill
                          sizes="(max-width: 1100px) 36vw, 18vw"
                          style={{ objectFit: "cover" }}
                          quality={70}
                        />
                      </span>
                      <i>{c.postcard.caption}</i>
                    </span>
                  )}
                </span>
                <span className={s.cityMeta}>
                  <span className="caps">
                    {pad(i + 1)} · {c.latin}
                  </span>
                  <b>{c.city}</b>
                  {d.colors.length > 0 && (
                    <span className={s.citySw} aria-hidden="true">
                      {d.colors.map((x) => (
                        <i key={x.name} style={{ background: x.swatch }} />
                      ))}
                    </span>
                  )}
                  <span>
                    {stories[c.slug]?.tagline}
                    {woo && d.from ? ` От ${d.from} BYN.` : ""}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
        {cities.map((c) => (
          <Tile key={c.slug} c={c} />
        ))}
      </ul>
      {qd.length > 0 && (
        <Group
          title="QD"
          text="Линейка QD: полотенца с фактурным узором, продаются поштучно."
          items={qd}
        />
      )}
      {robes.length > 0 && (
        <>
          <div className={s.groupHead}>
            <h2>Халаты</h2>
            <p>Махровые халаты из хлопка для дома, бани и спа.</p>
          </div>
          <ul className={s.cities}>
            {robes.map((p) => {
              const [min] = priceRange(p);
              return (
                <li key={p.id}>
                  <Link href={`/catalog/${p.id}`} className={s.city}>
                    <span className={s.cityImg}>
                      <Image
                        src={p.colors[0].image}
                        alt={`${p.name} ${p.title}`}
                        fill
                        sizes="(max-width: 1100px) 50vw, 25vw"
                        style={{ objectFit: "cover", objectPosition: p.colors[0].position ?? "50% 50%" }}
                        quality={70}
                      />
                    </span>
                    <span className={s.cityMeta}>
                      <span className="caps">{p.colors.length} цв.</span>
                      <b>{p.title}</b>
                      <span className={s.citySw} aria-hidden="true">
                        {p.colors.map((x) => (
                          <i key={x.name} style={{ background: x.swatch }} />
                        ))}
                      </span>
                      <span>{p.source === "woo" && min ? `От ${min} BYN.` : "Цена по запросу."}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className={s.groupMore}>
            <Link href="/catalog/mahrovye-halaty">Все халаты →</Link>
          </p>
        </>
      )}
      {other.length > 0 && (
        <Group title="Отдельные коллекции" text="Сезонные и отдельные линии." items={other} />
      )}
      <section className={s.indexMore}>
        <p>Все модели вместе, с фильтрами по цвету, размеру и цене, — в каталоге.</p>
        <Link href="/catalog" className={s.btn}>
          Весь каталог
        </Link>
      </section>
    </Shell>
  );
}

// плитки коллекций из админки: фото, цвета, «от X BYN»
function Group({ title, text, items }: { title: string; text: string; items: ExtraCollection[] }) {
  return (
    <>
      <div className={s.groupHead}>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <ul className={s.cities}>
        {items.map((c) => (
          <Tile key={c.slug} c={c} />
        ))}
      </ul>
    </>
  );
}

function Tile({ c }: { c: ExtraCollection }) {
  return (
    <li>
      <Link href={`/catalog/${c.productId}`} className={s.city}>
        <span className={s.cityImg}>
          {c.image && (
            <Image
              src={c.image}
              alt={`Полотенца ${c.title}`}
              fill
              sizes="(max-width: 1100px) 50vw, 25vw"
              style={{ objectFit: "cover", objectPosition: c.position }}
              quality={70}
            />
          )}
        </span>
        <span className={s.cityMeta}>
          <span className="caps">{c.colors.length} цв.</span>
          <b>{c.title}</b>
          <span className={s.citySw} aria-hidden="true">
            {c.colors.map((x) => (
              <i key={x.name} style={{ background: x.swatch }} />
            ))}
          </span>
          {c.priced && <span>От {c.from} BYN.</span>}
        </span>
      </Link>
    </li>
  );
}
