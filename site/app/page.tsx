import { collections } from "@/lib/collections";
import { TopBar } from "@/components/TopBar";
import { CitySlide } from "@/components/CitySlide";
import { SlidesObserver } from "@/components/SlidesObserver";
import { Hero, Purposes, Hotels, Gifts, Footer } from "@/components/Sections";

export default function Home() {
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
        <Purposes />
        <Hotels />
        <Gifts />
      </main>
      <Footer />
    </>
  );
}
