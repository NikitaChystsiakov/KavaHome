import type { Metadata } from "next";
import { TopBar } from "@/components/TopBar";
import { Thanks } from "@/components/Thanks";

export const metadata: Metadata = {
  title: "Спасибо за заказ — KAVA HOME",
  robots: { index: false, follow: false },
};

// Страница после оформления заказа. В прототипе открывается напрямую (/spasibo), корзина будет следующим шагом.
export default function ThanksPage() {
  return (
    <>
      <TopBar compact />
      <Thanks />
    </>
  );
}
