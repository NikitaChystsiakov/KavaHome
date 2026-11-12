import { HomePage } from "@/components/HomePage";
import { getProducts } from "@/lib/woo";

export default async function Home() {
  return <HomePage products={await getProducts()} />;
}
