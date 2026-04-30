"use client";

import { motion } from "framer-motion";
import { MapPin, Activity, HeadphonesIcon, ShieldCheck } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const pillars = [
  {
    icon: <MapPin className="w-5 h-5" />,
    label: "Infrastructure résidentielle",
    sub: "Hébergement 100 % local en Côte d'Ivoire",
  },
  {
    icon: <Activity className="w-5 h-5" />,
    label: "SLA 99,9 %",
    sub: "Haute disponibilité garantie contractuellement",
  },
  {
    icon: <HeadphonesIcon className="w-5 h-5" />,
    label: "Support expert 24/7",
    sub: "Équipe dédiée, réponse garantie en 1 heure",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    label: "Sécurité managée & PRA",
    sub: "Protection multicouche et plan de reprise intégré",
  },
];

export function TrustBand() {
  return (
    <section className="bg-white border-y border-taupe/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-taupe/10">
          {pillars.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07, ease }}
              className="flex items-start gap-4 px-6 lg:px-8 py-7 group"
            >
              <div className="shrink-0 w-9 h-9 rounded-lg bg-primary-light/10 border border-primary-light/15 flex items-center justify-center text-primary-light group-hover:bg-primary-light/20 transition-colors duration-300">
                {p.icon}
              </div>
              <div>
                <p className="text-[13px] font-bold text-navy leading-snug mb-0.5">{p.label}</p>
                <p className="text-[11px] text-taupe/55 leading-relaxed">{p.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
