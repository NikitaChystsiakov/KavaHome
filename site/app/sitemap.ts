import type { MetadataRoute } from "next";
import { collections } from "@/lib/collections";
import { getProducts } from "@/lib/woo";
import { SITE_URL } from "@/lib/site";
import { categoryPages, categoryPath } from "@/lib/categories";

// Карта сайта: страницы, коллекции и товары из WooCommerce (обновляется вместе с каталогом).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly",
    priority,
  });
  const products = await getProducts();
  return [
    page("", 1),
    page("/catalog", 0.9),
    ...categoryPages.map((c) => page(categoryPath(c), 0.9)),
    page("/kollekcii", 0.7),
    ...collections.map((c) => page(`/kollekcii/${c.slug}`, 0.7)),
    ...products.map((p) => page(`/catalog/${p.id}`, p.source === "woo" ? 0.8 : 0.4)),
    page("/biznes", 0.6),
    page("/dostavka", 0.5),
    page("/kontakty", 0.5),
    page("/o-nas", 0.5),
    page("/faq", 0.4),
    // /privacy закрыта noindex — в карту сайта не входит
  ];
}
