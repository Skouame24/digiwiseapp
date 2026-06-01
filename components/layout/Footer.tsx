"use client";

import Link from "next/link";
import Image from "next/image";
import { Linkedin, Mail, Facebook } from "lucide-react";

const legalLinks = [
  { label: "Mentions légales", href: "#" },
  { label: "Confidentialité", href: "#" },
  { label: "Conformité", href: "#" },
  { label: "Contact", href: "/contact" },
];

const socials = [
  { icon: <Linkedin className="w-4 h-4" />, href: "https://www.linkedin.com/company/ambra-cloud", label: "LinkedIn" },
  { icon: <Facebook className="w-4 h-4" />, href: "https://web.facebook.com/people/AMBRA-Cloud/61589426378437/?sk=directory_links&_rdc=1&_rdr#", label: "Facebook" },
  { icon: <Mail className="w-4 h-4" />, href: "mailto:infos@ambracloud.net", label: "Email" },
];

export function Footer() {
  return (
    <footer className="bg-navy border-t border-white/8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-5">

          {/* Left — Logo + copyright + links */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/" className="shrink-0">
              <Image
                src="/logo.png"
                alt="AMBRA Cloud"
                width={36}
                height={36}
                className="object-contain"
                unoptimized
              />
            </Link>
            <span className="text-[11px] text-white/30">
              &copy; {new Date().getFullYear()} AMBRA Cloud, Inc.
            </span>
            <span className="hidden md:block w-px h-3 bg-white/10" />
            {legalLinks.map((l, i) => (
              <span key={l.label} className="flex items-center gap-5">
                {i > 0 && <span className="text-white/15">·</span>}
                <Link
                  href={l.href}
                  className="text-[11px] text-white/35 hover:text-white/70 transition-colors duration-200"
                >
                  {l.label}
                </Link>
              </span>
            ))}
          </div>

          {/* Right — Social icons */}
          <div className="flex items-center gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={s.label}
                className="text-white/30 hover:text-white/80 transition-colors duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
}
