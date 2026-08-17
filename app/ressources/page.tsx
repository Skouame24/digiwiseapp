import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, ShieldCheck, Users } from "lucide-react";
import { CtaFinal } from "@/components/sections/CtaFinal";

export const metadata: Metadata = {
  title: "Ressources & Documentation | AMBRA Cloud",
  description: "Explorez nos cas d'usage, références clients, livres blancs et guides d'architecture cloud.",
};

const resourceCards = [
  {
    title: "Références Clients",
    desc: "Découvrez comment les banques, institutions publiques et entreprises leaders font confiance à notre infrastructure résidente.",
    icon: <Users className="w-6 h-6 text-primary-light" />,
    href: "/ressources/references",
    cta: "Voir les références",
  },
  {
    title: "Services Managés Cloud",
    desc: "Découvrez notre catalogue de services gérés : supervision 24/7, sauvegarde managée et sécurité Zero Trust.",
    icon: <ShieldCheck className="w-6 h-6 text-rouge-ambra" />,
    href: "/services-manages",
    cta: "Découvrir les services",
  },
  {
    title: "Blog & Analyses Techniques",
    desc: "Articles sur la souveraineté des données, les normes BCEAO/CIMA, Kubernetes Bare Metal et les architectures GPU.",
    icon: <BookOpen className="w-6 h-6 text-navy" />,
    href: "/blog",
    cta: "Lire le blog",
  },
  {
    title: "Devis Cloud Sur-Mesure",
    desc: "Simulez et configurez directement votre devis personnalisé en fonction de vos exigences de calcul et stockage.",
    icon: <FileText className="w-6 h-6 text-primary-light" />,
    href: "/devis",
    cta: "Demander un devis",
  },
];

export default function RessourcesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-cream relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-light/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary-light mb-4">
            // Ressources & Documentation
          </p>
          <h1 className="text-4xl md:text-5xl font-display text-navy leading-tight mb-4">
            Tout le savoir-faire{" "}
            <span className="italic text-rouge-ambra">AMBRA Cloud</span>
          </h1>
          <p className="text-[15px] text-taupe/70 max-w-2xl mx-auto leading-relaxed">
            Consultez nos références clients, guides d&apos;architectures et documentations pour accompagner votre transformation cloud souveraine.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {resourceCards.map((card) => (
              <div
                key={card.title}
                className="bg-white border border-taupe/15 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center mb-6">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-display text-navy mb-3">{card.title}</h3>
                  <p className="text-[14px] text-taupe/70 leading-relaxed mb-6">
                    {card.desc}
                  </p>
                </div>
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-rouge-ambra hover:text-navy transition-colors mt-auto"
                >
                  {card.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaFinal />
    </>
  );
}
