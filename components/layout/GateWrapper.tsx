"use client";

import { useEffect, useState, ReactNode } from "react";

interface GateWrapperProps {
  children: ReactNode;
}

export function GateWrapper({ children }: GateWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(true); // Par défaut true pour le SSR

  useEffect(() => {
    setMounted(true);

    const checkSubmission = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("submitted") === "true") {
        localStorage.setItem("bigin_form_submitted", "true");
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete("submitted");
        window.history.replaceState({}, "", currentUrl.pathname + currentUrl.search);
        setIsSubmitted(true);
        return true;
      }

      const isAlreadySubmitted = localStorage.getItem("bigin_form_submitted") === "true";
      if (isAlreadySubmitted) {
        setIsSubmitted(true);
        return true;
      } else {
        setIsSubmitted(false);
        return false;
      }
    };

    checkSubmission();

    // Écouter les changements dans le localStorage (utile si l'iframe met à jour le localStorage)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "bigin_form_submitted" && e.newValue === "true") {
        setIsSubmitted(true);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Polling régulier au cas où l'iframe redirige vers le site et met à jour le localStorage sans déclencher l'événement
    const interval = setInterval(() => {
      if (localStorage.getItem("bigin_form_submitted") === "true") {
        setIsSubmitted(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (!mounted) {
    return (
      <div style={{ opacity: 0 }} aria-hidden="true">
        {children}
      </div>
    );
  }

  // Si l'utilisateur n'a pas validé le formulaire, on bloque TOUT le site et on affiche l'iframe en plein écran
  if (!isSubmitted) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-white">
        <iframe 
          src="https://us.bigin.online/org714565689/forms/bienvenue-dans-votre-cloud"
          className="w-full h-full border-none"
          title="Bienvenue dans votre Cloud"
          sandbox="allow-scripts allow-same-origin allow-forms allow-top-navigation allow-popups"
        />
      </div>
    );
  }

  return <>{children}</>;
}

