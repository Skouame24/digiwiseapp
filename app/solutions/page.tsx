import type { Metadata } from "next";
import { SolutionsHero } from "@/components/sections/SolutionsHero";
import { SolutionsDetail } from "@/components/sections/SolutionsDetail";
import { CtaFinal } from "@/components/sections/CtaFinal";

export const metadata: Metadata = {
  title: "Solutions Cloud hybride et privé | AMBRA Cloud",
  description: "Découvrez nos solutions de Cloud Résident, Cloud Privé Bare Metal et Services Managés en Côte d'Ivoire.",
};

export default function SolutionsPage() {
  return (
    <>
      <SolutionsHero />
      <SolutionsDetail />
      <CtaFinal />
    </>
  );
}
