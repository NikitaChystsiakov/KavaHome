import { collections } from "@/lib/collections";
import { TopBar } from "./TopBar";
import { Deck } from "./Deck";
import { CollectionsRail } from "./CollectionsRail";
import { CollectionsStage } from "./CollectionsStage";
import { OpenPostcard } from "./OpenPostcard";
import { CityIndex } from "./CityIndex";
import { ColorSplit } from "./ColorSplit";
import { Ring } from "./Ring";
import { ZaraRow } from "./ZaraRow";
import { Wheel } from "./Wheel";
import { Catalog } from "./Catalog";
import { PresentationScroll } from "./PresentationScroll";
import { Hero, Gifts, Hotels, Footer } from "./Sections";

// Главная после звонка 2026-11-09: первый экран → колода открыток-коллекций → каталог по схеме Zara Home →
// подарочные наборы QD → для отелей → подвал.
// view: эскизы показа коллекций — deck (колода, текущая), rail (A, лента фото), stage (B, витрина),
// open (C, открытка во весь экран), index (D, указатель городов), tint (E, цвет коллекции),
// ring (F, кольцо открыток в пространстве и под ним простой ряд в духе Zara для сравнения)
// fan (по умолчанию с 2026-11-10): веер-лента открыток; 2026-11-11 заказчик выбрал веер, витрина B со второго экрана убрана
export type HomeView = "fan" | "deck" | "rail" | "stage" | "open" | "index" | "tint" | "ring";
export function HomePage({ view = "fan" }: { view?: HomeView }) {
  return (
    <>
      <TopBar />
      <main>
        <Hero />
        {view === "fan" && (
          <section id="kollekcii" aria-label="Коллекции" data-screen>
            <Wheel items={collections} mode="flow" />
          </section>
        )}
        {view === "deck" && <Deck items={collections} />}
        {view === "rail" && <CollectionsRail items={collections} />}
        {view === "stage" && <CollectionsStage items={collections} />}
        {view === "open" && <OpenPostcard items={collections} />}
        {view === "index" && <CityIndex items={collections} />}
        {view === "tint" && <ColorSplit items={collections} />}
        {view === "ring" && (
          <>
            <section id="kollekcii" aria-label="Коллекции">
              <Ring items={collections} />
            </section>
            <ZaraRow items={collections} />
          </>
        )}
        <Catalog collections={collections} />
        <Gifts />
        <Hotels />
      </main>
      <Footer />
      {view === "fan" && <PresentationScroll />}
    </>
  );
}
