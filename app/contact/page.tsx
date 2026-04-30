"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin, ArrowRight, Clock, CheckCircle } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const contactInfo = [
  {
    icon: <Mail className="w-5 h-5" />,
    label: "Email",
    value: "infos@ambracloud.net",
    href: "mailto:infos@ambracloud.net",
  },
  {
    icon: <Phone className="w-5 h-5" />,
    label: "Téléphone",
    value: "+225 07 97 26 47 40",
    href: "tel:+2250797264740",
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    label: "Adresse",
    value: "2 Plateaux Aghien, Abidjan\nCôte d'Ivoire",
    href: "https://maps.google.com/?q=Les+2+Plateaux+Abidjan",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    label: "Disponibilité",
    value: "Support 24h/7j\nLun – Ven : 8h – 18h",
    href: null,
  },
];

const subjects = [
  "Cloud Résident & Hybride",
  "Cloud Privé / Bare Metal",
  "Services Managés",
  "Partenariat",
  "Support technique",
  "Autre",
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
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
            // Contact
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="text-4xl md:text-5xl font-display text-navy leading-tight mb-4"
          >
            Parlons de votre{" "}
            <span className="italic text-rouge-ambra">projet cloud</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="text-[15px] text-taupe/70 max-w-xl leading-relaxed"
          >
            Notre équipe d&apos;architectes cloud est à votre écoute pour concevoir
            l&apos;infrastructure adaptée à vos enjeux métier.
          </motion.p>
        </div>
      </section>

      {/* ── MAIN — split layout ──────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">

            {/* LEFT — contact info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease }}
              className="lg:col-span-2 space-y-10"
            >
              <div>
                <div className="w-12 h-px bg-primary-light mb-6" />
                <h2 className="text-2xl font-display text-navy leading-snug mb-4">
                  Nos coordonnées
                </h2>
                <p className="text-[13px] text-taupe/60 leading-[1.8]">
                  Disponibles pour toute demande commerciale, technique ou de partenariat.
                  Réponse garantie sous 24h ouvrées.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4 group">
                    <div className="shrink-0 w-10 h-10 bg-primary-light/10 flex items-center justify-center text-primary-light group-hover:bg-primary-light group-hover:text-white transition-all duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-taupe/40 mb-0.5">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel="noreferrer"
                          className="text-[14px] text-navy hover:text-primary-light transition-colors duration-300 whitespace-pre-line"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-[14px] text-navy whitespace-pre-line">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
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
                  className="h-full flex flex-col items-center justify-center text-center py-20 border border-primary-light/20 bg-cream/30"
                >
                  <CheckCircle className="w-14 h-14 text-primary-light mb-6" />
                  <h3 className="text-2xl font-display text-navy mb-3">Message envoyé !</h3>
                  <p className="text-[14px] text-taupe/60 max-w-sm leading-relaxed">
                    Merci pour votre message. Notre équipe vous répondra dans les 24h ouvrées.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-8 text-[12px] font-bold uppercase tracking-widest text-primary-light border-b border-primary-light/30 hover:border-primary-light transition-colors"
                  >
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-taupe/50">
                        Nom complet <span className="text-rouge-ambra">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Jean Kouassi"
                        className="w-full px-4 py-3.5 bg-cream/30 border border-taupe/15 text-navy text-[14px] placeholder:text-taupe/30 focus:border-primary-light focus:bg-white outline-none transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-taupe/50">
                        Email professionnel <span className="text-rouge-ambra">*</span>
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="jean@entreprise.ci"
                        className="w-full px-4 py-3.5 bg-cream/30 border border-taupe/15 text-navy text-[14px] placeholder:text-taupe/30 focus:border-primary-light focus:bg-white outline-none transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-taupe/50">
                        Entreprise
                      </label>
                      <input
                        type="text"
                        placeholder="Nom de votre organisation"
                        className="w-full px-4 py-3.5 bg-cream/30 border border-taupe/15 text-navy text-[14px] placeholder:text-taupe/30 focus:border-primary-light focus:bg-white outline-none transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-taupe/50">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        placeholder="+225 07 xx xx xx xx"
                        className="w-full px-4 py-3.5 bg-cream/30 border border-taupe/15 text-navy text-[14px] placeholder:text-taupe/30 focus:border-primary-light focus:bg-white outline-none transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Subject chips */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-taupe/50">
                      Sujet de votre demande
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedSubject(s === selectedSubject ? "" : s)}
                          className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider border transition-all duration-300 ${
                            selectedSubject === s
                              ? "bg-primary-light border-primary-light text-white"
                              : "bg-transparent border-taupe/15 text-taupe/60 hover:border-primary-light/50 hover:text-navy"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-taupe/50">
                      Message <span className="text-rouge-ambra">*</span>
                    </label>
                    <textarea
                      required
                      rows={6}
                      placeholder="Décrivez votre projet, vos besoins ou vos questions…"
                      className="w-full px-4 py-3.5 bg-cream/30 border border-taupe/15 text-navy text-[14px] placeholder:text-taupe/30 focus:border-primary-light focus:bg-white outline-none transition-all duration-300 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group w-full flex items-center justify-center gap-3 bg-primary-light text-white text-[12px] font-black uppercase tracking-[0.2em] py-5 hover:bg-ambre-signature transition-all duration-300"
                  >
                    <span>Envoyer le message</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>

                  <p className="text-[11px] text-taupe/40 text-center leading-relaxed">
                    En soumettant ce formulaire, vous acceptez d&apos;être contacté par l&apos;équipe AMBRA Cloud.
                    Vos données ne seront jamais partagées avec des tiers.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MAP — full-width large section ───────────────────────── */}
      <section className="relative w-full h-[480px] md:h-[580px]">
        {/* Top bar overlay */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 lg:px-12 py-4 bg-navy/85 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-light opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-light" />
            </span>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/80">
              AMBRA Cloud — Siège social
            </p>
          </div>
          <p className="text-[11px] text-white/50 hidden sm:block tracking-wide">
            Les 2 Plateaux Aghien · Abidjan, Côte d&apos;Ivoire
          </p>
        </div>

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.521!2d-3.9943161!3d5.3461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1ea5311676b5b%3A0x3e30f0c3fc4702!2sLes%202%20Plateaux%2C%20Abidjan%2C%20C%C3%B4te%20d'Ivoire!5e0!3m2!1sfr!2sci!4v1700000000000!5m2!1sfr!2sci"
          width="100%"
          height="100%"
          style={{ border: 0, filter: "grayscale(20%) contrast(1.05) brightness(0.97)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="AMBRA Cloud — Les 2 Plateaux, Abidjan"
          className="w-full h-full"
        />

        {/* Amber bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary-light z-10" />
      </section>
    </>
  );
}
