import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections } from "@/lib/collections";
import { categoryBySlug, categoryPath } from "@/lib/categories";
import { getProducts } from "@/lib/woo";
import { breadcrumbs, jsonLd } from "@/lib/site";
import { Catalog } from "@/components/Catalog";
import { Shell } from "@/components/Shell";

// Страница категории: каталог с включённым фильтром. Файлы app/catalog/<slug>/page.tsx только вызывают это.
export function categoryMetadata(slug: string): Metadata {
  const c = categoryBySlug(slug);
  if (!c) return {};
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: categoryPath(c) },
    // openGraph не задаём: тогда превью берёт title, description и общую картинку app/opengraph-image.jpg
  };
}

export async function CategoryRoute({ slug }: { slug: string }) {
  const c = categoryBySlug(slug);
  if (!c) notFound();
  const products = await getProducts();
  const crumbs = breadcrumbs([
    { name: "Главная", path: "" },
    { name: "Каталог", path: "/catalog" },
    { name: c.h1, path: categoryPath(c) },
  ]);
  return (
    <Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(crumbs)} />
      <div style={{ paddingTop: "var(--hdr)" }}>
        <Catalog collections={collections} products={products} page category={slug} />
      </div>
    </Shell>
  );
}
