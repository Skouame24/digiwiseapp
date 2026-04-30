"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Server, Wifi } from "lucide-react";
import { Button } from "@/components/ui/Button";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const slides = [
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-shQRDpB0FX9d92SUhy0QfGhkh4S5_O9prAHr2mRzScke_t6OZ34_-0DJHyHliusDcgqLOO0dRVp9Lo-ThPl8plfnbkrX_y59YSPKQJufS_WJ2jYWlH7R20j7eX44R0ruArneEUq6CLwtt4qxm8tUc2avj6fZvg7-ISW0f3cXI518vUoMmw09gCN19p8MUeooyazwhCWTTAd6_ugC0S0kptkaMjGgYjVNa38ZdRNRF7S96UzxfLkSe4cHP7qQsdA1cymlugH4u0g",
    eyebrow: "Infrastructure Cloud Souveraine",
    h1line1: "Le cloud résident",
    h1line2: "conçu pour",
    h1accent: "l'Afrique.",
    sub: "Fiable, sécurisé et performant. AMBRA Cloud déploie des infrastructures souveraines pour les environnements critiques en Côte d'Ivoire et au-delà.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop",
    eyebrow: "Haute Disponibilité & Résilience",
    h1line1: "SLA 99,9 % garanti.",
    h1line2: "Zéro compromis",
    h1accent: "sur vos services.",
    sub: "Notre infrastructure Tier III redondante, localisée en Côte d'Ivoire, assure une disponibilité maximale pour vos applications et bases de données critiques.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop",
    eyebrow: "Sécurité & Souveraineté",
    h1line1: "Vos données restent",
    h1line2: "en Afrique.",
    h1accent: "Protégées. Maîtrisées.",
    sub: "Conformité CIMA, chiffrement end-to-end, PRA intégré et sécurité managée multicouche — pensé pour les environnements où la donnée ne peut pas quitter le territoire.",
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
    <section className="relative h-screen flex items-center overflow-hidden bg-cream">

      {/* ── Background image ─────────────────────────────────── */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={current}
            src={slide.image}
            alt=""
            aria-hidden="true"
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </AnimatePresence>

        {/* Cream overlay — heavy left (text readable), fades to transparent right (image shows) */}
        <div className="absolute inset-0 bg-gradient-to-r from-cream/95 via-cream/70 to-cream/10" />
        {/* Top fade for navbar */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-cream/80 to-transparent" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-cream/60 to-transparent" />
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-24">
        <div className="max-w-[560px]">

          {/* Eyebrow badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`eyebrow-${current}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-taupe/15 shadow-sm mb-7"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-primary-light" />
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-taupe/70">
                {slide.eyebrow}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* H1 */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`h1-${current}`}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease }}
              className="text-[42px] lg:text-[56px] font-display leading-[1.06] tracking-tight mb-5"
            >
              <span className="text-navy">{slide.h1line1}</span>
              <br />
              <span className="text-navy">{slide.h1line2} </span>
              <span className="italic text-rouge-ambra">{slide.h1accent}</span>
            </motion.h1>
          </AnimatePresence>

          {/* Sub */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${current}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, delay: 0.06, ease }}
              className="text-[15px] text-taupe/70 leading-[1.8] mb-9 max-w-[440px]"
            >
              {slide.sub}
            </motion.p>
          </AnimatePresence>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className="flex flex-wrap gap-4 mb-14"
          >
            <Button
              href="/devis"
              iconRight={<ArrowRight className="w-4 h-4" />}
              className="bg-rouge-ambra hover:bg-[#7a0a0a] text-white shadow-lg shadow-rouge-ambra/20 border-none"
            >
              Démarrer mon projet
            </Button>
            <Button variant="secondary" href="/solutions">
              Découvrir nos solutions
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease }}
            className="flex gap-8 pt-5 border-t border-taupe/15"
          >
            {[
              { value: "99,9%", label: "SLA garanti" },
              { value: "Tier III", label: "Datacenter" },
              { value: "24/7", label: "Support dédié" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xl font-display text-primary-light">{s.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-taupe/45 mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Floating cards ── bottom right ───────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6, ease }}
        className="absolute bottom-14 right-6 lg:right-16 hidden md:flex flex-col gap-3 z-10"
      >
        <div className="bg-white/90 backdrop-blur-sm border border-taupe/10 shadow-xl px-5 py-3.5 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-light/10 flex items-center justify-center">
              <Server className="w-4 h-4 text-primary-light" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-taupe/40">Uptime</p>
              <p className="text-[18px] font-display text-navy">99,99%</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm border border-taupe/10 shadow-xl px-5 py-3.5 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rouge-ambra/10 flex items-center justify-center">
              <Wifi className="w-4 h-4 text-rouge-ambra" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-taupe/40">Latence</p>
              <p className="text-[18px] font-display text-navy">&lt; 5 ms</p>
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
            <span className="absolute inset-0 rounded-full bg-taupe/20" />
            {i === current && (
              <motion.span
                className="absolute inset-0 rounded-full bg-rouge-ambra"
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
