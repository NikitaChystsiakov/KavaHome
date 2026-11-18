import { CategoryRoute, categoryMetadata } from "@/components/CategoryRoute";

export const metadata = categoryMetadata("polotenca-dlya-otelej");

export default function Page() {
  return <CategoryRoute slug="polotenca-dlya-otelej" />;
}
