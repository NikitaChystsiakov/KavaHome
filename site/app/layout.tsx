import type { Metadata, Viewport } from "next";
import { Forum, Golos_Text, Marck_Script } from "next/font/google";
import "./globals.css";

const forum = Forum({
  variable: "--font-forum",
  weight: "400",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const golos = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

// почерк для оборота открыток
const hand = Marck_Script({
  variable: "--font-hand",
  weight: "400",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KAVA HOME — махровые полотенца собственного производства из Узбекистана",
  description:
    "Махровые полотенца собственного производства из Узбекистана, коврики и наборы KAVA HOME. Коллекции Верона, Римини, Венеция, Флоренция, Милан. Минск, доставка по Беларуси, заказы для отелей и с логотипом.",
  // демо на vercel.app закрыто от поисковиков; снять при запуске на kavahome.by
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#fbf8f3",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${forum.variable} ${golos.variable} ${hand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
