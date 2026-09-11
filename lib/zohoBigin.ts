/**
 * Service d'intégration Zoho Bigin CRM
 * 
 * Permet de synchroniser automatiquement les leads et contacts issus du
 * formulaire de contact du site AMBRA Cloud vers Zoho Bigin CRM via API REST OAuth 2.0.
 */

interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
}

interface CachedToken {
  token: string;
  expiresAt: number;
}

let cachedToken: CachedToken | null = null;

/**
 * Récupère un Access Token Zoho valide en utilisant le Refresh Token.
 * Utilise un cache mémoire temporaire pour limiter le nombre d'appels à l'API OAuth.
 */
export async function getZohoAccessToken(): Promise<string | null> {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  const accountsUrl = process.env.ZOHO_ACCOUNTS_URL || "https://accounts.zoho.com";

  if (!clientId || !clientSecret || !refreshToken) {
    console.log("[Zoho Bigin] Identifiants OAuth 2.0 non configurés dans l'environnement (ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN). Mode démo.");
    return null;
  }

  // Vérification du cache de jeton (marge de sécurité de 60 secondes)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) {
    return cachedToken.token;
  }

  try {
    const params = new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    });

    const response = await fetch(`${accountsUrl}/oauth/v2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Zoho Bigin] Échec de rafraîchissement du jeton OAuth:", response.status, errorText);
      return null;
    }

    const data = await response.json();

    if (data.error) {
      console.error("[Zoho Bigin] Erreur lors de l'obtention du token OAuth:", data.error);
      return null;
    }

    const expiresInMs = (data.expires_in || 3600) * 1000;
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + expiresInMs,
    };

    return cachedToken.token;
  } catch (error) {
    console.error("[Zoho Bigin] Erreur de connexion au serveur OAuth Zoho:", error);
    return null;
  }
}

/**
 * Crée ou met à jour (Upsert) un contact dans Zoho Bigin CRM en fonction de son adresse e-mail.
 */
export async function upsertBiginContact(data: ContactSubmission): Promise<{ success: boolean; id?: string; details?: any }> {
  try {
    const accessToken = await getZohoAccessToken();

    if (!accessToken) {
      console.log("[Zoho Bigin] Synchronisation CRM ignorée (OAuth non configuré ou échec du token).");
      return { success: false, details: "OAuth non configuré" };
    }

    const apiUrl = process.env.ZOHO_BIGIN_API_URL || "https://www.zohoapis.com/bigin/v2";

    // Séparation prénom / nom
    const nameParts = data.name.trim().split(" ");
    const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : "";
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : data.name;

    const contactPayload = {
      data: [
        {
          First_Name: firstName,
          Last_Name: lastName,
          Email: data.email,
          Phone: data.phone || "",
          Company: data.company || "",
          Description: `[Formulaire Web AMBRA Cloud]\nSujet: ${data.subject || "Demande d'information"}\nEntreprise: ${data.company || "Non spécifiée"}\n\nMessage:\n${data.message}`,
          Lead_Source: "Site Web AMBRA Cloud",
        },
      ],
      duplicate_check_fields: ["Email"],
    };

    const response = await fetch(`${apiUrl}/Contacts/upsert`, {
      method: "POST",
      headers: {
        "Authorization": `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactPayload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("[Zoho Bigin] Erreur lors de l'Upsert du contact:", response.status, JSON.stringify(result));
      return { success: false, details: result };
    }

    const firstResult = result.data?.[0];
    if (firstResult && (firstResult.status === "success" || firstResult.code === "SUCCESS")) {
      console.log(`[Zoho Bigin] Contact synchronisé avec succès. ID: ${firstResult.details?.id || "Existant"}`);
      return {
        success: true,
        id: firstResult.details?.id,
        details: firstResult,
      };
    } else {
      console.warn("[Zoho Bigin] Réponse inattendue lors de l'Upsert:", JSON.stringify(result));
      return { success: false, details: result };
    }
  } catch (error) {
    console.error("[Zoho Bigin] Erreur inattendue lors de l'appel API Bigin:", error);
    return { success: false, details: error };
  }
}
