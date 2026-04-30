"use client";

import { motion } from "framer-motion";
import { Database, Activity, Shield, ArrowRight, CheckCircle2, ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

const services = [
  {
    id: "backup",
    title: "Sauvegarde managée",
    tagline: "Protection sans intervention",
    description: "Service de sauvegarde entièrement opéré par nos équipes. Planification, exécution, tests de restauration et reporting — tout est géré pour vous.",
    icon: <Database className="w-6 h-6" />,
    features: [
      "Planification automatique des backups",
      "Tests de restauration réguliers",
      "Réplication géographique inter-site",
      "Rapports détaillés et alertes",
      "Conformité RGPD et standards locaux"
    ],
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "monitoring",
    title: "Supervision & Monitoring",
    tagline: "Veille 24h/24 et 7j/7",
    description: "Surveillance proactive de vos infrastructures avec alertes en temps réel, tableaux de bord personnalisés et rapports mensuels de performance.",
    icon: <Activity className="w-6 h-6" />,
    features: [
      "Surveillance infrastructure 24/7",
      "Alertes temps réel multicanal",
      "Dashboards personnalisés",
      "Rapports de performance mensuels",
      "Détection proactive des anomalies"
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "security",
    title: "Sécurité managée",
    tagline: "Protection multicouche",
    description: "Protection multicouche de votre infrastructure : pare-feu managé, détection d'intrusions, chiffrement des données et conformité aux standards internationaux.",
    icon: <Shield className="w-6 h-6" />,
    features: [
      "Pare-feu managé et mis à jour",
      "Détection et prévention d'intrusions",
      "Chiffrement des données au repos et en transit",
      "Gestion des correctifs de sécurité",
      "Audit de conformité régulière"
    ],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop"
  }
];

export function ManagedServices() {
  const { addItem, removeItem, isInCart } = useCart();

  const handleCart = (service: typeof services[0]) => {
    const itemId = `managed-${service.id}`;
    if (isInCart(itemId)) {
      removeItem(itemId);
    } else {
      addItem({ id: itemId, name: service.title, description: service.tagline, category: "Services Managés" });
    }
  };
  return (
    <section className="py-24 md:py-32 bg-cream/30 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Services */}
        <div className="relative">
          {/* Vertical straight line */}
          <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-light/40 via-taupe/20 to-transparent hidden md:block" />

          <div className="space-y-24 md:space-y-32">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="group relative"
              >
                {/* Center node on desktop */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring" as const, stiffness: 300, damping: 20, delay: 0.2 }}
                  className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-8 z-10"
                >
                  <div className="w-5 h-5 rounded-full border-4 border-white shadow-md bg-primary-light" />
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Image */}
                <div className={cn("relative", index % 2 === 1 ? "lg:order-2" : "")}>
                  <div className="relative rounded-[32px] overflow-hidden shadow-xl aspect-[4/3]">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
                  </div>
                  <div className={cn(
                    "absolute -bottom-4 px-5 py-2 rounded-full shadow-lg text-[10px] font-bold uppercase tracking-widest text-white bg-primary-light",
                    index % 2 === 1 ? "-left-4 lg:left-auto lg:-right-4" : "-right-4"
                  )}>
                    {service.tagline}
                  </div>
                </div>

              <div className={cn(index % 2 === 1 ? "lg:order-1" : "")}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-light/10 text-primary-light flex items-center justify-center">
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

                  <Button
                    href="/devis"
                    iconRight={<ArrowRight className="w-4 h-4" />}
                    className="bg-primary-light text-white hover:bg-ambre-signature"
                  >
                    Demander un devis
                  </Button>                 
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
