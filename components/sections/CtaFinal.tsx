"use client";

import { motion } from "framer-motion";
import { Cpu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CtaFinal() {
  return (
    <section className="py-16 md:py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative bg-primary rounded-2xl lg:rounded-3xl p-6 sm:p-10 md:p-20 overflow-hidden group shadow-2xl shadow-primary/20">
        {/* Background Patterns - Soft & Brand Aligned */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-px bg-white/40"></div>
          <div className="absolute bottom-0 inset-x-0 h-px bg-white/40"></div>
          <div className="absolute top-1/2 left-0 w-full h-full rotate-45 scale-150 border-[0.5px] border-white/20"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-white/20 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-display text-white mb-6 leading-tight"
          >
            Prêt à sécuriser votre avenir numérique ?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/90 text-lg mb-12 font-medium"
          >
            Parlez à un architecte cloud AMBRA pour concevoir votre infrastructure sur mesure.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <Button 
              href="/devis"
              className="w-full sm:w-auto bg-[#1A0F0A] hover:bg-rouge-ambra text-white px-7 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-black/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-none group/btn cursor-pointer whitespace-nowrap"
            >
              <span>Demander un devis sur mesure</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1 shrink-0" />
            </Button>
            <Button 
              href="/contact"
              variant="secondary"
              className="w-full sm:w-auto bg-white/15 hover:bg-white text-white hover:text-navy border border-white/25 hover:border-transparent px-7 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl backdrop-blur-md transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              <span>Contacter un expert</span>
            </Button>
          </motion.div>
        </div>
        
        {/* Decorative Element */}
        <div className="hidden lg:block absolute right-[-5%] top-1/2 -translate-y-1/2 w-1/3 pointer-events-none opacity-10">
          <motion.div 
            animate={{ 
              rotate: [0, 5, 0],
              scale: [1, 1.05, 1] 
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="text-white"
          >
            <Cpu size={350} strokeWidth={1} />
          </motion.div>
        </div>

        {/* Decorative Element Left */}
        <div className="hidden lg:block absolute left-[-5%] top-1/2 -translate-y-1/2 w-1/3 pointer-events-none opacity-5">
          <motion.div 
            animate={{ 
              rotate: [0, -5, 0],
              scale: [1, 1.02, 1] 
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="text-white"
          >
            <Cpu size={300} strokeWidth={1} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
