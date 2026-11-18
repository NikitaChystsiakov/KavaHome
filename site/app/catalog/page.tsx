import type { Metadata } from "next";
import { collections } from "@/lib/collections";
import { getProducts } from "@/lib/woo";
import { CATALOG_TITLE } from "@/lib/categories";
import { Catalog } from "@/components/Catalog";
import { Shell } from "@/components/Shell";

export const metadata: Metadata = {
  title: CATALOG_TITLE,
  description:
    "Махровые и вафельные полотенца, наборы по 3 шт, коврики и халаты из 100% хлопка. Размеры от 30×30 до 100×150, много цветов, доставка по Беларуси.",
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
