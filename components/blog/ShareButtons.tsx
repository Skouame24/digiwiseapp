"use client";

import { useState } from "react";
import { Twitter, Linkedin, MessageCircle, Share2, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return url || window.location.href;
    }
    return url || "https://www.ambracloud.net/blog";
  };

  const handleShare = (network: "twitter" | "linkedin" | "whatsapp" | "copy") => {
    const currentUrl = getShareUrl();
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(`${title} — AMBRA Cloud`);

    switch (network) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
          "_blank",
          "noopener,noreferrer"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
          "_blank",
          "noopener,noreferrer"
        );
        break;
      case "whatsapp":
        window.open(
          `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
          "_blank",
          "noopener,noreferrer"
        );
        break;
      case "copy":
        if (navigator.clipboard) {
          navigator.clipboard.writeText(currentUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
          });
        }
        break;
    }
  };

  return (
    <div className="sticky top-32 flex lg:flex-col gap-3 items-center">
      <span className="text-[9px] font-bold uppercase tracking-widest text-taupe/40 lg:-rotate-90 lg:mb-8 whitespace-nowrap">
        Partager
      </span>
      <div className="w-px h-8 bg-taupe/10 hidden lg:block mb-4" />

      {/* Twitter / X */}
      <button
        onClick={() => handleShare("twitter")}
        aria-label="Partager sur X (Twitter)"
        title="Partager sur X"
        className="w-10 h-10 flex items-center justify-center rounded-full bg-cream hover:bg-navy hover:text-white transition-all text-navy cursor-pointer shadow-2xs hover:scale-105"
      >
        <Twitter className="w-4 h-4" />
      </button>

      {/* LinkedIn */}
      <button
        onClick={() => handleShare("linkedin")}
        aria-label="Partager sur LinkedIn"
        title="Partager sur LinkedIn"
        className="w-10 h-10 flex items-center justify-center rounded-full bg-cream hover:bg-[#0077b5] hover:text-white transition-all text-navy cursor-pointer shadow-2xs hover:scale-105"
      >
        <Linkedin className="w-4 h-4" />
      </button>

      {/* WhatsApp */}
      <button
        onClick={() => handleShare("whatsapp")}
        aria-label="Partager sur WhatsApp"
        title="Partager sur WhatsApp"
        className="w-10 h-10 flex items-center justify-center rounded-full bg-cream hover:bg-[#25D366] hover:text-white transition-all text-navy cursor-pointer shadow-2xs hover:scale-105"
      >
        <MessageCircle className="w-4 h-4" />
      </button>

      {/* Copier le lien */}
      <div className="relative">
        <button
          onClick={() => handleShare("copy")}
          aria-label="Copier le lien de l'article"
          title="Copier le lien"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-cream hover:bg-rouge-ambra hover:text-white transition-all text-navy cursor-pointer shadow-2xs hover:scale-105"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
        </button>
        {copied && (
          <span className="absolute left-full lg:left-auto lg:top-full ml-2 lg:ml-0 lg:mt-2 px-2 py-1 bg-navy text-white text-[9px] font-bold uppercase rounded shadow-lg whitespace-nowrap">
            Lien copié !
          </span>
        )}
      </div>
    </div>
  );
}

