import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "@/styles/globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/layout/Providers";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AMBRA Cloud | Cloud résident en Côte d’Ivoire",
  description:
    "Le cloud résident fiable, sécurisé et performant. AMBRA Cloud déploie des solutions d'infrastructure robustes et souveraines pour les environnements critiques.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${dmSerif.variable} ${dmSans.variable}`}>
      <body>
        <Providers>
          <Navbar />
          <main className="bg-white">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
