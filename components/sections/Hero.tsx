"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Server, Wifi, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const slides = [
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-shQRDpB0FX9d92SUhy0QfGhkh4S5_O9prAHr2mRzScke_t6OZ34_-0DJHyHliusDcgqLOO0dRVp9Lo-ThPl8plfnbkrX_y59YSPKQJufS_WJ2jYWlH7R20j7eX44R0ruArneEUq6CLwtt4qxm8tUc2avj6fZvg7-ISW0f3cXI518vUoMmw09gCN19p8MUeooyazwhCWTTAd6_ugC0S0kptkaMjGgYjVNa38ZdRNRF7S96UzxfLkSe4cHP7qQsdA1cymlugH4u0g",
    eyebrow: "Infrastructure Cloud Souveraine",
    h1line1: "Le cloud résident fiable,",
    h1line2: "sécurisé et performant",
    h1accent: "pour vos applications critiques.",
    sub: "Déployez vos environnements IaaS, Kubernetes, Bare Metal et Cloud Privé sur une infrastructure pensée pour la souveraineté des données, la haute disponibilité et la continuité d'activité.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop",
    eyebrow: "Haute Disponibilité & Résilience",
    h1line1: "SLA 99,9 % garanti.",
    h1line2: "Zéro compromis",
    h1accent: "sur la continuité de vos services.",
    sub: "Notre infrastructure Tier III redondante, localisée en Côte d'Ivoire, assure une disponibilité maximale pour vos applications et bases de données critiques.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop",
    eyebrow: "Sécurité & Souveraineté",
    h1line1: "Vos données restent",
    h1line2: "en Afrique.",
    h1accent: "Protégées. Souveraines. Maîtrisées.",
    sub: "Conformité CIMA, chiffrement end-to-end, PRA intégré et sécurité managée multicouche. Ambra Cloud est conçu pour les environnements où la donnée ne peut pas quitter le territoire.",
  },
];

export function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-navy pt-5">

      {/* ── Background image slider ───────────────────────────── */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={current}
            src={slide.image}
            alt=""
            aria-hidden="true"
            initial={{ scale: 1.06, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </AnimatePresence>

        {/* Overlay — much lighter to show the image, just enough for text contrast */}
 
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-36 pb-28 w-full">
        <div className="max-w-[600px]">

          {/* Eyebrow — changes with slide */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`eyebrow-${current}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8"
            >
              {/* <ShieldCheck className="w-3.5 h-3.5 text-primary-light" />
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                {slide.eyebrow}
              </span> */}
            </motion.div>
          </AnimatePresence>

          {/* H1 — changes with slide */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`h1-${current}`}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease }}
              className="text-[38px] lg:text-[54px] font-display leading-[1.07] tracking-tight mb-6 drop-shadow-md"
            >
              <span className="text-white">{slide.h1line1}</span>
              <br />
              <span className="text-white">{slide.h1line2}</span>
              <br />
              <span className="italic text-primary-light">{slide.h1accent}</span>
            </motion.h1>
          </AnimatePresence>

          {/* Sub — changes with slide */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${current}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, delay: 0.05, ease }}
              className="text-[15px] text-white/80 leading-[1.75] mb-10 max-w-[480px] drop-shadow-sm"
            >
              {slide.sub}
            </motion.p>
          </AnimatePresence>

          {/* CTAs — static, don't change */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3, ease }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <Button
              href="/devis"
              iconRight={<ArrowRight className="w-4 h-4" />}
              className="bg-rouge-ambra hover:bg-[#7a0a0a] text-white shadow-lg shadow-rouge-ambra/30 border-none"
            >
              Profiter d&apos;un essai gratuit
            </Button>
            <Button
              variant="secondary"
              href="/solutions"
              className="bg-white/10 text-white border-white/25 hover:bg-white/20 backdrop-blur-sm"
            >
              Découvrir nos solutions
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease }}
            className="flex gap-8 pt-6 border-t border-white/15"
          >
            {[
              { value: "99,9%", label: "SLA garanti" },
              { value: "Tier III", label: "Datacenter" },
              { value: "24/7", label: "Support dédié" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-lg font-display text-primary-light drop-shadow-sm">{s.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/55 mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Floating cards ── bottom right ───────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease }}
        className="absolute bottom-16 right-6 lg:right-16 hidden md:flex flex-col gap-3 z-10"
      >
        <div className="bg-navy/50 backdrop-blur-md border border-white/10 shadow-2xl px-5 py-3.5 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-light/20 flex items-center justify-center">
              <Server className="w-4 h-4 text-primary-light" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Uptime</p>
              <p className="text-[18px] font-display text-white">99,99%</p>
            </div>
          </div>
        </div>

        <div className="bg-navy/50 backdrop-blur-md border border-white/10 shadow-2xl px-5 py-3.5 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rouge-ambra/20 flex items-center justify-center">
              <Wifi className="w-4 h-4 text-primary-light" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Latence</p>
              <p className="text-[18px] font-display text-white">&lt; 5 ms</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Slide indicators ─────────────────────────────────── */}
      <div className="absolute bottom-8 left-6 lg:left-8 flex items-center gap-3 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className="relative h-1 transition-all duration-500 overflow-hidden"
            style={{ width: i === current ? 48 : 16 }}
          >
            <span className="absolute inset-0 rounded-full bg-white/25" />
            {i === current && (
              <motion.span
                className="absolute inset-0 rounded-full bg-primary-light"
                layoutId="indicator"
                transition={{ duration: 0.4, ease }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
