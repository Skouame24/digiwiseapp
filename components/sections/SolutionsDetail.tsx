"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Cloud, Lock, CheckCircle2, ShoppingBag, Check, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart, ServiceConfig } from "@/context/CartContext";
import { ServiceConfigModal } from "@/components/sections/ServiceConfigModal";

const categories = [
  {
    id: "resident",
    title: "Cloud Résident & Hybride",
    subtitle: "Hébergement & déploiement",
    icon: <Cloud className="w-6 h-6" />,
    accent: "primary-light" as const,
    services: [
      {
        title: "Cloud IaaS – Virtual Private Cloud (VPC)",
        tagline: "Infrastructure as a Service",
        description: "Des environnements isolés, sécurisés et dimensionnés à vos besoins. Créez et gérez vos instances en toute autonomie, sur une infrastructure que nous supervisons 24h/24.",
        features: [
          "Machines virtuelles dédiées et dimensionnées selon les besoins",
          "Gestion complète des instances",
          "Infrastructure supervisée 24h/24 et 7j/7"
        ],
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
        configurable: true,
        fields: ["designation", "vcpu", "ram", "storage", "duration"] as const,
      },
      {
        title: "Cloud PaaS – Kubernetes as a Service",
        tagline: "Orchestration de conteneurs",
        description: "Déployez, orchestrez et faites évoluer vos applications conteneurisées sans vous soucier de la complexité infrastructurelle. Nous gérons la plateforme, vous gérez vos services.",
        features: [
          "Déploiement et orchestration d'applications conteneurisées",
          "Gestion complète de la plateforme Kubernetes",
          "Administration de l'infrastructure sous-jacente"
        ],
        image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=1200&auto=format&fit=crop",
        configurable: true,
        fields: ["designation", "vcpu", "ram", "duration"] as const,
      },
      {
        title: "Datacenter Virtuel – Hyperviseur Proxmox VE",
        tagline: "Virtualisation Open Source",
        description: "Un environnement virtualisé ouvert, basé sur des fondations Open Source robustes. Maîtrise totale de votre infrastructure, flexibilité maximale, sans dépendance propriétaire.",
        features: [
          "Environnement virtualisé basé sur des technologies Open Source",
          "Maîtrise complète de l'infrastructure",
          "Flexibilité maximale et absence de dépendance propriétaire"
        ],
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
        configurable: true,
        fields: ["designation", "vcpu", "ram", "storage", "duration"] as const,
      },
      {
        title: "Sauvegarde & Plan de Reprise d’Activité (PRA)",
        tagline: "Protection & Continuité",
        description: "Sauvegarde automatisée des données et plan de reprise d'activité opérationnel, testé et documenté pour assurer la protection intégrale de vos données critiques.",
        features: [
          "Sauvegarde automatisée des données",
          "Plan de reprise d’activité opérationnel",
          "Tests et documentation du PRA",
          "Protection des données critiques"
        ],
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
        configurable: true,
        fields: ["storage", "duration"] as const,
      },
      {
        title: "Architecture Hybride",
        tagline: "Intégration Multi-Cloud",
        description: "Intégrez en toute simplicité votre cloud résident, vos clouds publics et vos infrastructures physiques on-premise au sein d'une architecture unifiée avec un point de gestion unique.",
        features: [
          "Intégration cloud résident, cloud public et on-premise",
          "Architecture unifiée et pilotage depuis un point de gestion unique",
          "Flexibilité et résilience maximales"
        ],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
        configurable: false,
        fields: [] as const,
      }
    ]
  },
  {
    id: "private",
    title: "Cloud Privé & Infrastructures Dédiées",
    subtitle: "Performance & contrôle",
    icon: <Lock className="w-6 h-6" />,
    accent: "navy" as const,
    services: [
      {
        title: "Bare Metal – Serveurs Dédiés Haute Performance",
        tagline: "Serveurs physiques dédiés",
        description: "Serveurs physiques dédiés pour vos charges les plus exigeantes : performances brutes, aucun partage, aucun voisin.",
        features: [
          "CPU & RAM dédiés",
          "Disques NVMe locaux",
          "Accès IPMI/KVM",
          "Performances brutes et aucun partage"
        ],
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
        configurable: true,
        fields: ["designation", "vcpu", "ram", "storage", "duration"] as const,
      },
      {
        title: "Colocation",
        tagline: "Hébergement de votre matériel",
        description: "Hébergez vos équipements dans notre datacenter Raxio Tier III. Vous gardez le matériel, nous assurons l'environnement.",
        features: [
          "Baies sécurisées dans notre datacenter Tier III",
          "Alimentation électrique et climatisation redondées",
          "Sécurité physique stricte 24h/24 et 7j/7",
          "Vous gardez le matériel, nous assurons l'environnement"
        ],
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
        configurable: true,
        fields: ["designation", "storage", "duration"] as const,
      },
      {
        title: "Turnkey Private Cloud - Clé en main",
        tagline: "Nuage privé géré clé en main",
        description: "Nous concevons, déployons et opérons votre cloud privé clé en main. Une alternative économique aux solutions hyperconvergées.",
        features: [
          "Conception, déploiement et opération clé en main",
          "Alternative économique aux solutions hyperconvergées",
          "Supervision proactive et monitoring 24h/24",
          "Support d'experts de bout en bout"
        ],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
        configurable: true,
        fields: ["designation", "vcpu", "ram", "storage", "duration"] as const,
      },
      {
        title: "Private Cloud as a service",
        tagline: "Infogérance On-Premise",
        description: "Transformez votre infrastructure existante en cloud privé performant. Vos serveurs restent on-premise, nous infogérons le contrôleur.",
        features: [
          "Transformation de votre infrastructure physique existante",
          "Vos serveurs physiques restent on-premise",
          "Nous infogérons complètement le contrôleur",
          "Supervision, monitoring et alerting 24h/24"
        ],
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
        configurable: true,
        fields: ["designation", "vcpu", "ram", "storage", "duration"] as const,
      }
    ]
  }
];

function ServiceCard({
  service,
  index,
  accent,
  categoryId,
  categoryTitle,
}: {
  service: typeof categories[0]["services"][0];
  index: number;
  accent: "primary-light" | "navy";
  categoryId: string;
  categoryTitle: string;
}) {
  const { addItem, removeItem, updateConfig, isInCart, items } = useCart();
  const itemId = `${categoryId}-${service.title.toLowerCase().replace(/\s+/g, "-")}`;
  const inCart = isInCart(itemId);
  const existingConfig = items.find((i) => i.id === itemId)?.config;
  const [modalOpen, setModalOpen] = useState(false);

  const handleCartClick = () => {
    if (service.configurable) {
      // always open configurator (add or edit)
      setModalOpen(true);
    } else {
      if (inCart) removeItem(itemId);
      else addItem({ id: itemId, name: service.title, description: service.tagline, category: categoryTitle });
    }
  };

  const handleConfirm = (config: ServiceConfig) => {
    setModalOpen(false);
    if (inCart) {
      updateConfig(itemId, config);
    } else {
      addItem({ id: itemId, name: service.title, description: service.tagline, category: categoryTitle, config });
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="group"
    >
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Image side — alternates based on index */}
        <div className={cn("relative", index % 2 === 1 ? "lg:order-2" : "")}>
          <div className="relative rounded-[32px] overflow-hidden shadow-xl aspect-[4/3]">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
          </div>
          {/* Floating tag */}
          <div className={cn(
            "absolute -bottom-4 px-5 py-2 rounded-full shadow-lg text-[10px] font-bold uppercase tracking-widest text-white",
            index % 2 === 1 ? "-left-4 lg:left-auto lg:-right-4" : "-right-4",
            accent === "navy" ? "bg-navy" : "bg-primary-light"
          )}>
            {service.tagline}
          </div>
        </div>

        {/* Content side */}
        <div className={cn(index % 2 === 1 ? "lg:order-1" : "")}>
          <div className="flex items-center gap-3 mb-4">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              accent === "navy" ? "bg-navy/10 text-navy" : "bg-primary-light/10 text-primary-light"
            )}>
              <span className="text-sm font-display font-bold">{index + 1}</span>
            </div>
            <div className="h-px flex-1 bg-taupe/10" />
          </div>

          <h4 className="text-2xl md:text-3xl font-display text-navy mb-4 group-hover:text-primary-light transition-colors duration-300">
            {service.title}
          </h4>

          <p className="text-[15px] text-taupe/70 leading-relaxed mb-6">
            {service.description}
          </p>

          <ul className="space-y-3 mb-8">
            {service.features.map((feat) => (
              <li key={feat} className="flex items-center gap-3">
                <CheckCircle2 className={cn(
                  "w-4 h-4 shrink-0",
                  accent === "navy" ? "text-navy" : "text-primary-light"
                )} />
                <span className="text-[14px] text-navy font-medium">{feat}</span>
              </li>
            ))}
          </ul>

          {/* Single CTA: Add to cart */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleCartClick}
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                inCart
                  ? "bg-primary-light/10 text-primary-light"
                  : accent === "navy"
                    ? "bg-navy text-white hover:bg-primary-light"
                    : "bg-primary-light text-white hover:bg-ambre-signature"
              )}
            >
              {inCart ? (
                <><Check className="w-4 h-4" /> Ajouté au panier</>
              ) : (
                <><ShoppingBag className="w-4 h-4" /> Ajouter au panier</>
              )}
            </button>

            {/* Edit config if already in cart */}
            {inCart && service.configurable && (
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-taupe/40 hover:text-navy transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" /> Modifier
              </button>
            )}
          </div>

          {/* Show designation if configured */}
          {inCart && existingConfig?.designation && (
            <p className="mt-2 text-[12px] text-taupe/50 italic">
              &ldquo;{existingConfig.designation}&rdquo;
            </p>
          )}

          {/* Configurator modal */}
          {modalOpen && (
            <ServiceConfigModal
              service={{ id: itemId, name: service.title, category: categoryTitle }}
              fields={service.fields ?? []}
              initial={existingConfig}
              accent={accent}
              onConfirm={handleConfirm}
              onClose={() => setModalOpen(false)}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function CategorySection({ category, categoryIndex }: { category: typeof categories[0]; categoryIndex: number }) {
  return (
    <div className="relative">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
      >
        <div className="inline-flex items-center gap-3 mb-6">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
            category.accent === "navy" ? "bg-navy text-gold" : "bg-primary-light text-white"
          )}>
            {category.icon}
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-taupe/50">
              {category.subtitle}
            </p>
            <h3 className="text-2xl md:text-3xl font-display text-navy">
              {category.title}
            </h3>
          </div>
        </div>
      </motion.div>

      {/* Services — straight timeline feel */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-light/40 via-taupe/20 to-transparent hidden md:block" />

        <div className="space-y-20 md:space-y-32">
          {category.services.map((service, index) => (
            <div key={service.title} className="relative">
              {/* Center node on desktop */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 20, delay: 0.2 }}
                className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-8 z-10"
              >
                <div className={cn(
                  "w-5 h-5 rounded-full border-4 border-white shadow-md",
                  category.accent === "navy" ? "bg-navy" : "bg-primary-light"
                )} />
              </motion.div>

              <ServiceCard service={service} index={index} accent={category.accent} categoryId={category.id} categoryTitle={category.title} />
            </div>
          ))}
        </div>
      </div>

      {/* Separator */}
      {categoryIndex === 0 && (
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-24 md:mt-32 h-px bg-taupe/10 origin-left"
        />
      )}
    </div>
  );
}

export function SolutionsDetail() {
  return (
    <section className="py-24 md:py-32 bg-cream/30 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
       

        {/* Categories */}
        <div className="space-y-24 md:space-y-32">
          {categories.map((category, index) => (
            <CategorySection key={category.id} category={category} categoryIndex={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
