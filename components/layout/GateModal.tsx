"use client";

import { useEffect, useState } from "react";

export function GateModal() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Détection du paramètre de retour de soumission dans l'URL
    const params = new URLSearchParams(window.location.search);
    if (params.get("submitted") === "true") {
      localStorage.setItem("bigin_form_submitted", "true");

      // Nettoyage de l'URL pour enlever "?submitted=true" sans recharger la page
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete("submitted");
      window.history.replaceState({}, "", currentUrl.pathname + currentUrl.search);
      
      setIsVisible(false);
      return;
    }

    // 2. Vérification si l'utilisateur a déjà rempli le formulaire
    const isSubmitted = localStorage.getItem("bigin_form_submitted");
    if (isSubmitted === "true") {
      setIsVisible(false);
      return;
    }

    // 3. Si non soumis, on affiche le modal et charge le script
    setIsVisible(true);

    const scriptId = "formScript4513682000006075056";
    // Éviter de charger le script plusieurs fois
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://us.bigin.online/org714565689/forms/bienvenue-dans-votre-cloud?script=$sYG";
      script.async = true;
      document.body.appendChild(script);
    }

    // 4. Intercepter le champ returnURL après injection du formulaire
    const interval = setInterval(() => {
      const returnInput = document.querySelector('input[name="returnURL"]') as HTMLInputElement;
      if (returnInput) {
        // Rediriger vers l'URL courante avec le paramètre submitted=true
        const redirectUrl = new URL(window.location.href);
        redirectUrl.searchParams.set("submitted", "true");
        returnInput.value = redirectUrl.toString();
        clearInterval(interval);
      }
    }, 100);

    // Nettoyage lors du démontage du composant
    return () => {
      clearInterval(interval);
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
      const formParent = document.getElementById("BiginWebToRecordFormParent4513682000006075056");
      if (formParent) {
        formParent.remove();
      }
    };
  }, []);

  // Bloquer le défilement de la page lorsque le modal est visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  if (!mounted || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Styles personnalisés injectés pour réécrire le design Zoho en mode AMBRA Premium */}
      <style jsx global>{`
        /* Fond d'écran du modal avec effet de flou */
        #BiginWebToRecordFormParent4513682000006075056 {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 999999 !important;
          background-color: rgba(26, 15, 10, 0.85) !important; /* noir-ambre avec opacité */
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          overflow-y: auto !important;
          padding: 20px !important;
          box-sizing: border-box !important;
        }

        /* Conteneur principal du formulaire */
        #BiginWebToRecordFormDiv4513682000006075056 {
          margin: auto !important;
          background-color: #1A0F0A !important; /* noir-ambre */
          border: 1px solid rgba(240, 156, 60, 0.25) !important; /* bordure ambre léger */
          color: #FBF4E4 !important; /* creme-resine */
          border-radius: 16px !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7) !important;
          max-width: 600px !important;
          width: 100% !important;
          padding: 10px !important;
          box-sizing: border-box !important;
        }

        /* Masquer le powered by de Zoho pour un rendu 100% en marque blanche */
        #poweredBy4513682000006075056 {
          display: none !important;
        }

        /* En-tête du formulaire */
        #BiginWebToRecordFormParent4513682000006075056 .wf-header {
          color: #F09C3C !important; /* ambre-lumineux */
          font-family: var(--font-dm-serif), serif !important;
          font-size: 24px !important;
          text-align: center !important;
          margin-bottom: 20px !important;
          padding-bottom: 10px !important;
          border-bottom: 1px solid rgba(251, 244, 228, 0.1) !important;
        }

        /* Section titres et descriptions */
        #BiginWebToRecordFormParent4513682000006075056 .wf-sec-title {
          color: #FCCC60 !important; /* miel-or */
          font-family: var(--font-dm-serif), serif !important;
          font-size: 18px !important;
          margin-bottom: 8px !important;
        }

        #BiginWebToRecordFormParent4513682000006075056 .wf-sec-desc {
          color: rgba(251, 244, 228, 0.7) !important; /* creme avec opacité */
          font-size: 14px !important;
          line-height: 1.5 !important;
          margin-bottom: 20px !important;
          text-align: center !important;
        }

        /* Libellés (Nom, Prénom...) */
        #BiginWebToRecordFormParent4513682000006075056 .wf-label {
          color: #FBF4E4 !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          margin-bottom: 6px !important;
          padding: 0 !important;
        }

        /* Champs de saisie */
        #BiginWebToRecordFormParent4513682000006075056 .wf-field-input,
        #BiginWebToRecordFormParent4513682000006075056 .wf-field-dropdown {
          background-color: rgba(251, 244, 228, 0.04) !important;
          border: 1px solid rgba(251, 244, 228, 0.15) !important;
          color: #FBF4E4 !important;
          border-radius: 8px !important;
          padding: 10px 14px !important;
          font-size: 15px !important;
          width: 100% !important;
          box-sizing: border-box !important;
          transition: all 0.2s ease !important;
        }

        #BiginWebToRecordFormParent4513682000006075056 .wf-field-input:focus {
          border-color: #D86C24 !important; /* ambre-signature */
          background-color: rgba(251, 244, 228, 0.08) !important;
          outline: none !important;
          box-shadow: 0 0 0 2px rgba(216, 108, 36, 0.2) !important;
        }

        /* Bouton Soumettre */
        #BiginWebToRecordFormParent4513682000006075056 .wf-btn {
          background-color: #D86C24 !important; /* ambre-signature */
          color: #fff !important;
          border: 1px solid #D86C24 !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          padding: 12px 24px !important;
          font-size: 16px !important;
          cursor: pointer !important;
          width: 100% !important;
          transition: all 0.2s ease !important;
          margin-top: 15px !important;
        }

        #BiginWebToRecordFormParent4513682000006075056 .wf-btn:hover {
          background-color: #F09C3C !important; /* ambre-lumineux */
          border-color: #F09C3C !important;
          box-shadow: 0 4px 12px rgba(240, 156, 60, 0.2) !important;
        }

        /* Ajustements pour les messages d'aide et d'erreur */
        #BiginWebToRecordFormParent4513682000006075056 .wf-field-help-text {
          color: rgba(251, 244, 228, 0.4) !important;
          font-size: 11px !important;
          margin-top: 4px !important;
        }

        #BiginWebToRecordFormParent4513682000006075056 .wf-field-error {
          color: #FF5050 !important;
          font-size: 12px !important;
          margin-top: 4px !important;
        }

        /* Logo du formulaire Zoho */
        #BiginWebToRecordFormParent4513682000006075056 .wf-logo {
          margin-bottom: 15px !important;
          max-height: 50px !important;
        }
        #BiginWebToRecordFormParent4513682000006075056 .wf-logo img {
          max-height: 50px !important;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3)) !important;
        }

        /* Espacements globaux */
        #BiginWebToRecordFormParent4513682000006075056 .wf-row {
          margin-bottom: 16px !important;
        }
        #BiginWebToRecordFormParent4513682000006075056 .wf-form-component {
          padding: 24px !important;
        }
        #BiginWebToRecordFormParent4513682000006075056 .wform-btn-wrap {
          margin-top: 24px !important;
        }
      `}</style>
    </>
  );
}
