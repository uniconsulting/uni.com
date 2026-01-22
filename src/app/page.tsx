import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { PlaceholderSection } from "@/components/sections/placeholder";
import { Footer } from "@/components/sections/footer";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PlaceholderSection id="features" title="Возможности" />
        <PlaceholderSection id="niches" title="Ниши" />
        <PlaceholderSection id="demo" title="Демо-чат" />
        <PlaceholderSection id="pricing" title="Тарифы" />
        <PlaceholderSection id="roi" title="ROI-калькулятор" />
        <PlaceholderSection id="faq" title="FAQ" />
      </main>
      <Footer />
    </>
  );
}
