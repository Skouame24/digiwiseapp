"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, Lock, HardDrive, BarChart3, ShoppingBag, Check, CheckCircle2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart, ServiceConfig } from "@/context/CartContext";
import { ServiceConfigModal } from "@/components/sections/ServiceConfigModal";

const services = [
  {
    id: "supervision",
    title: "Supervision 24/7",
    tagline: "Monitoring proactif en continu",
    description:
      "Monitoring proactif, alerting en temps réel et SLA garanti à 99,9 %. Nos équipes surveillent votre infrastructure 24h/24 et 7j/7 pour anticiper les incidents avant qu'ils n'impactent votre activité.",
    icon: <Eye className="w-6 h-6" />,
    features: [
      "Surveillance infrastructure 24h/24 et 7j/7",
      "Alertes temps réel multicanal (SMS, email, Slack)",
      "Dashboards personnalisés et rapports mensuels",
      "Détection proactive des anomalies",
      "SLA garanti à 99,9 %",
    ],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    configurable: true,
    fields: ["designation", "duration"] as const,
  },
  {
    id: "security",
    title: "Sécurité Native (Zero Trust)",
    tagline: "Approche Zero Trust intégrée",
    description:
      "Sécurité native reposant sur une approche Zero Trust (ZTNA), la protection des endpoints, des infrastructures réseau et des applications exposées sur Internet, complétée par une surveillance continue et une corrélation des événements de sécurité via SIEM.",
    icon: <Lock className="w-6 h-6" />,
    features: [
      "Pare-feu managé et mis à jour en continu",
      "Approche Zero Trust (ZTNA) native",
      "Protection des endpoints et du réseau",
      "SIEM — corrélation des événements de sécurité",
      "Détection et prévention d'intrusions (IDS/IPS)",
      "Audit de conformité régulier",
    ],
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    configurable: true,
    fields: ["designation", "duration"] as const,
  },
  {
    id: "backup",
    title: "Sauvegarde Automatisée",
    tagline: "Protection sans intervention",
    description:
      "Politique de sauvegarde configurable, restauration rapide et PRA documenté. Service entièrement opéré par nos équipes — planification, exécution, tests de restauration et reporting.",
    icon: <HardDrive className="w-6 h-6" />,
    features: [
      "Planification automatique des sauvegardes",
      "Tests de restauration réguliers et validés",
      "Réplication géographique inter-site",
      "PRA documenté et testé",
      "Conformité RGPD et standards locaux",
    ],
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
    configurable: true,
    fields: ["designation", "storage", "duration"] as const,
  },
  {
    id: "reporting",
    title: "Reporting Transparent",
    tagline: "Visibilité totale sur votre SI",
    description:
      "Tableaux de bord accessibles, rapports périodiques et visibilité totale sur votre système d'information. Vous savez à tout moment ce qui se passe sur votre infrastructure.",
    icon: <BarChart3 className="w-6 h-6" />,
    features: [
      "Tableaux de bord personnalisés et accessibles",
      "Rapports mensuels détaillés",
      "Historique complet des incidents et résolutions",
      "Métriques de performance et de disponibilité",
      "Accès portail client en temps réel",
    ],
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    configurable: true,
    fields: ["designation", "duration"] as const,
  },
];


const CATEGORY_ID = "managed";
const CATEGORY_TITLE = "Services Managés";

/* ── Service card ─────────────────────────────────────────── */
function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const { addItem, removeItem, updateConfig, isInCart, items } = useCart();
  const itemId = `${CATEGORY_ID}-${service.id}`;
  const inCart = isInCart(itemId);
  const existingConfig = items.find((i) => i.id === itemId)?.config;
  const [modalOpen, setModalOpen] = useState(false);

  const handleCartClick = () => {
    if (service.configurable) {
      setModalOpen(true);
    } else {
      if (inCart) removeItem(itemId);
      else
        addItem({
          id: itemId,
          name: service.title,
          description: service.tagline,
          category: CATEGORY_TITLE,
        });
    }
  };

  const handleConfirm = (config: ServiceConfig) => {
    setModalOpen(false);
    if (inCart) {
      updateConfig(itemId, config);
    } else {
      addItem({
        id: itemId,
        name: service.title,
        description: service.tagline,
        category: CATEGORY_TITLE,
        config,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      className="group"
    >
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Image — alternates */}
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
          <div
            className={cn(
              "absolute -bottom-4 px-5 py-2 rounded-full shadow-lg text-[10px] font-bold uppercase tracking-widest text-white bg-primary-light",
              index % 2 === 1 ? "-left-4 lg:left-auto lg:-right-4" : "-right-4"
            )}
          >
            {service.tagline}
          </div>
        </div>

        {/* Content */}
        <div className={cn(index % 2 === 1 ? "lg:order-1" : "")}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-light/10 text-primary-light flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
              {service.icon}
            </div>
            <div className="h-px flex-1 bg-taupe/10" />
          </div>

          <h3 className="text-2xl md:text-3xl font-display text-navy mb-4 group-hover:text-primary-light transition-colors duration-300">
            {service.title}
          </h3>

          <p className="text-[15px] text-taupe/70 leading-relaxed mb-6">
            {service.description}
          </p>

          <ul className="space-y-3 mb-8">
            {service.features.map((feat) => (
              <li key={feat} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-primary-light shrink-0" />
                <span className="text-[14px] text-navy font-medium">{feat}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleCartClick}
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                inCart
                  ? "bg-primary-light/10 text-primary-light"
                  : "bg-primary-light text-white hover:bg-ambre-signature"
              )}
            >
              {inCart ? (
                <>
                  <Check className="w-4 h-4" /> Ajouté au panier
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Ajouter au panier
                </>
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
              service={{ id: itemId, name: service.title, category: CATEGORY_TITLE }}
              fields={service.fields ?? []}
              initial={existingConfig}
              accent="primary-light"
              onConfirm={handleConfirm}
              onClose={() => setModalOpen(false)}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}


/* ── Section ──────────────────────────────────────────────── */
export function ManagedServices() {
  return (
    <section className="py-24 md:py-32 bg-cream/30 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">


        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-light/40 via-taupe/20 to-transparent hidden md:block" />

          <div className="space-y-24 md:space-y-32">
            {services.map((service, index) => (
              <div key={service.id} className="relative">
                {/* Center node on desktop */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 20,
                    delay: 0.2,
                  }}
                  className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-8 z-10"
                >
                  <div className="w-5 h-5 rounded-full border-4 border-white shadow-md bg-primary-light" />
                </motion.div>

                <ServiceCard service={service} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
