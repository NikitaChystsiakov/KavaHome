import { CategoryRoute, categoryMetadata } from "@/components/CategoryRoute";

export const metadata = categoryMetadata("bannye-polotenca");

export default function Page() {
  return <CategoryRoute slug="bannye-polotenca" />;
}
