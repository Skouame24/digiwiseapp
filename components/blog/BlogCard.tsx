"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  index: number;
}

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function BlogCard({ id, title, excerpt, category, date, image, index }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease }}
      className="group flex flex-col bg-white overflow-hidden"
    >
      <Link href={`/blog/${id}`} className="relative block aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/10 transition-colors duration-500" />
        
        {/* Category Tag */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[9px] font-bold uppercase tracking-widest text-primary-light">
            {category}
          </span>
        </div>
      </Link>

      <div className="flex flex-col flex-grow py-8 pr-4">
        <div className="flex items-center gap-2 mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-taupe/40">
          <Calendar className="w-3 h-3" />
          <span>{date}</span>
        </div>
        
        <Link href={`/blog/${id}`} className="group/title">
          <h3 className="text-xl font-display text-navy leading-tight mb-4 group-hover/title:text-primary-light transition-colors duration-300">
            {title}
          </h3>
        </Link>
        
        <p className="text-[14px] text-taupe/70 leading-relaxed mb-8 line-clamp-3">
          {excerpt}
        </p>
        
        <div className="mt-auto">
          <Link
            href={`/blog/${id}`}
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-primary-light group/link"
          >
            <span>Lire l&apos;article</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
