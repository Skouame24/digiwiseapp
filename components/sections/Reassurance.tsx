"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/* ── All logos: Collaborateurs + Clients ──────────────── */
const logos = [
   { name: "Société Générale", src: "/Collaborateur/image.png" },
  { name: "Snedai Groupe",    src: "/Collaborateur/image1.png" },
  { name: "SODECI",            src: "/Collaborateur/image2.png" },
  { name: "Bridge Bank",      src: "/Collaborateur/image3.png" },
  { name: "Bridge Bank",      src: "/Collaborateur/image4.png" },
  { name: "Bridge Bank",      src: "/Collaborateur/image5.png" },
  { name: "Bridge Bank",      src: "/Collaborateur/image6.png" }, 
  { name: "Bridge Bank",      src: "/Collaborateur/image7.png" }, 
  { name: "Bridge Bank",      src: "/Collaborateur/image8.png" }, 
  { name: "Bridge Bank",      src: "/Collaborateur/image9.png" }, 
  { name: "Bridge Bank",      src: "/Collaborateur/image10.png" }, 
  { name: "Bridge Bank",      src: "/Collaborateur/image11.png" }, 
  { name: "Bridge Bank",      src: "/Collaborateur/image12.png" }, 
  { name: "Bridge Bank",      src: "/Collaborateur/image13.png" }, 
  { name: "Bridge Bank",      src: "/Collaborateur/image14.png" }, 
  
];

export function Reassurance() {
  return (
    <section className="bg-white border-y border-taupe/10 overflow-hidden">
      <div className="py-6">
        <p className="text-center text-[9px] uppercase font-bold tracking-[0.3em] text-taupe/40 mb-6">
          ILS NOUS FONT CONFIANCE POUR LEUR INFRASTRUCTURE
        </p>

        {/* Infinite logo scroll */}
        <div className="relative flex overflow-x-hidden">
          <motion.div
            className="flex gap-10 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          >
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={i}
                className="shrink-0 h-10 w-28 flex items-center justify-center px-2 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={112}
                  height={40}
                  className="max-h-full max-w-full object-contain"
                  unoptimized
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
