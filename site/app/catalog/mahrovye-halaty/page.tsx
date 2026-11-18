import { CategoryRoute, categoryMetadata } from "@/components/CategoryRoute";

export const metadata = categoryMetadata("mahrovye-halaty");

export default function Page() {
  return <CategoryRoute slug="mahrovye-halaty" />;
}
