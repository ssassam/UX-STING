import { DemosSection } from "../components/demos-section";
import { ExtractSection } from "../components/extract-section";
import { Hero } from "../components/hero";
import { ImagesSection } from "../components/images-section";
import { Ledger } from "../components/ledger";
import { MotionSection } from "../components/motion-section";
import { QaSection } from "../components/qa-section";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { TasteSection } from "../components/taste-section";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Ledger />
        <QaSection />
        <ExtractSection />
        <ImagesSection />
        <TasteSection />
        <MotionSection />
        <DemosSection />
      </main>
      <SiteFooter />
    </>
  );
}
