import type { Metadata } from "next";
import { collections } from "@/lib/collections";
import { getProducts } from "@/lib/woo";
import { Catalog } from "@/components/Catalog";
import { Shell } from "@/components/Shell";

export const metadata: Metadata = {
  title: "Каталог махровых полотенец — KAVA HOME, Минск",
  description:
    "Банные, кухонные и пляжные полотенца, наборы по 3 шт, коврики и халаты из 100% хлопка. Цвета и размеры на выбор, доставка по Беларуси.",
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
