import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { forCollection } from "@/lib/catalog";
import { collections } from "@/lib/collections";
import { getProducts } from "@/lib/woo";

// Страницы коллекций отдельно не делаем (2026-11-19): коллекция = карточка её основной модели /catalog/<id>
// (фото столбцом, цвет и размер в адресе). Адрес /kollekcii/<slug> остаётся для старых ссылок и ведёт туда.

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return collections.map((x) => ({ slug: x.slug }));
}

async function Go({ params }: Params) {
  const { slug } = await params;
  const { product } = forCollection(slug, await getProducts());
  if (!product) notFound();
  permanentRedirect(`/catalog/${product.id}`);
  return null;
}

export default function CollectionPage({ params }: Params) {
  return (
    <Suspense fallback={null}>
      <Go params={params} />
    </Suspense>
  );
}
