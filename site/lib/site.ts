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
