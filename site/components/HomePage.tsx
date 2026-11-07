import { collections } from "@/lib/collections";
import { TopBar } from "./TopBar";
import { CitySlide } from "./CitySlide";
import { SlidesObserver } from "./SlidesObserver";
import { PresentationScroll } from "./PresentationScroll";
import { Hero, Purposes, Hotels, Gifts, Footer } from "./Sections";

// Главная целиком: первый экран, тур по городам-коллекциям открытками, разделы и подвал.
export function HomePage() {
  return (
    <>
      <TopBar />
      <main>
        <Hero count={collections.length} />
        <div>
          {collections.map((c, i) => (
            <CitySlide key={c.slug} c={c} index={i} all={collections} />
          ))}
        </div>
        <SlidesObserver selector="[data-slide]" />
        <PresentationScroll />
        <Purposes />
        <Hotels />
        <Gifts />
      </main>
      <Footer />
    </>
  );
}
