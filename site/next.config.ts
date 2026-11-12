import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    qualities: [75, 85],
    // фото товаров из админки WooCommerce
    remotePatterns: [new URL("https://kavahome.by/wp-content/uploads/**")],
  },
};

export default nextConfig;
