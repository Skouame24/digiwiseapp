"use client";

import { motion } from "framer-motion";
import {
  Shield, Zap, Clock, Headphones,
  Landmark, TrendingUp, HeartPulse, Building2, Rocket, Radio,
} from "lucide-react";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { DataCenter } from "@/components/sections/DataCenter";
import { cn } from "@/lib/utils";

/* ── Partner data (local images from /Collaborateur) ──── */
const partners = [
  { name: "Acronis",      logo: "/Collaborateur/image.jpg" },
  { name: "AWS",           logo: "/Collaborateur/image (8).png" },
  { name: "Check Point",  logo: "/Collaborateur/image (1).jpg" },
  { name: "Fortinet",     logo: "/Collaborateur/image (7).png" },
  { name: "IBM",           logo: "/Collaborateur/image (6).png" },
  { name: "Kaspersky",    logo: "/Collaborateur/image (5).png" },
  { name: "Microsoft",    logo: "/Collaborateur/image (4).png" },
  { name: "Oracle",        logo: "/Collaborateur/image (3).png" },
  { name: "PECB",          logo: "/Collaborateur/image (1).png" },
  { name: "SOCRadar",      logo: "/Collaborateur/image.png" },
  { name: "Synology",     logo: "/Collaborateur/image (2).png" },
];

/* ── Client data (local images from /Clients) ──────── */
const clients = [
  { name: "Société Générale", logo: "/Clients/image.png" },
  { name: "Snedai Groupe",    logo: "/Clients/image (1).png" },
  { name: "SODECI",            logo: "/Clients/image (2).png" },
  { name: "Bridge Bank",      logo: "/Clients/image (3).png" },
];

const certifications = [
  {
    img: "/Certification/image (3).png",
    label: "Certified Ethical Hacker",
    issuer: "EC-Council",
    desc: "Expertise en tests d’intrusion et analyse de vulnérabilités des systèmes d’information.",
  },
  {
    img: "/Certification/image (1).jpg",
    label: "Certified Information Systems Security Professional",
    issuer: "ISC²",
    desc: "Stratégie de sécurité de l’information, gouvernance et gestion des risques.",
  },
  {
    img: "/Certification/image (2).png",
    label: "Certified Cloud Security Professional",
    issuer: "ISC²",
    desc: "Sécurisation des architectures cloud, conformité et protection des données dans le cloud.",
  },
  {
    img: "/Certification/image.jpg",
    label: "Certified in Cybersecurity",
    issuer: "ISC²",
    desc: "Fondamentaux de la cybersécurité : réseaux, systèmes et meilleures pratiques de protection.",
  },
  {
    img: "/Certification/image.png",
    label: "ISO/IEC 27001 — Internal Auditor",
    issuer: "PECB",
    desc: "Audit interne des systèmes de management de la sécurité de l’information (SMSI).",
  },
  {
    img: "/Certification/image (1).png",
    label: "ISO/IEC 27001 — Internal Auditor",
    issuer: "PECB",
    desc: "Gestion des risques liés à la sécurité de l’information selon la norme ISO/IEC 27005.",
  },
];

const fadeLeft = {
  initial: { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

const fadeRight = {
  initial: { opacity: 0, x: 40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

const strengths = [
  {
    icon: <Shield className="w-6 h-6" />,
    stat: "ISO 27001",
    title: "Sécurité",
    desc: "Chiffrement de bout en bout, conformité réglementaire et protection avancée des données critiques pour les secteurs sensibles.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    stat: "<5ms",
    title: "Performance",
    desc: "Infrastructure NVMe et réseau SDN haute capacité pour des latences minimales et une bande passante adaptée à vos applications.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    stat: "99.95%",
    title: "Disponibilité",
    desc: "Datacenter Tier III certifié, alimentation N+1 et connectivité redondante pour garantir la continuité de vos services 24/7.",
  },
  {
    icon: <Headphones className="w-6 h-6" />,
    stat: "24/7",
    title: "Support expert",
    desc: "Une équipe d'ingénieurs cloud dédiée, disponible en permanence pour vous accompagner dans vos opérations et votre croissance.",
  },
];

const sectors = [
  {
    icon: <Landmark className="w-5 h-5" />,
    name: "Services financiers",
    desc: "Banques, assurances, conformité CIMA et données sensibles.",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    name: "Fintech",
    desc: "Paiement digital, wallets et applications mobiles à fort trafic.",
  },
  {
    icon: <HeartPulse className="w-5 h-5" />,
    name: "Santé",
    desc: "Dossiers patients, imagerie médicale et systèmes critiques.",
  },
  {
    icon: <Building2 className="w-5 h-5" />,
    name: "Services publics",
    desc: "Infrastructure nationale, eau, énergie et télécoms d'État.",
  },
  {
    icon: <Rocket className="w-5 h-5" />,
    name: "Startups & SaaS",
    desc: "Scalabilité instantanée, CI/CD et environnements multi-tenant.",
  },
  {
    icon: <Radio className="w-5 h-5" />,
    name: "Télécoms & Médias",
    desc: "Diffusion, streaming et archivage de contenus haute disponibilité.",
  },
];

export function About() {
  return (
    <div>

      {/* ── 1. HERO ─────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 bg-cream relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-light/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white"
          style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 30%, 0 100%)" }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary-light mb-4"
          >
            // À propos d&apos;AMBRA Cloud
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl font-display text-navy leading-tight mb-4"
          >
            Infrastructure cloud{" "}
            <span className="italic text-rouge-ambra">souveraine</span>{" "}
            pour l&apos;Afrique de l&apos;Ouest
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[15px] text-taupe/70 max-w-2xl mx-auto leading-relaxed"
          >
            Depuis Abidjan, AMBRA Cloud opère une infrastructure cloud résidente de classe entreprise —
            fiable, sécurisée et conçue pour les organisations africaines qui exigent
            la gouvernance souveraine de leurs données.
          </motion.p>
        </div>
      </section>

      {/* ── 2. QUI SOMMES-NOUS — image gauche / texte droite ─────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

            {/* Image */}
            <motion.div {...fadeLeft} className="relative">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=1200&auto=format&fit=crop"
                  alt="Infrastructure cloud AMBRA"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Amber offset frame */}
              <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 border border-primary-light/30 pointer-events-none" />
            </motion.div>

            {/* Text */}
            <motion.div {...fadeRight}>
              <div className="w-12 h-px bg-primary-light mb-8" />
              <blockquote className="text-xl md:text-2xl font-display text-navy leading-[1.35] tracking-tight mb-8">
                &ldquo;Un cloud résident conçu pour répondre aux enjeux de{" "}
                <span className="text-primary-light italic">souveraineté</span>,{" "}
                de sécurité et de performance des entreprises africaines.&rdquo;
              </blockquote>
              <div className="space-y-4 text-[14px] text-taupe/70 leading-[1.85]">
                <p>
                  Notre approche s&apos;intègre naturellement dans les stratégies{" "}
                  <strong className="text-navy">cloud hybride et multicloud</strong>. Nous proposons
                  des solutions d&apos;IaaS, de PaaS, de Bare Metal et de Cloud Privé permettant
                  d&apos;héberger des applications critiques et d&apos;assurer la continuité d&apos;activité.
                </p>
                <p>
                  AMBRA Cloud se positionne comme un{" "}
                  <strong className="text-navy">partenaire de confiance</strong>. Une expertise technique,
                  une exigence opérationnelle forte et une vision claire : permettre aux entreprises
                  d&apos;évoluer sereinement grâce à une infrastructure stable, sécurisée et performante.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. PRÉSENCE LOCALE — texte gauche / image droite ────── */}
      <section className="py-20 md:py-28 bg-cream/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

            {/* Text */}
            <motion.div {...fadeLeft}>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary-light mb-4">
                // Fondée en 2021 — Abidjan, Côte d&apos;Ivoire
              </p>
              <h2 className="text-3xl md:text-[40px] font-display text-navy leading-tight mb-6">
                Premier opérateur cloud{" "}
                <span className="italic text-primary-light">résident</span>{" "}
                de Côte d&apos;Ivoire
              </h2>
              <div className="space-y-4 text-[14px] text-taupe/70 leading-[1.85]">
                <p>
                  Nos solutions s&apos;adressent en particulier aux secteurs sensibles et régulés
                  tels que les services financiers, la fintech, la santé et les services publics,
                  ainsi qu&apos;aux startups et éditeurs SaaS à la recherche d&apos;un socle cloud
                  agile pour le développement, le déploiement et la montée en charge.
                </p>
                <p>
                  Avec une infrastructure <strong className="text-navy">Tier III certifiée</strong> et
                  une équipe d&apos;ingénieurs spécialisés, nous garantissons la performance,
                  la résilience et la conformité réglementaire de vos systèmes d&apos;information.
                </p>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div {...fadeRight} className="relative">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop"
                  alt="Équipe AMBRA Cloud Abidjan"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-4 -left-4 w-2/3 h-2/3 border border-primary-light/30 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 4. NOS ATOUTS ────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary-light mb-3">
              // Nos atouts
            </p>
            <h2 className="text-3xl md:text-[40px] font-display text-navy leading-tight">
              Pourquoi choisir AMBRA Cloud
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-px bg-taupe/10">
            {strengths.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="group bg-white p-8 lg:p-10 relative overflow-hidden"
              >
                {/* Top amber line slides in on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary-light scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                <div className="flex items-start gap-6">
                  <div className="shrink-0 w-12 h-12 bg-primary-light/10 flex items-center justify-center text-primary-light group-hover:bg-primary-light group-hover:text-white transition-all duration-500">
                    {s.icon}
                  </div>
                  <div>
                    <div className="text-[28px] font-display font-bold text-navy mb-1 leading-none">
                      {s.stat}
                    </div>
                    <h3 className="text-[12px] font-bold text-navy mb-3 uppercase tracking-wider">
                      {s.title}
                    </h3>
                    <p className="text-[13px] text-taupe/60 leading-[1.75]">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. SECTEURS D'INTERVENTION ──────────────────────────────── */}
      <section className="py-20 md:py-28 bg-cream/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 max-w-2xl"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary-light mb-3">
              // Secteurs d&apos;intervention
            </p>
            <h2 className="text-3xl md:text-[40px] font-display text-navy leading-tight">
              Des solutions pour chaque secteur
            </h2>
          </motion.div>

          {/* Cards — horizontal scroll on mobile, 3-col grid on desktop */}
          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0">
            {sectors.map((sector, i) => (
              <motion.div
                key={sector.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className={cn(
                  "group shrink-0 w-[260px] md:w-auto",
                  "border border-taupe/10 p-6 relative bg-white",
                  "transition-all duration-300 hover:border-primary-light/40 hover:shadow-sm"
                )}
              >
                {/* Left amber accent on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary-light scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

                <div className="w-10 h-10 bg-primary-light/10 flex items-center justify-center text-primary-light mb-4 group-hover:bg-primary-light group-hover:text-white transition-all duration-300">
                  {sector.icon}
                </div>
                <h3 className="text-[14px] font-display font-bold text-navy mb-2">
                  {sector.name}
                </h3>
                <p className="text-[12px] text-taupe/60 leading-relaxed">
                  {sector.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. DATA CENTERS ───────────────────────────────────────── */}
      <DataCenter />

      {/* ── 7. PARTENAIRES & CLIENTS — two infinite sliders ─────── */}
      <section className="py-20 md:py-28 bg-cream/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary-light mb-3">
              // Partenaires &amp; Clients
            </p>
            <h2 className="text-3xl md:text-[40px] font-display text-navy leading-tight">
              Ils nous font confiance
            </h2>
            <p className="text-[14px] text-taupe/60 mt-3 max-w-xl mx-auto leading-relaxed">
              Des alliances stratégiques et des clients de premier plan qui nous font confiance
              pour leurs infrastructures et solutions technologiques critiques.
            </p>
          </motion.div>
        </div>

        {/* ─ Row 1 : Partenaires technologiques — scroll left ─ */}
        <div className="mb-3">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-taupe/40 mb-5">
            Partenaires technologiques
          </p>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-cream/30 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-cream/30 to-transparent z-10 pointer-events-none" />
            <motion.div
              className="flex gap-6 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, ease: "linear", repeat: Infinity }}
            >
              {[...partners, ...partners].map((p, i) => (
                <div
                  key={`partner-${p.name}-${i}`}
                  className="shrink-0 w-44 h-20 bg-white border border-taupe/10 flex items-center justify-center px-6 grayscale hover:grayscale-0 hover:border-primary-light/30 transition-all duration-500"
                >
                  <img src={p.logo} alt={p.name} className="max-h-8 max-w-full object-contain" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ─ Row 2 : Clients — scroll right (reverse) ─ */}
        <div className="mt-6">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-taupe/40 mb-5">
            Nos clients
          </p>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-cream/30 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-cream/30 to-transparent z-10 pointer-events-none" />
            <motion.div
              className="flex gap-6 w-max"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ duration: 35, ease: "linear", repeat: Infinity }}
            >
              {[...clients, ...clients].map((c, i) => (
                <div
                  key={`client-${c.name}-${i}`}
                  className="shrink-0 w-44 h-20 bg-white border border-taupe/10 flex items-center justify-center px-6 grayscale hover:grayscale-0 hover:border-primary-light/30 transition-all duration-500"
                >
                  <img src={c.logo} alt={c.name} className="max-h-8 max-w-full object-contain" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 7. CERTIFICATIONS ────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Header — left-aligned editorial style */}
          <div className="grid lg:grid-cols-12 gap-12 mb-16 items-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary-light mb-3">
                // Certifications
              </p>
              <h2 className="text-3xl md:text-[40px] font-display text-navy leading-tight">
                L&apos;équipe AMBRA certifiée aux{" "}
                <span className="italic text-primary-light">standards internationaux</span>
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-7 text-[14px] text-taupe/60 leading-[1.85] lg:pb-1"
            >
              Des certifications internationales qui attestent de l&apos;expertise et du niveau
              d&apos;exigence de nos équipes en matière de sécurité, de cloud et de conformité réglementaire.
            </motion.p>
          </div>

          {/* Cards — 3-col grid on desktop */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="group relative bg-cream/30 border border-taupe/10 p-7 hover:border-primary-light/30 hover:bg-white hover:shadow-md transition-all duration-500 overflow-hidden"
              >
                {/* Sliding amber left border */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary-light scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom" />

                {/* Badge row */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 shrink-0 bg-white border border-taupe/10 flex items-center justify-center p-2">
                    <img
                      src={cert.img}
                      alt={cert.label}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-taupe/40">
                      {cert.issuer}
                    </p>
                    <p className="text-[13px] font-bold text-navy leading-snug mt-0.5">
                      {cert.label}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[13px] text-taupe/60 leading-[1.75]">
                  {cert.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CTA FINAL (shared component) ────────────────────────── */}
      <CtaFinal />

    </div>
  );
}
