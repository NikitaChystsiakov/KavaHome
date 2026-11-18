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
  title: "Махровые полотенца в Минске — купить в KAVA HOME",
  description:
    "Махровые полотенца из 100% хлопка в Минске: Верона, Венеция, Милан, Римини, наборы по 3 шт, коврики, халаты. Доставка по Беларуси.",
  alternates: { canonical: "./" },
  // превью ссылки в Telegram, Viber и соцсетях; картинка — app/opengraph-image.jpg
  openGraph: {
    type: "website",
    locale: "ru_BY",
    siteName: "KAVA HOME",
  },
  // подтверждение прав в Яндекс Вебмастере и Google Search Console: коды задаются переменными окружения
  verification: {
    yandex: process.env.YANDEX_VERIFICATION,
    google: process.env.GOOGLE_SITE_VERIFICATION,
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
