"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function ProjectsHero() {
  return (
    <section className="pt-32 pb-16 bg-cream relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-light/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary-light mb-4"
        >
          // Nos Réalisations
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="text-4xl md:text-5xl font-display text-navy leading-tight mb-4"
        >
          Des projets qui{" "}
          <span className="italic text-rouge-ambra">parlent pour nous</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          className="text-[15px] text-taupe/70 max-w-xl leading-relaxed"
        >
          De la banque à l&apos;énergie, en passant par les télécoms et le secteur public —
          découvrez comment AMBRA Cloud accompagne les organisations ivoiriennes dans leur
          transformation numérique.
        </motion.p>
      </div>
    </section>
  );
}
