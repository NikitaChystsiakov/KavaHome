import { TopBar } from "@/components/TopBar";
import { Lab } from "@/components/Lab";

// Лаборатория приёмов показа коллекций (2026-11-10). Удалить после выбора.
export default function LabPage() {
  return (
    <>
      <TopBar compact />
      <main>
        <Lab />
      </main>
    </>
  );
}
