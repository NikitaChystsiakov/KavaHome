import { INDEXABLE, SITE_URL } from "@/lib/site";

// robots.txt текстом, а не через app/robots.ts: Next не умеет Clean-param (директива Яндекса).
// Пока SITE_INDEX не равен 1 (демо на vercel.app), сайт целиком закрыт от поисковиков.
// Clean-param: параметры фильтров, цвета и размера не меняют содержимое страницы для поиска,
// Яндекс склеивает такие адреса с адресом без параметров. Google то же делает по canonical.
const PARAMS = "q&razmer&plotnost&min&max&kat&nazn&tkan&kol&cvet&sort&vid&poisk";

export function GET() {
  const body = INDEXABLE
    ? [
        "User-Agent: *",
        "Allow: /",
        // корзина, «спасибо» и API не нужны в поиске
        "Disallow: /api/",
        "Disallow: /korzina",
        "Disallow: /spasibo",
        "",
        "User-Agent: Yandex",
        "Allow: /",
        "Disallow: /api/",
        "Disallow: /korzina",
        "Disallow: /spasibo",
        `Clean-param: ${PARAMS}`,
        "",
        `Sitemap: ${SITE_URL}/sitemap.xml`,
        "",
      ]
    : ["User-Agent: *", "Disallow: /", ""];
  return new Response(body.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
