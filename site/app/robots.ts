import type { MetadataRoute } from "next";
import { INDEXABLE, SITE_URL } from "@/lib/site";

// Пока SITE_INDEX не равен 1 (демо на vercel.app), сайт целиком закрыт от поисковиков.
export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // корзина, «спасибо» и API не нужны в поиске; параметры фильтров не плодят дубли
      disallow: ["/api/", "/korzina", "/spasibo"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
