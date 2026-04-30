"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Lock, Zap, Globe, Headset, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "security",
    title: "Sécurité Native",
    desc: "L'ambre préserve ce qu'elle contient. Nous appliquons cette philosophie à vos données avec un chiffrement matériel AES-256 et une isolation totale des ressources par défaut.",
    icon: <Lock className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
    details: ["Isolation matérielle Bare Metal", "Protection anti-DDoS 2Tbps", "Firewall nouvelle génération"]
  },
  {
    id: "latency",
    title: "Ultra Basse Latence",
    desc: "Chaque milliseconde compte pour vos applications critiques. Notre Backbone 100Gbps assure une fluidité exceptionnelle pour vos services financiers et industriels.",
    icon: <Zap className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?q=80&w=1200&auto=format&fit=crop",
    details: ["Réseau 100Gbps redondé", "Peerings locaux directs", "Temps de réponse < 5ms"]
  },
  {
    id: "sovereign",
    title: "Souveraineté Totale",
    desc: "Vos données ne quittent jamais le sol ivoirien. Une infrastructure résidente qui vous garantit une conformité totale avec les régulations locales et régionales.",
    icon: <Globe className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    details: ["Hébergement Abidjan (Tier III)", "Conformité ARTCI", "Zéro juridiction étrangère"]
  },
  {
    id: "support",
    title: "Support Expert 24/7",
    desc: "Plus qu'un ticket, une expertise humaine locale. Nos ingénieurs basés à Abidjan vous accompagnent personnellement dans la réussite de vos projets cloud.",
    icon: <Headset className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    details: ["Ingénieurs dédiés", "Intervention site < 1h", "Accompagnement architectural"]
  },
];

export function WhyAmbra() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const [activeIndex, setActiveIndex] = useState(0);

  // Sync index with scroll progress
  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      const index = Math.min(
        Math.floor(latest * features.length),
        features.length - 1
      );
      if (index !== activeIndex && index >= 0) {
        setActiveIndex(index);
      }
    });
  }, [scrollYProgress, activeIndex]);

  return (
    <section ref={containerRef} className="relative bg-[#FBF4E4]/40 py-32">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-24">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#900C0C] mb-4">L'Avantage AMBRA</p>
          <h2 className="text-4xl md:text-6xl font-display text-[#1A0F0A] leading-tight">
            Pourquoi choisir <br />
            <span className="italic">notre infrastructure</span> ?
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-20">
          {/* Left: Dynamic Text Content (Scroll Linked) */}
          <div className="lg:col-span-5 space-y-24">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0.2 }}
                whileInView={{ opacity: 1 }}
                viewport={{ margin: "-20% 0px -20% 0px" }}
                className="space-y-8 py-10"
              >
                <div className="flex items-center gap-5">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 shadow-lg",
                    activeIndex === index ? "bg-[#900C0C] text-white scale-110" : "bg-white text-[#5C4A3E] opacity-50"
                  )}>
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
                      <span className="text-[13px] font-bold uppercase tracking-widest text-[#1A0F0A]">{detail}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Sticky Visual Presentation (Soft & Fluid) */}
          <div className="lg:col-span-7 sticky top-40 h-[500px]">
            <div className="relative w-full h-full rounded-[48px] overflow-hidden shadow-2xl border-[12px] border-white bg-white">
              <div className="absolute inset-0">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: activeIndex === index ? 1 : 0,
                      scale: activeIndex === index ? 1 : 1.1,
                      x: activeIndex === index ? 0 : 20
                    }}
                    transition={{ 
                      duration: 1, 
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                    className="absolute inset-0"
                  >
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A]/60 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-10 left-10 right-10">
                       <motion.p 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: activeIndex === index ? 1 : 0, y: activeIndex === index ? 0 : 10 }}
                         className="text-white/60 text-[10px] font-black uppercase tracking-[0.4em] mb-2"
                       >
                         {feature.id}
                       </motion.p>
                       <motion.p 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: activeIndex === index ? 1 : 0, y: activeIndex === index ? 0 : 10 }}
                         transition={{ delay: 0.1 }}
                         className="text-3xl font-display text-white"
                       >
                         {feature.title}
                       </motion.p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Glassmorphism Badge */}
              <div className="absolute top-8 right-8 px-6 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full shadow-lg">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">AMBRA Cloud Core</span>
              </div>
            </div>
            
            {/* Soft decorative background glow */}
            <div className="absolute -z-10 -bottom-20 -right-20 w-96 h-96 bg-[#FCCC60]/15 rounded-full blur-[100px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
