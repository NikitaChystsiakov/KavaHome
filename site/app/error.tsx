"use client";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { contacts } from "@/lib/collections";
import s from "@/components/editorial.module.css";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Shell>
      <section className={s.infoTop}>
        <p className="caps">KAVA HOME</p>
        <h1>Не удалось загрузить страницу</h1>
        <p>
          Пожалуйста, попробуйте ещё раз. Если каталог пока недоступен, поможем
          с выбором по телефону.
        </p>
        <div className={s.jumpNav}>
          <button type="button" onClick={reset}>
            Попробовать ещё раз ↗
          </button>
          <a href={contacts.phoneHref}>{contacts.phone}</a>
          <Link href="/kontakty">Контакты</Link>
        </div>
      </section>
    </Shell>
  );
}
