import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    qualities: [75, 85],
    // фото с хостинга kavahome.by отвечают по 3–5 с: сжатую копию держим неделю, а не 4 часа по умолчанию,
    // чтобы покупатели реже ждали повторного сжатия. Сбросить кэш нельзя — заменённое фото класть под новым именем.
    minimumCacheTTL: 604800,
    // фото товаров из админки WooCommerce
    remotePatterns: [new URL("https://kavahome.by/wp-content/uploads/**")],
  },
};

export default nextConfig;
