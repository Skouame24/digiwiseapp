"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: "bridge-bank",
    company: "Bridge Bank",
    industry: "Banque",
    initials: "BB",
    color: "bg-[#C8102E]",
    service: "Bare Metal",
    quote: "Grâce au service Bare Metal, nous profitons d'une performance maximale et d'une stabilité irréprochable pour nos applications critiques.",
    author: "Directeur des Systèmes d'Information"
  },
  {
    id: "sodeci",
    company: "SODECI",
    industry: "Distribution d'eau",
    initials: "SD",
    color: "bg-[#007A33]",
    service: "Data Center Virtuel",
    quote: "Avec le Data Center Virtuel, nous gérons nos ressources en toute autonomie tout en bénéficiant d'une fiabilité exemplaire.",
    author: "Responsable Informatique"
  },
  {
    id: "snedai",
    company: "Snedai Groupe",
    industry: "Technologie",
    initials: "SG",
    color: "bg-[#F26522]",
    service: "Cloud Privé",
    quote: "Le Cloud Privé d'AMBRA CLOUD nous garantit souveraineté, conformité et sécurité pour l'hébergement de nos données sensibles.",
    author: "CEO & Fondateur"
  }
];

export function References() {
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-16 h-1 bg-primary-light mx-auto mb-16 origin-left rounded-full"
        />

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="group relative"
            >
              <div className="bg-cream/50 rounded-[32px] p-8 lg:p-10 h-full flex flex-col transition-all duration-500 hover:bg-cream hover:shadow-xl hover:shadow-taupe/5 border border-transparent hover:border-taupe/10">
                {/* Logo area */}
                <div className="mb-8 flex justify-center">
                  <div className={cn(
                    "w-20 h-20 rounded-2xl flex items-center justify-center text-white font-display text-xl font-bold shadow-lg transition-transform duration-500 group-hover:scale-110",
                    t.color
                  )}>
                    {t.initials}
                  </div>
                </div>

                {/* Company info */}
                <div className="text-center mb-6">
                  <h3 className="text-lg font-display font-bold text-navy mb-1">
                    {t.company}
                  </h3>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-taupe/50">
                    {t.industry}
                  </p>
                </div>

                {/* Quote */}
                <div className="relative flex-grow">
                  <Quote className="w-8 h-8 text-primary-light/20 absolute -top-2 -left-2" />
                  <p className="text-[14px] text-taupe/70 leading-relaxed text-center relative z-10 pt-4">
                    {t.quote}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-12 h-px bg-taupe/20 mx-auto my-6" />

                {/* Service tag + author */}
                <div className="text-center">
                  <span className="inline-block px-4 py-1.5 bg-primary-light/10 text-primary-light text-[10px] font-bold uppercase tracking-widest rounded-full mb-3">
                    {t.service}
                  </span>
                  <p className="text-[12px] text-taupe/50 font-medium">
                    {t.author}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 md:mt-28 text-center"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-taupe/40 mb-8">
            Ils nous font confiance
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-white font-display text-sm font-bold",
                  t.color
                )}
              >
                {t.initials}
              </div>
            ))}
            <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center text-white font-display text-sm font-bold">
              +12
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
