import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { allCards, plural, priceRange } from "@/lib/catalog";
import { collections } from "@/lib/collections";
import { categoryPath, productCategory } from "@/lib/categories";
import { getProducts } from "@/lib/woo";
import { OG, SITE_URL, breadcrumbs, jsonLd } from "@/lib/site";
import { CatalogCard } from "@/components/Catalog";
import { ProductView } from "@/components/ProductView";
import { Shell } from "@/components/Shell";
import s from "@/components/product.module.css";
import c from "@/components/catalog.module.css";

export async function generateStaticParams() {
  const list = await getProducts();
  return list.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/catalog/[id]">): Promise<Metadata> {
  const { id } = await params;
  const p = (await getProducts()).find((x) => x.id === id);
  if (!p) return { title: "Товар не найден — KAVA HOME" };
  const [min, max] = priceRange(p);
  const name = `${p.name} ${p.title}`;
  const woo = p.source === "woo";
  const price = min === max ? `${min} BYN` : `от ${min} BYN`;
  // размеры — частая часть запроса («полотенце 70×140»), в описании их перечисляем
  const sizes = [...new Set(p.colors.flatMap((c) => (c.sizes?.length ? c.sizes : p.sizes).map((z) => z.label)))]
    .filter((z) => /^\d/.test(z)) // «Набор 3 шт» — не размер
    .sort((a, b) => a.localeCompare(b, "ru", { numeric: true }));
  const colors = p.colors.length > 1
    ? `${p.colors.length} ${plural(p.colors.length, "цвет", "цвета", "цветов")}: ${p.colors.map((x) => x.name).join(", ")}`
    : `Цвет: ${p.colors[0].name}`;
  const description = [
    `${name} из ${p.composition === "100% хлопок" || !p.composition ? "100% хлопка" : p.composition}${p.density ? `, ${p.density} г/м²` : ""}.`,
    sizes.length > 1 ? `Размеры: ${sizes.join(", ")}.` : sizes.length ? `Размер ${sizes[0]}.` : "",
    `${colors}.`,
    woo ? `Цена ${min === max ? `${min}` : `${min}–${max}`} BYN, доставка по Беларуси.` : "Цену уточнит менеджер, доставка по Беларуси.",
  ].filter(Boolean).join(" ");
  // бренд в конце, только если title помещается в выдачу (~70 знаков)
  const base = `${name} — купить в Минске, ${woo ? price : "цена по запросу"}`;
  const title = base.length + 12 <= 70 ? `${base} | KAVA HOME` : base;
  return {
    // превью ссылки: фото первого цвета вместо общей картинки сайта
    openGraph: {
      ...OG,
      title: `${name} — KAVA HOME`,
      description,
      images: [{ url: p.colors[0].image, alt: name }],
    },
    title,
    description,
  };
}

async function Product({
  params,
}: {
  params: PageProps<"/catalog/[id]">["params"];
}) {
  const { id } = await params;
  const list = await getProducts();
  const p = list.find((x) => x.id === id);
  if (!p) notFound();
  const collection = collections.find((x) => x.slug === p.collection);
  // ниже карточки: та же коллекция (наборы, коврики), потом соседи по категории
  const same = list.filter(
    (x) => x.id !== p.id && p.collection && x.collection === p.collection,
  );
  const near = list
    .filter(
      (x) => x.id !== p.id && !same.includes(x) && x.category === p.category,
    )
    .slice(0, 8 - same.length);
  const more = allCards([...same, ...near]).slice(0, 8);

  const [min, max] = priceRange(p);
  const cat = productCategory(p);
  const crumbs = breadcrumbs([
    { name: "Главная", path: "" },
    { name: "Каталог", path: "/catalog" },
    ...(cat ? [{ name: cat.h1, path: categoryPath(cat) }] : []),
    { name: `${p.name} ${p.title}`, path: `/catalog/${p.id}` },
  ]);
  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${p.name} ${p.title}`,
    brand: { "@type": "Brand", name: "KAVA HOME" },
    image: p.colors.flatMap((c) => c.images?.length ? c.images.slice(0, 1) : [c.image]).map((src) => (src.startsWith("http") ? src : `${SITE_URL}${src}`)),
    description: `${p.composition ?? "100% хлопок"}${p.density ? `, ${p.density} г/м²` : ""}. Цвета: ${p.colors.map((c) => c.name).join(", ")}.`,
    sku: p.colors[0].sizes?.[0]?.sku || undefined,
    color: p.colors.map((c) => c.name).join(", "),
    material: p.composition ?? "100% хлопок",
    ...(p.source === "woo" && {
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "BYN",
        lowPrice: min,
        highPrice: max,
        offerCount: p.colors.reduce((n, c) => n + (c.sizes?.length ?? p.sizes.length), 0),
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/catalog/${p.id}`,
      },
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(product)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(crumbs)} />
      <ProductView product={p} collection={collection} />
      {more.length > 0 && (
        <section className={s.related} aria-labelledby="related-title">
          <div className={s.relatedHead}>
            <h2 id="related-title">
              {same.length && !near.length
                ? `Ещё из коллекции ${collection?.city ?? p.title}`
                : "Вам может подойти"}
            </h2>
            <Link href="/catalog" className="caps">
              Весь каталог
            </Link>
          </div>
          <ul
            className={c.grid}
            style={{ "--cols": 4 } as React.CSSProperties}
            data-cols={4}
          >
            {more.map((card) => (
              <li key={card.key}>
                <CatalogCard card={card} eager={false} cols={4} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

export default function ProductPage({ params }: PageProps<"/catalog/[id]">) {
  return (
    <Shell>
      <Suspense fallback={<div style={{ minHeight: "100svh" }} />}>
        <Product params={params} />
      </Suspense>
    </Shell>
  );
}
