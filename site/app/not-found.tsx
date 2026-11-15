import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import s from "@/components/editorial.module.css";
export const metadata: Metadata = { title: "Страница не найдена — KAVA HOME" };
export default function NotFound() {
  return (
    <Shell>
      <section className={s.notFound}>
        <p className="caps">404 · Адрес не найден</p>
        <span aria-hidden="true" className={s.bigNumber}>
          404
        </span>
        <h1>
          Кажется, мы свернули
          <br />
          не туда
        </h1>
        <p>
          Ссылка могла устареть, а товар — переехать.
          <br />
          Продолжим знакомство в каталоге?
        </p>
        <div className={s.jumpNav}>
          <Link href="/catalog">Перейти в каталог ↗</Link>
          <Link href="/kontakty">Связаться с нами</Link>
        </div>
      </section>
    </Shell>
  );
}
