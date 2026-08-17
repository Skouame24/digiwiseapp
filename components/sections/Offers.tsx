"use client";

import { motion } from "framer-motion";
import { Cloud, ShieldCheck, Database, Cpu, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const offers = [
  {
    title: "Cloud Privé & Dédié",
    description: "Des infrastructures sur-mesure pour vos exigences spécifiques de confidentialité, de conformité ou de très haute performance.",
    icon: <ShieldCheck className="w-6 h-6" />,
    features: [
      "Bare Metal – Serveurs Dédiés",
      "Turnkey Private Cloud",
      "Colocation Datacenter Tier III",
      "Private Cloud as a Service"
    ],
    cta: "Découvrir",
    href: "/solutions#private",
    featured: false
  },
  {
    title: "Cloud Résident & Hybride",
    description: "Hébergez vos applications critiques dans un cloud de proximité, conforme et souverain, avec la flexibilité d'architectures multi-cloud.",
    icon: <Cloud className="w-6 h-6" />,
    features: [
      "Cloud IaaS – VPC",
      "Cloud PaaS – Kubernetes",
      "Datacenter Virtuel – Proxmox VE",
      "Sauvegarde & PRA Automatisé"
    ],
    cta: "Voir les offres",
    href: "/solutions#resident",
    featured: true
  },
  {
    title: "Stockage d'Objet S3",
    description: "Stockage massif haute durabilité (11 nines) compatible API S3 pour vos sauvegardes, médias et datalakes IA sans frais d'ingress.",
    icon: <Database className="w-6 h-6" />,
    features: [
      "Compatibilité API S3 standard",
      "Durabilité 99.999999999%",
      "Multi-réplication inter-sites",
      "Chiffrement AES-256 au repos"
    ],
    cta: "Configurer",
    href: "/solutions#object-storage",
    featured: false
  },
  {
    title: "Processeurs & Serveurs GPU",
    description: "Infrastructures accélérées NVIDIA (RTX 4090, L40S, H100) pour vos entraînements d'IA, apprentissage profond et rendu 3D.",
    icon: <Cpu className="w-6 h-6" />,
    features: [
      "NVIDIA H100 (80GB VRAM SXM5)",
      "NVIDIA L40S (48GB VRAM)",
      "Optimisé PyTorch / TensorFlow",
      "Calcul HPC & Rendu temps réel"
    ],
    cta: "Explorer les GPU",
    href: "/solutions#gpu",
    featured: false
  }
];

export function Offers() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-[#FBF4E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-rouge-ambra mb-4"
          >
            Nos Solutions Cloud & Compute
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display text-[#1A0F0A] mb-6"
          >
            Quatre univers d&apos;offres,<br />
            <span className="italic">une seule infrastructure d&apos;excellence.</span>
          </motion.h2>
          <div className="w-20 h-1 bg-[#D86C24] mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
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
                "relative h-full p-6 sm:p-7 transition-all duration-500 flex flex-col group rounded-2xl sm:rounded-3xl border",
                offer.featured
                  ? "bg-[#1A0F0A] text-white shadow-2xl border-transparent"
                  : "bg-white border-[#5C4A3E]/10 shadow-sm hover:shadow-xl"
              )}>
                {offer.featured && (
                  <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-[#FCCC60]/10 border border-[#FCCC60]/30 px-2.5 py-0.5 rounded-full">
                    <Star className="w-3 h-3 text-[#FCCC60] fill-[#FCCC60]" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#FCCC60]">Recommandé</span>
                  </div>
                )}

                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500",
                  offer.featured ? "bg-[#D86C24] text-white" : "bg-[#FBF4E4] text-[#D86C24]"
                )}>
                  {offer.icon}
                </div>

                <div className="flex-grow">
                  <h3 className="text-xl font-display mb-3">{offer.title}</h3>
                  <p className={cn(
                    "text-[13px] leading-relaxed mb-6 font-medium",
                    offer.featured ? "text-white/70" : "text-[#5C4A3E]/80"
                  )}>
                    {offer.description}
                  </p>

                  <ul className="space-y-2.5 mb-8">
                    {offer.features.map((item) => (
                      <li key={item} className="flex items-center gap-2.5">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0",
                          offer.featured ? "bg-[#D86C24]" : "bg-[#D86C24]/60"
                        )} />
                        <span className="text-[11px] font-bold uppercase tracking-wider opacity-90">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  href={offer.href}
                  className={cn(
                    "w-full py-4 rounded-xl font-bold uppercase tracking-[0.15em] text-[10px] border-none mt-auto",
                    offer.featured
                      ? "bg-[#D86C24] text-white hover:bg-white hover:text-[#1A0F0A]"
                      : "bg-[#1A0F0A] text-white hover:bg-[#D86C24]"
                  )}
                >
                  <span>{offer.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
