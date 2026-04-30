"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, CheckCircle2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const filters = [
  "Tous",
  "IaaS VPC",
  "Bare Metal",
  "Data Center Virtuel",
  "Cloud Privé",
  "Sauvegarde Managée & PRA",
  "Colocation",
];

const projects = [
  {
    id: "rti",
    company: "RTI",
    fullName: "Radiodiffusion Télévision Ivoirienne",
    industry: "Média & Télécommunications",
    service: "IaaS VPC",
    shortDesc: "Infrastructure cloud pour la diffusion et l'archivage de contenus audiovisuels.",
    longDesc:
      "Déploiement d'une infrastructure IaaS VPC complète pour la gestion de la diffusion en direct, l'archivage numérique de plus de 50 ans de contenus, et la distribution multicanale. Haute disponibilité garantie pour les événements en direct.",
    results: ["99.99% de disponibilité", "Archivage de 500+ TB", "Diffusion multicanale"],
    image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=1200&auto=format&fit=crop",
    year: "2023",
  },
  {
    id: "sunu",
    company: "SUNU Assurances",
    fullName: "SUNU Assurances CI",
    industry: "Assurance & Finance",
    service: "Cloud Privé",
    shortDesc: "Hébergement sécurisé des données clients et applications métier.",
    longDesc:
      "Mise en place d'un cloud privé dédié pour héberger les applications de souscription, de sinistres et la base de données clients. Conformité avec les réglementations de la CIMA et protection des données personnelles.",
    results: ["Conformité CIMA", "Données chiffrées", "DRP opérationnel"],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    year: "2022",
  },
  {
    id: "bgfi",
    company: "BGFI Bank",
    fullName: "BGFI Bank Côte d'Ivoire",
    industry: "Banque & Finance",
    service: "Bare Metal",
    shortDesc: "Serveurs physiques dédiés pour les transactions bancaires.",
    longDesc:
      "Fourniture de serveurs Bare Metal haute performance pour le core banking, avec latence <1ms et redondance totale. Infrastructure critique supportant plus de 2 millions de transactions mensuelles.",
    results: ["Latence <1ms", "2M+ transactions/mois", "Résilience 99.95%"],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    year: "2023",
  },
  {
    id: "bridge",
    company: "Bridge Bank",
    fullName: "Bridge Bank Group CI",
    industry: "Banque & Finance",
    service: "Sauvegarde Managée & PRA",
    shortDesc: "Solution de backup automatisée avec plan de reprise d'activité.",
    longDesc:
      "Implémentation d'une stratégie de sauvegarde managée 3-2-1 avec réplication asynchrone vers un site secondaire. Plan de reprise d'activité testé trimestriellement avec un RTO de 4 heures.",
    results: ["RTO 4h", "Tests trimestriels", "Rétention 7 ans"],
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
    year: "2024",
  },
  {
    id: "sodeci",
    company: "SODECI",
    fullName: "Société de Distribution d'Eau",
    industry: "Services Publics",
    service: "Data Center Virtuel",
    shortDesc: "Virtualisation complète de l'infrastructure IT.",
    longDesc:
      "Migration complète de l'infrastructure legacy vers un data center virtuel, incluant la virtualisation des serveurs, du stockage SAN et du réseau SDN. Réduction de 40% des coûts d'exploitation IT.",
    results: ["-40% coûts IT", "Migration 0 downtime", "150+ VMs"],
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop",
    year: "2021",
  },
  {
    id: "snedai",
    company: "Snedai Groupe",
    fullName: "Snedai Groupe",
    industry: "Technologie & IT",
    service: "Colocation",
    shortDesc: "Hébergement de serveurs dans notre datacenter Tier III.",
    longDesc:
      "Colocation de 12 baies dans notre datacenter avec bande passante dédiée 10Gbps, accès sécurisé 24/7 et monitoring environnemental. Extension progressive de l'infrastructure selon la croissance du groupe.",
    results: ["12 baies actives", "10Gbps dédié", "Croissance +30%/an"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
    year: "2022",
  },
];

export function Projects() {
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = projects
    .filter((p) => activeFilter === "Tous" || p.service === activeFilter)
    .filter((p) =>
      query.trim() === ""
        ? true
        : p.company.toLowerCase().includes(query.toLowerCase()) ||
          p.industry.toLowerCase().includes(query.toLowerCase()) ||
          p.service.toLowerCase().includes(query.toLowerCase()) ||
          p.shortDesc.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-16"
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => {
                setActiveFilter(f);
                setOpenId(null);
                setQuery("");
              }}
              className={cn(
                "px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-300",
                activeFilter === f
                  ? "bg-navy text-white shadow-md"
                  : "bg-white/70 text-taupe/70 hover:bg-white hover:text-navy border border-taupe/10"
              )}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
          className="relative max-w-md mx-auto mb-12"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe/35 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpenId(null); }}
            placeholder="Rechercher un projet, secteur, service…"
            className="w-full pl-11 pr-10 py-3.5 bg-white border border-taupe/15 text-[13px] text-navy placeholder:text-taupe/35 focus:border-primary-light focus:ring-2 focus:ring-primary-light/10 outline-none transition-all"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setOpenId(null); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-taupe/30 hover:text-rouge-ambra transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </motion.div>
        <div className="border-t border-taupe/15">
          <AnimatePresence initial={false}>
            {filtered.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 text-center"
              >
                <Search className="w-8 h-8 text-taupe/20 mx-auto mb-4" />
                <p className="text-[13px] text-taupe/40 font-medium">Aucun projet ne correspond à votre recherche.</p>
                <button
                  onClick={() => { setQuery(""); setActiveFilter("Tous"); }}
                  className="mt-4 text-[11px] font-bold uppercase tracking-widest text-rouge-ambra hover:text-navy transition-colors"
                >
                  Réinitialiser
                </button>
              </motion.div>
            )}
            {filtered.map((project, index) => {
              const isOpen = openId === project.id;
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.4, delay: index * 0.06, ease }}
                  className="border-b border-taupe/15"
                >
                  {/* Row header — always visible */}
                  <button
                    onClick={() => setOpenId(isOpen ? null : project.id)}
                    className="w-full text-left py-7 flex items-center gap-6 group"
                  >
                    {/* Year */}
                    <span className={cn(
                      "shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 transition-colors duration-300",
                      isOpen ? "bg-rouge-ambra/10 text-rouge-ambra" : "bg-white/80 text-taupe/50"
                    )}>
                      {project.year}
                    </span>

                    {/* Company */}
                    <span className={cn(
                      "text-xl lg:text-2xl font-display font-black leading-none transition-colors duration-300 min-w-[160px]",
                      isOpen ? "text-rouge-ambra" : "text-navy group-hover:text-rouge-ambra"
                    )}>
                      {project.company}
                    </span>

                    {/* Industry */}
                    <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-taupe/40 shrink-0">
                      {project.industry}
                    </span>

                    {/* Short desc */}
                    <span className="hidden lg:block flex-1 text-[13px] text-taupe/55 leading-relaxed truncate">
                      {project.shortDesc}
                    </span>

                    {/* Chevron */}
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease }}
                      className={cn(
                        "shrink-0 ml-auto w-8 h-8 flex items-center justify-center border transition-colors duration-300",
                        isOpen
                          ? "border-rouge-ambra/30 text-rouge-ambra bg-rouge-ambra/5"
                          : "border-taupe/15 text-taupe/40 group-hover:border-navy/20 group-hover:text-navy"
                      )}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.span>
                  </button>

                  {/* Expanded content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease }}
                        className="overflow-hidden"
                      >
                        <div className="pb-10 grid md:grid-cols-2 gap-8 lg:gap-14">
                          {/* Image */}
                          <motion.div
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1, ease }}
                            className="relative aspect-[4/3] overflow-hidden rounded-sm"
                          >
                            <img
                              src={project.image}
                              alt={project.company}
                              className="w-full h-full object-cover"
                            />
                            {/* Soft overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent" />
                            {/* Service tag */}
                            <div className="absolute bottom-4 left-4">
                              <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-primary-light">
                                {project.service}
                              </span>
                            </div>
                          </motion.div>

                          {/* Details */}
                          <motion.div
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.15, ease }}
                            className="flex flex-col justify-between py-2"
                          >
                            {/* Company full name */}
                            <div className="mb-6">
                              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-rouge-ambra mb-1">
                                {project.industry}
                              </p>
                              <h3 className="text-[22px] font-display font-black text-navy leading-tight">
                                {project.fullName}
                              </h3>
                            </div>

                            {/* Long desc */}
                            <p className="text-[14px] text-taupe/70 leading-[1.85] mb-8 flex-1">
                              {project.longDesc}
                            </p>

                            {/* Results */}
                            <div className="mb-8">
                              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-taupe/40 mb-4">
                                Résultats clés
                              </p>
                              <div className="space-y-2.5">
                                {project.results.map((r, i) => (
                                  <div key={r} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-primary-light shrink-0" />
                                    <span className="text-[13px] font-medium text-navy">{r}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* CTA */}
                            <div className="pt-6 border-t border-taupe/10">
                              <p className="text-[11px] text-taupe/40 mb-3">Vous avez un projet similaire ?</p>
                              <Link
                                href="/devis"
                                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-rouge-ambra hover:text-navy transition-colors duration-200 group"
                              >
                                Démarrer un projet
                                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                              </Link>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
