import { Hero } from "@/components/sections/Hero";
import { TrustBand } from "@/components/sections/TrustBand";
import { Reassurance } from "@/components/sections/Reassurance";
import { Offers } from "@/components/sections/Offers";
import { WhyAmbra } from "@/components/sections/WhyAmbra";
import { Sectors } from "@/components/sections/Sectors";
import { DataCenter } from "@/components/sections/DataCenter";
import { CtaFinal } from "@/components/sections/CtaFinal";

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* <TrustBand /> */}
      <Reassurance />
      <Offers />
      <WhyAmbra />
      <Sectors />
      <DataCenter />
      <CtaFinal />
    </>
  );
}
