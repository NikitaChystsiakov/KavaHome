import type { Metadata, Viewport } from "next";
import { Forum, Golos_Text, Marck_Script } from "next/font/google";
import "./globals.css";
import { INDEXABLE, SITE_URL } from "@/lib/site";
import { ScrollTop } from "@/components/ScrollTop";

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
  metadataBase: new URL(SITE_URL),
  title: "KAVA HOME — махровые полотенца в Минске",
  description:
    "Махровые полотенца из 100% хлопка, коврики и наборы KAVA HOME. Коллекции Верона, Римини, Венеция, Флоренция, Милан. Минск, доставка по Беларуси, заказы для отелей и с логотипом.",
  alternates: { canonical: "./" },
  // превью ссылки в Telegram, Viber и соцсетях; картинка — app/opengraph-image.jpg
  openGraph: {
    type: "website",
    locale: "ru_BY",
    siteName: "KAVA HOME",
  },
  // демо закрыто от поисковиков; на боевом домене SITE_INDEX=1 (lib/site.ts)
  robots: INDEXABLE ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#fbf8f3",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${forum.variable} ${golos.variable} ${hand.variable}`}>
      <body>
        {children}
        <ScrollTop />
      </body>
    </html>
  );
}
