import type { Metadata } from "next";
import { CartPage } from "@/components/CartPage";
import { Shell } from "@/components/Shell";

export const metadata: Metadata = {
  title: "Корзина — KAVA HOME",
  robots: { index: false, follow: false },
};

export default function KorzinaPage() {
  return (
    <Shell>
      <CartPage />
    </Shell>
  );
}
