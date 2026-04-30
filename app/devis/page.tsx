"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Trash2, ArrowRight, CheckCircle2, User, Building2, Mail, Phone, MessageSquare, ChevronRight, Plus, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useCart, CartItem } from "@/context/CartContext";
import { MANAGED_ADDONS } from "@/components/sections/ServiceConfigModal";
import { CtaFinal } from "@/components/sections/CtaFinal";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function DevisPage() {
  const { items, removeItem, clearCart, count } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      clearCart();
    }, 1400);
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-cream relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-light/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary-light mb-4">
            // Devis
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="text-4xl md:text-5xl font-display text-navy leading-tight mb-4">
            Votre projet,{" "}
            <span className="italic text-rouge-ambra">notre proposition</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="text-[15px] text-taupe/70 max-w-xl leading-relaxed">
            Sélectionnez vos services, remplissez le formulaire — nos architectes vous recontactent sous 24h.
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
                className="max-w-xl mx-auto text-center py-24">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                  className="w-20 h-20 bg-primary-light/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="w-10 h-10 text-primary-light" />
                </motion.div>
                <h2 className="text-3xl font-display text-navy mb-4">Demande envoyée !</h2>
                <p className="text-[15px] text-taupe/70 leading-relaxed mb-8">
                  Notre équipe analyse votre sélection et vous contacte sous 24h avec une proposition sur-mesure.
                </p>
                <Link href="/solutions"
                  className="inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] text-primary-light hover:text-rouge-ambra transition-colors">
                  Continuer la navigation <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid lg:grid-cols-[1fr_420px] gap-12 items-start">

                {/* LEFT: Form */}
                <div>
                  <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-taupe/40 mb-8">Informations client</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field icon={<User className="w-4 h-4" />} label="Prénom" name="prenom" placeholder="Jean" required />
                      <Field icon={<User className="w-4 h-4" />} label="Nom" name="nom" placeholder="Kouassi" required />
                    </div>
                    <Field icon={<Building2 className="w-4 h-4" />} label="Entreprise" name="entreprise" placeholder="Nom de votre organisation" required />
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field icon={<Mail className="w-4 h-4" />} label="Email" name="email" type="email" placeholder="vous@entreprise.ci" required />
                      <Field icon={<Phone className="w-4 h-4" />} label="Téléphone" name="tel" type="tel" placeholder="+225 07 XX XX XX" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold uppercase tracking-widest text-taupe/60">
                        Message / Besoins spécifiques
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-taupe/30" />
                        <textarea name="message" rows={5}
                          className="w-full pl-11 pr-4 py-3.5 bg-white border border-taupe/20 text-[14px] text-navy placeholder:text-taupe/30 focus:border-primary-light focus:ring-2 focus:ring-primary-light/10 outline-none transition-all resize-none"
                          placeholder="Décrivez votre projet, vos contraintes, vos objectifs…" />
                      </div>
                    </div>

                    <button type="submit" disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-[#900C0C] text-white text-[12px] font-black uppercase tracking-[0.2em] py-4 hover:bg-[#7a0a0a] transition-colors duration-300 disabled:opacity-60">
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Envoi en cours…
                        </span>
                      ) : (
                        <><span>Envoyer ma demande de devis</span><ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>

                    <p className="text-center text-[11px] text-taupe/40">
                      Pas de paiement requis — nous vous contactons sous 24h.
                    </p>
                  </form>
                </div>

                {/* RIGHT: Cart recap */}
                <div className="lg:sticky lg:top-28">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-taupe/40 mb-5">Services sélectionnés</h2>

                  <div className="border border-taupe/15 bg-white">
                    <AnimatePresence mode="popLayout">
                      {items.length === 0 ? (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="flex flex-col items-center py-12 text-center px-6">
                          <ShoppingBag className="w-10 h-10 text-taupe/15 mb-3" />
                          <p className="text-[12px] font-bold text-taupe/30 uppercase tracking-widest mb-1">Panier vide</p>
                          <p className="text-[11px] text-taupe/25">Ajoutez des services depuis nos pages offres.</p>
                          <Link href="/solutions"
                            className="mt-4 text-[11px] font-bold uppercase tracking-widest text-primary-light hover:text-rouge-ambra transition-colors flex items-center gap-1">
                            Voir les solutions <ChevronRight className="w-3 h-3" />
                          </Link>
                        </motion.div>
                      ) : (
                        <>
                          <div className="divide-y divide-taupe/8">
                            {items.map((item) => (
                              <CartItemRow
                                key={item.id}
                                item={item}
                                onRemove={() => removeItem(item.id)}
                              />
                            ))}
                          </div>
                          <div className="p-4 border-t border-taupe/10 bg-cream/30">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold uppercase tracking-widest text-taupe/50">
                                {count} service{count > 1 ? "s" : ""} sélectionné{count > 1 ? "s" : ""}
                              </span>
                              <button onClick={clearCart}
                                className="text-[10px] font-bold uppercase tracking-widest text-taupe/30 hover:text-rouge-ambra transition-colors">
                                Vider
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  <p className="mt-4 text-[11px] text-taupe/40 leading-relaxed">
                    Vous pouvez aussi ajouter des services directement depuis les pages{" "}
                    <Link href="/solutions" className="underline hover:text-navy transition-colors">Solutions</Link> ou{" "}
                    <Link href="/services-manages" className="underline hover:text-navy transition-colors">Services Managés</Link>.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <CtaFinal />
    </>
  );
}

/* ── Reusable field ──────────────────────────────────────── */
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
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-taupe/20 text-[14px] text-navy placeholder:text-taupe/30 focus:border-primary-light focus:ring-2 focus:ring-primary-light/10 outline-none transition-all"
        />
      </div>
    </div>
  );
}

/* ── Collapsible cart item row ─────────────────────────────── */

function CartItemRow({ item, onRemove }: { item: CartItem; onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  const hasDetails = !!item.config;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.25 }}
      className="p-4"
    >
      {/* Always visible row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-rouge-ambra mb-1">
            {item.category}
          </p>
          <p className="text-[15px] font-black text-navy leading-snug">{item.name}</p>
          <p className="text-[12px] text-taupe/55 mt-0.5 leading-relaxed">{item.description}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0 mt-0.5">
          {/* Expand arrow — only if config exists */}
          {hasDetails && (
            <button
              onClick={() => setOpen((v) => !v)}
              className="p-1.5 text-taupe/40 hover:text-navy transition-colors duration-200"
              aria-label={open ? "Réduire" : "Détailler"}
            >
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="block"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </button>
          )}
          <button
            onClick={onRemove}
            className="p-1.5 text-taupe/25 hover:text-rouge-ambra transition-colors duration-200"
            aria-label="Retirer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Collapsible config details */}
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
                <p className="text-[12px] italic text-taupe/60">
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
                {item.config.duration !== undefined && (
                  <span className="text-[12px] font-bold text-navy">{item.config.duration} <span className="font-normal text-taupe/50">mois</span></span>
                )}
              </div>
              {item.config.addons.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {item.config.addons.map((addonId) => {
                    const a = MANAGED_ADDONS.find((m) => m.id === addonId);
                    return a ? (
                      <span key={addonId}
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rouge-ambra bg-rouge-ambra/5 border border-rouge-ambra/20 px-2 py-0.5">
                        <Plus className="w-2.5 h-2.5" /> {a.label}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
