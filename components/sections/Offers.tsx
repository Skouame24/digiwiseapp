"use client";

import { motion } from "framer-motion";
import { Cloud, ShieldCheck, Settings2, CheckCircle2, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const offers = [
  {
    title: "Cloud Résident & Hybride",
    description: "Infrastructure IaaS, Kubernetes et VPC hébergée à Abidjan. Souveraineté totale des données, élasticité à la demande.",
    icon: <Cloud className="w-6 h-6" />,
    features: ["IaaS VPC & Kubernetes", "Souveraineté locale", "Haute disponibilité"],
    cta: "Voir les offres",
    href: "/solutions",
    featured: false
  },
  {
    title: "Cloud Privé Dédié",
    description: "Isolation totale de vos ressources critiques sur du matériel Bare Metal. Contrôle total, performance maximale.",
    icon: <ShieldCheck className="w-6 h-6" />,
    features: ["Bare Metal dédié", "Colocation Tier III", "Cloud privé managé"],
    cta: "Découvrir",
    href: "/solutions",
    featured: true
  },
  {
    title: "Services Managés",
    description: "Sauvegarde, supervision 24/7 et sécurité avancée. Nos experts pilotent votre infrastructure, vous vous concentrez sur votre métier.",
    icon: <Settings2 className="w-6 h-6" />,
    features: ["Supervision & monitoring", "Sécurité managée", "Sauvegarde & PRA"],
    cta: "En savoir plus",
    href: "/services-manages",
    featured: false
  }
];

export function Offers() {
  return (
    <section className="py-32 bg-[#FBF4E4]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[20px] font-bold uppercase tracking-[0.3em] text-rouge-ambra  mb-4"
          >
            Nos Solutions
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display text-[#1A0F0A] mb-6"
          >
            Trois univers d&apos;offres,<br />
            <span className="italic">une seule infrastructure.</span>
          </motion.h2>
          <div className="w-20 h-1 bg-[#D86C24] mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-3 gap-10 items-stretch">
          {offers.map((offer, idx) => (
            <motion.div
              key={offer.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="h-full"
            >
              <div className={cn(
                "relative h-full p-10 transition-all duration-500 flex flex-col group",
                offer.featured 
                  ? "bg-[#1A0F0A] rounded-[40px] text-white shadow-2xl" 
                  : "bg-white rounded-[32px] border border-[#5C4A3E]/10"
              )}>
                {offer.featured && (
                  <div className="absolute top-8 right-10 flex items-center gap-2">
                    <Star className="w-3 h-3 text-[#FCCC60] fill-[#FCCC60]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#FCCC60]">Recommandé</span>
                  </div>
                )}

                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110 duration-500",
                  offer.featured ? "bg-[#D86C24] text-white" : "bg-[#FBF4E4] text-[#D86C24]"
                )}>
                  {offer.icon}
                </div>

                <div className="flex-grow">
                  <h3 className="text-2xl font-display mb-6">{offer.title}</h3>
                  <p className={cn(
                    "text-[15px] leading-relaxed mb-10 font-medium",
                    offer.featured ? "text-white/70" : "text-[#5C4A3E]/80"
                  )}>
                    {offer.description}
                  </p>

                  <ul className="space-y-4 mb-12">
                    {offer.features.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          offer.featured ? "bg-[#D86C24]" : "bg-[#D86C24]/40"
                        )} />
                        <span className="text-xs font-bold uppercase tracking-widest opacity-90">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  href={offer.href}
                  className={cn(
                    "w-full py-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] border-none",
                    offer.featured 
                      ? "bg-[#D86C24] text-white hover:bg-white hover:text-[#1A0F0A]" 
                      : "bg-[#1A0F0A] text-white hover:bg-[#D86C24]"
                  )}
                >
                  <span>{offer.cta}</span>
                  <ArrowRight className="w-4 h-4 ml-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
