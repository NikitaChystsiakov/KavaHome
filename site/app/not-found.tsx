import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/Shell";

export const metadata: Metadata = { title: "Страница не найдена — KAVA HOME" };

export default function NotFound() {
  return (
    <Shell>
      <div style={{ minHeight: "80svh", display: "grid", placeItems: "center", padding: "120px 28px", textAlign: "center" }}>
        <div>
          <p className="caps" style={{ color: "var(--ink-2)", fontSize: 11, fontWeight: 600 }}>
            Ошибка 404
          </p>
          <h1 style={{ marginTop: 14, fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1 }}>
            Такой страницы нет
          </h1>
          <p style={{ marginTop: 18, color: "var(--ink-2)" }}>Возможно, товар сняли с продажи или ссылка устарела.</p>
          <Link href="/catalog" className="caps" style={{ display: "inline-block", marginTop: 28, borderBottom: "1px solid", paddingBottom: 3 }}>
            Перейти в каталог
          </Link>
        </div>
      </div>
    </Shell>
  );
}
