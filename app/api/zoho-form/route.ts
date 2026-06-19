import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://us.bigin.online/org714565689/forms/bienvenue-dans-votre-cloud");
    let html = await res.text();

    // On injecte un script qui écoute la soumission du formulaire
    // et envoie un message au parent (notre site) pour lui dire que c'est fait.
    const scriptToInject = `
      <script>
        document.addEventListener('submit', function() {
          // On prévient le site parent que le formulaire a été soumis
          window.parent.postMessage('form_submitted', '*');
        });
      </script>
    `;

    if (html.includes('</body>')) {
      html = html.replace('</body>', scriptToInject + '</body>');
    } else {
      html += scriptToInject;
    }

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Erreur proxy Zoho Form:", error);
    return new NextResponse("Erreur lors du chargement du formulaire.", { status: 500 });
  }
}
