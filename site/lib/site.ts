// Адрес витрины и разрешение индексации.
// SITE_URL можно задать явно; иначе на Vercel берётся основной адрес проекта (сейчас kavahome.vercel.app,
// после подключения домена — kavahome.by), локально — kavahome.by. От адреса зависят превью ссылок,
// канонические адреса и карта сайта.
// Индексация закрыта, пока в переменных окружения нет SITE_INDEX=1: ставить только на боевом домене.
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const SITE_URL = (
  process.env.SITE_URL ?? (vercel ? `https://${vercel}` : "https://kavahome.by")
).replace(/\/$/, "");
export const INDEXABLE = process.env.SITE_INDEX === "1";

// общая часть превью ссылок: страница с собственным openGraph заменяет корневой целиком, поэтому повторяем
export const OG = { type: "website", locale: "ru_BY", siteName: "KAVA HOME" } as const;

// хлебные крошки для поисковиков (BreadcrumbList); путь без адреса сайта
export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((x, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: x.name,
      item: `${SITE_URL}${x.path}`,
    })),
  };
}

export const jsonLd = (data: unknown) => ({
  __html: JSON.stringify(data).replace(/</g, "\\u003c"),
});
