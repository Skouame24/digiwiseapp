"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { CtaFinal } from "@/components/sections/CtaFinal";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function EssaiPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <>
      <section className="pt-32 pb-16 bg-cream relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary-light mb-4">
            // Essai gratuit
          </p>
          <h1 className="text-4xl md:text-5xl font-display text-navy leading-tight mb-4">
            Testez AMBRA Cloud{" "}
            <span className="italic text-rouge-ambra">sans engagement</span>
          </h1>
          <p className="text-[15px] text-taupe/70 max-w-xl leading-relaxed">
            Accès d&apos;essai à notre infrastructure résidente — accompagnement par nos architectes pour
            valider vos besoins avant tout déploiement.
          </p>
        </motion.div>
      </section>

      <section className="py-16 bg-cream min-h-[50vh]">
        <motion.div className="max-w-xl mx-auto px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <CheckCircle2 className="w-14 h-14 text-primary-light mx-auto mb-6" />
                <h2 className="text-2xl font-display text-navy mb-3">Demande enregistrée</h2>
                <p className="text-[15px] text-taupe/70 leading-relaxed mb-8">
                  Notre équipe active votre essai et vous recontacte sous 24h avec les accès et la marche à suivre.
                </p>
                <Link
                  href="/solutions"
                  className="inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] text-primary-light hover:text-rouge-ambra transition-colors"
                >
                  Voir nos solutions <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-5 bg-white border border-taupe/15 p-8 shadow-sm"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Prénom" name="prenom" placeholder="Jean" required />
                  <Field label="Nom" name="nom" placeholder="Kouassi" required />
                </div>
                <Field label="Entreprise" name="entreprise" placeholder="Nom de votre organisation" required />
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Email" name="email" type="email" placeholder="vous@entreprise.ci" required />
                  <Field label="Téléphone" name="tel" type="tel" placeholder="+225 07 XX XX XX" />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold uppercase tracking-widest text-taupe/60">
                    Votre besoin (optionnel)
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3.5 bg-white border border-taupe/20 text-[14px] text-navy placeholder:text-taupe/30 focus:border-primary-light focus:ring-2 focus:ring-primary-light/10 outline-none transition-all resize-none"
                    placeholder="VM, stockage, services managés…"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#900C0C] text-white text-[12px] font-black uppercase tracking-[0.2em] py-4 hover:bg-[#7a0a0a] transition-colors disabled:opacity-60"
                >
                  {loading ? "Envoi en cours…" : "Demander mon essai gratuit"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
                <p className="text-center text-[11px] text-taupe/40">
                  Sans carte bancaire — activation sous 24h ouvrées.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      <CtaFinal />
    </>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[12px] font-bold uppercase tracking-widest text-taupe/60">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3.5 bg-white border border-taupe/20 text-[14px] text-navy placeholder:text-taupe/30 focus:border-primary-light focus:ring-2 focus:ring-primary-light/10 outline-none transition-all"
      />
    </div>
  );
}
