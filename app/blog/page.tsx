"use client";

import { motion } from "framer-motion";
import { BlogCard } from "@/components/blog/BlogCard";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { ArrowRight, Search, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

import { blogPosts } from "@/lib/blogData";

export default function BlogPage() {
  const featuredPost = blogPosts[0];

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
            // Insights & Actualités
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

      {/* ── FEATURED POST ────────────────────────────────────────── */}
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

      {/* ── FILTERING (Optional / Visual only) ────────────────────── */}
      <section className="py-8 bg-white border-y border-taupe/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-3">
              {["Tous", "Infrastructure", "Sécurité", "Indépendance", "Secteurs"].map((cat) => (
                <button
                  key={cat}
                  className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${cat === "Tous"
                    ? "bg-navy text-white"
                    : "text-taupe/50 hover:text-navy hover:bg-cream"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe/30" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 bg-cream/30 border border-taupe/10 text-[12px] focus:outline-none focus:border-primary-light/50 transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── BLOG GRID ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {blogPosts.slice(1).map((post, index) => (
              <BlogCard key={post.id} {...post} index={index} />
            ))}
          </div>

          <div className="mt-24 text-center">
            <button className="px-12 py-5 bg-navy text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-primary-light transition-all duration-500 shadow-xl shadow-navy/10 group">
              Charger plus d&apos;articles
            </button>
          </div>
        </div>
      </section>

      <CtaFinal />
    </>
  );
}
