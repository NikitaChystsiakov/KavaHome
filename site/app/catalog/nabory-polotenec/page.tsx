import { CategoryRoute, categoryMetadata } from "@/components/CategoryRoute";

export const metadata = categoryMetadata("nabory-polotenec");

export default function Page() {
  return <CategoryRoute slug="nabory-polotenec" />;
}
