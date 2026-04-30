"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Share2, Twitter, Linkedin, Facebook } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CtaFinal } from "@/components/sections/CtaFinal";

// Animation ease
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

// Mock data (in a real app, this would be fetched from a CMS based on the ID)
const getPostData = (id: string) => ({
  id,
  title: "Souveraineté numérique : pourquoi le cloud résident est vital pour l'Afrique",
  category: "Souveraineté",
  date: "15 Mai 2024",
  readTime: "6 min de lecture",
  author: {
    name: "Dr. Amadou Koné",
    role: "Architecte Cloud Senior",
    avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=200&auto=format&fit=crop",
  },
  image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1600&auto=format&fit=crop",
  content: `
    <p>À l'ère où la donnée est devenue le nouvel or noir, la question de sa localisation n'est plus seulement technique, elle est éminemment stratégique et politique. Pour les entreprises africaines, et particulièrement en Côte d'Ivoire, dépendre exclusivement de datacenters situés en Europe ou en Amérique du Nord présente des risques majeurs que le modèle du <strong>cloud résident</strong> permet de mitiger.</p>

    <h2>1. La latence, l'ennemie silencieuse de la performance</h2>
    <p>Une requête qui traverse l'océan Atlantique met inévitablement plus de temps à revenir. Pour des applications métiers critiques (Fintech, transactions en temps réel, santé), cette latence de quelques dizaines de millisecondes peut se traduire par des abandons de paniers, des désynchronisations ou des expériences utilisateurs dégradées. Un cloud résident comme AMBRA Cloud, opéré localement, réduit cette latence au strict minimum.</p>

    <blockquote>
      La souveraineté numérique n'est pas un concept abstrait. C'est la capacité d'une entreprise à garantir l'intégrité, la disponibilité et la confidentialité de ses données sous la juridiction de son propre pays.
    </blockquote>

    <h2>2. Conformité légale et protection des données</h2>
    <p>De plus en plus de régulateurs africains exigent que les données sensibles (bancaires, médicales, identitaires) restent sur le territoire national. C'est ici que le cloud souverain prend tout son sens. En hébergeant vos infrastructures chez AMBRA Cloud, vous vous assurez de respecter strictement la législation ivoirienne et régionale en matière de protection des données personnelles.</p>

    <h2>3. L'hybridation : le meilleur des deux mondes</h2>
    <p>Le cloud résident ne signifie pas pour autant se couper de l'innovation mondiale. Les stratégies modernes reposent sur le <strong>Cloud Hybride</strong>. Les données critiques et les cœurs de base de données restent sécurisés localement, tandis que des applications moins sensibles peuvent s'appuyer sur des ressources publiques (AWS, Azure) si nécessaire. Cette flexibilité est au cœur de l'offre AMBRA.</p>

    <p>En conclusion, investir dans une infrastructure cloud résidente n'est plus une option de luxe, c'est une composante essentielle de la gestion des risques et de la compétitivité d'une entreprise moderne en Afrique de l'Ouest.</p>
  `,
  tags: ["Cloud Computing", "Souveraineté", "RGPD", "Infrastructure", "Afrique"],
});

export default function BlogPost() {
  const params = useParams();
  const id = params?.id as string;
  const post = getPostData(id);

  if (!post) {
    return <div>Article introuvable</div>;
  }

  return (
    <>
      <article className="bg-white pb-24">
        {/* ── HEADER ARTICLE ─────────────────────────────────────── */}
        <section className="pt-40 pb-16 px-6 relative bg-cream">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-taupe/50 hover:text-navy transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au blog
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="flex items-center gap-4 mb-6"
            >
              <span className="px-3 py-1 bg-white text-primary-light text-[10px] font-bold uppercase tracking-widest border border-primary-light/20">
                {post.category}
              </span>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-taupe/40">
                <Calendar className="w-3.5 h-3.5" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-taupe/40">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="text-4xl md:text-5xl lg:text-6xl font-display text-navy leading-tight mb-8"
            >
              {post.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
              className="flex items-center gap-4"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-navy">{post.author.name}</p>
                <p className="text-[12px] text-taupe/60">{post.author.role}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── IMAGE HERO ─────────────────────────────────────────── */}
        <section className="px-6 -mt-10 max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
            className="relative w-full aspect-[21/9] md:aspect-[21/9] bg-cream shadow-2xl"
          >
            <Image 
              src={post.image} 
              alt={post.title} 
              fill 
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-navy/10" />
          </motion.div>
        </section>

        {/* ── CONTENT ────────────────────────────────────────────── */}
        <section className="pt-20 px-6 max-w-4xl mx-auto flex flex-col lg:flex-row gap-16 relative">
          
          {/* Share Sidebar (Sticky Desktop) */}
          <div className="lg:w-16 shrink-0 order-2 lg:order-1">
            <div className="sticky top-32 flex lg:flex-col gap-4 items-center">
              <span className="text-[9px] font-bold uppercase tracking-widest text-taupe/40 lg:-rotate-90 lg:mb-8 whitespace-nowrap">
                Partager
              </span>
              <div className="w-px h-8 bg-taupe/10 hidden lg:block mb-4" />
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-cream hover:bg-primary-light hover:text-white transition-colors text-navy">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-cream hover:bg-primary-light hover:text-white transition-colors text-navy">
                <Linkedin className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-cream hover:bg-primary-light hover:text-white transition-colors text-navy">
                <Facebook className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-cream hover:bg-primary-light hover:text-white transition-colors text-navy">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 order-1 lg:order-2">
            <div 
              className="max-w-none
                [&_h2]:font-display [&_h2]:text-navy [&_h2]:text-3xl [&_h2]:mt-14 [&_h2]:mb-6
                [&_p]:text-taupe/80 [&_p]:leading-relaxed [&_p]:text-[17px] [&_p]:mb-6
                [&_strong]:text-navy [&_strong]:font-bold
                [&_blockquote]:border-l-4 [&_blockquote]:border-primary-light [&_blockquote]:bg-cream/50 [&_blockquote]:py-6 [&_blockquote]:px-8 [&_blockquote]:text-xl [&_blockquote]:font-display [&_blockquote]:italic [&_blockquote]:text-navy [&_blockquote]:my-10 [&_blockquote]:shadow-sm
                [&_a]:text-primary-light hover:[&_a]:text-rouge-ambra [&_a]:transition-colors"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="mt-16 pt-8 border-t border-taupe/10 flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Link 
                  key={tag} 
                  href="/blog" 
                  className="px-4 py-2 bg-cream text-[11px] font-bold uppercase tracking-widest text-taupe/60 hover:bg-navy hover:text-white transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </section>

      </article>

      {/* ── RELATED CTA ────────────────────────────────────────── */}
      <CtaFinal />
    </>
  );
}
