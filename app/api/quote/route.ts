import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { upsertBiginContact } from "@/lib/zohoBigin";
import { formatPriceFCFA } from "@/lib/pricing";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contact, items, summary } = body;

    const { prenom, nom, entreprise, email, tel, message } = contact || {};
    const fullName = `${prenom || ""} ${nom || ""}`.trim() || "Client Pro";

    if (!email) {
      return NextResponse.json(
        { error: "L'adresse e-mail est obligatoire pour transmettre le devis." },
        { status: 400 }
      );
    }

    // 1. Synchronisation automatique vers Zoho Bigin CRM
    try {
      const itemsSummaryText = (items || [])
        .map((item: any, idx: number) => {
          const cfg = item.config || {};
          return `Machine #${idx + 1} : ${item.name}
- Quantité : ${cfg.instanceCount || 1}
- OS : ${cfg.os || "Non spécifié"}
- CPU : ${cfg.vcpu || 2} vCPU | RAM : ${cfg.ram || 4} Go
- Stockage : Système 100 Go + Données ${cfg.dataDisk || 0} Go (${cfg.storageType || "standard"})
- Bande Passante : ${cfg.bandwidth || 1} Mbps
- Engagement : ${cfg.duration || 3} Mois
- Montant mensuel : ${formatPriceFCFA(cfg.monthlyPrice || 0, false)}`;
        })
        .join("\n\n");

      const crmMessage = `Demande de Devis Officiel AMBRA Cloud

Informations client :
• Contact : ${fullName}
• Entreprise : ${entreprise || "Non renseignée"}
• Email : ${email}
• Téléphone : ${tel || "Non renseigné"}
• Remarques / Besoins : ${message || "Aucun"}

Détail des ressources chiffrées :
${itemsSummaryText}

Synthèse financière :
• Total Mensuel HT : ${formatPriceFCFA(summary?.monthlyTotal || 0, false)}
• Montant Trimestriel (x3) : ${formatPriceFCFA(summary?.quarterlyTotal || 0, false)}
• Montant Annuel (x12) : ${formatPriceFCFA(summary?.annualTotal || 0, false)}`;

      await upsertBiginContact({
        name: fullName,
        email,
        phone: tel,
        company: entreprise,
        subject: `[Devis AMBRA Cloud] ${entreprise || fullName} - ${formatPriceFCFA(summary?.monthlyTotal || 0, false)}/mois`,
        message: crmMessage,
      });
    } catch (crmErr) {
      console.error("[Devis API] Erreur lors de la synchronisation Zoho Bigin CRM:", crmErr);
    }

    // 2. Configuration SMTP pour l'envoi de l'e-mail
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const receiverEmail = process.env.EMAIL_NOTIFICATION_TO || "contact@ambracloud.net";

    // Si les identifiants SMTP ne sont pas encore renseignés dans .env.local
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.log("=== NOUVELLE DEMANDE DE DEVIS ENREGISTRÉE ===");
      console.log({
        client: { fullName, entreprise, email, tel, message },
        itemsCount: items?.length || 0,
        monthlyTotal: summary?.monthlyTotal,
        date: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        sent: false,
        message: "Devis enregistré et synchronisé au CRM. (SMTP en attente de mot de passe dans .env.local).",
      });
    }

    // 3. Envoi effectif de l'e-mail avec nodemailer
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const quoteRowsHtml = (items || [])
      .map((item: any, idx: number) => {
        const cfg = item.config || {};
        return `
          <tr style="border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 12px; font-weight: bold; color: #1E293B;">
              ${item.name}
              <div style="font-size: 11px; font-weight: normal; color: #64748B;">
                ${cfg.designation ? `&laquo; ${cfg.designation} &raquo; &bull; ` : ""}${cfg.instanceCount > 1 ? `Cluster de ${cfg.instanceCount} machines &bull; ` : ""}OS: ${cfg.os || "Linux"}
              </div>
            </td>
            <td style="padding: 12px; font-size: 12px; color: #475569;">
              ${cfg.vcpu || 2} vCPU &bull; ${cfg.ram || 4} Go RAM<br/>
              Disque 1 Système (OS): ${cfg.systemDisk || 100} Go (${cfg.systemDiskType === "advanced" ? "NVMe" : "Standard"})<br/>
              Disque 2 Données: ${cfg.dataDisk ? `${cfg.dataDisk} Go (${cfg.dataDiskType === "advanced" ? "NVMe" : "Standard"})` : "Aucun (0 Go)"}<br/>
              Bande passante: ${cfg.bandwidth || 1} Mbps Dédié
            </td>
            <td style="padding: 12px; font-size: 12px; text-align: center; color: #475569;">
              ${cfg.duration || 3} Mois
            </td>
            <td style="padding: 12px; font-weight: bold; color: #990000; text-align: right;">
              ${formatPriceFCFA(cfg.monthlyPrice || 0, false)}
            </td>
          </tr>
        `;
      })
      .join("");

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #1E293B; max-width: 680px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #ffffff;">
        <div style="background-color: #0F172A; padding: 20px; border-radius: 8px; color: #ffffff; margin-bottom: 24px;">
          <h2 style="margin: 0; font-size: 18px; color: #D86C24;">AMBRA CLOUD &bull; Devis d'Infrastructure Officiel</h2>
          <p style="margin: 4px 0 0; font-size: 12px; color: #94A3B8;">Devis généré le ${new Date().toLocaleDateString("fr-FR")} pour ${entreprise || fullName}</p>
        </div>

        <h3 style="font-size: 14px; text-transform: uppercase; color: #0F172A; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px;">Coordonnées du demandeur</h3>
        <table style="width: 100%; font-size: 13px; margin-bottom: 20px;">
          <tr><td style="padding: 4px 0; width: 140px; font-weight: bold;">Nom complet :</td><td>${fullName}</td></tr>
          <tr><td style="padding: 4px 0; font-weight: bold;">Entreprise :</td><td>${entreprise || "Non renseignée"}</td></tr>
          <tr><td style="padding: 4px 0; font-weight: bold;">Email :</td><td><a href="mailto:${email}" style="color: #990000;">${email}</a></td></tr>
          <tr><td style="padding: 4px 0; font-weight: bold;">Téléphone :</td><td>${tel || "Non renseigné"}</td></tr>
          ${message ? `<tr><td style="padding: 4px 0; font-weight: bold;">Remarques :</td><td style="font-style: italic;">${message}</td></tr>` : ""}
        </table>

        <h3 style="font-size: 14px; text-transform: uppercase; color: #0F172A; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px;">Ressources &amp; Services Chiffrés</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #F8FAFC; text-align: left; font-size: 11px; text-transform: uppercase; color: #64748B;">
              <th style="padding: 8px 12px;">Service / Machine</th>
              <th style="padding: 8px 12px;">Dimensionnement</th>
              <th style="padding: 8px 12px; text-align: center;">Engagement</th>
              <th style="padding: 8px 12px; text-align: right;">Mensuel HT</th>
            </tr>
          </thead>
          <tbody>
            ${quoteRowsHtml}
          </tbody>
        </table>

        <div style="background-color: #F8FAFC; padding: 16px; border-radius: 8px; border: 1px solid #E2E8F0; text-align: right; margin-bottom: 20px;">
          <div style="font-size: 16px; font-weight: bold; color: #0F172A;">
            Total Mensuel HT : <span style="color: #990000; font-size: 18px;">${formatPriceFCFA(summary?.monthlyTotal || 0, false)}</span>
          </div>
          <div style="font-size: 12px; color: #64748B; margin-top: 4px;">
            Montant Trimestriel (x3) : <strong>${formatPriceFCFA(summary?.quarterlyTotal || 0, false)}</strong> &bull; 
            Montant Annuel (x12) : <strong>${formatPriceFCFA(summary?.annualTotal || 0, false)}</strong>
          </div>
        </div>

        <p style="font-size: 11px; color: #94A3B8; text-align: center; margin: 0;">
          Ce devis a été transmis automatiquement aux architectes AMBRA Cloud. Nos ingénieurs vous recontactent sous 24h ouvrées.
        </p>
      </div>
    `;

    // Envoi au client et en copie à l'équipe commerciale AMBRA
    await transporter.sendMail({
      from: `"AMBRA Cloud" <${smtpUser}>`,
      to: [email, receiverEmail],
      replyTo: email,
      subject: `[Devis AMBRA Cloud] Votre estimation d'infrastructure (${formatPriceFCFA(summary?.monthlyTotal || 0, false)}/mois)`,
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      sent: true,
      message: "Devis transmis avec succès par e-mail et synchronisé au CRM !",
    });
  } catch (error: any) {
    console.error("[Devis API] Erreur lors de l'envoi du devis :", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la transmission du devis. Veuillez réessayer." },
      { status: 500 }
    );
  }
}

