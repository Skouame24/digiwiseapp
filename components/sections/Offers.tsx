"use client";

import { motion } from "framer-motion";
import { Cloud, ShieldCheck, Database, Cpu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const offers = [
  {
    title: "Cloud Privé & Dédié",
    description:
      "Des infrastructures sur-mesure pour vos exigences spécifiques de confidentialité, de conformité ou de très haute performance.",
    icon: <ShieldCheck className="w-6 h-6" />,
    features: [
      "Bare Metal – Serveurs Dédiés",
      "Turnkey Private Cloud",
      "Colocation Datacenter Tier III",
      "Private Cloud as a Service",
    ],
    cta: "Explorer",
    href: "/solutions#private",
  },
  {
    title: "Cloud Résident & Hybride",
    description:
      "Hébergez vos applications critiques dans un cloud de proximité, conforme et souverain, avec la flexibilité d'architectures multi-cloud.",
    icon: <Cloud className="w-6 h-6" />,
    features: [
      "Cloud IaaS – VPC",
      "Cloud PaaS – Kubernetes",
      "Datacenter Virtuel – Proxmox VE",
      "Sauvegarde & PRA Automatisé",
    ],
    cta: "Explorer",
    href: "/solutions#resident",
  },
  {
    title: "Stockage d'Objet S3",
    description:
      "Stockage massif haute durabilité (11 nines) compatible API S3 pour vos sauvegardes, médias et datalakes IA sans frais d'ingress.",
    icon: <Database className="w-6 h-6" />,
    features: [
      "Compatibilité API S3 standard",
      "Durabilité 99.999999999%",
      "Multi-réplication inter-sites",
      "Chiffrement AES-256 au repos",
    ],
    cta: "Explorer",
    href: "/solutions#object-storage",
  },
  {
    title: "Processeurs & Serveurs GPU",
    description:
      "Infrastructures accélérées NVIDIA (RTX 4090, L40S, H100) pour vos entraînements d'IA, apprentissage profond et rendu 3D.",
    icon: <Cpu className="w-6 h-6" />,
    features: [
      "NVIDIA H100 (80GB VRAM SXM5)",
      "NVIDIA L40S (48GB VRAM)",
      "Optimisé PyTorch / TensorFlow",
      "Calcul HPC & Rendu temps réel",
    ],
    cta: "Explorer",
    href: "/solutions#gpu",
  },
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
            Nos Solutions Cloud &amp; Compute
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display text-[#1A0F0A] mb-6"
          >
            Quatre univers d&apos;offres,
            <br />
            <span className="italic">
              une seule infrastructure d&apos;excellence.
            </span>
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
              <div className="relative h-full p-6 sm:p-7 transition-all duration-500 flex flex-col group rounded-2xl sm:rounded-3xl border bg-white border-[#5C4A3E]/10 shadow-sm hover:shadow-xl hover:border-[#D86C24]/30">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500 bg-[#FBF4E4] text-[#D86C24] shrink-0">
                  {offer.icon}
                </div>

                <h3 className="text-xl font-display text-[#1A0F0A] mb-3 lg:min-h-[3.5rem] flex items-start leading-snug">
                  {offer.title}
                </h3>

                <p className="text-[13px] leading-relaxed mb-6 font-medium text-[#5C4A3E]/80 lg:min-h-[6.5rem]">
                  {offer.description}
                </p>

                <ul className="space-y-2.5 mb-8 mt-auto">
                  {offer.features.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#D86C24]" />
                      <span className="text-[10.5px] font-bold uppercase tracking-wide text-[#1A0F0A]/90 leading-tight">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  href={offer.href}
                  className="w-full h-[52px] !px-4 rounded-xl font-bold uppercase tracking-widest !text-[11px] whitespace-nowrap border-none bg-[#1A0F0A] text-white hover:bg-[#D86C24] transition-colors shrink-0"
                >
                  <span>{offer.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
