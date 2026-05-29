import type { Metadata } from "next";
import { ProjectsHero } from "@/components/sections/ProjectsHero";
import { Projects } from "@/components/sections/Projects";

export const metadata: Metadata = {
  title: "Projets | AMBRA Cloud",
  description: "Découvrez nos réalisations : AFMA, CN-ITIE, NEOLEDGE, KAYDAN TECHNOLOGY et bien d'autres clients.",
};

export default function ProjetsPage() {
  return (
    <>
      <ProjectsHero />
      <Projects />
    </>
  );
}
