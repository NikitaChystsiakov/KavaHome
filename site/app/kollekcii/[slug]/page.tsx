import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { forCollection, plural, priceRange, type Card } from "@/lib/catalog";
import { collections, legKm } from "@/lib/collections";
import { sizeNote } from "@/lib/colors";
import { stories } from "@/lib/stories";
import { getProducts } from "@/lib/woo";
import { CatalogCard } from "@/components/Catalog";
import { Shell } from "@/components/Shell";
import { Stamp } from "@/components/Stamp";
import c from "@/components/catalog.module.css";
import s from "@/components/collection.module.css";

// Страница коллекции-города (2026-11-15): первый экран с фото и характеристиками → почему так названа
// и факты о городе рядом со старинной открыткой → все цвета карточками каталога → следующая остановка маршрута.
// Плотность, состав, размеры и цены — из товара WooCommerce (или заглушки прототипа), тексты — lib/stories.ts.

type Params = { params: Promise<{ slug: string }> };

const pad = (n: number) => String(n).padStart(2, "0");

export function generateStaticParams() {
  return collections.map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const col = collections.find((x) => x.slug === slug);
  if (!col) return { title: "Коллекция не найдена — KAVA HOME" };
  const { product, colors } = forCollection(slug, await getProducts());
  const kind = product?.name.toLowerCase() ?? "полотенца";
  return {
    openGraph: {
      type: "website",
      locale: "ru_BY",
      siteName: "KAVA HOME",
      title: `Коллекция ${col.city} — KAVA HOME`,
      images: [{ url: col.image, alt: `Полотенца коллекции ${col.city}` }],
    },
    title: `Коллекция ${col.city} — ${kind}${product ? `, ${product.density} г/м²` : ""} | KAVA HOME`,
    description: `${col.city}: ${stories[slug]?.tagline ?? ""} ${colors.length ? `${colors.length} ${plural(colors.length, "цвет", "цвета", "цветов")}: ${colors.map((x) => x.name).join(", ")}.` : ""} ${product?.composition ?? "100% хлопок"}. Доставка по Беларуси.`.replace(/\s+/g, " "),
  };
}

async function CollectionView({ params }: Params) {
  const { slug } = await params;
  const index = collections.findIndex((x) => x.slug === slug);
  if (index < 0) notFound();
  const col = collections[index];
  const story = stories[slug];
  const list = await getProducts();
  const own = list.filter((p) => p.collection === slug);
  const { product, colors, sizes } = forCollection(slug, list);
  const isWoo = product?.source === "woo";
  const [min, max] = product ? priceRange(product) : [0, 0];
  const kind = product?.category === "mats" ? "mats" : product?.category === "kitchen" ? "kitchen" : "bath";

  // каждый цвет основной модели — своей карточкой, за ними наборы и остальное из коллекции
  const cards: Card[] = [
    ...(product ? product.colors.map((_, i) => ({ key: `${product.id}-${i}`, product, colorIndex: i })) : []),
    ...own.filter((p) => p !== product).map((p) => ({ key: p.id, product: p, colorIndex: 0 })),
  ];

  const next = collections[(index + 1) % collections.length];
  const prev = collections[(index - 1 + collections.length) % collections.length];
  const km = legKm[`${slug}-${next.slug}`];

  const specs = [
    product && { term: "Плотность", value: `${product.density} г/м²` },
    { term: "Состав", value: product?.composition ?? "100% хлопок" },
    ...col.facts.filter((f) => f.term !== "Где" && f.term !== "Что это"),
    sizes.length > 0 && {
      term: "Размеры",
      value: sizes.map((z) => `${z} ${sizeNote(z, kind)}`.trim()).join(" · "),
    },
    { term: "Цена", value: isWoo ? (min === max ? `${min} BYN` : `${min}–${max} BYN`) : "уточнит менеджер" },
  ].filter(Boolean) as { term: string; value: string }[];

  return (
    <>
      <section className={s.hero} aria-labelledby="col-title">
        <figure className={s.heroPhoto}>
          <Image
            src={col.image}
            alt={`Полотенца коллекции ${col.city}`}
            fill
            preload
            sizes="(max-width: 900px) 100vw, 58vw"
            style={{ objectFit: "cover", objectPosition: col.imagePosition ?? "50% 50%" }}
            quality={85}
          />
        </figure>
        <div className={s.heroText}>
          <p className="caps">
            <Link href="/kollekcii">Коллекции</Link> · {pad(index + 1)} из {pad(collections.length)}
          </p>
          <h1 id="col-title">{col.city}</h1>
          <p className={s.latin}>
            {col.latin} · {col.countryLatin} · {col.coords}
          </p>
          {story && <p className={s.tagline}>{story.tagline}</p>}
          {colors.length > 0 && (
            <ul className={s.swatches} aria-label="Цвета">
              {colors.map((x) => (
                <li key={x.name}>
                  <Link
                    href={`/catalog/${product!.id}?cvet=${encodeURIComponent(x.name)}`}
                    style={{ background: x.swatch }}
                    title={x.name}
                    aria-label={x.name}
                  />
                </li>
              ))}
            </ul>
          )}
          <dl className={s.specs}>
            {specs.map((f) => (
              <div key={f.term}>
                <dt>{f.term}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className={s.btns}>
            <a href="#cveta" className={s.btn}>
              Выбрать цвет и размер
            </a>
            <Link href={`/catalog?kol=${slug}`} className={s.btnGhost}>
              В каталоге
            </Link>
          </div>
        </div>
      </section>

      {story && (
        <section className={s.story} aria-labelledby="story-title" data-postcard={col.postcard ? true : undefined}>
          {col.postcard && (
            <figure className={s.postcard}>
              <span className={s.postcardImg}>
                <Image
                  src={col.postcard.src}
                  alt={`${col.postcard.caption}, старинная открытка`}
                  fill
                  sizes="(max-width: 900px) 92vw, 44vw"
                  style={{ objectFit: "cover" }}
                  quality={80}
                />
              </span>
              <figcaption>
                {col.postcard.caption}, {col.postcard.year}
              </figcaption>
              <Stamp
                id={`col-${slug}`}
                ring={`${col.latin} · ${col.countryLatin} · KAVA HOME ·`}
                center={pad(index + 1)}
                sub={`ИЗ ${pad(collections.length)}`}
                className={s.stamp}
                ink
              />
            </figure>
          )}
          <div className={s.storyText}>
            <p className="caps">Почему {col.city}</p>
            <h2 id="story-title">Привет {col.from}</h2>
            {story.story.map((t) => (
              <p key={t} className={s.para}>{t}</p>
            ))}
            <h3 className="caps">Интересно</h3>
            <ol className={s.facts}>
              {story.facts.map((f, i) => (
                <li key={f}>
                  <span>{pad(i + 1)}</span>
                  {f}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {cards.length > 0 && (
        <section id="cveta" className={s.colors} aria-labelledby="colors-title">
          <div className={s.colorsHead}>
            <h2 id="colors-title">
              {colors.length > 1 ? `${colors.length} ${plural(colors.length, "цвет", "цвета", "цветов")} коллекции` : "Коллекция"}
            </h2>
            <Link href={`/catalog?kol=${slug}`} className="caps">
              Смотреть в каталоге
            </Link>
          </div>
          <ul className={c.grid} style={{ "--cols": 4 } as React.CSSProperties} data-cols={4}>
            {cards.map((card, i) => (
              <li key={card.key}>
                <CatalogCard card={card} eager={i < 4} cols={4} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className={s.route} aria-label="Другие коллекции">
        <Link href={`/kollekcii/${next.slug}`} className={s.next}>
          <span className={s.nextPhoto}>
            <Image
              src={next.postcard?.src ?? next.image}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              style={{ objectFit: "cover", objectPosition: next.postcard ? "50% 50%" : next.imagePosition }}
              quality={70}
            />
          </span>
          <span className={s.nextText}>
            <span className="caps">
              Следующая остановка{km ? ` · ${km} км` : ""}
            </span>
            <b>{next.city}</b>
            <span>{stories[next.slug]?.tagline}</span>
          </span>
        </Link>
        <div className={s.routeLinks}>
          <Link href={`/kollekcii/${prev.slug}`}>← {prev.city}</Link>
          <Link href="/kollekcii">Все коллекции</Link>
        </div>
      </nav>
    </>
  );
}

export default function CollectionPage({ params }: Params) {
  return (
    <Shell>
      <Suspense fallback={<div style={{ minHeight: "100svh" }} />}>
        <CollectionView params={params} />
      </Suspense>
    </Shell>
  );
}
