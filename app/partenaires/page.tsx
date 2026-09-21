"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  Coins,
  TrendingUp,
  Wallet,
  Zap,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import { CtaFinal } from "@/components/sections/CtaFinal";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const SOLUTIONS_OPTIONS = [
  "Hébergement Cloud Résident",
  "Colocation Datacenter",
  "Cloud Privé & Bare Metal",
  "Sécurité Managée & Sauvegarde",
  "Processeurs GPU & IA",
  "Autres / Multi-services"
];

const BUDGET_OPTIONS = [
  "Moins de 500 000 FCFA / mois (PME)",
  "500 000 à 1 500 000 FCFA / mois (Standard)",
  "1 500 000 à 5 000 000 FCFA / mois (Entreprise)",
  "Plus de 5 000 000 FCFA / mois (Grand Compte)",
  "À déterminer / Audit requis",
];

const TIMELINES = [
  "Moins d'un mois (Imminent)",
  "1 à 3 mois (Court terme)",
  "3 à 6 mois (Moyen terme)",
  "Plus de 6 mois (Prospection)",
];

export default function PartenairesPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dealId, setDealId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    nomPartenaire: "",
    emailPartenaire: "",
    telephonePartenaire: "",
    solutions: SOLUTIONS_OPTIONS[0],
    budgetEstime: BUDGET_OPTIONS[1],
    descriptionBesoin: "",
    entreprise: "",
    dateCloture: "",
    contact: "",
    coordonnees: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/partner-deal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomPartenaire: formData.nomPartenaire,
          emailPartenaire: formData.emailPartenaire,
          telephonePartenaire: formData.telephonePartenaire,
          solutions: formData.solutions,
          budgetEstime: formData.budgetEstime,
          descriptionBesoin: formData.descriptionBesoin,
          entreprise: formData.entreprise,
          dateCloture: formData.dateCloture,
          contact: formData.contact,
          coordonnees: formData.coordonnees,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la déclaration d'opportunité.");
      }

      setDealId(data.dealReference || `AMBRA-DEAL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Impossible d'enregistrer l'opportunité. Veuillez vérifier vos informations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 bg-cream relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-rouge-ambra/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 border border-primary-light/30 rounded-full mb-4 shadow-sm"
          >
            <Coins className="w-4 h-4 text-rouge-ambra" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-navy">
              PROGRAMME APPORTEURS D&apos;AFFAIRES
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="text-4xl md:text-5xl lg:text-6xl font-display text-navy leading-[1.15] mb-5 max-w-4xl"
          >
            Monétisez vos affaires —{" "}
            <span className="italic text-rouge-ambra">Gagnez jusqu&apos;à 20% de commissions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="text-[16px] text-taupe/80 max-w-3xl leading-relaxed"
          >
            Recommandez AMBRA Cloud à vos clients et contacts professionnels. Touchez des commissions directes ou récurrentes sur chaque contrat d&apos;hébergement et cloud déployé.
            <strong className="text-navy font-bold"> Vous nous apportez l&apos;affaire, nos ingénieurs gèrent toute la technique, vous encaissez vos sous.</strong>
          </motion.p>

          {/* Badges de réassurance */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
            className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-taupe/15 text-[12px] font-bold text-navy"
          >
            <div className="flex items-center gap-2 bg-white/90 px-4 py-2.5 rounded-xl border border-primary-light/25 shadow-sm">
              <TrendingUp className="w-4 h-4 text-rouge-ambra" />
              <span>Jusqu&apos;à 20% de commissions récurrentes</span>
            </div>
            <div className="flex items-center gap-2 bg-white/90 px-4 py-2.5 rounded-xl border border-taupe/15 shadow-sm">
              <Lock className="w-4 h-4 text-rouge-ambra" />
              <span>Opportunité Protégée & Sécurisée</span>
            </div>
            <div className="flex items-center gap-2 bg-white/90 px-4 py-2.5 rounded-xl border border-taupe/15 shadow-sm">
              <Zap className="w-4 h-4 text-primary-light" />
              <span>Zéro gestion technique requise</span>
            </div>
            <div className="flex items-center gap-2 bg-white/90 px-4 py-2.5 rounded-xl border border-taupe/15 shadow-sm">
              <Wallet className="w-4 h-4 text-rouge-ambra" />
              <span>Paiement garanti dès encaissement</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION GAINS FINANCIERS & COMMISSIONS ───────────────── */}
      

      {/* ── FORM SECTION ────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-cream/20 min-h-screen">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {submitted ? (
              /* SUCCESS STATE */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease }}
                className="bg-white border border-primary-light/40 rounded-3xl p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-2xl"
              >
                <div className="w-20 h-20 bg-rouge-ambra/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-rouge-ambra" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-rouge-ambra bg-rouge-ambra/10 px-4 py-1.5 rounded-full">
                  {dealId}
                </span>
                <h2 className="text-3xl font-display text-navy mt-4 mb-3">
                  Opportunité Enregistrée & Commissions Verrouillées !
                </h2>
                <p className="text-[14px] text-taupe/70 leading-relaxed mb-8">
                  Votre déclaration d&apos;affaire pour l&apos;entreprise <strong className="text-navy">{formData.entreprise}</strong> a été enregistrée avec succès dans le programme Partenaires AMBRA Cloud. Vos commissions sont réservées à votre nom.
                </p>

                <div className="bg-cream/40 p-6 rounded-2xl border border-taupe/15 text-left text-[13px] space-y-3 mb-8 shadow-sm">
                  <div className="flex justify-between border-b border-taupe/10 pb-2">
                    <span className="text-taupe/60 font-semibold">Partenaire référent :</span>
                    <span className="font-bold text-navy">{formData.nomPartenaire}</span>
                  </div>
                  <div className="flex justify-between border-b border-taupe/10 pb-2">
                    <span className="text-taupe/60 font-semibold">Client déclaré :</span>
                    <span className="font-bold text-navy">{formData.entreprise}</span>
                  </div>
                  <div className="flex justify-between border-b border-taupe/10 pb-2">
                    <span className="text-taupe/60 font-semibold">Solutions ciblées :</span>
                    <span className="font-bold text-navy">{formData.solutions}</span>
                  </div>
                  <div className="flex justify-between border-b border-taupe/10 pb-2">
                    <span className="text-taupe/60 font-semibold">Budget estimé :</span>
                    <span className="font-bold text-navy">{formData.budgetEstime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-taupe/60 font-semibold">Statut du Deal :</span>
                    <span className="font-bold text-emerald-600">✓ Actif & Protégé (Commissions réservées)</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        nomPartenaire: "",
                        emailPartenaire: "",
                        telephonePartenaire: "",
                        solutions: SOLUTIONS_OPTIONS[0],
                        budgetEstime: BUDGET_OPTIONS[1],
                        descriptionBesoin: "",
                        entreprise: "",
                        dateCloture: "",
                        contact: "",
                        coordonnees: "",
                      });
                    }}
                    className="w-full sm:w-auto bg-navy text-white text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-rouge-ambra transition-colors"
                  >
                    Déclarer une autre affaire
                  </button>
                  <Link
                    href="/contact"
                    className="w-full sm:w-auto text-xs font-bold uppercase tracking-widest text-taupe/70 hover:text-navy px-6 py-4"
                  >
                    Contacter notre équipe partenariats
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* FORM STATE */
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {errorMessage && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                      {errorMessage}
                    </div>
                  )}

                  {/* 1. VOS COORDONNÉES (POUR TOUCHER VOS COMMISSIONS) */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-taupe/15 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b border-taupe/15 pb-4">
                      <div className="w-10 h-10 bg-rouge-ambra/10 rounded-xl flex items-center justify-center text-rouge-ambra">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-navy">1. Vos informations (Apporteur d&apos;affaires)</h2>
                        <p className="text-[12px] text-taupe/70 mt-0.5">Ces coordonnées serviront à lier l&apos;opportunité à votre nom et vous verser vos commissions.</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-taupe/70">
                          Votre Nom / Raison Sociale <span className="text-rouge-ambra">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.nomPartenaire}
                          onChange={(e) => setFormData({ ...formData, nomPartenaire: e.target.value })}
                          placeholder="Votre nom ou cabinet"
                          className="w-full px-4 py-3.5 bg-cream/20 border border-taupe/20 text-navy text-[14px] rounded-xl placeholder:text-taupe/30 focus:border-rouge-ambra outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-taupe/70">
                          Votre Email Professionnel <span className="text-rouge-ambra">*</span>
                        </label>
                        <input
                          required
                          type="email"
                          value={formData.emailPartenaire}
                          onChange={(e) => setFormData({ ...formData, emailPartenaire: e.target.value })}
                          placeholder="contact@votredomaine.ci"
                          className="w-full px-4 py-3.5 bg-cream/20 border border-taupe/20 text-navy text-[14px] rounded-xl placeholder:text-taupe/30 focus:border-rouge-ambra outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-taupe/70">
                          Votre Téléphone / WhatsApp <span className="text-rouge-ambra">*</span>
                        </label>
                        <input
                          required
                          type="tel"
                          value={formData.telephonePartenaire}
                          onChange={(e) => setFormData({ ...formData, telephonePartenaire: e.target.value })}
                          placeholder="+225 07..."
                          className="w-full px-4 py-3.5 bg-cream/20 border border-taupe/20 text-navy text-[14px] rounded-xl placeholder:text-taupe/30 focus:border-rouge-ambra outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. DÉTAILS DU PROJET ET CLIENT */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-taupe/15 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b border-taupe/15 pb-4">
                      <div className="w-10 h-10 bg-rouge-ambra/10 rounded-xl flex items-center justify-center text-rouge-ambra">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-navy">2. Le Projet & Entreprise Cible</h2>
                        <p className="text-[12px] text-taupe/70 mt-0.5">Détaillez le client afin de verrouiller l&apos;exclusivité commerciale sous 90 jours.</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-taupe/70">
                          Entreprise (Client Final) <span className="text-rouge-ambra">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.entreprise}
                          onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
                          placeholder="Nom de l'entreprise cliente"
                          className="w-full px-4 py-3.5 bg-cream/20 border border-taupe/20 text-navy text-[14px] rounded-xl placeholder:text-taupe/30 focus:border-rouge-ambra outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-taupe/70">
                          Solutions / Services Recherchés <span className="text-rouge-ambra">*</span>
                        </label>
                        <select
                          required
                          value={formData.solutions}
                          onChange={(e) => setFormData({ ...formData, solutions: e.target.value })}
                          className="w-full px-4 py-3.5 bg-cream/20 border border-taupe/20 text-navy text-[14px] rounded-xl focus:border-rouge-ambra outline-none transition-all cursor-pointer"
                        >
                          {SOLUTIONS_OPTIONS.map((sol) => (
                            <option key={sol} value={sol}>
                              {sol}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-taupe/70">
                          Budget mensuel estimé
                        </label>
                        <select
                          value={formData.budgetEstime}
                          onChange={(e) => setFormData({ ...formData, budgetEstime: e.target.value })}
                          className="w-full px-4 py-3.5 bg-cream/20 border border-taupe/20 text-navy text-[14px] rounded-xl focus:border-rouge-ambra outline-none transition-all cursor-pointer"
                        >
                          {BUDGET_OPTIONS.map((bg) => (
                            <option key={bg} value={bg}>
                              {bg}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-taupe/70">
                          Délai estimé de réalisation
                        </label>
                        <select
                          value={formData.dateCloture}
                          onChange={(e) => setFormData({ ...formData, dateCloture: e.target.value })}
                          className="w-full px-4 py-3.5 bg-cream/20 border border-taupe/20 text-navy text-[14px] rounded-xl focus:border-rouge-ambra outline-none transition-all cursor-pointer"
                        >
                          <option value="">-- À définir --</option>
                          {TIMELINES.map((tl) => (
                            <option key={tl} value={tl}>
                              {tl}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-taupe/70">
                        Description du besoin ou contexte du projet <span className="text-rouge-ambra">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formData.descriptionBesoin}
                        onChange={(e) => setFormData({ ...formData, descriptionBesoin: e.target.value })}
                        placeholder="Ex: Migration de serveurs, besoin de sauvegarde souveraine, projet de colocation baie dédiée, contact déjà établi..."
                        className="w-full px-4 py-3.5 bg-cream/20 border border-taupe/20 text-navy text-[14px] rounded-xl placeholder:text-taupe/30 focus:border-rouge-ambra outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-taupe/15">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-taupe/70">
                          Contact chez le client (Optionnel)
                        </label>
                        <input
                          type="text"
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          placeholder="Nom & Fonction (DSI, DG...)"
                          className="w-full px-4 py-3.5 bg-cream/20 border border-taupe/20 text-navy text-[14px] rounded-xl placeholder:text-taupe/30 focus:border-rouge-ambra outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-taupe/70">
                          Coordonnées du contact (Optionnel)
                        </label>
                        <input
                          type="text"
                          value={formData.coordonnees}
                          onChange={(e) => setFormData({ ...formData, coordonnees: e.target.value })}
                          placeholder="Email ou Téléphone client"
                          className="w-full px-4 py-3.5 bg-cream/20 border border-taupe/20 text-navy text-[14px] rounded-xl placeholder:text-taupe/30 focus:border-rouge-ambra outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-rouge-ambra via-[#900C0C] to-[#7a0a0a] text-white text-xs sm:text-sm font-black uppercase tracking-[0.2em] py-5 px-8 rounded-2xl hover:shadow-xl hover:shadow-rouge-ambra/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 shadow-lg cursor-pointer group"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sécurisation & Enregistrement de votre affaire...
                        </span>
                      ) : (
                        <>
                          <span className="relative z-10">Soumettre & Verrouiller mes commissions</span>
                          <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1.5" />
                        </>
                      )}
                    </button>

                    <div className="text-center space-y-1">
                      <p className="text-[12px] font-bold text-navy flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4 text-rouge-ambra" />
                        <span>Engagement de stricte confidentialité & Protection de votre dossier</span>
                      </p>
                      <p className="text-[11px] text-taupe/60">
                        Votre opportunité est enregistrée directement dans notre portail partenaires officiel AMBRA Cloud.
                      </p>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <CtaFinal />
    </>
  );
}
