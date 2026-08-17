"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Linkedin, Mail, Facebook, ShieldCheck, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const socials = [
  { icon: <Linkedin className="w-4 h-4" />, href: "https://www.linkedin.com/company/ambra-cloud", label: "LinkedIn" },
  { icon: <Facebook className="w-4 h-4" />, href: "https://web.facebook.com/people/AMBRA-Cloud/61589426378437/?sk=directory_links&_rdc=1&_rdr#", label: "Facebook" },
  { icon: <Mail className="w-4 h-4" />, href: "mailto:infos@ambracloud.net", label: "Email" },
];

export function Footer() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const getModalTitle = (modal: string) => {
    switch (modal) {
      case "mentions": return "Mentions Légales";
      case "confidentialite": return "Politique de Confidentialité & RGPD";
      case "conformite": return "Conformité & Souveraineté de la Donnée";
      default: return "";
    }
  };

  const getModalContent = (modal: string) => {
    switch (modal) {
      case "mentions":
        return (
          <div className="space-y-4 text-sm text-taupe/80">
            <p><strong>Éditeur du site :</strong> AMBRA Cloud, SAS au capital de 50 000 000 FCFA, immatriculée au RCCM d&apos;Abidjan, Côte d&apos;Ivoire.</p>
            <p><strong>Siège social :</strong> Datacenter Raxio, Zone Franche VITIB, Grand-Bassam / Abidjan, Côte d&apos;Ivoire.</p>
            <p><strong>Directeur de la publication :</strong> Direction Générale AMBRA Cloud.</p>
            <p><strong>Hébergement :</strong> Infrastructure Cloud Résidente AMBRA Cloud (Datacenter Tier III, Côte d&apos;Ivoire).</p>
            <p><strong>Contact :</strong> infos@ambracloud.net | +225 07 00 00 00 00</p>
          </div>
        );
      case "confidentialite":
        return (
          <div className="space-y-4 text-sm text-taupe/80">
            <p>AMBRA Cloud s&apos;engage à protéger la confidentialité et l&apos;intégrité de vos données personnelles et professionnelles conformément aux normes internationales et aux réglementations applicables en UEMOA.</p>
            <p>Vos données de configuration de devis et formulaires de contact sont destinées exclusivement aux équipes d&apos;architecture cloud AMBRA et ne sont jamais revendues ou cédées à des tiers.</p>
            <p>Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données sur simple demande à <strong>dpo@ambracloud.net</strong>.</p>
          </div>
        );
      case "conformite":
        return (
          <div className="space-y-4 text-sm text-taupe/80">
            <p>AMBRA Cloud opère une infrastructure cloud 100% résidente en Côte d&apos;Ivoire. Vos données ne quittent jamais le territoire national sans votre accord explicite.</p>
            <p><strong>Certification Datacenter :</strong> Hébergement certifié Tier III par l&apos;Uptime Institute, garantissant 99,982 % de disponibilité.</p>
            <p><strong>Conformité BCEAO & ARTCI :</strong> Architectures et chiffrement adaptés aux contraintes réglementaires du secteur bancaire, télécoms et organismes publics de la zone UEMOA.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <footer className="bg-navy border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">

            {/* Left — Logo + copyright + legal links */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link href="/" className="shrink-0">
                <Image
                  src="/logo.png"
                  alt="AMBRA Cloud"
                  width={36}
                  height={36}
                  className="object-contain"
                  unoptimized
                />
              </Link>
              <span className="text-[11px] text-white/40 font-medium">
                &copy; {new Date().getFullYear()} AMBRA Cloud, Inc. Tous droits réservés.
              </span>
              <span className="hidden md:block w-px h-3 bg-white/15" />
              
              <button
                onClick={() => setActiveModal("mentions")}
                className="text-[11px] text-white/40 hover:text-white/80 transition-colors duration-200"
              >
                Mentions légales
              </button>
              <span className="text-white/15">·</span>
              <button
                onClick={() => setActiveModal("confidentialite")}
                className="text-[11px] text-white/40 hover:text-white/80 transition-colors duration-200"
              >
                Confidentialité
              </button>
              <span className="text-white/15">·</span>
              <button
                onClick={() => setActiveModal("conformite")}
                className="text-[11px] text-white/40 hover:text-white/80 transition-colors duration-200 flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3 text-primary-light" /> Conformité
              </button>
              <span className="text-white/15">·</span>
              <Link
                href="/contact"
                className="text-[11px] text-white/40 hover:text-white/80 transition-colors duration-200"
              >
                Contact
              </Link>
            </div>

            {/* Right — Social icons */}
            <div className="flex items-center gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={s.label}
                  className="text-white/40 hover:text-white transition-colors duration-200 p-1.5 rounded-lg hover:bg-white/5"
                >
                  {s.icon}
                </a>
              ))}
            </div>

          </div>
        </div>
      </footer>

      {/* Legal Modal */}
      <AnimatePresence>
        {activeModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-[90]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-white rounded-2xl p-6 sm:p-8 z-[95] shadow-2xl border border-taupe/15"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-taupe/10">
                <h3 className="text-lg font-black text-navy">{getModalTitle(activeModal)}</h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1 hover:bg-taupe/10 rounded-full text-taupe/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="py-2">{getModalContent(activeModal)}</div>
              <div className="mt-6 pt-4 border-t border-taupe/10 text-right">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2.5 bg-navy text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-primary-light transition-colors"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
