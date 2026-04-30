import type { Metadata } from "next";
import { ProjectsHero } from "@/components/sections/ProjectsHero";
import { Projects } from "@/components/sections/Projects";

export const metadata: Metadata = {
  title: "Projets | AMBRA Cloud",
  description: "Découvrez nos réalisations : RTI, SUNU Assurances, BGFI Bank, SODECI et bien d'autres clients.",
};

export default function ProjetsPage() {
  return (
    <>
      <ProjectsHero />
      <Projects />
    </>
  );
}
