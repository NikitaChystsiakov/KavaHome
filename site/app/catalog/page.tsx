import type { Metadata } from "next";
import { collections } from "@/lib/collections";
import { getProducts } from "@/lib/woo";
import { Catalog } from "@/components/Catalog";
import { Shell } from "@/components/Shell";

export const metadata: Metadata = {
  title: "Каталог махровых полотенец, ковриков и наборов — KAVA HOME",
  description:
    "Махровые полотенца из 100% хлопка 420–500 г/м², коврики, наборы и подарочные полотенца. Фильтры по назначению, цвету и коллекции. Доставка по Беларуси.",
};

export default async function CatalogPage() {
  const products = await getProducts();
  return (
    <Shell>
      <div style={{ paddingTop: "var(--hdr)" }}>
        <Catalog collections={collections} products={products} page />
      </div>
    </Shell>
  );
}
