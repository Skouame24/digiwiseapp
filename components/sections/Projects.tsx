"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, CheckCircle2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const ease = [0.25, 1, 0.5, 1] as [number, number, number, number];

// Liste des filtres disponibles
const filters = [
  "Tous",
  "IaaS VPC",
  "Bare Metal",
  "Data Center Virtuel",
  "Cloud Privé",
  "Sauvegarde Managée & PRA",
  "Colocation",
];

// Liste des projets avec leurs informations
const projects = [
  {
    id: "afma",
    company: "AFMA",
    fullName: "AFMA",
    industry: "Assurances",
    service: "IaaS VPC",
    shortDesc: "Mise en place d'un environnement cloud privé virtuel (VPC) hautement sécurisé.",
    longDesc:
      "Mise en place d'un environnement cloud privé virtuel (VPC) hautement sécurisé permettant à AFMA de centraliser ses données métier et d'assurer la continuité opérationnelle grâce à une infrastructure évolutive et managée.",
    results: ["Haute sécurité", "Continuité opérationnelle", "Infrastructure managée"],
    image: "/Collaborateur/acr-afma.png.png",
    year: "2026",
  },
  {
    id: "cn-itie",
    company: "CN-ITIE",
    fullName: "CN-ITIE",
    industry: "Secteur Public",
    service: "IaaS VPC",
    shortDesc: "Déploiement d'un VPC cloud dédié pour la gestion des données d'extractivisme.",
    longDesc:
      "Déploiement d'un VPC cloud dédié pour la gestion et la publication des données d'extractivisme. L'infrastructure garantit la confidentialité des informations sensibles tout en permettant un accès multi-utilisateurs sécurisé.",
    results: ["Confidentialité", "Accès sécurisé", "Gestion multi-utilisateurs"],
    image: "/Collaborateur/cn-itie.png",
    year: "2026",
  },
  {
    id: "neoledge",
    company: "NEOLEDGE",
    fullName: "Neoledge",
    industry: "Technologie & IT",
    service: "IaaS VPC",
    shortDesc: "Hébergement des solutions de gestion documentaire sur infrastructure IaaS VPC.",
    longDesc:
      "Hébergement des solutions de gestion documentaire de NeoLedge sur une infrastructure IaaS VPC robuste. La solution offre haute disponibilité, sauvegarde automatisée et performances optimales pour la gestion électronique de documents.",
    results: ["Haute disponibilité", "Sauvegarde automatisée", "Performances optimales"],
    image: "/Collaborateur/neoledge.png",
    year: "2026",
  },
  {
    id: "kaydan",
    company: "KAYDAN TECHNOLOGY",
    fullName: "Kaydan Technology",
    industry: "Technologie & IT",
    service: "Colocation",
    shortDesc: "Environnement cloud VPC flexible pour l'hébergement d'applications.",
    longDesc:
      "Fourniture d'un environnement cloud VPC flexible permettant à KAYDAN TECHNOLOGY d'héberger ses applications technologiques avec une garantie de performance, une isolation réseau complète et une montée en charge rapide selon les besoins.",
    results: ["Garantie de performance", "Isolation réseau complète", "Montée en charge rapide"],
    image: "/Collaborateur/image6.png",
    year: "2026",
  },
  {
    id: "tralco",
    company: "TRALCO",
    fullName: "Tralco",
    industry: "Logistique",
    service: "IaaS VPC",
    shortDesc: "Infrastructure IaaS cloud VPC pour le stockage des données logistiques.",
    longDesc:
      "Mise à disposition d'une infrastructure IaaS cloud VPC pour le stockage sécurisé des données logistiques et la gestion des systèmes d'information de TRALCO, avec une connexion réseau à faible latence et haute résilience.",
    results: ["Stockage sécurisé", "Faible latence", "Haute résilience"],
    image: "/Collaborateur/image10.png",
    year: "2026",
  },
  {
    id: "ama",
    company: "AMA",
    fullName: "Africa Medical Appointment",
    industry: "Santé",
    service: "IaaS VPC",
    shortDesc: "Infrastructure cloud VPC conforme aux exigences sanitaires.",
    longDesc:
      "Déploiement d'une infrastructure cloud VPC conforme aux exigences sanitaires pour la plateforme AMA. L'environnement garantit la confidentialité des données patients, la disponibilité 24h/24 et la scalabilité du service de prise de rendez-vous médicaux en ligne.",
    results: ["Disponibilité 24h/24", "Confidentialité des données", "Scalabilité du service"],
    image: "/Collaborateur/ama.png",
    year: "2026",
  },
  {
    id: "mde",
    company: "MDE Business School",
    fullName: "MDE Business School",
    industry: "Éducation",
    service: "IaaS VPC",
    shortDesc: "VPC cloud dédié à l'hébergement de la plateforme pédagogique.",
    longDesc:
      "Mise à disposition d'un VPC cloud dédié à l'hébergement de la plateforme pédagogique de MDE Business School. L'infrastructure permet une expérience d'apprentissage en ligne fluide, sécurisée et accessible à l'ensemble des apprenants et formateurs.",
    results: ["Apprentissage fluide", "Accès sécurisé", "Haute accessibilité"],
    image: "/Collaborateur/mdeschool.png",
    year: "2026",
  },
  {
    id: "vatico",
    company: "VATICO",
    fullName: "Vatico",
    industry: "Services",
    service: "IaaS VPC",
    shortDesc: "Infrastructure IaaS VPC sur mesure pour l'hébergement des systèmes d'exploitation.",
    longDesc:
      "Déploiement d'une infrastructure IaaS VPC sur mesure pour VATICO, assurant l'hébergement de ses systèmes d'exploitation avec isolation réseau, supervision proactive et garanties de service adaptées à ses exigences opérationnelles.",
    results: ["Isolation réseau", "Supervision proactive", "Garanties de service (SLA)"],
    image: "/Collaborateur/image11.png",
    year: "2026",
  },
  {
    id: "gs2e",
    company: "GS2E",
    fullName: "GS2E",
    industry: "Énergie & Services",
    service: "IaaS VPC",
    shortDesc: "Cloud privé virtuel pour centraliser l'exploitation des outils informatiques.",
    longDesc:
      "Fourniture d'un cloud privé virtuel permettant à GS2E de centraliser l'exploitation de ses outils informatiques. L'environnement offre flexibilité d'administration, sécurité renforcée et accès distant sécurisé pour les équipes.",
    results: ["Flexibilité d'administration", "Sécurité renforcée", "Accès distant sécurisé"],
    image: "/Collaborateur/image14.png",
    year: "2026",
  },
  {
    id: "opisms",
    company: "OPISMS",
    fullName: "OPISMS",
    industry: "Télécommunications",
    service: "IaaS VPC",
    shortDesc: "Infrastructure cloud VPC performante pour des solutions de messagerie.",
    longDesc:
      "Mise à disposition d'une infrastructure cloud VPC performante pour OPISMS, supportant ses solutions de messagerie et de communication professionnelle avec une haute disponibilité du service et une architecture résiliente.",
    results: ["Haute disponibilité", "Architecture résiliente", "Performances optimales"],
    image: "/Collaborateur/opisms.png",
    year: "2026",
  },
  {
    id: "hes",
    company: "HES FINANCES",
    fullName: "HES Finances",
    industry: "Finance",
    service: "IaaS VPC",
    shortDesc: "Hébergement des applications financières dans un environnement ultra-sécurisé.",
    longDesc:
      "Hébergement des applications financières de HES FINANCES dans un environnement IaaS VPC ultra-sécurisé. La solution garantit l'intégrité et la confidentialité des données financières sensibles, avec chiffrement end-to-end et sauvegardes automatisées.",
    results: ["Chiffrement end-to-end", "Sauvegardes automatisées", "Intégrité des données"],
    image: "/Collaborateur/image4.png",
    year: "2026",
  },
  {
    id: "kerry",
    company: "KERRY PAYMENT SA",
    fullName: "Kerry Payment SA",
    industry: "Finance & Paiement",
    service: "IaaS VPC",
    shortDesc: "Infrastructure IaaS VPC dédiée aux opérations de paiement.",
    longDesc:
      "Déploiement d'une infrastructure IaaS VPC dédiée aux opérations de paiement de KERRY PAYMENT SA. L'environnement cloud assure conformité aux normes de sécurité financière, redondance des données et disponibilité continue des services de transaction.",
    results: ["Conformité financière", "Redondance des données", "Disponibilité continue"],
    image: "/Collaborateur/kerrypay.png",
    year: "2026",
  },
  {
    id: "kerales",
    company: "KERALES FINANCES",
    fullName: "Kerales Finances",
    industry: "Finance",
    service: "Colocation",
    shortDesc: "Hébergement physique des équipements serveurs dans des racks certifiés.",
    longDesc:
      "Hébergement physique des équipements serveurs de KERALES FINANCES dans les racks certifiés d'Ambra Cloud au sein du datacentre RAXIO. La solution garantit la protection des équipements, une connectivité internet haut débit et une supervision permanente de l’infrastructure.",
    results: ["Protection des équipements", "Connectivité haut débit", "Supervision continue"],
    image: "/Collaborateur/image7.png",
    year: "2026",
  },
  {
    id: "mcapital",
    company: "MCAPITAL (Mansa Capital)",
    fullName: "Mansa Capital",
    industry: "Finances",
    service: "Colocation",
    shortDesc: "Colocation des infrastructures de Mansa Capital dans les racks d'Ambra Cloud.",
    longDesc:
      "Colocation des infrastructures de MANSA CAPITAL dans les racks d'Ambra Cloud au datacentre RAXIO. Le dispositif offre une connectivité à très haut débit, une disponibilité de 99,9%, une surveillance physique et logique continue ainsi qu'une gestion câblage optimisée.",
    results: ["Connectivité haut débit", "Disponibilité 99,9%", "Surveillance continue"],
    image: "/Collaborateur/image8.png",
    year: "2026",
  },
  {
    id: "gek",
    company: "GEK (Gek Capital)",
    fullName: "Gek Capital",
    industry: "Finances",
    service: "Colocation",
    shortDesc: "Solution de colocation sécurisée avec sauvegarde NAS automatisée.",
    longDesc:
      "Mise en œuvre d'une solution de colocation hautement sécurisée pour GEK Capital au datacentre RAXIO. L'infrastructure bénéficie d'une connectivité redondante et d'un système de sauvegarde automatisée vers NAS, garantissant la protection et la restauration rapide des données critiques.",
    results: ["Sauvegarde NAS automatisée", "Haute disponibilité", "Restauration rapide"],
    image: "/Collaborateur/image12.png",
    year: "2026",
  },
];

export function Projects() {
  // Gestion des états
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [openId, setOpenId] = useState<string | null>(projects[0]?.id || null);
  const [query, setQuery] = useState("");

  // Filtrage des projets (on ne filtre pas selon le service si c’est "Colocation")
  const filtered = projects
    .filter((p) =>
      activeFilter === "Tous" ||
      (activeFilter === "Colocation" ? p.service === "Colocation" : p.service === activeFilter)
    )
    .filter((p) =>
      query.trim() === ""
        ? true
        : p.company.toLowerCase().includes(query.toLowerCase()) ||
        p.industry.toLowerCase().includes(query.toLowerCase()) ||
        p.service.toLowerCase().includes(query.toLowerCase()) ||
        p.shortDesc.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <section className="py-16 bg-cream relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-10">
        {/* Partie des filtres */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8"
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

        {/* Barre de recherche */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="relative max-w-md mx-auto mb-8"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe/35 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un projet, secteur, service…"
            className="w-full pl-11 pr-10 py-3.5 bg-white border border-taupe/15 text-[13px] text-navy placeholder:text-taupe/35 focus:border-primary-light focus:ring-2 focus:ring-primary-light/10 outline-none transition-all"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setActiveFilter("Tous");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-taupe/30 hover:text-rouge-ambra transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </motion.div>

        {/* Liste des projets */}
        <div className="border-t border-taupe/15">
          <AnimatePresence initial={false}>
            {filtered.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-16 text-center"
              >
                <Search className="w-8 h-8 text-taupe/20 mx-auto mb-4" />
                <p className="text-[13px] text-taupe/40 font-medium">Aucun projet ne correspond à votre recherche.</p>
                <button
                  onClick={() => {
                    setQuery("");
                    setActiveFilter("Tous");
                  }}
                  className="mt-4 text-[11px] font-bold uppercase tracking-widest text-rouge-ambra hover:text-navy transition-colors duration-200 group"
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
                  transition={{ duration: 0.6, delay: index * 0.06, ease }}
                  className="border-b border-taupe/15"
                >
                  {/* En-tête du projet */}
                  <button
                    onClick={() => setOpenId(isOpen ? null : project.id)}
                    className="w-full text-left py-7 flex items-center gap-6 group"
                  >
                    {/* Année */}
                    <span className={cn(
                      "shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 transition-colors duration-300",
                      isOpen ? "bg-rouge-ambra/10 text-rouge-ambra" : "bg-white/80 text-taupe/50"
                    )}>
                      {project.year}
                    </span>

                    {/* Nom de l'entreprise */}
                    <span className={cn(
                      "text-xl lg:text-2xl font-display font-black leading-tight transition-colors duration-300",
                      isOpen ? "text-rouge-ambra" : "text-navy group-hover:text-rouge-ambra"
                    )}>
                      {project.company}
                    </span>

                    {/* Secteur d'activité */}
                    <span className="hidden md:block text-[10px] font-bold uppercase tracking-[0.3em] text-rouge-ambra shrink-0">
                      {project.industry}
                    </span>

                    {/* Description courte */}
                    <span className="hidden lg:block flex-1 text-[13px] text-taupe/55 leading-[1.85] truncate group-hover:text-rouge-ambra transition-colors duration-300">
                      {project.shortDesc}
                    </span>

                    {/* Flèche de déroulement */}
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.5, ease }}
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

                  {/* Contenu détaillé */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16 }}
                        transition={{ duration: 0.6, delay: 0.1, ease }}
                        className="overflow-hidden"
                      >
                        <div className="pb-8 grid md:grid-cols-2 gap-8 lg:gap-14">
                          {/* Image */}
                          <motion.div
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease }}
                            className="relative w-full max-w-xs h-40 rounded-lg overflow-hidden bg-white border border-black/5"
                          >
                            <img
                              src={project.image}
                              alt={project.company}
                              className="w-full h-full object-contain p-6"
                            />

                            {/* Étiquette du service */}
                            <div className="absolute bottom-4 left-4">
                              <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-primary-light">
                                {project.service}
                              </span>
                            </div>
                          </motion.div>

                          {/* Informations détaillées */}
                          <motion.div
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.15, ease }}
                            className="flex flex-col justify-between py-2"
                          >
                            {/* Nom complet */}
                            <div className="mb-6">
                              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-rouge-ambra mb-1">
                                {project.industry}
                              </p>
                              <h3 className="text-[22px] font-display font-black text-navy leading-tight">
                                {project.fullName}
                              </h3>
                            </div>

                            {/* Description longue */}
                            <p className="text-[14px] text-taupe/70 leading-[1.85] mb-8 flex-1">
                              {project.longDesc}
                            </p>

                            {/* Résultats clés */}
                            <div className="mb-8">
                              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-taupe/40 mb-4">
                                Résultats clés
                              </p>
                              <div className="space-y-2.5">
                                {project.results.map((r, i) => (
                                  <div key={r} className="flex items-center gap-3 text-left">
                                    <CheckCircle2 className="w-4 h-4 text-primary-light shrink-0" />
                                    <span className="text-[13px] font-medium text-navy">{r}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Appel à l'action */}
                            <div className="pt-6 border-t border-taupe/10">
                              <p className="text-[11px] text-taupe/40 mb-3">
                                Vous avez un projet similaire ?
                              </p>
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