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

    // Écouter les changements dans le localStorage et les messages de l'iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "form_submitted") {
        // Enregistrer la soumission pour les futures visites
        localStorage.setItem("bigin_form_submitted", "true");
        // On attend 2 secondes pour laisser le temps au message de remerciement de s'afficher dans l'iframe
        setTimeout(() => {
          setIsSubmitted(true);
        }, 2000);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "bigin_form_submitted" && e.newValue === "true") {
        setIsSubmitted(true);
      }
    };

    window.addEventListener("message", handleMessage);
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("storage", handleStorageChange);
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
          src="/api/zoho-form"
          className="w-full h-full border-none"
          title="Bienvenue dans votre Cloud"
          sandbox="allow-scripts allow-same-origin allow-forms allow-top-navigation allow-popups"
        />
      </div>
    );
  }

  return <>{children}</>;
}

