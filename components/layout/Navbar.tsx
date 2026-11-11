"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ArrowRight, ChevronDown, FileText, Trash2, Pencil, ShieldCheck, Database, Cpu, Cloud, ShoppingCart, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart, CartItem } from "@/context/CartContext";
import { formatPriceFCFA } from "@/lib/pricing";

const navLinks: { label: string; href: string; dropdown?: { label: string; href: string; icon?: React.ReactNode }[] }[] = [
  { label: "Accueil", href: "/" },
  {
    label: "Solutions",
    href: "/solutions",
    dropdown: [
      { label: "Cloud Résident & Hybride", href: "/solutions#resident" },
      { label: "Stockage d'Objet S3", href: "/solutions#object-storage" },
      { label: "Processeurs GPU & IA", href: "/solutions#gpu" },
      { label: "Cloud Privé & Dédié", href: "/solutions#private" },
    ]
  },
  { label: "Services Managés", href: "/services-manages" },
  { label: "Blog", href: "/blog" },
  { label: "Projets", href: "/projets" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const {
    items,
    removeItem,
    duplicateItem,
    count,
    getTotalMonthlyPrice,
    cartBounceKey,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
  } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsCartDrawerOpen(false);
  }, [pathname, setIsCartDrawerOpen]);

  const totalMonthly = getTotalMonthlyPrice();

  return (
    <>
      <motion.nav
        initial={{ y: -10 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-700",
          scrolled
            ? "py-3 bg-white/95 border-b border-[#FBF4E4] shadow-sm backdrop-blur-md"
            : "py-6 bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
          <Link href="/" className="relative group transition-transform duration-500 hover:scale-[1.02]">
            <Image
              src="/logo.png"
              alt="AMBRA Cloud Logo"
              width={280}
              height={88}
              className="h-12 sm:h-14 lg:h-16 xl:h-[4.5rem] w-auto object-contain max-w-[180px] sm:max-w-[220px] lg:max-w-none"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const hasDropdown = !!link.dropdown;

              if (hasDropdown) {
                return (
                  <div
                    key={link.label}
                    className="relative group h-full py-4"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-1 px-4 text-[13px] font-bold uppercase tracking-wider transition-all duration-300",
                        activeDropdown === link.label ? "text-[#900C0C]" : "text-[#5C4A3E]"
                      )}
                    >
                      {link.label}
                      <ChevronDown className={cn("w-4 h-4 transition-transform duration-500", activeDropdown === link.label && "rotate-180")} />
                    </Link>

                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-[100%] left-0 w-64 pt-2 z-50"
                        >
                          <div className="bg-white border border-[#FBF4E4] shadow-2xl rounded-2xl overflow-hidden py-2">
                            {link.dropdown?.map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                className="block px-6 py-3 text-[12px] font-bold text-[#5C4A3E] hover:bg-[#900C0C] hover:text-white transition-all duration-300 uppercase tracking-widest"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-[13px] font-bold uppercase tracking-wider transition-all duration-300 group",
                    isActive ? "text-[#900C0C]" : "text-[#5C4A3E] hover:text-[#900C0C]"
                  )}
                >
                  {link.label}
                  <motion.span
                    className={cn(
                      "absolute bottom-0 left-4 right-4 h-[2px] bg-[#900C0C] origin-left transition-transform duration-500 ease-out",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <motion.button
              id="navbar-cart-button"
              key={cartBounceKey}
              animate={cartBounceKey > 0 ? {
                scale: [1, 1.35, 0.9, 1.15, 1],
                rotate: [0, -8, 6, -3, 0],
              } : {}}
              transition={{ duration: 0.55, ease: "easeOut" }}
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2.5 text-[#5C4A3E] hover:text-navy hover:bg-[#FBF4E4] rounded-xl transition-all duration-300 group cursor-pointer"
              aria-label="Voir mon panier"
            >
              <ShoppingCart className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rouge-ambra text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-sm">
                  {count}
                  {cartBounceKey > 0 && (
                    <span className="absolute inset-0 rounded-full bg-rouge-ambra animate-ping opacity-75 pointer-events-none" />
                  )}
                </span>
              )}
            </motion.button>

            <Link
              href="/essai-gratuit"
              className="group relative inline-flex items-center gap-2 bg-[#900C0C] text-white text-[11px] font-black uppercase tracking-[0.2em] px-7 py-3.5 rounded-full overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-[#900C0C]/20 active:scale-95 shadow-lg shadow-[#900C0C]/10"
            >
              <span className="relative z-10">Essai gratuit</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5" />
              <div className="absolute inset-0 bg-[#7a0a0a] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </Link>
          </div>

          {/* Mobile Cart & Toggle */}
          <div className="lg:hidden flex items-center gap-1.5">
            <motion.button
              id="navbar-cart-button-mobile"
              key={`mob-${cartBounceKey}`}
              animate={cartBounceKey > 0 ? {
                scale: [1, 1.3, 0.92, 1.12, 1],
                rotate: [0, -6, 5, -2, 0],
              } : {}}
              transition={{ duration: 0.55, ease: "easeOut" }}
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 text-[#5C4A3E] hover:bg-[#FBF4E4] rounded-full transition-colors cursor-pointer"
              aria-label="Voir mon panier"
            >
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 bg-rouge-ambra text-white text-[9px] font-black flex items-center justify-center rounded-full shadow-sm">
                  {count}
                  {cartBounceKey > 0 && (
                    <span className="absolute inset-0 rounded-full bg-rouge-ambra animate-ping opacity-75 pointer-events-none" />
                  )}
                </span>
              )}
            </motion.button>

            <button
              className="p-2 text-[#5C4A3E] hover:bg-[#FBF4E4] rounded-full transition-colors cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 min-h-[100dvh] w-full max-w-full bg-white z-[60] lg:hidden overflow-y-auto"
            >
              <div className="p-8 h-full flex flex-col">
                <div className="flex items-center justify-between mb-12">
                  <Image src="/logo.png" alt="Logo" width={220} height={70} className="h-14 sm:h-16 w-auto object-contain" />
                  <button onClick={() => setMobileOpen(false)} className="p-3 bg-[#FBF4E4] rounded-full text-[#1A0F0A]">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4 flex-grow overflow-y-auto">
                  {navLinks.map((link) => (
                    <div key={link.label} className="space-y-3">
                      <Link
                        href={link.href}
                        className={cn(
                          "block text-2xl font-display font-bold transition-all",
                          pathname === link.href ? "text-[#900C0C]" : "text-[#1A0F0A]"
                        )}
                        onClick={() => !link.dropdown && setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                      {link.dropdown && (
                        <div className="pl-4 space-y-2 border-l-2 border-[#FBF4E4]">
                          {link.dropdown.map(sub => (
                            <Link key={sub.label} href={sub.href} className="block text-base font-medium text-[#5C4A3E]" onClick={() => setMobileOpen(false)}>
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-[#FBF4E4] mt-auto space-y-3">
                  <Link
                    href="/essai-gratuit"
                    className="flex items-center justify-center gap-3 w-full bg-[#900C0C] text-white text-sm font-black uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-[#900C0C]/20"
                    onClick={() => setMobileOpen(false)}
                  >
                    Essai gratuit
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Cart Modal (Slide-over) */}
      <AnimatePresence>
        {isCartDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[80] flex flex-col"
            >
              <div className="p-6 border-b border-[#FBF4E4] flex items-center justify-between">
                <h2 className="text-base font-black text-[#1A0F0A] flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-rouge-ambra" />
                  VOTRE SÉLECTION CLOUD
                </h2>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="p-2 text-[#5C4A3E] hover:bg-[#FBF4E4] rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-[#5C4A3E]/50">
                    <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-wider">Votre sélection est vide</p>
                    <p className="text-xs text-center mt-2 text-taupe/60">
                      Configurez et ajoutez des solutions cloud à votre devis en direct.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {items.map((item) => (
                      <div key={item.id} className="p-4 rounded-2xl border border-taupe/15 bg-cream/20 shadow-2xs flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-black uppercase tracking-wider text-rouge-ambra">{item.category}</p>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-sm font-bold text-navy mt-0.5 leading-snug">{item.name}</h4>
                            {item.config?.designation && (
                              <span className="text-[10px] font-bold text-rouge-ambra bg-rouge-ambra/10 px-2 py-0.5 rounded border border-rouge-ambra/25">
                                &ldquo;{item.config.designation}&rdquo;
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-taupe/70 mt-1 line-clamp-2">{item.description}</p>
                          <div className="mt-2 text-[13px] font-black text-navy">
                            {formatPriceFCFA(item.config?.monthlyPrice ?? item.basePrice ?? 0, false)} / mois HT
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Link
                            href={getSolutionTargetUrl(item)}
                            onClick={() => setIsCartDrawerOpen(false)}
                            className="p-2 text-taupe/40 hover:text-rouge-ambra hover:bg-rouge-ambra/5 rounded-lg transition-colors cursor-pointer"
                            title="Modifier cette solution sur la page"
                            aria-label="Modifier cette solution"
                          >
                            <Pencil className="w-4 h-4 text-rouge-ambra" />
                          </Link>
                          <button
                            onClick={() => duplicateItem(item.id)}
                            className="p-2 text-taupe/40 hover:text-navy hover:bg-cream/50 rounded-lg transition-colors cursor-pointer"
                            title="Dupliquer cette machine"
                            aria-label="Dupliquer cette machine"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-taupe/40 hover:text-rouge-ambra hover:bg-rouge-ambra/5 rounded-lg transition-colors cursor-pointer"
                            title="Supprimer"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 border-t border-taupe/15 bg-cream/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-taupe/70">Total Mensuel Estimé</span>
                    <span className="text-xl font-black text-rouge-ambra">{formatPriceFCFA(totalMonthly, false)}</span>
                  </div>
                  <Link
                    href="/devis"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="flex items-center justify-center gap-2 w-full bg-navy hover:bg-rouge-ambra text-white text-xs font-bold uppercase tracking-wider py-4 rounded-xl shadow-lg transition-all duration-300"
                  >
                    <span>Finaliser mon devis</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function getSolutionTargetUrl(item: CartItem): string {
  const id = item.id.toLowerCase();
  const name = item.name.toLowerCase();

  // Redirection vers les services managés (/services-manages)
  if (
    id.includes("managed") ||
    id.includes("supervision") ||
    id.includes("security") ||
    id.includes("backup") ||
    id.includes("reporting") ||
    item.category.toLowerCase().includes("manag")
  ) {
    if (name.includes("supervision") || id.includes("supervision")) {
      return `/services-manages?edit=${encodeURIComponent(item.id)}#managed-supervision`;
    }
    if (name.includes("sécurité") || name.includes("securite") || id.includes("security") || name.includes("zero trust")) {
      return `/services-manages?edit=${encodeURIComponent(item.id)}#managed-security`;
    }
    if (name.includes("sauvegarde") || id.includes("backup")) {
      return `/services-manages?edit=${encodeURIComponent(item.id)}#managed-backup`;
    }
    if (name.includes("reporting") || id.includes("reporting")) {
      return `/services-manages?edit=${encodeURIComponent(item.id)}#managed-reporting`;
    }
    return `/services-manages?edit=${encodeURIComponent(item.id)}`;
  }

  // Redirection vers la solution spécifique sur /solutions avec scroll et ouverture du configurateur
  return `/solutions?edit=${encodeURIComponent(item.id)}#${encodeURIComponent(item.id)}`;
}