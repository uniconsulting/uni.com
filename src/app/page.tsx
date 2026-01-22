import Header from "../components/sections/Header";
import Hero from "../components/sections/Hero";
import CTA1 from "../components/sections/CTA1";

export default function Page() {
  return (
    <>
      <Header />
      <CTA1 />
        <Hero />
          <CTA1 />
      </main>
    </>
  );
}
