import { CategoryRoute, categoryMetadata } from "@/components/CategoryRoute";

export const metadata = categoryMetadata("kovriki-dlya-vannoj");

export default function Page() {
  return <CategoryRoute slug="kovriki-dlya-vannoj" />;
}
