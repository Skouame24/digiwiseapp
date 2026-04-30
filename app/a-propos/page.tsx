import type { Metadata } from "next";
import { About } from "@/components/sections/About";

export const metadata: Metadata = {
  title: "À propos | AMBRA Cloud",
  description: "Découvrez AMBRA Cloud, le premier fournisseur d'infrastructure cloud souveraine en Côte d'Ivoire. Notre vision, notre mission et nos expertises.",
};

export default function AProposPage() {
  return <About />;
}
