"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Trash2, ArrowRight, CheckCircle2, User, Building2, Mail, Phone, MessageSquare, ChevronRight, Plus, ChevronDown, Download, Printer, ShieldCheck, Database, Cpu, Cloud, Lock, Check, Clock } from "lucide-react";
import Link from "next/link";
import { useCart, CartItem, ServiceConfig } from "@/context/CartContext";
import { MANAGED_ADDONS, GPU_MODELS, formatPriceFCFA } from "@/lib/pricing";
import { ServiceConfigModal } from "@/components/sections/ServiceConfigModal";
import { CtaFinal } from "@/components/sections/CtaFinal";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

// Catalogue pour sélection directe dans la page de devis
const QUICK_CATALOG = [
  {
    id: "resident-cloud-iaas-–-virtual-private-cloud-(vpc)",
    title: "Cloud IaaS – Virtual Private Cloud (VPC)",
    category: "Cloud Résident & Hybride",
    description: "Machines virtuelles dédiées et dimensionnées selon les besoins",
    basePrice: 65000,
    configurable: true,
    fields: ["designation", "vcpu", "ram", "storage", "duration"] as const,
    icon: <Cloud className="w-4 h-4 text-primary-light" />,
  },
  {
    id: "object-storage-stockage-d'objet-s3-souverain",
    title: "Stockage d'Objet S3 Souverain",
    category: "Stockage d'Objet (S3-Compatible)",
    description: "Compatibilité 100% S3 (MinIO, AWS SDK) - Zéro frais Egress/Ingress",
    basePrice: 15,
    configurable: true,
    fields: ["designation", "storage", "duration"] as const,
    icon: <Database className="w-4 h-4 text-primary-light" />,
  },
  {
    id: "gpu-instances-&-serveurs-gpu-dédiés-ia",
    title: "Instances & Serveurs GPU Dédiés IA",
    category: "Processeurs & Serveurs GPU",
    description: "NVIDIA H100 (80GB SXM5), L40S (48GB) et RTX 4090",
    basePrice: 165000,
    configurable: true,
    fields: ["designation", "gpu_type", "gpu_count", "vcpu", "ram", "storage", "duration"] as const,
    icon: <Cpu className="w-4 h-4 text-rouge-ambra" />,
  },
  {
    id: "resident-datacenter-virtuel-–-hyperviseur-proxmox-ve",
    title: "Datacenter Virtuel – Proxmox VE",
    category: "Cloud Résident & Hybride",
    description: "Virtualisation Open Source sans dépendance propriétaire",
    basePrice: 120000,
    configurable: true,
    fields: ["designation", "vcpu", "ram", "storage", "duration"] as const,
    icon: <Cloud className="w-4 h-4 text-navy" />,
  },
  {
    id: "private-bare-metal-–-serveurs-dédiés-haute-performance",
    title: "Bare Metal – Serveurs Dédiés Physical",
    category: "Cloud Privé & Infrastructures Dédiées",
    description: "Performances brutes non partagées - Accès IPMI / KVM",
    basePrice: 180000,
    configurable: true,
    fields: ["designation", "vcpu", "ram", "storage", "duration"] as const,
    icon: <Lock className="w-4 h-4 text-navy" />,
  },
];

export default function DevisPage() {
  const { items, addItem, removeItem, updateConfig, isInCart, clearCart, count, getTotalMonthlyPrice } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [configuringItem, setConfiguringItem] = useState<typeof QUICK_CATALOG[0] | null>(null);

  const totalMonthly = getTotalMonthlyPrice();
  const totalAnnual = totalMonthly * 12;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      clearCart();
    }, 1200);
  };

  const handlePrintQuote = () => {
    window.print();
  };

  const toggleCatalogItem = (catItem: typeof QUICK_CATALOG[0]) => {
    if (isInCart(catItem.id)) {
      removeItem(catItem.id);
    } else {
      addItem({
        id: catItem.id,
        name: catItem.title,
        description: catItem.description,
        category: catItem.category,
        basePrice: catItem.basePrice,
      });
    }
  };

  const handleModalConfirm = (config: ServiceConfig) => {
    if (!configuringItem) return;
    if (isInCart(configuringItem.id)) {
      updateConfig(configuringItem.id, config);
    } else {
      addItem({
        id: configuringItem.id,
        name: configuringItem.title,
        description: configuringItem.description,
        category: configuringItem.category,
        basePrice: configuringItem.basePrice,
        config,
      });
    }
    setConfiguringItem(null);
  };

  return (
    <>
      {/* Printable CSS style overlay */}
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
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary-light mb-4">
            // Devis Cloud Sur-Mesure
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="text-4xl md:text-5xl font-display text-navy leading-tight mb-4">
            Votre projet infrastructure,{" "}
            <span className="italic text-rouge-ambra">votre devis personnalisé</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="text-[15px] text-taupe/70 max-w-xl leading-relaxed">
            Renseignez votre projet ci-dessous pour recevoir une étude personnalisée par nos architectes. Notre calculateur tarifaire interactif est actuellement en cours de formalisation et sera bientôt disponible en ligne.
          </motion.p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 bg-cream min-h-screen">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {submitted ? (
              /* Success state */
              <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }}
                className="max-w-xl mx-auto text-center py-24 no-print">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                  className="w-20 h-20 bg-primary-light/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="w-10 h-10 text-primary-light" />
                </motion.div>
                <h2 className="text-3xl font-display text-navy mb-4">Demande de devis transmise !</h2>
                <p className="text-[15px] text-taupe/70 leading-relaxed mb-8">
                  Nos architectes d&apos;infrastructure analysent votre sélection et vous recontactent sous 24h avec une offre formelle signée.
                </p>
                <Link href="/solutions"
                  className="inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] text-primary-light hover:text-rouge-ambra transition-colors">
                  Retour aux solutions <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid lg:grid-cols-[1fr_440px] gap-12 items-start">

                {/* LEFT: Article Selection + Contact Form */}
                <div className="no-print space-y-10">

                  {/* Bandeau d'information sur la formalisation */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FBF4E4] border border-[#D86C24]/30 flex items-start gap-3.5 text-navy">
                    <Clock className="w-5 h-5 text-rouge-ambra shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm">
                      <span className="font-black text-rouge-ambra uppercase tracking-wider block text-[11px] mb-1">
                        Calculateur & Grille tarifaire en cours d&apos;actualisation — Bientôt disponible
                      </span>
                      <span className="text-taupe/80 leading-relaxed">
                        Nos équipes formalisent actuellement la nouvelle grille tarifaire unifiée. Le calculateur interactif est temporairement grisé. Remplissez simplement vos coordonnées et vos besoins ci-dessous pour recevoir une étude chiffrée personnalisée sous 24h ouvrées.
                      </span>
                    </div>
                  </div>

                  {/* Quick Catalog Checkers */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-taupe/50">
                        1. Sélection des Produits & Services (Optionnel)
                      </h2>
                      <span className="text-[10px] text-taupe/40 font-semibold">Cochez vos domaines d&apos;intérêt</span>
                    </div>

                    <div className="space-y-3">
                      {QUICK_CATALOG.map((catItem) => {
                        const active = isInCart(catItem.id);

                        return (
                          <div
                            key={catItem.id}
                            className={`p-4 rounded-2xl border transition-all duration-200 bg-white ${active
                                ? "border-rouge-ambra shadow-md ring-1 ring-rouge-ambra/30"
                                : "border-taupe/15 hover:border-taupe/30"
                              }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <button
                                type="button"
                                onClick={() => toggleCatalogItem(catItem)}
                                className="flex items-start gap-3 text-left flex-1 min-w-0"
                              >
                                <span
                                  className={`mt-0.5 w-5 h-5 shrink-0 border-2 rounded-md flex items-center justify-center transition-colors ${active ? "border-rouge-ambra bg-rouge-ambra" : "border-taupe/30 bg-white"
                                    }`}
                                >
                                  {active && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                                </span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    {catItem.icon}
                                    <p className="text-[14px] font-bold text-navy leading-snug">{catItem.title}</p>
                                  </div>
                                  <p className="text-[11px] text-taupe/60 mt-1">{catItem.description}</p>
                                </div>
                              </button>

                              <div className="text-right shrink-0">
                                <span className="text-[11px] font-bold text-rouge-ambra bg-rouge-ambra/5 px-2.5 py-1 rounded-md border border-rouge-ambra/20 block">
                                  Sur devis
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Contact Form */}
                  <div>
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-taupe/50 mb-6">
                      2. Vos Coordonnées & Validation
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field icon={<User className="w-4 h-4" />} label="Prénom" name="prenom" placeholder="Jean" required />
                        <Field icon={<User className="w-4 h-4" />} label="Nom" name="nom" placeholder="Kouassi" required />
                      </div>
                      <Field icon={<Building2 className="w-4 h-4" />} label="Entreprise / Organisation" name="entreprise" placeholder="Ex : Bank West Africa" required />
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field icon={<Mail className="w-4 h-4" />} label="Email professionnel" name="email" type="email" placeholder="jean@entreprise.ci" required />
                        <Field icon={<Phone className="w-4 h-4" />} label="Téléphone" name="tel" type="tel" placeholder="+225 07 XX XX XX XX" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold uppercase tracking-widest text-taupe/60">
                          Besoins spécifiques & Remarques (optionnel)
                        </label>
                        <div className="relative">
                          <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-taupe/30" />
                          <textarea name="message" rows={3}
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-taupe/20 rounded-xl text-[14px] text-navy placeholder:text-taupe/30 focus:border-primary-light focus:ring-2 focus:ring-primary-light/10 outline-none transition-all resize-none"
                            placeholder="Ex : Migration depuis AWS, contraintes BCEAO/CIMA, besoin de PRA..." />
                        </div>
                      </div>

                      {/* Notice if no item selected */}
                      {items.length === 0 && (
                        <div className="p-3.5 bg-primary-light/10 border border-primary-light/20 rounded-xl text-[12px] text-navy font-medium flex items-center gap-2.5">
                          <span className="text-base">💡</span>
                          <span>Vous pouvez cocher des services ci-dessus ou simplement remplir vos coordonnées : un architecte élaborera votre devis sur-mesure.</span>
                        </div>
                      )}

                      <div className="pt-2 space-y-3">
                        <button type="submit" disabled={loading}
                          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-rouge-ambra via-[#900C0C] to-[#7a0a0a] text-white text-xs sm:text-sm font-black uppercase tracking-[0.2em] py-4 sm:py-5 px-6 rounded-xl hover:shadow-xl hover:shadow-rouge-ambra/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 shadow-lg cursor-pointer group">
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Transmission en cours…
                            </span>
                          ) : (
                            <>
                              <span className="relative z-10">Envoyer ma demande de devis</span>
                              <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1.5" />
                            </>
                          )}
                        </button>

                        {items.length > 0 && (
                          <button type="button" onClick={handlePrintQuote}
                            className="w-full flex items-center justify-center gap-2 bg-navy text-white text-[12px] font-black uppercase tracking-[0.18em] py-3.5 rounded-xl hover:bg-primary-light transition-colors duration-300 shadow-md">
                            <Download className="w-4 h-4 text-white" />
                            <span>Télécharger / Imprimer mon devis (PDF)</span>
                          </button>
                        )}
                      </div>

                      <div className="text-center space-y-1 pt-1">
                        <p className="text-[12px] font-bold text-navy">
                          🔒 Étude & devis 100% gratuit — Sans engagement
                        </p>
                        <p className="text-[11px] text-taupe/60">
                          Validation et chiffrage personnalisé transmis par nos architectes sous 24h ouvrées.
                        </p>
                      </div>
                    </form>
                  </div>
                </div>

                {/* RIGHT: Dynamic Calculation & Printable Section - Grisé / Bientôt disponible */}
                <div className="lg:sticky lg:top-28 relative" id="printable-devis">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-taupe/50">Calculateur & Devis</h2>
                      <span className="text-[9px] font-black uppercase tracking-wider bg-rouge-ambra/10 text-rouge-ambra px-2 py-0.5 rounded-full border border-rouge-ambra/20">
                        Bientôt disponible
                      </span>
                    </div>
                  </div>

                  <div className="relative border border-taupe/15 bg-white rounded-2xl overflow-hidden shadow-md">
                    {/* Overlay d'information "Bientôt disponible" */}
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-[#FBF4E4] border border-[#D86C24]/30 flex items-center justify-center text-rouge-ambra mb-3 shadow-sm">
                        <Clock className="w-6 h-6 text-rouge-ambra" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rouge-ambra bg-rouge-ambra/10 px-3 py-1 rounded-full mb-2">
                        Bientôt disponible
                      </span>
                      <h4 className="text-[15px] font-display font-bold text-navy mb-1.5">
                        Calculateur tarifaire en cours de formalisation
                      </h4>
                      <p className="text-xs text-taupe/70 max-w-xs leading-relaxed mb-4">
                        La nouvelle grille tarifaire unifiée est en cours de validation. Remplissez le formulaire de contact pour recevoir une offre sur-mesure sous 24h.
                      </p>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-navy bg-cream/80 px-3 py-1.5 rounded-xl border border-taupe/15">
                        <ShieldCheck className="w-4 h-4 text-primary-light" />
                        Chiffrage officiel transmis par nos architectes
                      </div>
                    </div>

                    {/* Contenu grisé en arrière-plan */}
                    <div className="opacity-35 grayscale pointer-events-none select-none">
                      {/* Header for print preview */}
                      <div className="p-6 bg-navy text-white flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-light">AMBRA CLOUD</p>
                          <h3 className="text-lg font-black text-white">Devis d&apos;Infrastructure</h3>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-white/60 block font-mono">DEV-XXXX</span>
                          <span className="text-[10px] text-white/60 block">{new Date().toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center py-12 text-center px-6">
                        <FileText className="w-10 h-10 text-taupe/20 mb-3" />
                        <p className="text-[12px] font-bold text-taupe/40 uppercase tracking-widest mb-1">Calculateur automatique</p>
                        <p className="text-[11px] text-taupe/40">Tarifs en cours de mise à jour.</p>
                      </div>

                      <div className="p-5 border-t border-taupe/15 bg-cream/40 space-y-3">
                        <div className="flex items-center justify-between text-xs text-taupe/70 font-semibold">
                          <span>Sous-total estimé :</span>
                          <span className="font-bold text-navy">Sur devis</span>
                        </div>
                        <div className="pt-3 border-t border-taupe/15 flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-black uppercase tracking-widest text-navy block">Montant Mensuel</span>
                            <span className="text-[10px] text-taupe/50 block">Étude personnalisée</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-black text-rouge-ambra block">Sur devis</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 rounded-xl border border-taupe/15 bg-white text-[11px] text-taupe/60 space-y-2">
                    <p className="flex items-center gap-1.5 font-bold text-navy">
                      <ShieldCheck className="w-4 h-4 text-primary-light shrink-0" /> Garanties AMBRA Cloud
                    </p>
                    <p>SLA contractuel 99,99%, hébergement souverain en Côte d&apos;Ivoire et support technique 24h/24 et 7j/7 inclus.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal si clic sur Personnaliser - Mis en commentaire pendant la formalisation */}
        {/*
        configuringItem && (
          <ServiceConfigModal
            service={{
              id: configuringItem.id,
              name: configuringItem.title,
              category: configuringItem.category,
              basePrice: configuringItem.basePrice,
            }}
            fields={configuringItem.fields}
            initial={items.find((i) => i.id === configuringItem.id)?.config}
            onConfirm={handleModalConfirm}
            onClose={() => setConfiguringItem(null)}
          />
        )
        */}
      </section>

      <CtaFinal />
    </>
  );
}

/* ── Form field ────────────────────────────────────────────── */
function Field({
  icon, label, name, placeholder, type = "text", required = false
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

/* ── Cart item row ─────────────────────────────────────────── */
function CartItemRow({ item, onRemove }: { item: CartItem; onRemove: () => void }) {
  const [open, setOpen] = useState(true);
  const hasDetails = !!item.config;
  const itemMonthly = item.config?.monthlyPrice ?? item.basePrice ?? 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.25 }}
      className="p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-rouge-ambra mb-0.5">
            {item.category}
          </p>
          <p className="text-[14px] font-black text-navy leading-snug">{item.name}</p>
          <p className="text-[11px] text-taupe/60 mt-0.5 leading-relaxed">{item.description}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0 mt-0.5 no-print">
          {hasDetails && (
            <button
              onClick={() => setOpen((v) => !v)}
              className="p-1.5 text-taupe/40 hover:text-navy transition-colors duration-200"
              aria-label={open ? "Réduire" : "Détailler"}
            >
              <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </button>
          )}
          <button
            onClick={onRemove}
            className="p-1.5 text-taupe/30 hover:text-rouge-ambra transition-colors duration-200"
            aria-label="Retirer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && item.config && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-taupe/8 space-y-2">
              {item.config.designation && (
                <p className="text-[12px] italic text-navy font-semibold">
                  &ldquo;{item.config.designation}&rdquo;
                </p>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {item.config.vcpu !== undefined && (
                  <span className="text-[12px] font-bold text-navy">{item.config.vcpu} <span className="font-normal text-taupe/50">vCPU</span></span>
                )}
                {item.config.ram !== undefined && (
                  <span className="text-[12px] font-bold text-navy">{item.config.ram} <span className="font-normal text-taupe/50">Go RAM</span></span>
                )}
                {item.config.storage !== undefined && (
                  <span className="text-[12px] font-bold text-navy">{item.config.storage} <span className="font-normal text-taupe/50">Go stockage</span></span>
                )}
                {item.config.gpuCount !== undefined && (
                  <span className="text-[12px] font-bold text-rouge-ambra">{item.config.gpuCount}x GPU <span className="font-normal text-taupe/50">({item.config.gpuType?.toUpperCase()})</span></span>
                )}
                {item.config.duration !== undefined && (
                  <span className="text-[12px] font-bold text-navy">{item.config.duration} <span className="font-normal text-taupe/50">mois</span></span>
                )}
              </div>
              {item.config.addons && item.config.addons.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {item.config.addons.map((addonId) => {
                    const a = MANAGED_ADDONS.find((m) => m.id === addonId);
                    return a ? (
                      <span key={addonId}
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rouge-ambra bg-rouge-ambra/5 border border-rouge-ambra/20 px-2 py-0.5 rounded">
                        <Plus className="w-2.5 h-2.5" /> {a.label} (+{formatPriceFCFA(a.monthlyPrice, false)})
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-2 text-right">
        <span className="text-[12px] font-black text-navy">{formatPriceFCFA(itemMonthly, true)}/mo</span>
      </div>
    </motion.div>
  );
}
