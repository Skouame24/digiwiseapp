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
        title: "IaaS (VPC)",
        tagline: "Infrastructure as a Service",
        description: "Déployez vos machines virtuelles, réseaux et stockage dans un Virtual Private Cloud totalement isolé. Vous gardez le contrôle total de votre infrastructure tout en bénéficiant de la flexibilité du cloud.",
        features: ["VMs dédiées & scalables", "Réseau SDN privé", "Stockage bloc haute performance", "API & CLI complets"],
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
        configurable: true,
        fields: ["designation", "vcpu", "ram", "storage", "duration"] as const,
      },
      {
        title: "PaaS (Kubernetes)",
        tagline: "Orchestration de conteneurs",
        description: "Accélérez vos déploiements avec un cluster Kubernetes managé. Nous gérons le plan de contrôle, vous vous concentrez sur vos applications.",
        features: ["Cluster managé & haute dispo", "Auto-scaling horizontal", "Ingress & Load Balancer", "Intégration CI/CD"],
        image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=1200&auto=format&fit=crop",
        configurable: true,
        fields: ["designation", "vcpu", "ram", "duration"] as const,
      },
      {
        title: "Sauvegarde",
        tagline: "Protection des données",
        description: "Solutions de sauvegarde automatisées avec réplication géographique entre nos sites. Récupérez vos données en quelques clics grâce à des politiques de rétention flexibles.",
        features: ["Snapshots automatisés", "Réplication inter-site", "Restauration granulaire", "Conformité RGPD/SNS"],
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
        configurable: true,
        fields: ["storage", "duration"] as const,
      }
    ]
  },
  {
    id: "private",
    title: "Cloud Privé",
    subtitle: "Performance & contrôle",
    icon: <Lock className="w-6 h-6" />,
    accent: "navy" as const,
    services: [
      {
        title: "Bare Metal",
        tagline: "Serveurs physiques dédiés",
        description: "Serveurs physiques haute performance sans couche de virtualisation. Idéal pour les bases de données exigeantes, le calcul intensif ou les charges nécessitant un accès direct au matériel.",
        features: ["CPU & RAM dédiés", "Disques NVMe locaux", "Accès IPMI/KVM", "Déploiement en 2h"],
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
        configurable: true,
        fields: ["designation", "vcpu", "ram", "storage", "duration"] as const,
      },
      {
        title: "Colocation",
        tagline: "Hébergement de votre matériel",
        description: "Installez vos serveurs dans notre datacenter Tier III certifié. Vous conservez la propriété de votre hardware tout en profitant de notre infrastructure électrique, réseau et climatisation de niveau entreprise.",
        features: ["Baies sécurisées 24/7", "Alimentation redondante", "Bande passante dédiée", "Accès sur rendez-vous"],
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
        configurable: true,
        fields: ["designation", "storage", "duration"] as const,
      },
      {
        title: "Cloud privé managé",
        tagline: "Infrastructure dédiée & gérée",
        description: "Un environnement cloud entièrement dédié à votre organisation, managé par nos experts. Vous bénéficiez de l'isolation d'une infrastructure dédiée avec la simplicité d'un service managé.",
        features: ["VMware / OpenStack", "Migration assistée", "SLA 99,95%", "Support technique dédié"],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
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
