"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Zap, Globe, Headset, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const features = [
  {
    id: "security",
    title: "Sécurité Native",
    desc: "L'ambre préserve ce qu'elle contient. Nous appliquons cette philosophie à vos données avec un chiffrement matériel AES-256 et une isolation totale des ressources par défaut.",
    icon: <Lock className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
    details: ["Isolation matérielle Bare Metal", "Protection anti-DDoS 2Tbps", "Firewall nouvelle génération"],
  },
  {
    id: "latency",
    title: "Ultra Basse Latence",
    desc: "Chaque milliseconde compte pour vos applications critiques. Notre Backbone 100Gbps assure une fluidité exceptionnelle pour vos services financiers et industriels.",
    icon: <Zap className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
    details: ["Réseau 100Gbps redondé", "Peerings locaux directs", "Temps de réponse < 5ms"],
  },
  {
    id: "sovereign",
    title: "Maitrise totale",
    desc: "Vos données ne quittent jamais le sol ivoirien. Une infrastructure résidente qui vous garantit une conformité totale avec les régulations locales et régionales.",
    icon: <Globe className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    details: ["Hébergement Abidjan (Tier III)", "Conformité ARTCI", "Zéro juridiction étrangère"],
  },
  {
    id: "support",
    title: "Support Expert 24/7",
    desc: "Plus qu'un ticket, une expertise humaine locale. Nos ingénieurs basés à Abidjan vous accompagnent personnellement dans la réussite de vos projets cloud.",
    icon: <Headset className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    details: ["Ingénieurs dédiés", "Intervention site < 1h", "Accompagnement architectural"],
  },
];

export function WhyAmbra() {
  const [activeIndex, setActiveIndex] = useState(0);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* Détection fiable du bloc au centre du viewport (indépendant de useScroll) */
  useEffect(() => {
    const observers = features.map((_, index) => {
      const el = blockRefs.current[index];
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(index);
        },
        { root: null, rootMargin: "-42% 0px -42% 0px", threshold: 0 }
      );

      observer.observe(el);
      return observer;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <section className="relative bg-[#FBF4E4]/40 py-16 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease }}
          className="mb-12 md:mb-24 scroll-mt-28"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#900C0C] mb-4">
            L&apos;Avantage AMBRA
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-display text-[#1A0F0A] leading-tight">
            Pourquoi choisir <br />
            <span className="italic">notre infrastructure</span> ?
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-20 items-start">
          {/* Gauche — texte qui apparaît en douceur au scroll */}
          <div className="lg:col-span-5 space-y-12 lg:space-y-24 order-2 lg:order-1">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                ref={(el) => {
                  blockRefs.current[index] = el;
                }}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-12% 0px -12% 0px" }}
                transition={{ duration: 0.55, ease }}
                className="space-y-8 py-10 scroll-mt-28"
              >
                <div className="flex items-center gap-5">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 shadow-lg",
                      activeIndex === index
                        ? "bg-[#900C0C] text-white scale-110"
                        : "bg-white text-[#5C4A3E] opacity-50"
                    )}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-display text-[#1A0F0A]">{feature.title}</h3>
                </div>

                <p className="text-lg text-[#5C4A3E]/80 leading-relaxed font-sans font-medium">
                  {feature.desc}
                </p>

                <div className="grid grid-cols-1 gap-4">
                  {feature.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#900C0C]" />
                      <span className="text-[13px] font-bold uppercase tracking-widest text-[#1A0F0A]">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Droite — image sticky + crossfade (sticky rétabli après fix overflow global) */}
          <div className="lg:col-span-7 lg:sticky lg:top-28 self-start order-1 lg:order-2 mb-8 lg:mb-0 h-[280px] sm:h-[360px] lg:h-[500px]">
            <div className="relative w-full h-full rounded-2xl lg:rounded-[48px] overflow-hidden shadow-2xl border-4 sm:border-8 lg:border-[12px] border-white bg-white">
              <div className="absolute inset-0">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={false}
                    animate={{
                      opacity: activeIndex === index ? 1 : 0,
                      scale: activeIndex === index ? 1 : 1.08,
                      x: activeIndex === index ? 0 : 20,
                    }}
                    transition={{ duration: 0.9, ease }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ zIndex: activeIndex === index ? 1 : 0 }}
                  >
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A]/60 via-transparent to-transparent" />

                    <div className="absolute bottom-10 left-10 right-10">
                      <motion.p
                        initial={false}
                        animate={{
                          opacity: activeIndex === index ? 1 : 0,
                          y: activeIndex === index ? 0 : 10,
                        }}
                        transition={{ duration: 0.6, ease }}
                        className="text-white/60 text-[10px] font-black uppercase tracking-[0.4em] mb-2"
                      >
                        {feature.id}
                      </motion.p>
                      <motion.p
                        initial={false}
                        animate={{
                          opacity: activeIndex === index ? 1 : 0,
                          y: activeIndex === index ? 0 : 10,
                        }}
                        transition={{ duration: 0.6, delay: 0.08, ease }}
                        className="text-3xl font-display text-white"
                      >
                        {feature.title}
                      </motion.p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="absolute top-8 right-8 px-6 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full shadow-lg z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  AMBRA Cloud Core
                </span>
              </div>
            </div>

            <div className="absolute -z-10 -bottom-10 -right-8 sm:-bottom-20 sm:-right-20 w-48 h-48 sm:w-96 sm:h-96 bg-[#FCCC60]/15 rounded-full blur-[100px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
