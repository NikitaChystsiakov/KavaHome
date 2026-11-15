import { collections } from "@/lib/collections";
import type { Product } from "@/lib/catalog";
import { TopBar } from "./TopBar";
import { Wheel } from "./Wheel";
import { Catalog } from "./Catalog";
import { PresentationScroll } from "./PresentationScroll";
import { Hero, Gifts, Hotels, Footer } from "./Sections";
import { Trust } from "./Partners";

// Главная после звонка 2026-11-09: первый экран → веер открыток-коллекций (выбран заказчиком 2026-11-11) →
// каталог по схеме Zara Home → подарочные наборы QD → нам доверяют (отели, сети и маркетплейсы одним экраном)
// → вход «для бизнеса» → подвал. Эскизы других вариантов (/v/*) удалены 2026-11-15, они есть в истории git.
// products: товары из WooCommerce (app/page.tsx)
export function HomePage({ products }: { products: Product[] }) {
  return (
    <>
      <TopBar />
      <main>
        <Hero />
        <section id="kollekcii" aria-label="Коллекции" data-screen>
          <Wheel items={collections} mode="flow" products={products} />
        </section>
        <Catalog collections={collections} products={products} />
        <Gifts />
        <Trust />
        <Hotels />
      </main>
      <Footer />
      <PresentationScroll />
    </>
  );
}
