"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Server, Zap, Shield, Wifi, Thermometer, Lock } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const locations = [
  {
    id: "abidjan",
    city: "Grand Bassam",
    country: "Côte d'Ivoire",
    flag: "🇨🇮",
    tier: "Tier III",
    status: "Opérationnel",
    ping: "< 5ms",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
    specs: [
      { icon: <Server className="w-4 h-4" />, label: "Capacité", value: "2 MW" },
      { icon: <Thermometer className="w-4 h-4" />, label: "PUE", value: "1.4" },
      { icon: <Zap className="w-4 h-4" />, label: "Redondance", value: "N+1" },
      { icon: <Wifi className="w-4 h-4" />, label: "Connectivité", value: "10 Gbps" },
    ],
    highlight: true,
  },
  {
    id: "paris",
    city: "Paris",
    country: "France",
    flag: "🇫🇷",
    tier: "Tier III+",
    status: "Opérationnel",
    ping: "< 20ms",
    image:
      "https://images.unsplash.com/photo-1520869562399-e772f042f422?q=80&w=1200&auto=format&fit=crop",
    specs: [
      { icon: <Server className="w-4 h-4" />, label: "Capacité", value: "5 MW" },
      { icon: <Thermometer className="w-4 h-4" />, label: "PUE", value: "1.3" },
      { icon: <Zap className="w-4 h-4" />, label: "Redondance", value: "2N" },
      { icon: <Wifi className="w-4 h-4" />, label: "Connectivité", value: "100 Gbps" },
    ],
    highlight: false,
  },
];

/* Animated pulsing dot */
function PulseDot({ delay = 0 }: { delay?: number }) {
  return (
    <span className="relative flex h-3 w-3">
      <motion.span
        className="absolute inline-flex h-full w-full rounded-full bg-primary-light opacity-75"
        animate={{ scale: [1, 2.2, 1], opacity: [0.75, 0, 0.75] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay }}
      />
      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-light" />
    </span>
  );
}

/* Animated connection line between two DC cards */
function ConnectionLine() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div
      ref={ref}
      className="hidden lg:flex items-center justify-center relative z-10 px-4"
    >
      <div className="flex flex-col items-center gap-2">
        {/* Vertical dashed line with animated dot travelling down */}
        <div className="relative w-px h-48 bg-primary-light/20">
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary-light"
            initial={{ top: 0, opacity: 0 }}
            animate={inView ? { top: ["0%", "100%"], opacity: [0, 1, 0] } : {}}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </div>
        <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-primary-light/50 rotate-0 whitespace-nowrap">
          Interconnexion directe
        </div>
        <div className="relative w-px h-48 bg-primary-light/20">
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary-light"
            initial={{ top: "100%", opacity: 0 }}
            animate={inView ? { top: ["100%", "0%"], opacity: [0, 1, 0] } : {}}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
        </div>
      </div>
    </div>
  );
}

export function DataCenter() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-navy relative overflow-hidden"
    >
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-light/4 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-rouge-ambra/4 rounded-full blur-[150px] pointer-events-none" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#F09C3C 1px, transparent 1px), linear-gradient(90deg, #F09C3C 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="mb-20"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary-light mb-4">
            // Infrastructure physique
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="text-4xl md:text-[52px] font-display text-white leading-[1.05] tracking-tight max-w-lg">
              Nos{" "}
              <span className="italic text-primary-light">Data Centers</span>
            </h2>
            <p className="text-[14px] text-white/40 max-w-xs leading-[1.8] md:text-right">
              Des infrastructures certifiées Tier III, sécurisées et interconnectées
              garantissant performance et souveraineté des données.
            </p>
          </div>
          <div className="mt-8 h-px bg-gradient-to-r from-primary-light/40 via-primary-light/10 to-transparent" />
        </motion.div>

        {/* DC Cards + Connection Line */}
        <div className="flex flex-col lg:flex-row items-stretch gap-0">
          {locations.map((dc, i) => (
            <>
              <motion.div
                key={dc.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.2, ease }}
                className="group relative flex-1 overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={dc.image}
                    alt={`Datacenter ${dc.city}`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-navy/70 group-hover:bg-navy/50 transition-colors duration-700" />

                  {/* Tier badge — top right */}
                  <div className="absolute top-4 right-4 bg-primary-light/20 border border-primary-light/30 px-3 py-1 backdrop-blur-sm">
                    <span className="text-[10px] font-bold text-primary-light tracking-widest uppercase">
                      {dc.tier}
                    </span>
                  </div>

                  {/* Status pill — top left */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 backdrop-blur-sm">
                    <PulseDot delay={i * 0.4} />
                    <span className="text-[10px] text-white/70 font-medium">{dc.status}</span>
                  </div>

                  {/* Location overlay — bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary-light/70 mb-1">
                          {dc.flag} {dc.country}
                        </p>
                        <h3 className="text-2xl font-display text-white leading-none">
                          {dc.city}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-white/40 uppercase tracking-wider">Latence locale</p>
                        <p className="text-lg font-display text-primary-light">{dc.ping}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specs grid */}
                <div className="bg-white/4 border border-white/8 grid grid-cols-2 divide-x divide-y divide-white/6">
                  {dc.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="p-4 flex items-center gap-3 group/spec hover:bg-primary-light/5 transition-colors duration-300"
                    >
                      <div className="shrink-0 text-primary-light/50 group-hover/spec:text-primary-light transition-colors duration-300">
                        {spec.icon}
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider">{spec.label}</p>
                        <p className="text-[14px] font-bold text-white">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom amber accent bar — slides on hover */}
                <div className="h-[3px] bg-primary-light/20 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-primary-light"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.4 + i * 0.3, ease }}
                  />
                </div>
              </motion.div>

              {i === 0 && <ConnectionLine key="connection" />}
            </>
          ))}
        </div>

        {/* Bottom trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8, ease }}
          className="mt-14 pt-10 border-t border-white/8 grid sm:grid-cols-3 gap-8"
        >
          {[
            { icon: <Shield className="w-5 h-5" />, label: "Sécurité physique", value: "Contrôle biométrique, CCTV 24/7, accès multi-niveaux" },
            { icon: <Zap className="w-5 h-5" />, label: "Alimentation", value: "UPS & générateurs diesel avec redondance N+1" },
            { icon: <Lock className="w-5 h-5" />, label: "Conformité", value: "ISO 27001 · Tier III · ARTCI certifié" },
          ].map((item, i) => (
            <div key={item.label} className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 bg-primary-light/10 flex items-center justify-center text-primary-light">
                {item.icon}
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">{item.label}</p>
                <p className="text-[13px] text-white/70 leading-relaxed">{item.value}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
