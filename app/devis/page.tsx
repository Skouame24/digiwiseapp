"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Trash2,
  ArrowRight,
  CheckCircle2,
  User,
  Building2,
  Mail,
  Phone,
  MessageSquare,
  ChevronRight,
  Plus,
  ChevronDown,
  Download,
  Printer,
  ShieldCheck,
  Database,
  Cpu,
  Cloud,
  Lock,
  Check,
  Server,
  Pencil,
  X,
  SlidersHorizontal,
  Copy,
} from "lucide-react";
import Link from "next/link";
import { useCart, CartItem, ServiceConfig } from "@/context/CartContext";
import {
  MANAGED_SERVICES_CATALOG,
  OS_CATALOG,
  calculateDetailedQuote,
  formatPriceFCFA,
} from "@/lib/pricing";
import { ServiceConfigModal } from "@/components/sections/ServiceConfigModal";
import { CtaFinal } from "@/components/sections/CtaFinal";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

// Catalogue officiel pour le devis interactif AMBRA
const QUICK_CATALOG = [
  {
    id: "resident-cloud-iaas-vpc",
    title: "Cloud IaaS – Virtual Private Cloud (VPC)",
    category: "Cloud Résident & Hybride",
    description: "Machines virtuelles dédiées (2 vCPU, 4 Go RAM, 100 Go Stockage, Infogérance 24/7)",
    defaultConfig: {
      designation: "Instance Production ERP",
      os: "ubuntu-24",
      vcpu: 2,
      ram: 4,
      storage: 100,
      storageType: "standard" as const,
      bandwidth: 1,
      duration: 3,
      addons: ["cloud-m"],
    },
    fields: ["designation", "vcpu", "ram", "storage", "duration"] as const,
    icon: <Cloud className="w-4 h-4 text-primary-light" />,
  },
  {
    id: "object-storage-s3",
    title: "Stockage d'Objet S3 Souverain",
    category: "Stockage d'Objet (S3-Compatible)",
    description: "Stockage 1 000 Go compatible S3 (API standard, zéro frais de transfert)",
    defaultConfig: {
      designation: "Bucket S3 Sauvegardes",
      storage: 1000,
      storageType: "standard" as const,
      isObjectStorage: true,
      duration: 3,
      addons: [],
    },
    fields: ["designation", "storage", "duration"] as const,
    icon: <Database className="w-4 h-4 text-primary-light" />,
  },
  {
    id: "gpu-dedicated-ia",
    title: "Instances & Serveurs GPU Dédiés IA",
    category: "Processeurs & Serveurs GPU",
    description: "Accélération NVIDIA RTX 4090 (24 Go VRAM), 4 vCPU, 16 Go RAM pour modèles IA et rendu 3D",
    defaultConfig: {
      designation: "Nœud GPU Calcul IA",
      os: "ubuntu-24",
      vcpu: 4,
      ram: 16,
      storage: 250,
      storageType: "advanced" as const,
      gpuType: "rtx4090",
      gpuCount: 1,
      bandwidth: 1,
      duration: 3,
      addons: ["cloud-m"],
    },
    fields: ["designation", "gpu_type", "gpu_count", "vcpu", "ram", "storage", "duration"] as const,
    icon: <Cpu className="w-4 h-4 text-rouge-ambra" />,
  },
  {
    id: "datacenter-proxmox-ve",
    title: "Datacenter Virtuel – Proxmox VE",
    category: "Cloud Résident & Hybride",
    description: "Environnement de virtualisation Open Source dédié et supervisé 24h/24",
    defaultConfig: {
      designation: "Cluster Proxmox VE",
      os: "debian-12",
      vcpu: 8,
      ram: 32,
      storage: 500,
      storageType: "advanced" as const,
      bandwidth: 1,
      duration: 3,
      addons: ["cloud-m", "cloud-monitor"],
    },
    fields: ["designation", "vcpu", "ram", "storage", "duration"] as const,
    icon: <Server className="w-4 h-4 text-navy" />,
  },
  {
    id: "colocation-tier-3",
    title: "Colocation Datacenter Raxio Tier III",
    category: "Cloud Privé & Infrastructures Dédiées",
    description: "Hébergement physique de vos équipements en baie sécurisée Tier III à Abidjan (35 000 FCFA HT / U)",
    defaultConfig: {
      designation: "Emplacement Baie Datacenter (1U)",
      rackUnits: 1, // 1U = 35 000 FCFA HT
      duration: 12,
      addons: [],
    },
    fields: ["designation", "rackUnits", "duration"] as const,
    icon: <Lock className="w-4 h-4 text-navy" />,
  },
];

type CatalogItemType = {
  id: string;
  title: string;
  category: string;
  description: string;
  defaultConfig: ServiceConfig;
  fields: readonly string[];
  icon?: React.ReactNode;
};

export default function DevisPage() {
  const { items, addItem, removeItem, updateConfig, duplicateItem, isInCart, clearCart, count } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [configuringItem, setConfiguringItem] = useState<CatalogItemType | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [catalogModalOpen, setCatalogModalOpen] = useState(false);

  // Recherche robuste d'un item déjà présent dans le devis
  const findMatchingCartItem = (catItemId: string, catTitle?: string) => {
    return items.find((i) => {
      if (i.id === catItemId || i.serviceId === catItemId) return true;
      const cleanI = (i.id + " " + i.name).toLowerCase().replace(/[^a-z0-9]/g, "");
      const cleanCat = (catItemId + " " + (catTitle || "")).toLowerCase().replace(/[^a-z0-9]/g, "");
      return (
        cleanI.includes(cleanCat) ||
        cleanCat.includes(cleanI) ||
        (cleanI.includes("vpc") && cleanCat.includes("vpc")) ||
        (cleanI.includes("iaas") && cleanCat.includes("iaas")) ||
        (cleanI.includes("s3") && cleanCat.includes("s3")) ||
        (cleanI.includes("gpu") && cleanCat.includes("gpu")) ||
        (cleanI.includes("proxmox") && cleanCat.includes("proxmox")) ||
        (cleanI.includes("colocation") && cleanCat.includes("colocation"))
      );
    });
  };

  const handleEditItem = (item: CartItem) => {
    const serviceKey = item.serviceId || item.id.split("_inst_")[0];
    const catMatch = QUICK_CATALOG.find((c) =>
      c.id === serviceKey ||
      c.id === item.id ||
      item.id.includes(c.id) ||
      c.id.includes(item.id) ||
      (item.name && c.title && (item.name.toLowerCase().includes(c.title.toLowerCase()) || c.title.toLowerCase().includes(item.name.toLowerCase())))
    );

    // Détection exhaustive des champs configurables
    const isColo = item.id.toLowerCase().includes("colocation") || item.name.toLowerCase().includes("colocation") || item.name.toLowerCase().includes("baie");
    const isGpu = item.config?.gpuType !== undefined || item.id.toLowerCase().includes("gpu") || item.name.toLowerCase().includes("gpu");
    const isS3 = item.config?.isObjectStorage || item.id.toLowerCase().includes("object") || item.id.toLowerCase().includes("s3") || item.name.toLowerCase().includes("objet");

    let fields: readonly string[] = catMatch?.fields ?? ["designation", "vcpu", "ram", "storage", "duration"];
    if (isColo) {
      fields = ["designation", "rackUnits", "duration"];
    } else if (isGpu) {
      fields = ["designation", "gpu_type", "gpu_count", "vcpu", "ram", "storage", "duration"];
    } else if (isS3) {
      fields = ["designation", "storage", "duration"];
    } else {
      fields = ["designation", "vcpu", "ram", "storage", "duration"];
    }

    setEditingItemId(item.id);
    setConfiguringItem({
      id: item.serviceId || item.id,
      title: item.name,
      category: item.category,
      description: item.description,
      defaultConfig: item.config || catMatch?.defaultConfig || { designation: item.name, duration: 3, addons: [] },
      fields,
      icon: catMatch?.icon || <Server className="w-4 h-4 text-navy" />,
    });
  };

  // Calcul global selon la formule officielle AMBRA
  const globalSummary = items.reduce(
    (acc, item) => {
      if (item.config) {
        const details = calculateDetailedQuote(item.config);
        acc.compute += details.computeSubtotal;
        acc.management += details.managementFee;
        acc.security += details.securityManagementFee;
        acc.fixedAddons += details.fixedAddonsTotal;
        acc.monthlyTotal += details.monthlyTotal;
      }
      return acc;
    },
    { compute: 0, management: 0, security: 0, fixedAddons: 0, monthlyTotal: 0 }
  );

  const totalMonthly = globalSummary.monthlyTotal;
  const totalQuarterly = totalMonthly * 3;
  const totalAnnual = totalMonthly * 12;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const contact = {
      prenom: formData.get("prenom") as string,
      nom: formData.get("nom") as string,
      entreprise: formData.get("entreprise") as string,
      email: formData.get("email") as string,
      tel: formData.get("tel") as string,
      message: formData.get("message") as string,
    };

    try {
      await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact,
          items,
          summary: {
            monthlyTotal: totalMonthly,
            quarterlyTotal: totalQuarterly,
            annualTotal: totalAnnual,
            globalSummary,
          },
        }),
      });

      setSubmitted(true);
      clearCart();
    } catch (err) {
      console.error("Erreur lors de la transmission du devis:", err);
      setSubmitted(true);
      clearCart();
    } finally {
      setLoading(false);
    }
  };

  const handlePrintQuote = () => {
    window.print();
  };

  const toggleCatalogItem = (catItem: typeof QUICK_CATALOG[0]) => {
    const existing = findMatchingCartItem(catItem.id, catItem.title);
    if (existing) {
      removeItem(existing.id);
    } else {
      const details = calculateDetailedQuote(catItem.defaultConfig);
      addItem({
        id: catItem.id,
        name: catItem.title,
        description: catItem.description,
        category: catItem.category,
        config: {
          ...catItem.defaultConfig,
          monthlyPrice: details.monthlyTotal,
        },
      });
    }
  };

  const handleModalConfirm = (config: ServiceConfig, sourceCoords?: { x: number; y: number }) => {
    if (!configuringItem) return;
    const details = calculateDetailedQuote(config);
    const enrichedConfig = {
      ...config,
      monthlyPrice: details.monthlyTotal,
    };

    if (editingItemId) {
      updateConfig(editingItemId, enrichedConfig, sourceCoords);
    } else {
      const baseServiceId = configuringItem.id;
      const newId = `${baseServiceId}_inst_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
      addItem(
        {
          id: newId,
          serviceId: baseServiceId,
          name: configuringItem.title,
          description: configuringItem.description,
          category: configuringItem.category,
          config: enrichedConfig,
        },
        sourceCoords
      );
    }
    setEditingItemId(null);
    setConfiguringItem(null);
  };

  return (
    <>
      {/* Styles d'impression officielle */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-devis, #printable-devis * {
            visibility: visible;
          }
          #printable-devis {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-cream relative overflow-hidden no-print">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-light/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary-light mb-4"
          >
            // Chiffrage Officiel AMBRA Cloud
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="text-4xl md:text-5xl font-display text-navy leading-tight mb-4"
          >
            Votre infrastructure cloud,{" "}
            <span className="italic text-rouge-ambra">votre devis en temps réel</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="text-[15px] text-taupe/70 max-w-2xl leading-relaxed"
          >
            Composez votre configuration selon la Price List officielle AMBRA Cloud. Les coûts de serveurs, Cloud Management (20%) et services managés sont calculés en temps réel.
          </motion.p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 bg-cream min-h-screen">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {submitted ? (
              /* Success state */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease }}
                className="max-w-xl mx-auto text-center py-24 no-print"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                  className="w-20 h-20 bg-primary-light/10 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                  <CheckCircle2 className="w-10 h-10 text-primary-light" />
                </motion.div>
                <h2 className="text-3xl font-display text-navy mb-4">Demande de devis transmise !</h2>
                <p className="text-[15px] text-taupe/70 leading-relaxed mb-8">
                  Nos architectes d&apos;infrastructure ont bien reçu votre sélection et vous recontactent sous 24h avec votre offre formelle signée.
                </p>
                <Link
                  href="/solutions"
                  className="inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] text-primary-light hover:text-rouge-ambra transition-colors"
                >
                  Retour aux solutions <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid lg:grid-cols-[1fr_460px] gap-8 lg:gap-12 items-start"
              >
                {/* GAUCHE : Formulaire coordonnées & validation */}
                <div className="no-print space-y-6">
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-taupe/15 shadow-sm">
                    <div className="mb-6">
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-rouge-ambra block mb-1">
                        Étape de validation
                      </span>
                      <h2 className="text-xl sm:text-2xl font-display text-navy">
                        Vos Coordonnées Professionnelles
                      </h2>
                      <p className="text-[13px] text-taupe/70 mt-1">
                        Renseignez vos coordonnées pour recevoir votre devis officiel chiffré et être contacté par nos architectes cloud.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field icon={<User className="w-4 h-4" />} label="Prénom" name="prenom" placeholder="Jean" required />
                        <Field icon={<User className="w-4 h-4" />} label="Nom" name="nom" placeholder="Kouassi" required />
                      </div>
                      <Field icon={<Building2 className="w-4 h-4" />} label="Entreprise / Organisation" name="entreprise" placeholder="Ex : Banque Ouest Africaine" required />
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field icon={<Mail className="w-4 h-4" />} label="Email professionnel" name="email" type="email" placeholder="j.kouassi@banque.ci" required />
                        <Field icon={<Phone className="w-4 h-4" />} label="Téléphone" name="tel" type="tel" placeholder="+225 07 XX XX XX XX" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold uppercase tracking-widest text-taupe/60">
                          Besoins spécifiques &amp; Contraintes (optionnel)
                        </label>
                        <div className="relative">
                          <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-taupe/30" />
                          <textarea
                            name="message"
                            rows={3}
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-taupe/20 rounded-xl text-[14px] text-navy placeholder:text-taupe/30 focus:border-primary-light focus:ring-2 focus:ring-primary-light/10 outline-none transition-all resize-none"
                            placeholder="Ex : Besoins de réplication PRA, contraintes réglementaires BCEAO/CIMA, licences Windows..."
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-rouge-ambra via-[#900C0C] to-[#7a0a0a] text-white text-xs sm:text-sm font-black uppercase tracking-[0.2em] py-4 sm:py-5 px-6 rounded-xl hover:shadow-xl hover:shadow-rouge-ambra/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 shadow-lg cursor-pointer group"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Transmission en cours…
                            </span>
                          ) : (
                            <>
                              <span className="relative z-10">Transmettre ma demande de devis</span>
                              <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1.5" />
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-center space-y-1 pt-1">
                        <p className="text-[12px] font-bold text-navy">
                          Étude &amp; devis 100% gratuit — Sans engagement
                        </p>
                        <p className="text-[11px] text-taupe/60">
                          Chiffrage certifié et contrat d&apos;infrastructure transmis par nos architectes sous 24h ouvrées.
                        </p>
                      </div>
                    </form>
                  </div>
                </div>

                {/* DROITE : CALCULATEUR ET FICHE DE DEVIS EN FACE */}
                <div className="lg:sticky lg:top-28" id="printable-devis">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-taupe/50">
                      Calculateur Tarifaire
                    </h2>
                    <button
                      type="button"
                      onClick={() => setCatalogModalOpen(true)}
                      className="no-print inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-rouge-ambra hover:underline cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter une ressource</span>
                    </button>
                  </div>

                  <div className="border border-taupe/15 bg-white rounded-3xl overflow-hidden shadow-lg">
                    {/* Header officiel devis */}
                    <div className="p-6 bg-navy text-white flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-light">
                          AMBRA CLOUD
                        </p>
                        <h3 className="text-lg font-black text-white">Devis d&apos;Infrastructure</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-white/60 block font-mono">
                          AMB-{new Date().getFullYear()}-{Math.floor(1000 + Math.random() * 9000)}
                        </span>
                        <span className="text-[10px] text-white/60 block">
                          {new Date().toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>

                    {/* Barre d'action rapide sous le header */}
                    <div className="px-5 py-3 bg-cream/70 border-b border-taupe/15 flex items-center justify-between no-print flex-wrap gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-navy">
                        Ressources &amp; Services ({items.length})
                      </span>
                      <div className="flex items-center gap-2">
                        {items.length > 0 && (
                          <button
                            type="button"
                            onClick={() => handleEditItem(items[0])}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-cream border border-taupe/20 text-navy text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
                          >
                            <Pencil className="w-3 h-3 text-rouge-ambra" />
                            <span>Modifier ma machine</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setCatalogModalOpen(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy hover:bg-rouge-ambra text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Ajouter une ressource</span>
                        </button>
                      </div>
                    </div>

                    <AnimatePresence mode="popLayout">
                      {items.length === 0 ? (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col items-center py-12 text-center px-6"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center text-taupe/40 mb-3">
                            <FileText className="w-6 h-6" />
                          </div>
                          <p className="text-[13px] font-bold text-navy mb-1">
                            Aucune ressource sélectionnée
                          </p>
                          <p className="text-[12px] text-taupe/60 max-w-xs mb-5">
                            Sélectionnez vos machines virtuelles, stockage ou baie datacenter pour calculer votre estimation officielle.
                          </p>
                          <button
                            type="button"
                            onClick={() => setCatalogModalOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rouge-ambra text-white text-xs font-bold uppercase tracking-wider hover:bg-[#900C0C] transition-colors cursor-pointer shadow-sm"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Choisir mes ressources</span>
                          </button>
                        </motion.div>
                      ) : (
                        <>
                          {/* Lignes de configuration */}
                          <div className="divide-y divide-taupe/10">
                            {items.map((item) => (
                              <CartItemRow
                                key={item.id}
                                item={item}
                                onRemove={() => removeItem(item.id)}
                                onEdit={() => handleEditItem(item)}
                                onDuplicate={() => duplicateItem(item.id)}
                              />
                            ))}
                          </div>

                          {/* Tableau récapitulatif officiel AMBRA */}
                          <div className="p-5 border-t border-taupe/15 bg-cream/40 space-y-2.5">
                            <div className="flex items-center justify-between text-xs text-taupe/80">
                              <span>Ressources Cloud (Compute &amp; Stockage) :</span>
                              <span className="font-bold text-navy">
                                {formatPriceFCFA(globalSummary.compute, false)}
                              </span>
                            </div>

                            {globalSummary.management > 0 && (
                              <div className="flex items-center justify-between text-xs text-taupe/80">
                                <span>CLOUD-M : Cloud Management (20%) :</span>
                                <span className="font-bold text-rouge-ambra">
                                  +{formatPriceFCFA(globalSummary.management, false)}
                                </span>
                              </div>
                            )}

                            {globalSummary.security > 0 && (
                              <div className="flex items-center justify-between text-xs text-taupe/80">
                                <span>CLOUD-SM : Security Management (10%) :</span>
                                <span className="font-bold text-rouge-ambra">
                                  +{formatPriceFCFA(globalSummary.security, false)}
                                </span>
                              </div>
                            )}

                            {globalSummary.fixedAddons > 0 && (
                              <div className="flex items-center justify-between text-xs text-taupe/80">
                                <span>Services Managés &amp; Options :</span>
                                <span className="font-bold text-navy">
                                  +{formatPriceFCFA(globalSummary.fixedAddons, false)}
                                </span>
                              </div>
                            )}

                            {/* Totaux périodiques */}
                            <div className="pt-3 border-t border-taupe/15 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-[11px] font-black uppercase tracking-widest text-navy block">
                                    Total Mensuel HT
                                  </span>
                                  <span className="text-[10px] font-extrabold text-emerald-700 block">
                                    {(() => {
                                      const maxDur = items.reduce((max, i) => Math.max(max, i.config?.duration || 3), 3);
                                      if (maxDur === 3) return "Engagement Trimestriel (dès 3 Mois)";
                                      if (maxDur === 12) return "Engagement Annuel (12 Mois)";
                                      if (maxDur === 36) return "Engagement Pluriannuel (36 Mois)";
                                      return `Engagement ${maxDur} Mois`;
                                    })()}
                                  </span>
                                </div>
                                <span className="text-xl font-black text-rouge-ambra">
                                  {formatPriceFCFA(totalMonthly, true)}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-xs text-taupe/70 pt-1">
                                <span>Montant Trimestriel (x3) :</span>
                                <span className="font-bold text-navy">{formatPriceFCFA(totalQuarterly, false)}</span>
                              </div>

                              <div className="flex items-center justify-between text-xs text-taupe/70">
                                <span>Montant Annuel (x12) :</span>
                                <span className="font-bold text-navy">{formatPriceFCFA(totalAnnual, false)}</span>
                              </div>
                            </div>

                            <div className="pt-2 flex items-center justify-between no-print border-t border-taupe/10">
                              <span className="text-[11px] font-bold uppercase tracking-widest text-taupe/50">
                                {count} service{count > 1 ? "s" : ""} sélectionné{count > 1 ? "s" : ""}
                              </span>
                              <button
                                onClick={clearCart}
                                className="text-[10px] font-bold uppercase tracking-widest text-taupe/40 hover:text-rouge-ambra transition-colors cursor-pointer"
                              >
                                Réinitialiser
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mt-4 p-4 rounded-2xl border border-taupe/15 bg-white text-[11px] text-taupe/60 space-y-2">
                    <p className="flex items-center gap-1.5 font-bold text-navy">
                      <ShieldCheck className="w-4 h-4 text-primary-light shrink-0" /> Garanties AMBRA Cloud
                    </p>
                    <p>
                      SLA contractuel 99,95 %, hébergement souverain en Côte d&apos;Ivoire (Tier III) et support technique 24h/24 et 7j/7 inclus.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Sélection Rapide du Catalogue */}
        <AnimatePresence>
          {catalogModalOpen && (
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCatalogModalOpen(false)}
                className="fixed inset-0 bg-navy/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease }}
                className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-taupe/15 overflow-hidden flex flex-col max-h-[88vh]"
              >
                {/* Header */}
                <div className="bg-navy p-5 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-xl">
                      <SlidersHorizontal className="w-5 h-5 text-primary-light" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary-light block">
                        AMBRA Cloud
                      </span>
                      <h3 className="text-lg font-black text-white">
                        Catalogue des Infrastructures &amp; Serveurs
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setCatalogModalOpen(false)}
                    className="p-1.5 hover:bg-white/15 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Body: Liste des 5 ressources */}
                <div className="p-5 sm:p-6 overflow-y-auto space-y-3 bg-cream/30 flex-1">
                  <p className="text-xs text-taupe/70 mb-2">
                    Cochez les ressources à ajouter ou retirez-les selon vos besoins. Les tarifs sont calculés selon la Price List officielle AMBRA Cloud.
                  </p>
                  {QUICK_CATALOG.map((catItem) => {
                    const cartItemObj = findMatchingCartItem(catItem.id, catItem.title);
                    const active = !!cartItemObj || isInCart(catItem.id);
                    const currentMonthly =
                      cartItemObj?.config?.monthlyPrice ??
                      calculateDetailedQuote(catItem.defaultConfig).monthlyTotal;

                    return (
                      <div
                        key={catItem.id}
                        className={`p-4 rounded-2xl border transition-all duration-200 bg-white ${
                          active
                            ? "border-rouge-ambra shadow-md ring-1 ring-rouge-ambra/30"
                            : "border-taupe/15 hover:border-taupe/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => toggleCatalogItem(catItem)}
                            className="flex items-start gap-3 text-left flex-1 min-w-0 cursor-pointer"
                          >
                            <span
                              className={`mt-0.5 w-5 h-5 shrink-0 border-2 rounded-md flex items-center justify-center transition-colors ${
                                active
                                  ? "border-rouge-ambra bg-rouge-ambra"
                                  : "border-taupe/30 bg-white"
                              }`}
                            >
                              {active && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                {catItem.icon}
                                <p className="text-[14px] font-bold text-navy leading-snug">
                                  {catItem.title}
                                </p>
                              </div>
                              <p className="text-[11px] text-taupe/60 mt-1">{catItem.description}</p>
                            </div>
                          </button>

                          <div className="text-right shrink-0 flex flex-col items-end gap-1">
                            <span className="text-[12px] font-black text-navy block">
                              {formatPriceFCFA(currentMonthly, false)}
                            </span>
                            {active ? (
                              <div className="flex items-center gap-2 pt-0.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCatalogModalOpen(false);
                                    setEditingItemId(null);
                                    setConfiguringItem({
                                      ...catItem,
                                      defaultConfig: {
                                        ...catItem.defaultConfig,
                                        designation: `Serveur #${items.length + 1}`,
                                      },
                                    });
                                  }}
                                  className="text-[10px] font-black uppercase tracking-wider text-rouge-ambra hover:underline cursor-pointer"
                                >
                                  + Ajouter un autre ›
                                </button>
                                <span className="text-taupe/30">|</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCatalogModalOpen(false);
                                    if (cartItemObj) handleEditItem(cartItemObj);
                                  }}
                                  className="text-[10px] font-bold uppercase tracking-wider text-navy hover:underline cursor-pointer"
                                >
                                  Modifier ›
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setCatalogModalOpen(false);
                                  setEditingItemId(null);
                                  setConfiguringItem(catItem);
                                }}
                                className="text-[10px] font-bold uppercase tracking-widest text-rouge-ambra hover:underline cursor-pointer"
                              >
                                Configurer ›
                              </button>
                            )}
                          </div>
                        </div>

                        {active && cartItemObj?.config && (
                          <div className="mt-3 pt-2.5 border-t border-taupe/10 text-[11px] text-taupe/70 flex flex-wrap gap-x-4 gap-y-1">
                            {cartItemObj.config.rackUnits !== undefined && (
                              <span className="text-navy font-semibold">{cartItemObj.config.rackUnits}U en Baie Datacenter</span>
                            )}
                            {cartItemObj.config.vcpu !== undefined && (
                              <span>{cartItemObj.config.vcpu} vCPU</span>
                            )}
                            {cartItemObj.config.ram !== undefined && (
                              <span>{cartItemObj.config.ram} Go RAM</span>
                            )}
                            {cartItemObj.config.storage !== undefined && (
                              <span>
                                {cartItemObj.config.storage} Go{" "}
                                {cartItemObj.config.storageType === "advanced" ? "(NVMe)" : "(Std)"}
                              </span>
                            )}
                            {cartItemObj.config.gpuCount !== undefined && (
                              <span className="text-rouge-ambra font-bold">
                                {cartItemObj.config.gpuCount}x GPU ({cartItemObj.config.gpuType?.toUpperCase()})
                              </span>
                            )}
                            {cartItemObj.config.addons?.includes("cloud-m") && (
                              <span className="text-rouge-ambra font-medium">+Cloud Management (20%)</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="p-4 bg-white border-t border-taupe/15 flex items-center justify-between">
                  <span className="text-xs font-bold text-navy">
                    {items.length} ressource{items.length > 1 ? "s" : ""} dans votre devis
                  </span>
                  <button
                    type="button"
                    onClick={() => setCatalogModalOpen(false)}
                    className="px-6 py-2.5 bg-rouge-ambra hover:bg-[#900C0C] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                  >
                    Valider et voir mon devis
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal de configuration des détails */}
        {configuringItem && (
          <ServiceConfigModal
            service={{
              id: configuringItem.id,
              name: configuringItem.title,
              category: configuringItem.category,
            }}
            fields={configuringItem.fields}
            initial={findMatchingCartItem(configuringItem.id, configuringItem.title)?.config ?? configuringItem.defaultConfig}
            onConfirm={handleModalConfirm}
            onClose={() => setConfiguringItem(null)}
          />
        )}
      </section>

      <CtaFinal />
    </>
  );
}

/* ── Form field ────────────────────────────────────────────── */
function Field({
  icon,
  label,
  name,
  placeholder,
  type = "text",
  required = false,
}: {
  icon: React.ReactNode;
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[12px] font-bold uppercase tracking-widest text-taupe/60">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe/30">{icon}</span>
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-taupe/20 rounded-xl text-[14px] text-navy placeholder:text-taupe/30 focus:border-primary-light focus:ring-2 focus:ring-primary-light/10 outline-none transition-all"
        />
      </div>
    </div>
  );
}

/* ── Ligne d'article du devis ──────────────────────────────── */
function CartItemRow({
  item,
  onRemove,
  onEdit,
  onDuplicate,
}: {
  item: CartItem;
  onRemove: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
}) {
  const [open, setOpen] = useState(true);
  const hasDetails = !!item.config;
  const quoteCalc = item.config ? calculateDetailedQuote(item.config) : null;
  const itemMonthly = quoteCalc?.monthlyTotal ?? item.config?.monthlyPrice ?? 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.25 }}
      className="p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-rouge-ambra mb-0.5">
            {item.category}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-[14px] sm:text-[15px] font-black text-navy leading-snug">
              {item.name}
            </h4>
            {item.config?.designation && (
              <span className="text-[11px] font-bold text-rouge-ambra bg-rouge-ambra/10 px-2 py-0.5 rounded border border-rouge-ambra/25">
                &ldquo;{item.config.designation}&rdquo;
              </span>
            )}
          </div>
          <p className="text-[11px] text-taupe/65 mt-0.5 leading-relaxed">{item.description}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0 mt-0.5 no-print">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="p-1.5 text-taupe/40 hover:text-rouge-ambra transition-colors duration-200 cursor-pointer"
              title="Modifier la configuration de cette machine"
              aria-label="Modifier"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          {onDuplicate && (
            <button
              type="button"
              onClick={onDuplicate}
              className="p-1.5 text-taupe/40 hover:text-navy transition-colors duration-200 cursor-pointer"
              title="Dupliquer cette machine"
              aria-label="Dupliquer"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}
          {hasDetails && (
            <button
              onClick={() => setOpen((v) => !v)}
              className="p-1.5 text-taupe/40 hover:text-navy transition-colors duration-200 cursor-pointer"
              aria-label={open ? "Réduire" : "Détailler"}
            >
              <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </button>
          )}
          <button
            onClick={onRemove}
            className="p-1.5 text-taupe/30 hover:text-rouge-ambra transition-colors duration-200 cursor-pointer"
            aria-label="Retirer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && item.config && quoteCalc && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3.5 pt-3 border-t border-taupe/15 space-y-3">
              {/* Badges synthétiques du contrat */}
              <div className="flex flex-wrap items-center gap-1.5">
                {quoteCalc.instanceCount > 1 && (
                  <span className="text-[11px] font-black text-rouge-ambra bg-rouge-ambra/10 px-2.5 py-0.5 rounded-full border border-rouge-ambra/25">
                    Cluster de {quoteCalc.instanceCount} machines identiques
                  </span>
                )}
                {item.config.os && (
                  <span className="text-[11px] font-bold text-navy bg-white px-2.5 py-0.5 rounded-full border border-taupe/20 shadow-2xs">
                    OS : <span className="font-extrabold text-emerald-700">
                      {OS_CATALOG.find((o) => o.id === item.config?.os)?.name || item.config.os} (Licence Incluse · 0 F)
                    </span>
                  </span>
                )}
                <span className="text-[11px] font-bold text-navy bg-white px-2.5 py-0.5 rounded-full border border-taupe/20 shadow-2xs">
                  Engagement : <span className="font-extrabold text-navy">
                    {quoteCalc.duration} Mois {quoteCalc.duration === 12 ? "(Annuel)" : quoteCalc.duration === 36 ? "(3 Ans)" : "(Trimestriel)"}
                  </span>
                </span>
              </div>

              {/* Tableau d'imputation détaillé poste par poste */}
              <div className="bg-cream/40 rounded-2xl p-3 sm:p-4 border border-taupe/15 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-taupe/15">
                  <span className="text-[10px] font-black uppercase tracking-widest text-navy">
                    Détail des Postes Chiffrés {quoteCalc.instanceCount > 1 ? "(Par Machine)" : ""}
                  </span>
                  <span className="text-[9.5px] font-bold text-taupe/60">
                    Tarif officiel HT / mois
                  </span>
                </div>

                <div className="divide-y divide-taupe/10">
                  {quoteCalc.itemsBreakdown.map((b, idx) => (
                    <div key={idx} className="py-1.5 flex items-start justify-between gap-2 text-[11.5px]">
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-navy block leading-tight">{b.label}</span>
                        {b.sublabel && (
                          <span className="text-taupe/60 text-[10.5px] block leading-tight mt-0.5">
                            {b.sublabel}
                          </span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`font-black block leading-tight ${b.isIncluded || b.totalPrice === 0 ? "text-emerald-700" : "text-navy"}`}>
                          {b.isIncluded || b.totalPrice === 0 ? "Inclus (0 F)" : formatPriceFCFA(b.totalPrice, false)}
                        </span>
                        {b.unitPriceText && (
                          <span className="text-[9px] text-taupe/50 block leading-tight mt-0.5">
                            {b.unitPriceText}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Synthèse machine vs cluster */}
                <div className="pt-2.5 border-t border-taupe/15 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-taupe/70">
                    <span>Sous-total Compute unitaire (Serveur nu) :</span>
                    <span className="font-bold text-navy">{formatPriceFCFA(quoteCalc.unitComputeSubtotal, false)}</span>
                  </div>
                  {quoteCalc.managementFee > 0 && (
                    <div className="flex items-center justify-between text-[11px] text-taupe/70">
                      <span>Cloud Management &amp; Support 24/7 (+20%) :</span>
                      <span className="font-bold text-rouge-ambra">+{formatPriceFCFA(Math.round(quoteCalc.managementFee / quoteCalc.instanceCount), false)}</span>
                    </div>
                  )}
                  {quoteCalc.securityManagementFee > 0 && (
                    <div className="flex items-center justify-between text-[11px] text-taupe/70">
                      <span>Cybersécurité &amp; Vulnérabilités (+10%) :</span>
                      <span className="font-bold text-rouge-ambra">+{formatPriceFCFA(Math.round(quoteCalc.securityManagementFee / quoteCalc.instanceCount), false)}</span>
                    </div>
                  )}

                  {quoteCalc.instanceCount > 1 && (
                    <div className="flex items-center justify-between text-[11px] font-bold text-navy pt-1.5 border-t border-taupe/10">
                      <span>Sous-total unitaire par machine :</span>
                      <span className="font-black text-navy">{formatPriceFCFA(quoteCalc.unitMonthlyTotal, false)} / mois</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs font-black text-navy pt-2 border-t border-taupe/20">
                    <span>
                      Total mensuel {quoteCalc.instanceCount > 1 ? `(${quoteCalc.instanceCount} machines)` : ""} :
                    </span>
                    <span className="text-[15px] font-black text-rouge-ambra">
                      {formatPriceFCFA(quoteCalc.monthlyTotal, true)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
