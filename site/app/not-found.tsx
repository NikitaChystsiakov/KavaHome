import Link from "next/link";
import { TopBar } from "@/components/TopBar";

// В прототипе готова только главная: остальные ссылки ведут сюда.
export default function NotFound() {
  return (
    <>
      <TopBar />
      <main style={{ minHeight: "100svh", display: "grid", placeItems: "center", padding: "120px 28px", textAlign: "center" }}>
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1 }}>
            Эта страница будет в полной версии
          </h1>
          <p style={{ marginTop: 18, color: "var(--ink-2)" }}>Сейчас готова главная: каталог, карточка и корзина — следующим шагом.</p>
          <Link href="/" className="caps" style={{ display: "inline-block", marginTop: 28, borderBottom: "1px solid", paddingBottom: 3 }}>
            На главную
          </Link>
        </div>
      </main>
    </>
  );
}
