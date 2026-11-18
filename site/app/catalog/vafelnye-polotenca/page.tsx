import { CategoryRoute, categoryMetadata } from "@/components/CategoryRoute";

export const metadata = categoryMetadata("vafelnye-polotenca");

export default function Page() {
  return <CategoryRoute slug="vafelnye-polotenca" />;
}
