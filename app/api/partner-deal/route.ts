import { NextResponse } from "next/server";
import { upsertBiginContact } from "@/lib/zohoBigin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const partnerCompany = body.partnerCompany || body.nomPartenaire;
    const partnerEmail = body.partnerEmail || body.emailPartenaire;
    const partnerPhone = body.partnerPhone || body.telephonePartenaire;
    const partnerContactName = body.partnerContactName || body.nomContactPartenaire || partnerCompany;
    const partnerType = body.partnerType || "Apporteur d'Affaires";

    const clientName = body.clientName || body.entreprise;
    const clientSector = body.clientSector || "Non spécifié";
    const clientContact = body.clientContact || body.contact;
    const clientCoordonnees = body.clientCoordonnees || body.coordonnees;

    const projectScope = body.projectScope || body.solutions;
    const estimatedMonthlyBudget = body.estimatedMonthlyBudget || body.budgetEstime || "À évaluer";
    const closingTimeline = body.closingTimeline || body.dateCloture;
    const comments = body.comments || body.descriptionBesoin;

    if (!partnerCompany || !clientName) {
      return NextResponse.json(
        { error: "Le nom du partenaire et le nom du client final sont obligatoires." },
        { status: 400 }
      );
    }

    const dealReference = `DEAL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    console.log("=== NOUVELLE DÉCLARATION D'OPPORTUNITÉ (AMBRA CLOUD PARTNER NETWORK) ===");
    console.log({
      dealReference,
      partner: { partnerCompany, partnerContactName, partnerEmail, partnerPhone, partnerType },
      endClient: { clientName, clientSector, clientContact, clientCoordonnees },
      dealSpecs: { projectScope, estimatedMonthlyBudget, closingTimeline, comments },
      date: new Date().toISOString(),
    });

    // Traitement sécurisé
    const messageDetails = `=== DÉCLARATION D'OPPORTUNITÉ ===
Client Final: ${clientName}
Secteur: ${clientSector}
Contact Client: ${clientContact || "Non précisé"} (${clientCoordonnees || "Non précisé"})

--- Détails du Projet ---
Solutions: ${projectScope}
Budget Mensuel Estimé: ${estimatedMonthlyBudget}
Délai: ${closingTimeline}

Commentaires:
${comments}`.trim();

    // Envoi vers Zoho Bigin
    const zohoResult = await upsertBiginContact({
      name: partnerContactName,
      email: partnerEmail,
      phone: partnerPhone,
      company: partnerCompany,
      subject: `Opportunité Partenaire: ${clientName}`,
      message: messageDetails,
    });

    if (!zohoResult.success) {
      console.warn("L'opportunité a été reçue mais la synchronisation CRM Zoho a échoué.");
    }

    return NextResponse.json({
      success: true,
      dealReference,
      message: "Opportunité enregistrée et protégée avec succès dans le Réseau Partenaires Ambra Cloud.",
      data: {
        dealReference,
        partnerCompany,
        clientName,
        estimatedMonthlyBudget,
        closingTimeline,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Erreur enregistrement opportunité partenaire:", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer l'opportunité pour le moment. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
