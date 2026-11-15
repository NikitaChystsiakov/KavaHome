import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { forCollection } from "@/lib/catalog";
import { collections } from "@/lib/collections";
import { stories } from "@/lib/stories";
import { getProducts } from "@/lib/woo";
import { Shell } from "@/components/Shell";
import s from "@/components/collection.module.css";

export const metadata: Metadata = {
  title: "Коллекции полотенец — KAVA HOME",
  description:
    "Коллекции KAVA HOME названы в честь городов: Верона, Венеция, Римини, Флоренция, Неаполь, Милан, Бергамо, Лион. Махровые и вафельные полотенца, коврики, 100% хлопок.",
};

const pad = (n: number) => String(n).padStart(2, "0");

// Все города маршрута: фото полотенца и поверх старинная открытка (если есть), цвета, «от X BYN».
export default async function CollectionsPage() {
  const list = await getProducts();
  return (
    <Shell>
      <section className={s.indexTop}>
        <div>
          <p className="caps">KAVA HOME · {collections.length} городов</p>
          <h1>Коллекции</h1>
        </div>
        <p>
          Каждая коллекция названа в честь города и повторяет что-то из его
          характера: волну каналов, кладку купола, своды старых улиц.
        </p>
      </section>
      <ul className={s.cities}>
        {collections.map((c, i) => {
          const d = forCollection(c.slug, list);
          const woo = d.product?.source === "woo";
          return (
            <li key={c.slug}>
              <Link href={`/kollekcii/${c.slug}`} className={s.city}>
                <span className={s.cityImg}>
                  <Image
                    src={c.image}
                    alt={`Полотенца коллекции ${c.city}`}
                    fill
                    sizes="(max-width: 1100px) 50vw, 25vw"
                    style={{ objectFit: "cover", objectPosition: c.imagePosition ?? "50% 50%" }}
                    quality={70}
                    loading={i < 4 ? "eager" : "lazy"}
                  />
                  {c.postcard && (
                    <span className={s.cityCard}>
                      <span>
                        <Image
                          src={c.postcard.src}
                          alt=""
                          fill
                          sizes="(max-width: 1100px) 36vw, 18vw"
                          style={{ objectFit: "cover" }}
                          quality={70}
                        />
                      </span>
                      <i>{c.postcard.caption}</i>
                    </span>
                  )}
                </span>
                <span className={s.cityMeta}>
                  <span className="caps">
                    {pad(i + 1)} · {c.latin}
                  </span>
                  <b>{c.city}</b>
                  {d.colors.length > 0 && (
                    <span className={s.citySw} aria-hidden="true">
                      {d.colors.map((x) => (
                        <i key={x.name} style={{ background: x.swatch }} />
                      ))}
                    </span>
                  )}
                  <span>
                    {stories[c.slug]?.tagline}
                    {woo && d.from ? ` От ${d.from} BYN.` : ""}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <section className={s.indexMore}>
        <p>
          Кроме городов есть подарочные наборы QD, халаты и полотенца для
          отелей — они в каталоге.
        </p>
        <Link href="/catalog" className={s.btn}>
          Весь каталог
        </Link>
      </section>
    </Shell>
  );
}
