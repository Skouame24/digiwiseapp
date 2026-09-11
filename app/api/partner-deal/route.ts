import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      partnerCompany,
      partnerContactName,
      partnerEmail,
      partnerPhone,
      partnerType,
      clientName,
      clientSector,
      clientContact,
      projectScope,
      estimatedMonthlyBudget,
      closingTimeline,
      preSalesSupportNeeded,
      comments,
    } = body;

    if (!partnerCompany || !partnerEmail || !clientName) {
      return NextResponse.json(
        { error: "La société partenaire, l'email partenaire et le nom du client final sont obligatoires." },
        { status: 400 }
      );
    }

    const dealReference = `DEAL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    console.log("=== NOUVELLE DÉCLARATION D'OPPORTUNITÉ PARTENAIRE (ZOHO BIGIN DEAL REG) ===");
    console.log({
      dealReference,
      partner: { partnerCompany, partnerContactName, partnerEmail, partnerPhone, partnerType },
      endClient: { clientName, clientSector, clientContact },
      dealSpecs: { projectScope, estimatedMonthlyBudget, closingTimeline, preSalesSupportNeeded, comments },
      date: new Date().toISOString(),
    });

    // Simuler le délai réseau Zoho Bigin API
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({
      success: true,
      dealReference,
      message: "Opportunité enregistrée et enregistrée avec succès dans le pipeline Zoho Bigin Partenaires.",
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
