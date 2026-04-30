"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ArrowRight, ChevronDown, ShoppingBag, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

const navLinks: { label: string; href: string; dropdown?: { label: string; href: string }[] }[] = [
  { label: "Accueil", href: "/" },
  { label: "Solutions", href: "/solutions" },
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
  const { items, removeItem, count } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setCartOpen(false); }, [pathname]);

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
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        <Link href="/" className="relative group transition-transform duration-500 hover:scale-[1.02]">
          <Image
            src="/logo.png"
            alt="AMBRA Cloud Logo"
            width={200}
            height={64}
            // ✅ CORRECTION : h-9 (36px) remplacé par h-14 (56px)
            // Les props width/height seules ne suffisent pas avec next/image
            // C'est toujours la classe Tailwind qui contrôle la taille réelle
            className="h-14 w-auto object-contain"
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
                  <button
                    className={cn(
                      "flex items-center gap-1 px-4 text-[13px] font-bold uppercase tracking-wider transition-all duration-300",
                      activeDropdown === link.label ? "text-[#900C0C]" : "text-[#5C4A3E]"
                    )}
                  >
                    {link.label}
                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-500", activeDropdown === link.label && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-[100%] left-0 w-56 pt-2"
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
          {/* Cart icon + badge */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2.5 text-[#5C4A3E] hover:text-[#900C0C] transition-colors duration-300 cursor-pointer flex items-center gap-2"
            aria-label="Panier"
          >
            <ShoppingBag className="w-5 h-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#900C0C] text-white text-[9px] font-black rounded-full flex items-center justify-center"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <Link
            href="/devis"
            className="group relative inline-flex items-center gap-2 bg-[#900C0C] text-white text-[11px] font-black uppercase tracking-[0.2em] px-8 py-3.5 rounded-full overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-[#900C0C]/20 active:scale-95 shadow-lg shadow-[#900C0C]/10"
          >
            <span className="relative z-10">Démarrer</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5" />
            <div className="absolute inset-0 bg-[#7a0a0a] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button onClick={() => setCartOpen(true)} className="relative p-2 text-[#5C4A3E]" aria-label="Panier">
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#900C0C] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
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
            className="fixed inset-0 top-0 h-screen w-screen bg-white z-[60] lg:hidden"
          >
            <div className="p-8 h-full flex flex-col">
              <div className="flex items-center justify-between mb-16">
                {/* ✅ Logo mobile aussi corrigé : h-8 → h-12 */}
                <Image src="/logo.png" alt="Logo" width={160} height={48} className="h-12 w-auto object-contain" />
                <button onClick={() => setMobileOpen(false)} className="p-3 bg-[#FBF4E4] rounded-full text-[#1A0F0A]">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 flex-grow overflow-y-auto">
                {navLinks.map((link) => (
                  <div key={link.label} className="space-y-4">
                    <Link
                      href={link.href}
                      className={cn(
                        "block text-3xl font-display font-bold transition-all",
                        pathname === link.href ? "text-[#900C0C]" : "text-[#1A0F0A]"
                      )}
                      onClick={() => !link.dropdown && setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                    {link.dropdown && (
                      <div className="pl-6 space-y-4 border-l-2 border-[#FBF4E4]">
                        {link.dropdown.map(sub => (
                          <Link key={sub.label} href={sub.href} className="block text-lg font-medium text-[#5C4A3E]" onClick={() => setMobileOpen(false)}>
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-[#FBF4E4] mt-auto">
                <Link
                  href="/devis"
                  className="flex items-center justify-center gap-3 w-full bg-[#900C0C] text-white text-sm font-black uppercase tracking-widest py-6 rounded-2xl shadow-xl shadow-[#900C0C]/20"
                  onClick={() => setMobileOpen(false)}
                >
                  Démarrer mon projet
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>

    {/* ── Cart Drawer ──────────────────────────────────────── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-[70]"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[80] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-taupe/10">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-primary-light" />
                  <h2 className="text-[14px] font-black uppercase tracking-[0.2em] text-navy">Ma sélection</h2>
                  {count > 0 && (
                    <span className="bg-primary-light/10 text-primary-light text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {count} service{count > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-cream rounded-full transition-colors">
                  <X className="w-5 h-5 text-taupe" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                <AnimatePresence mode="popLayout">
                  {items.length === 0 ? (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full pt-24 text-center">
                      <ShoppingBag className="w-12 h-12 text-taupe/20 mb-4" />
                      <p className="text-[13px] font-bold text-taupe/40 uppercase tracking-widest">Aucun service sélectionné</p>
                      <p className="text-[12px] text-taupe/30 mt-2">Parcourez nos offres et ajoutez ce qui vous intéresse.</p>
                    </motion.div>
                  ) : (
                    items.map((item) => (
                      <motion.div key={item.id} layout
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-start justify-between gap-3 p-4 bg-cream/40 border border-taupe/10"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-light mb-0.5">{item.category}</p>
                          <p className="text-[14px] font-bold text-navy leading-snug">{item.name}</p>
                          {item.config ? (
                            <div className="mt-1 space-y-0.5">
                              {item.config.designation && (
                                <p className="text-[12px] italic text-taupe/60">&ldquo;{item.config.designation}&rdquo;</p>
                              )}
                              <div className="flex flex-wrap gap-x-2 text-[11px] text-taupe/50">
                                {item.config.vcpu !== undefined && <span>{item.config.vcpu} vCPU</span>}
                                {item.config.ram !== undefined && <span>{item.config.ram} Go RAM</span>}
                                {item.config.storage !== undefined && <span>{item.config.storage} Go</span>}
                                {item.config.duration !== undefined && <span>{item.config.duration} mois</span>}
                              </div>
                              {item.config.addons.length > 0 && (
                                <p className="text-[11px] text-primary-light/70">
                                  + {item.config.addons.length} service{item.config.addons.length > 1 ? "s" : ""} additionnel{item.config.addons.length > 1 ? "s" : ""}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-[12px] text-taupe/60 mt-1 line-clamp-2">{item.description}</p>
                          )}
                        </div>
                        <button onClick={() => removeItem(item.id)}
                          className="shrink-0 p-1.5 text-taupe/30 hover:text-rouge-ambra transition-colors duration-200 mt-0.5">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-6 py-5 border-t border-taupe/10 space-y-3">
                {items.length > 0 ? (
                  <>
                    <button
                      onClick={() => { setCartOpen(false); router.push("/devis"); }}
                      className="w-full flex items-center justify-center gap-2 bg-[#900C0C] text-white text-[12px] font-black uppercase tracking-[0.2em] py-4 hover:bg-[#7a0a0a] transition-colors duration-300"
                    >
                      Demander un devis <ArrowRight className="w-4 h-4" />
                    </button>
                    <button onClick={() => setCartOpen(false)}
                      className="w-full text-[11px] font-bold uppercase tracking-widest text-taupe/50 hover:text-navy py-2 transition-colors duration-200">
                      Continuer la navigation
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setCartOpen(false); router.push("/solutions"); }}
                    className="w-full flex items-center justify-center gap-2 bg-primary-light text-white text-[12px] font-black uppercase tracking-[0.2em] py-4 hover:bg-ambre-signature transition-colors duration-300">
                    Voir nos offres <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}