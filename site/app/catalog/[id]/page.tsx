import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { allCards, priceRange } from "@/lib/catalog";
import { collections } from "@/lib/collections";
import { getProducts } from "@/lib/woo";
import { CatalogCard } from "@/components/Catalog";
import { ProductView } from "@/components/ProductView";
import { Shell } from "@/components/Shell";
import s from "@/components/product.module.css";
import c from "@/components/catalog.module.css";

export async function generateStaticParams() {
  const list = await getProducts();
  return list.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/catalog/[id]">): Promise<Metadata> {
  const { id } = await params;
  const p = (await getProducts()).find((x) => x.id === id);
  if (!p) return { title: "Товар не найден — KAVA HOME" };
  const [min, max] = priceRange(p);
  return {
    title: `${p.name} ${p.title} — ${p.colors.length > 1 ? `${p.colors.length} цветов, ` : ""}от ${min} BYN | KAVA HOME`,
    description: `${p.name} ${p.title}: ${p.colors.map((x) => x.name).join(", ")}. ${p.density ? `${p.density} г/м², ` : ""}${p.composition ?? "100% хлопок"}. Цена ${min}–${max} BYN. Доставка по Беларуси.`,
  };
}

async function Product({ params }: { params: PageProps<"/catalog/[id]">["params"] }) {
  const { id } = await params;
  const list = await getProducts();
  const p = list.find((x) => x.id === id);
  if (!p) notFound();
  const collection = collections.find((x) => x.slug === p.collection);
  // ниже карточки: та же коллекция (наборы, коврики), потом соседи по категории
  const same = list.filter((x) => x.id !== p.id && p.collection && x.collection === p.collection);
  const near = list.filter((x) => x.id !== p.id && !same.includes(x) && x.category === p.category).slice(0, 8 - same.length);
  const more = allCards([...same, ...near]).slice(0, 8);

  return (
    <>
      <ProductView product={p} collection={collection} />
      {more.length > 0 && (
        <section className={s.related} aria-labelledby="related-title">
          <div className={s.relatedHead}>
            <h2 id="related-title">{same.length ? `Ещё из коллекции ${collection?.city ?? p.title}` : "Вам может подойти"}</h2>
            <Link href="/catalog" className="caps">
              Весь каталог
            </Link>
          </div>
          <ul className={c.grid} style={{ "--cols": 4 } as React.CSSProperties} data-cols={4}>
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
