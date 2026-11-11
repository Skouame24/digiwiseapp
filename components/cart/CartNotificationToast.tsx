"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShoppingCart, ArrowRight, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPriceFCFA } from "@/lib/pricing";

export function CartNotificationToast() {
  const { lastAddedItem, clearLastAddedItem, setIsCartDrawerOpen } = useCart();

  useEffect(() => {
    if (!lastAddedItem) return;
    const timer = setTimeout(() => {
      clearLastAddedItem();
    }, 4500);
    return () => clearTimeout(timer);
  }, [lastAddedItem, clearLastAddedItem]);

  if (!lastAddedItem) return null;

  const cfg = lastAddedItem.config;
  const price = cfg?.monthlyPrice ?? lastAddedItem.basePrice ?? 0;

  return (
    <AnimatePresence>
      <motion.div
        key={lastAddedItem.id + (cfg?.monthlyPrice ?? "")}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-5 right-4 sm:right-6 z-[9999] max-w-sm w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-md rounded-2xl border border-taupe/20 shadow-2xl p-4 text-navy overflow-hidden"
      >
        {/* Barre de progression d'auto-fermeture */}
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 4.5, ease: "linear" }}
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-rouge-ambra to-rouge-ambra origin-left"
        />

        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </span>
            <div>
              <p className="text-[12px] font-black text-navy leading-tight">
                Ressource ajoutée au devis !
              </p>
              <p className="text-[10px] font-semibold text-taupe/70 leading-tight mt-0.5 truncate max-w-[200px]">
                {lastAddedItem.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={clearLastAddedItem}
            className="p-1 rounded-lg text-taupe/40 hover:text-navy hover:bg-cream/50 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Détail rapide du dimensionnement */}
        <div className="mt-2.5 pt-2.5 border-t border-taupe/10 flex items-center justify-between text-[11px]">
          <div className="text-taupe/70 text-[10px] font-medium truncate max-w-[190px]">
            {cfg ? (
              <span>
                {cfg.vcpu ? `${cfg.vcpu} vCPU · ` : ""}
                {cfg.ram ? `${cfg.ram} Go RAM · ` : ""}
                {cfg.systemDisk || cfg.dataDisk ? `${(cfg.systemDisk || 100) + (cfg.dataDisk || 0)} Go` : ""}
              </span>
            ) : (
              <span>{lastAddedItem.category}</span>
            )}
          </div>
          <span className="font-black text-rouge-ambra text-xs shrink-0">
            {formatPriceFCFA(price, false)} / m
          </span>
        </div>

        {/* Bouton d'action Voir mon devis */}
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              clearLastAddedItem();
              setIsCartDrawerOpen(true);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-navy hover:bg-rouge-ambra text-white text-[11px] font-bold uppercase tracking-wider transition-colors duration-200 shadow-xs cursor-pointer group"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Voir mon panier</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={clearLastAddedItem}
            className="py-2 px-3 rounded-xl bg-cream/60 hover:bg-cream text-taupe/75 hover:text-navy text-[11px] font-bold transition-colors cursor-pointer"
          >
            Continuer
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
