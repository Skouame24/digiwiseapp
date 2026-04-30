"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/* ── All logos: Collaborateurs + Clients ──────────────── */
const logos = [
  { name: "Acronis",          src: "/Collaborateur/image.jpg" },
  { name: "AWS Partner",       src: "/Collaborateur/image (8).png" },
  { name: "Check Point",       src: "/Collaborateur/image (1).jpg" },
  { name: "Fortinet",          src: "/Collaborateur/image (7).png" },
  { name: "IBM",               src: "/Collaborateur/image (6).png" },
  { name: "Kaspersky",         src: "/Collaborateur/image (5).png" },
  { name: "Microsoft",         src: "/Collaborateur/image (4).png" },
  { name: "Oracle",            src: "/Collaborateur/image (3).png" },
  { name: "PECB",              src: "/Collaborateur/image (1).png" },
  { name: "SOCRadar",          src: "/Collaborateur/image.png" },
  { name: "Synology",          src: "/Collaborateur/image (2).png" },
  { name: "Société Générale",  src: "/Clients/image.png" },
  { name: "Snedai",            src: "/Clients/image (1).png" },
  { name: "SODECI",            src: "/Clients/image (2).png" },
  { name: "Bridge Bank",       src: "/Clients/image (3).png" },
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
