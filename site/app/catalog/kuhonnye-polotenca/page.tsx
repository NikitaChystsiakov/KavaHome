import { CategoryRoute, categoryMetadata } from "@/components/CategoryRoute";

export const metadata = categoryMetadata("kuhonnye-polotenca");

export default function Page() {
  return <CategoryRoute slug="kuhonnye-polotenca" />;
}
