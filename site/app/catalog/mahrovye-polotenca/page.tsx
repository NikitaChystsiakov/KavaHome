import { CategoryRoute, categoryMetadata } from "@/components/CategoryRoute";

export const metadata = categoryMetadata("mahrovye-polotenca");

export default function Page() {
  return <CategoryRoute slug="mahrovye-polotenca" />;
}
