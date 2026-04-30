/**
 * Client API Zoho Books - Structure ready
 * Remplacer les valeurs mock par vos vraies credentials Zoho.
 */

const ZOHO_API_BASE = "https://books.zoho.com/api/v3";

interface ZohoContact {
  contact_id: string;
  contact_name: string;
  email: string;
}

interface ZohoEstimate {
  estimate_id: string;
  customer_name: string;
  total: number;
  status: string;
}

/**
 * Récupère un contact Zoho Books par son email.
 * MOCK : retourne un contact fictif.
 */
export async function getContactByEmail(email: string): Promise<ZohoContact | null> {
  console.log("[Zoho] Recherche contact :", email);
  // TODO: Implémenter l'appel réel à l'API Zoho
  return {
    contact_id: "mock-contact-id",
    contact_name: "Contact Test",
    email,
  };
}

/**
 * Crée un nouveau devis (estimate) dans Zoho Books.
 * MOCK : retourne un devis fictif.
 */
export async function createEstimate(data: {
  customerName: string;
  email: string;
  items: Array<{ name: string; rate: number; quantity: number }>;
}): Promise<ZohoEstimate> {
  console.log("[Zoho] Création devis pour :", data.customerName);
  // TODO: Implémenter l'appel réel à l'API Zoho
  return {
    estimate_id: `EST-${Date.now()}`,
    customer_name: data.customerName,
    total: data.items.reduce((sum, item) => sum + item.rate * item.quantity, 0),
    status: "draft",
  };
}

/**
 * Crée un nouveau contact dans Zoho Books.
 * MOCK : retourne un contact fictif.
 */
export async function createContact(data: {
  contactName: string;
  email: string;
  companyName?: string;
}): Promise<ZohoContact> {
  console.log("[Zoho] Création contact :", data.contactName);
  // TODO: Implémenter l'appel réel à l'API Zoho
  return {
    contact_id: `CNT-${Date.now()}`,
    contact_name: data.contactName,
    email: data.email,
  };
}

export type { ZohoContact, ZohoEstimate };
