import { TopBar } from "./TopBar";
import { Footer } from "./Sections";

// Каркас внутренних страниц: плотная шапка с логотипом, содержимое, подвал.
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar compact />
      <main>{children}</main>
      <Footer />
    </>
  );
}
