"use client";

import { motion } from "framer-motion";
import { HeartPulse, Landmark, ShieldAlert, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const sectors = [
  { 
    name: "Banque & Fintech", 
    icon: <Landmark className="w-6 h-6" />,
    desc: "Infrastructures critiques pour transactions sécurisées."
  },
  { 
    name: "Secteur Public", 
    icon: <ShieldAlert className="w-6 h-6" />,
    desc: "Souveraineté des données citoyennes et administratives."
  },
  { 
    name: "Santé", 
    icon: <HeartPulse className="w-6 h-6" />,
    desc: "Hébergement certifié de données sensibles de santé."
  },
  { 
    name: "SaaS & Tech", 
    icon: <Cpu className="w-6 h-6" />,
    desc: "Scalabilité et performance pour plateformes innovantes."
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  }
};

export function Sectors() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-cream/50 -skew-x-12 translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-24 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="relative z-10"
        >
          <motion.p variants={itemVariants} className="text-[10px] font-black uppercase tracking-[0.3em] text-[#900C0C] mb-4">
            Expertise Sectorielle
          </motion.p>
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-display text-navy mb-8 leading-tight">
            Conçu pour les <br />
            <span className="text-primary-light italic">Secteurs Critiques</span>.
          </motion.h2>
          <motion.p variants={itemVariants} className="text-[15px] text-taupe/80 mb-12 leading-relaxed max-w-xl font-medium">
            Certaines données ne tolèrent aucune faille. AMBRA Cloud déploie des environnements sur-mesure répondant aux exigences réglementaires les plus strictes.
          </motion.p>

          <div className="grid sm:grid-cols-2 gap-6">
            {sectors.map((sector) => (
              <motion.div
                key={sector.name}
                variants={itemVariants}
                whileHover={{ 
                  y: -8, 
                  scale: 1.03,
                  transition: { type: "spring", stiffness: 400, damping: 20 }
                }}
                className="group relative flex flex-col p-6 bg-cream/30 rounded-3xl border border-transparent hover:border-primary-light/30 hover:bg-white hover:shadow-[0_20px_60px_-15px_rgba(240,156,60,0.15)] transition-all duration-500 overflow-hidden"
              >
                {/* Glow gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-light/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                
                <div className="relative z-10 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-light mb-4 shadow-sm group-hover:bg-primary-light group-hover:text-white group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
                  {sector.icon}
                </div>
                <h4 className="relative z-10 text-lg font-display text-navy mb-2 group-hover:text-primary-light transition-colors duration-300">{sector.name}</h4>
                <p className="relative z-10 text-[13px] text-taupe/70 leading-relaxed">{sector.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="relative">
          <motion.div 
             initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
             whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
             className="relative rounded-[48px] overflow-hidden shadow-2xl border-[12px] border-white z-20"
          >
            <img 
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop"
              alt="High security data center"
              className="w-full aspect-[4/5] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
            
            <div className="absolute bottom-10 left-10 right-10">
               <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Conformité</p>
               <p className="text-2xl font-display text-white">Certifié Tier III & Souverain</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute -bottom-10 -left-10 bg-navy text-white p-8 rounded-3xl shadow-2xl z-30 max-w-[240px] border border-white/10"
          >
             <p className="text-[10px] font-bold uppercase tracking-widest text-primary-light mb-4">Engagement</p>
             <p className="text-sm italic font-medium leading-relaxed opacity-90">"La protection de vos données est notre priorité absolue."</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
