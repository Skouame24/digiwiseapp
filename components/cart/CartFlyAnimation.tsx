"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPriceFCFA } from "@/lib/pricing";

export function CartFlyAnimation() {
  const { flyingItem, clearFlyingItem } = useCart();
  const [coords, setCoords] = useState<{
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
  } | null>(null);

  useEffect(() => {
    if (!flyingItem) {
      setCoords(null);
      return;
    }

    // Calcul des coordonnées de destination (bouton du panier dans la Navbar)
    let targetEl = document.getElementById("navbar-cart-button");
    if (!targetEl || targetEl.offsetParent === null) {
      targetEl = document.getElementById("navbar-cart-button-mobile");
    }

    let targetX = window.innerWidth - 65;
    let targetY = 32;

    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;
    }

    // Coordonnées de départ (centre de l'écran ou clic de l'utilisateur)
    const startX = flyingItem.startX ?? window.innerWidth / 2;
    const startY = flyingItem.startY ?? window.innerHeight / 2;

    setCoords({ startX, startY, targetX, targetY });
  }, [flyingItem]);

  if (!flyingItem || !coords) return null;

  const { startX, startY, targetX, targetY } = coords;

  // Calcul du point de contrôle de l'arche pour un vol doux et naturel
  const midX = startX + (targetX - startX) * 0.45;
  const midY = Math.min(startY, targetY) - 60;

  return (
    <AnimatePresence>
      <motion.div
        key={flyingItem.id + flyingItem.name}
        initial={{
          position: "fixed",
          left: startX,
          top: startY,
          x: "-50%",
          y: "-50%",
          scale: 0.9,
          opacity: 0,
          zIndex: 99999,
          pointerEvents: "none",
        }}
        animate={{
          left: [startX, midX, targetX],
          top: [startY, midY, targetY],
          scale: [0.9, 1.05, 0.65, 0.2],
          opacity: [0, 1, 0.95, 0],
          rotate: [0, -6, 5, 0],
        }}
        transition={{
          duration: 0.75,
          times: [0, 0.25, 0.75, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
        onAnimationComplete={clearFlyingItem}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-rouge-ambra/40 shadow-2xl text-navy pointer-events-none select-none ring-2 ring-rouge-ambra/20"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rouge-ambra to-[#7a0a0a] text-white flex items-center justify-center shadow-xs">
          <Server className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-black text-navy max-w-[140px] truncate leading-tight">
              {flyingItem.name}
            </span>
            <Sparkles className="w-3 h-3 text-rouge-ambra animate-pulse" />
          </div>
          {flyingItem.price ? (
            <span className="text-[10px] font-extrabold text-rouge-ambra block leading-tight mt-0.5">
              {formatPriceFCFA(flyingItem.price, false)}
            </span>
          ) : (
            <span className="text-[9.5px] font-bold text-emerald-700 block leading-tight mt-0.5">
              Ajouté au panier !
            </span>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
