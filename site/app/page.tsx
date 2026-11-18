import { HomePage } from "@/components/HomePage";
import { getProducts } from "@/lib/woo";
import { contacts } from "@/lib/collections";
import { marketplaces } from "@/lib/partners";
import { SITE_URL, jsonLd } from "@/lib/site";

// Разметка бренда для поисковиков: организация (логотип, контакты, магазины на маркетплейсах) и сайт.
const brand = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "KAVA HOME",
      alternateName: "KavaHome Textile",
      url: SITE_URL,
      logo: `${SITE_URL}/apple-icon.png`,
      email: contacts.email,
      telephone: "+375291015858",
      sameAs: marketplaces.map((m) => m.url),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#site`,
      name: "KAVA HOME",
      url: SITE_URL,
      inLanguage: "ru-BY",
      publisher: { "@id": `${SITE_URL}/#org` },
    },
  ],
};

export default async function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(brand)} />
      <HomePage products={await getProducts()} />
    </>
  );
}
