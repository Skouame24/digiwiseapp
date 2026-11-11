"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BlogCard } from "@/components/blog/BlogCard";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { ArrowRight, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/blogData";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const categories = ["Tous", "Infrastructure", "Sécurité", "Indépendance", "Secteurs"];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const featuredPost = blogPosts[0];

  // Filtrage dynamique des articles (Audit A17)
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchCat =
        activeCategory === "Tous" ||
        post.category.toLowerCase() === activeCategory.toLowerCase();
      const matchSearch =
        searchQuery.trim() === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  // Si aucun filtre n'est actif, la grille commence après l'article à la Une
  const isDefaultView = activeCategory === "Tous" && searchQuery.trim() === "";
  const displayPosts = isDefaultView
    ? filteredPosts.slice(1, visibleCount + 1)
    : filteredPosts.slice(0, visibleCount);

  const totalAvailable = isDefaultView ? filteredPosts.length - 1 : filteredPosts.length;
  const hasMore = displayPosts.length < totalAvailable;

  return (
    <>
      {/* ── HERO (Pattern Contact) ────────────────────────────────── */}
      <section className="pt-32 pb-16 bg-cream relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-light/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary-light mb-4"
          >
            // Insights &amp; Actualités
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="text-4xl md:text-5xl font-display text-navy leading-tight mb-4"
          >
            Explorez l&apos;avenir du{" "}
            <span className="italic text-rouge-ambra">Cloud Résident</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="text-[15px] text-taupe/70 max-w-xl leading-relaxed"
          >
            Analyses, expertises techniques et visions stratégiques pour
            propulser votre infrastructure vers de nouveaux horizons.
          </motion.p>
        </div>
      </section>

      {/* ── FEATURED POST (visible en vue par défaut) ─────────────── */}
      {isDefaultView && featuredPost && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease }}
              className="relative grid lg:grid-cols-2 gap-0 bg-cream/30 border border-taupe/10 overflow-hidden group"
            >
              <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-navy/20" />
              </div>

              <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-primary-light text-white text-[9px] font-bold uppercase tracking-widest">
                    À la Une
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-taupe/40">
                    {featuredPost.date}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-display text-navy mb-6 leading-tight group-hover:text-primary-light transition-colors duration-300">
                  <Link href={`/blog/${featuredPost.id}`}>
                    {featuredPost.title}
                  </Link>
                </h2>

                <p className="text-[14px] text-taupe/70 leading-relaxed mb-10 max-w-lg">
                  {featuredPost.excerpt}
                </p>

                <div>
                  <Link
                    href={`/blog/${featuredPost.id}`}
                    className="inline-flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.2em] text-navy border-b-2 border-primary-light/30 hover:border-primary-light transition-all duration-300 pb-1"
                  >
                    <span>Lire l&apos;article complet</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── FILTERING (Fonctionnel - Audit A17) ────────────────────── */}
      <section className="py-8 bg-white border-y border-taupe/5 sticky top-20 z-20 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setVisibleCount(6);
                  }}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 rounded-lg cursor-pointer ${
                    activeCategory === cat
                      ? "bg-navy text-white shadow-sm"
                      : "text-taupe/60 hover:text-navy hover:bg-cream/80 border border-taupe/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe/35 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(6);
                }}
                placeholder="Rechercher un sujet, technologie…"
                className="w-full pl-10 pr-9 py-2.5 bg-cream/30 border border-taupe/15 rounded-xl text-[12px] text-navy placeholder:text-taupe/40 focus:outline-none focus:border-primary-light focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-taupe/40 hover:text-rouge-ambra transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── BLOG GRID ────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {displayPosts.length === 0 ? (
            <div className="py-20 text-center max-w-md mx-auto">
              <Search className="w-10 h-10 text-taupe/20 mx-auto mb-4" />
              <h3 className="text-lg font-display text-navy mb-2">Aucun article ne correspond à votre recherche</h3>
              <p className="text-xs text-taupe/60 mb-6">
                Essayez d&apos;autres mots-clés ou sélectionnez une autre catégorie.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("Tous");
                  setSearchQuery("");
                }}
                className="px-6 py-2.5 bg-navy text-white text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-primary-light transition-colors cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {displayPosts.map((post, index) => (
                <BlogCard key={post.id} {...post} index={index} />
              ))}
            </div>
          )}

          {/* Bouton Charger plus d'articles fonctionnel (Audit A18) */}
          {hasMore && (
            <div className="mt-20 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-10 py-4 bg-navy hover:bg-rouge-ambra text-white text-[11px] font-black uppercase tracking-[0.25em] rounded-xl transition-all duration-300 shadow-lg shadow-navy/10 active:scale-95 cursor-pointer"
              >
                Charger plus d&apos;articles ({totalAvailable - displayPosts.length} restants)
              </button>
            </div>
          )}
        </div>
      </section>

      <CtaFinal />
    </>
  );
}
