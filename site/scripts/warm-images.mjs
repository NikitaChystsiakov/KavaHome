// Прогрев фото после выкладки: обходит страницы из sitemap.xml и запрашивает картинки (/_next/image),
// чтобы первые покупатели не ждали, пока Vercel скачает фото с медленного хостинга и сожмёт его.
// Запуск: node scripts/warm-images.mjs https://kavahome.vercel.app
// По два запроса за раз: хостинг kavahome.by не любит залпы.
const base = (process.argv[2] ?? "https://kavahome.vercel.app").replace(/\/$/, "");
const UA = { "User-Agent": "kavahome-warmup" };

const xml = await (await fetch(`${base}/sitemap.xml`, { headers: UA })).text();
// в карте сайта может стоять боевой домен — подменяем на проверяемый адрес
const pages = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => base + new URL(m[1]).pathname);
console.log(`страниц: ${pages.length}`);

const images = new Set();
for (const page of pages) {
  const html = await (await fetch(page, { headers: UA })).text();
  for (const m of html.matchAll(/(?:srcSet|srcset|imageSrcSet)="([^"]+)"/g))
    for (const part of m[1].split(", ")) {
      const url = part.trim().split(" ")[0].replace(/&amp;/g, "&");
      // для телефона и ноутбука: ширины 640–1200 покрывают почти всех
      const w = Number(new URLSearchParams(url.split("?")[1]).get("w"));
      if (url.startsWith("/_next/image") && w >= 640 && w <= 1200) images.add(base + url);
    }
}
console.log(`картинок: ${images.size}`);

const list = [...images];
let done = 0, slow = 0;
await Promise.all(
  [0, 1].map(async () => {
    while (list.length) {
      const url = list.shift();
      const t = Date.now();
      await fetch(url, { headers: UA }).then((r) => r.arrayBuffer()).catch(() => {});
      if (Date.now() - t > 1500) slow++;
      if (++done % 25 === 0) console.log(`${done}/${images.size}`);
    }
  }),
);
console.log(`готово: ${done}, из них сжимались заново (дольше 1,5 с): ${slow}`);
