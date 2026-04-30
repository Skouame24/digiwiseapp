import type { Metadata } from "next";
import { ManagedServices } from "@/components/sections/ManagedServices";
import { CtaFinal } from "@/components/sections/CtaFinal";

export const metadata: Metadata = {
  title: "Services Managés | AMBRA Cloud",
  description: "Nos experts cloud pilotent votre infrastructure 24/7 : sauvegarde managée, supervision et sécurité avancée.",
};

export default function ServicesManagesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-cream relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-light/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white"
          style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 30%, 0 100%)" }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary-light mb-4">
            // Services Managés
          </p>
          <h1 className="text-4xl md:text-5xl font-display text-navy leading-tight mb-4">
            Votre infrastructure,{" "}
            <span className="italic text-rouge-ambra">pilotée par nos experts</span>
          </h1>
          <p className="text-[15px] text-taupe/70 max-w-2xl mx-auto leading-relaxed">
            Nos architectes cloud supervisent, sécurisent et optimisent votre environnement
            24h/7j — pour que vous restiez focalisé sur votre cœur de métier.
          </p>
        </div>
      </section>

      <ManagedServices />
      <CtaFinal />
    </>
  );
}
