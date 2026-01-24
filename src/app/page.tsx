import Header from "../components/sections/Header";
import Hero from "../components/sections/Hero";
import CTA1 from "../components/sections/CTA1";
import InfoBlocks from "../components/sections/InfoBlocks";
import Niches from "../components/sections/Niches";
import DemoChat from "../components/sections/DemoChat";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CTA1 />
        <InfoBlocks />
        <Niches />
        <DemoChat />
      </main>
    </>
  );
}
