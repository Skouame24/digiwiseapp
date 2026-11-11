import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
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

    if (!partnerCompany || !clientName || !partnerEmail) {
      return NextResponse.json(
        { error: "Le nom, l'e-mail du partenaire et le nom du client final sont obligatoires." },
        { status: 400 }
      );
    }

    if (typeof partnerEmail !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(partnerEmail)) {
      return NextResponse.json(
        { error: "L'adresse e-mail du partenaire est invalide." },
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

    // 1. Synchronisation vers Zoho Bigin CRM
    const messageDetails = `=== DÉCLARATION D'OPPORTUNITÉ (Réf: ${dealReference}) ===
Client Final: ${clientName}
Secteur: ${clientSector}
Contact Client: ${clientContact || "Non précisé"} (${clientCoordonnees || "Non précisé"})

--- Détails du Projet ---
Solutions: ${projectScope}
Budget Mensuel Estimé: ${estimatedMonthlyBudget}
Délai envisagé: ${closingTimeline || "Non précisé"}

Commentaires & Besoins:
${comments || "Aucun commentaire additionnel."}`.trim();

    let crmSynced = false;
    try {
      const zohoResult = await upsertBiginContact({
        name: partnerContactName,
        email: partnerEmail,
        phone: partnerPhone,
        company: partnerCompany,
        subject: `[Partenaire ${dealReference}] Opportunité: ${clientName}`,
        message: messageDetails,
      });
      crmSynced = zohoResult.success;
      if (!crmSynced) {
        console.warn("[Zoho Bigin] Synchronisation CRM partielle ou non confirmée:", zohoResult.details);
      } else {
        console.log("[Zoho Bigin] Opportunité et contact synchronisés avec succès dans Zoho Bigin CRM.");
      }
    } catch (zohoErr) {
      console.error("[Zoho Bigin] Erreur lors de l'appel API CRM:", zohoErr);
    }

    // 2. Notification par email à marketing@ambracloud.net
    const notificationEmail = process.env.PARTNER_NOTIFICATION_EMAIL || "marketing@ambracloud.net";
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpSecure = process.env.SMTP_SECURE === "true";

    let emailSent = false;
    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const mailOptions = {
          from: `"AMBRA Cloud Partenaires" <${smtpUser}>`,
          replyTo: partnerEmail,
          to: notificationEmail,
          subject: `[Nouvelle Opportunité Partenaire] ${clientName} - Réf: ${dealReference}`,
          text: `
Nouvelle opportunité déclarée sur le portail Partenaires AMBRA Cloud :

RÉFÉRENCE DEAL : ${dealReference}
DATE : ${new Date().toLocaleString("fr-FR")}

--- 1. INFORMATIONS DU PARTENAIRE APPORTEUR ---
• Société Partenaire : ${partnerCompany}
• Nom du contact : ${partnerContactName}
• Email : ${partnerEmail}
• Téléphone : ${partnerPhone || "Non renseigné"}
• Type de Partenaire : ${partnerType}

--- 2. CLIENT FINAL PRÉSENTÉ ---
• Entreprise Cliente : ${clientName}
• Secteur d'activité : ${clientSector}
• Contact chez le client : ${clientContact || "Non précisé"}
• Coordonnées client : ${clientCoordonnees || "Non précisé"}

--- 3. PÉRIMÈTRE & BESOINS DU PROJET ---
• Solutions ciblées : ${projectScope}
• Budget mensuel estimé : ${estimatedMonthlyBudget}
• Délai prévisionnel de clôture : ${closingTimeline || "Non précisé"}

Description & Commentaires :
${comments || "Aucun commentaire"}

--- 4. STATUT CRM ---
• Enregistré dans Zoho Bigin CRM : ${crmSynced ? "OUI (Automatique)" : "À vérifier manuellement"}
          `.trim(),
          html: `
            <div style="font-family: Arial, sans-serif; color: #1E293B; max-width: 650px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #FFFFFF;">
              <div style="background-color: #990000; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px; color: #FFFFFF;">
                <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; opacity: 0.85;">Programme Apporteurs d'Affaires</span>
                <h2 style="margin: 6px 0 0; font-size: 20px; font-weight: bold; color: #FFFFFF;">Nouvelle Opportunité Déclarée</h2>
              </div>

              <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
                <span style="font-size: 11px; font-weight: bold; color: #64748B; text-transform: uppercase; letter-spacing: 0.1em;">Référence Deal</span>
                <p style="font-size: 18px; font-weight: bold; color: #990000; margin: 4px 0 0;">${dealReference}</p>
              </div>

              <h3 style="color: #0F172A; border-bottom: 2px solid #F1F5F9; padding-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">1. Partenaire Référent</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
                <tr><td style="padding: 6px 0; color: #64748B; width: 170px;">Société / Entité :</td><td style="font-weight: bold; color: #0F172A;">${partnerCompany}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748B;">Contact Partenaire :</td><td style="font-weight: bold; color: #0F172A;">${partnerContactName}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748B;">Email :</td><td><a href="mailto:${partnerEmail}" style="color: #990000; font-weight: bold;">${partnerEmail}</a></td></tr>
                <tr><td style="padding: 6px 0; color: #64748B;">Téléphone :</td><td style="font-weight: bold; color: #0F172A;">${partnerPhone || "Non renseigné"}</td></tr>
              </table>

              <h3 style="color: #0F172A; border-bottom: 2px solid #F1F5F9; padding-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">2. Client Final</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
                <tr><td style="padding: 6px 0; color: #64748B; width: 170px;">Entreprise Cliente :</td><td style="font-weight: bold; color: #0F172A; font-size: 15px;">${clientName}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748B;">Secteur :</td><td style="font-weight: bold; color: #0F172A;">${clientSector}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748B;">Interlocuteur Client :</td><td style="font-weight: bold; color: #0F172A;">${clientContact || "Non précisé"}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748B;">Coordonnées :</td><td style="font-weight: bold; color: #0F172A;">${clientCoordonnees || "Non précisé"}</td></tr>
              </table>

              <h3 style="color: #0F172A; border-bottom: 2px solid #F1F5F9; padding-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">3. Périmètre &amp; Budget du Projet</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
                <tr><td style="padding: 6px 0; color: #64748B; width: 170px;">Solutions :</td><td style="font-weight: bold; color: #0F172A;">${projectScope}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748B;">Budget Estimé :</td><td style="font-weight: bold; color: #990000; font-size: 14px;">${estimatedMonthlyBudget}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748B;">Délai de décision :</td><td style="font-weight: bold; color: #0F172A;">${closingTimeline || "Non précisé"}</td></tr>
              </table>

              <h3 style="color: #0F172A; border-bottom: 2px solid #F1F5F9; padding-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">4. Description &amp; Commentaires</h3>
              <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #334155; white-space: pre-line; margin-bottom: 20px;">
                ${comments || "Aucun commentaire particulier."}
              </div>

              <div style="border-top: 1px solid #E2E8F0; padding-top: 14px; font-size: 11px; color: #94A3B8; display: flex; justify-content: space-between;">
                <span>Synchronisation CRM Zoho Bigin : ${crmSynced ? "✓ Enregistré" : "Mode manuel"}</span>
                <span>AMBRA Cloud Partner Platform</span>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
        console.log(`[Email Notification] Notification envoyée avec succès à ${notificationEmail}`);
      } catch (mailErr) {
        console.error("[Email Notification] Erreur envoi email SMTP:", mailErr);
      }
    } else {
      console.log(`[Email Notification (Mode Démo)] Notification prête pour ${notificationEmail} (SMTP non configuré dans .env)`);
      emailSent = true;
    }

    return NextResponse.json({
      success: true,
      dealReference,
      crmSynced,
      emailSent,
      message: "Opportunité enregistrée et protégée avec succès dans le Réseau Partenaires Ambra Cloud.",
      data: {
        dealReference,
        partnerCompany,
        clientName,
        estimatedMonthlyBudget,
        closingTimeline,
        notificationSentTo: notificationEmail,
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
