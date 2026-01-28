import Header from "../components/sections/Header";
import Hero from "../components/sections/Hero";
import CTA1 from "../components/sections/CTA1";
import InfoBlocks from "../components/sections/InfoBlocks";
import Niches from "../components/sections/Niches";
import DemoChat from "../components/sections/DemoChat";
import Plans from "../components/sections/Plans";
import RoiCalculatorSection from "../components/sections/RoiCalculatorSection";
import CTA2 from "../components/sections/CTA2";

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
        <Plans />
        <RoiCalculatorSection />
        <CTA2 />
      </main>
    </>
  );
}
