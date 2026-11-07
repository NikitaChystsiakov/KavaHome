import type { Metadata, Viewport } from "next";
import { Forum, Golos_Text } from "next/font/google";
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

export const metadata: Metadata = {
  title: "KAVA HOME — махровые полотенца из Минска",
  description:
    "Махровые полотенца, коврики и наборы KAVA HOME. Коллекции Верона, Римини, Венеция, Флоренция, Милан. Доставка по Беларуси, заказы для отелей и с логотипом.",
};

export const viewport: Viewport = {
  themeColor: "#f4f1ec",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${forum.variable} ${golos.variable}`}>
      <body>{children}</body>
    </html>
  );
}
