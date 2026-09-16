"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ArrowRight, ChevronDown, FileText, Trash2, ShieldCheck, Database, Cpu, Cloud, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
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
  const [cartOpen, setCartOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { items, removeItem, count, getTotalMonthlyPrice } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setCartOpen(false); }, [pathname]);

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
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-3 text-[#5C4A3E] hover:bg-[#FBF4E4] rounded-full transition-colors group"
            >
              <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
              {count > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#900C0C] text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                  {count}
                </span>
              )}
            </button>

            <Link
              href="/essai-gratuit"
              className="group relative inline-flex items-center gap-2 bg-[#900C0C] text-white text-[11px] font-black uppercase tracking-[0.2em] px-7 py-3.5 rounded-full overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-[#900C0C]/20 active:scale-95 shadow-lg shadow-[#900C0C]/10"
            >
              <span className="relative z-10">Essai gratuit</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5" />
              <div className="absolute inset-0 bg-[#7a0a0a] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              className="p-2 text-[#5C4A3E] hover:bg-[#FBF4E4] rounded-full transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
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
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
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
                <h2 className="text-lg font-black text-[#1A0F0A] flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#900C0C]" />
                  VOTRE SÉLECTION
                </h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 text-[#5C4A3E] hover:bg-[#FBF4E4] rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-[#5C4A3E]/50">
                    <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-wider">Votre panier est vide</p>
                    <p className="text-xs text-center mt-2">Découvrez nos solutions cloud et ajoutez-les à votre sélection.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="p-4 rounded-xl border border-[#FBF4E4] bg-white shadow-sm flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-wider text-[#900C0C]">{item.category}</p>
                          <h4 className="text-sm font-bold text-[#1A0F0A] mt-1">{item.name}</h4>
                          <p className="text-xs text-[#5C4A3E]/70 mt-1 line-clamp-2">{item.description}</p>
                          <div className="mt-2 text-sm font-black text-[#1A0F0A]">
                            {formatPriceFCFA(item.config?.monthlyPrice ?? item.basePrice ?? 0, true)}/mo
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-[#5C4A3E]/40 hover:text-[#900C0C] hover:bg-[#900C0C]/5 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 border-t border-[#FBF4E4] bg-[#FBF4E4]/30">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-[#5C4A3E]">Total estimé</span>
                    <span className="text-xl font-black text-[#900C0C]">{formatPriceFCFA(totalMonthly, true)}<span className="text-sm font-bold">/mo</span></span>
                  </div>
                  <Link
                    href="/devis"
                    onClick={() => setCartOpen(false)}
                    className="flex items-center justify-center gap-2 w-full bg-[#900C0C] text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-[#900C0C]/20 hover:shadow-xl hover:shadow-[#900C0C]/30 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Valider ma sélection
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