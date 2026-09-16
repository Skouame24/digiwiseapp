"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, User, Building2, Mail, Phone, MessageSquare, ArrowRight, ShieldCheck, Server, Clock, CheckCircle } from "lucide-react";
import { CtaFinal } from "@/components/sections/CtaFinal";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const trialBenefits = [
  {
    icon: <Server className="w-5 h-5" />,
    label: "Environnement Dédié",
    value: "Accédez à de vraies ressources (IaaS, S3, GPU) isolées pour tester nos performances en conditions réelles.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    label: "Sécurité & Souveraineté",
    value: "Vos données de test restent en Côte d'Ivoire, dans notre Datacenter Tier III.",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    label: "Accompagnement Expert",
    value: "Nos architectes cloud vous guident lors du déploiement de votre maquette (POC).",
  }
];

export default function EssaiGratuitPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    entreprise: "",
    email: "",
    tel: "",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      // Simulation d'envoi
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSent(true);
    } catch (err: any) {
      setErrorMessage("Impossible d'envoyer la demande pour le moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 bg-cream relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-light/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary-light mb-4"
          >
            // Essai Gratuit
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="text-4xl md:text-5xl font-display text-navy leading-tight mb-4"
          >
            Testez notre infrastructure,{" "}
            <span className="italic text-rouge-ambra">sans engagement</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="text-[15px] text-taupe/70 max-w-xl leading-relaxed"
          >
            Découvrez la performance, la sécurité et la flexibilité d'AMBRA Cloud pendant une période d'essai gratuite. 
          </motion.p>
        </div>
      </section>

      {/* ── MAIN — split layout ──────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">

            {/* LEFT — benefits info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease }}
              className="lg:col-span-2 space-y-10"
            >
              <div>
                <div className="w-12 h-px bg-primary-light mb-6" />
                <h2 className="text-2xl font-display text-navy leading-snug mb-4">
                  Pourquoi tester AMBRA ?
                </h2>
                <p className="text-[13px] text-taupe/60 leading-[1.8]">
                  Faire le choix d'une infrastructure résidente, c'est s'assurer d'une latence minimale et d'une souveraineté totale. 
                  Nous mettons à votre disposition un environnement de test complet pour valider votre architecture.
                </p>
              </div>

              <div className="space-y-6">
                {trialBenefits.map((item) => (
                  <div key={item.label} className="flex items-start gap-4 group">
                    <div className="shrink-0 w-10 h-10 bg-primary-light/10 flex items-center justify-center text-primary-light group-hover:bg-primary-light group-hover:text-white transition-all duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-taupe/40 mb-1">
                        {item.label}
                      </p>
                      <p className="text-[14px] text-navy whitespace-pre-line leading-relaxed">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-taupe/15">
                <div className="p-5 bg-cream/50 rounded-xl border border-taupe/10">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-navy mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-light" />
                    Zéro carte de crédit
                  </p>
                  <p className="text-[13px] text-taupe/60">
                    L'essai est entièrement gratuit pour les entreprises et les professionnels. Vous ne serez facturé qu'en cas de passage en production.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* RIGHT — form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease }}
              className="lg:col-span-3"
            >
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="h-full flex flex-col items-center justify-center text-center py-20 border border-primary-light/20 bg-cream/30 rounded-2xl"
                >
                  <CheckCircle className="w-14 h-14 text-primary-light mb-6" />
                  <h3 className="text-2xl font-display text-navy mb-3">Demande d'essai envoyée !</h3>
                  <p className="text-[14px] text-taupe/60 max-w-sm leading-relaxed">
                    Nos équipes préparent votre environnement cloud et vous contacteront très rapidement avec vos accès.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setFormData({ prenom: "", nom: "", entreprise: "", email: "", tel: "", message: "" });
                    }}
                    className="mt-8 text-[12px] font-bold uppercase tracking-widest text-primary-light border-b border-primary-light/30 hover:border-primary-light transition-colors"
                  >
                    Faire une nouvelle demande
                  </button>
                </motion.div>
              ) : (
                <div className="bg-white p-6 sm:p-10 rounded-2xl border border-taupe/10 shadow-lg shadow-taupe/5">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {errorMessage && (
                      <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded">
                        {errorMessage}
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-taupe/50">
                          Prénom <span className="text-rouge-ambra">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.prenom}
                          onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                          placeholder="Jean"
                          className="w-full px-4 py-3.5 bg-cream/30 border border-taupe/15 text-navy text-[14px] placeholder:text-taupe/30 focus:border-primary-light focus:bg-white outline-none transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-taupe/50">
                          Nom <span className="text-rouge-ambra">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.nom}
                          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                          placeholder="Kouassi"
                          className="w-full px-4 py-3.5 bg-cream/30 border border-taupe/15 text-navy text-[14px] placeholder:text-taupe/30 focus:border-primary-light focus:bg-white outline-none transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-taupe/50">
                          Email professionnel <span className="text-rouge-ambra">*</span>
                        </label>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="jean@entreprise.ci"
                          className="w-full px-4 py-3.5 bg-cream/30 border border-taupe/15 text-navy text-[14px] placeholder:text-taupe/30 focus:border-primary-light focus:bg-white outline-none transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-taupe/50">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={formData.tel}
                          onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                          placeholder="+225 07 xx xx xx xx"
                          className="w-full px-4 py-3.5 bg-cream/30 border border-taupe/15 text-navy text-[14px] placeholder:text-taupe/30 focus:border-primary-light focus:bg-white outline-none transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-taupe/50">
                        Entreprise / Organisation <span className="text-rouge-ambra">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.entreprise}
                        onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
                        placeholder="Ex : Bank West Africa"
                        className="w-full px-4 py-3.5 bg-cream/30 border border-taupe/15 text-navy text-[14px] placeholder:text-taupe/30 focus:border-primary-light focus:bg-white outline-none transition-all duration-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-taupe/50">
                        Solution d'intérêt & Besoins <span className="text-rouge-ambra">*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Ex : Je souhaite tester le stockage S3 pour nos sauvegardes, ou une VM pour notre application interne..."
                        className="w-full px-4 py-3.5 bg-cream/30 border border-taupe/15 text-navy text-[14px] placeholder:text-taupe/30 focus:border-primary-light focus:bg-white outline-none transition-all duration-300 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group w-full flex items-center justify-center gap-3 bg-gradient-to-r from-rouge-ambra via-[#900C0C] to-[#7a0a0a] text-white text-[12px] font-black uppercase tracking-[0.2em] py-5 rounded-xl hover:shadow-xl hover:shadow-rouge-ambra/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 shadow-lg cursor-pointer"
                    >
                      <span>{loading ? "Création en cours..." : "Demander mon accès gratuit"}</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                    
                    <p className="text-[11px] text-taupe/40 text-center leading-relaxed mt-4">
                      En soumettant ce formulaire, vous acceptez d&apos;être contacté par l&apos;équipe AMBRA Cloud.
                      Vos données ne seront jamais partagées avec des tiers.
                    </p>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <CtaFinal />
    </>
  );
}
