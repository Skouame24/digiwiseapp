import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Les champs Nom, Email et Message sont obligatoires." },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpSecure = process.env.SMTP_SECURE === "true";
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "infos@ambracloud.net";

    // Si les identifiants SMTP ne sont pas configurés
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.log("=== NOUVEAU MESSAGE DE CONTACT (SMTP non configuré dans .env) ===");
      console.log({ name, email, company, phone, subject, message, date: new Date().toISOString() });
      
      // On retourne un statut success avec une indication
      return NextResponse.json({
        success: true,
        message: "Message bien reçu (mode démo - veuillez configurer vos variables SMTP dans .env.local).",
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure, // true pour le port 465, false pour les autres ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: `"${name}" <${smtpUser}>`,
      replyTo: email,
      to: receiverEmail,
      subject: `[Formulaire Contact Website] ${subject || "Nouvelle demande de contact"} - ${name}`,
      text: `
Nouveau message depuis le formulaire de contact AMBRA Cloud:

• Nom complet: ${name}
• Email: ${email}
• Entreprise: ${company || "Non renseignée"}
• Téléphone: ${phone || "Non renseigné"}
• Sujet: ${subject || "Non spécifié"}

Message:
${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; color: #1E293B; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E2E8F0; border-radius: 8px;">
          <h2 style="color: #990000; margin-top: 0;">Nouveau message de contact</h2>
          <p>Vous avez reçu une nouvelle demande d'information depuis le site AMBRA Cloud.</p>
          <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
          <table style="width: 100%; text-align: left; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; font-weight: bold; width: 140px;">Nom complet :</td><td>${name}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Email :</td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Entreprise :</td><td>${company || "Non renseignée"}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Téléphone :</td><td>${phone || "Non renseigné"}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Sujet :</td><td>${subject || "Non spécifié"}</td></tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
          <h3 style="margin-bottom: 8px;">Message :</h3>
          <div style="background-color: #F8FAFC; padding: 14px; border-radius: 6px; white-space: pre-line;">
            ${message}
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "E-mail envoyé avec succès !",
    });
  } catch (error: any) {
    console.error("Erreur lors de l'envoi de l'e-mail:", error);
    return NextResponse.json(
      { error: "Impossible d'envoyer l'e-mail pour le moment. Veuillez réessayer ultérieurement." },
      { status: 500 }
    );
  }
}
