import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const echapperHtml = (valeur = "") =>
  String(valeur)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const attendreImages = async (documentImpression) => {
  const images = Array.from(documentImpression.images || []);
  await Promise.all(
    images.map((image) => {
      if (image.complete) return Promise.resolve();
      return new Promise((resolve) => {
        image.onload = resolve;
        image.onerror = resolve;
      });
    })
  );
};

const attendreDocument = (fenetre) =>
  new Promise((resolve) => {
    if (fenetre.document.readyState === "complete") {
      resolve();
      return;
    }
    fenetre.addEventListener("load", resolve, { once: true });
    setTimeout(resolve, 1500);
  });

const stylesDeLaPage = () =>
  Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((element) => element.outerHTML)
    .join("\n");

export const imprimerDocument = async (
  zone,
  {
    titre = "Document",
    orientation = "portrait",
    format = "A4",
    marge = "10mm",
    classeDocument = "",
  } = {}
) => {
  if (!zone) {
    window.alert("Le document à imprimer n'est pas encore disponible.");
    return false;
  }

  const fenetre = window.open("", "_blank", "width=1000,height=800");
  if (!fenetre) {
    window.alert(
      "La fenêtre d'impression a été bloquée. Autorisez les fenêtres contextuelles puis réessayez."
    );
    return false;
  }

  const titreSecurise = echapperHtml(titre);
  const classeSecurisee = echapperHtml(classeDocument);
  fenetre.document.open();
  fenetre.document.write(`<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <base href="${echapperHtml(document.baseURI)}" />
  <title>${titreSecurise}</title>
  ${stylesDeLaPage()}
  <style>
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body { margin: 0; padding: 0; background: #fff; }
    body { padding: ${marge}; }
    .document-impression {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
      visibility: visible !important;
    }
    .document-impression,
    .document-impression * { visibility: visible !important; }
    .hide-on-print,
    .no-print,
    button { display: none !important; }
    @page { size: ${format} ${orientation}; margin: ${marge}; }
    @media print {
      body { padding: 0; }
      .document-impression {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <main class="document-impression ${classeSecurisee}">
    ${zone.outerHTML}
  </main>
</body>
</html>`);
  fenetre.document.close();

  try {
    await attendreDocument(fenetre);
    await fenetre.document.fonts?.ready;
    await attendreImages(fenetre.document);
    fenetre.focus();
    fenetre.addEventListener("afterprint", () => fenetre.close(), {
      once: true,
    });
    fenetre.print();
    return true;
  } catch {
    fenetre.close();
    window.alert(
      "L'impression n'a pas pu être préparée. Rechargez la page puis réessayez."
    );
    return false;
  }
};

export const imprimerRecuPaiement = (zone, numero) =>
  imprimerDocument(zone, {
    titre: numero ? `Reçu de paiement ${numero}` : "Reçu de paiement",
    orientation: "portrait",
    format: "A4",
    marge: "12mm",
    classeDocument: "document-recu-paiement",
  });

export const imprimerListeFinanciere = (zone, titre = "Liste financière") =>
  imprimerDocument(zone, {
    titre,
    orientation: "landscape",
    format: "A4",
    marge: "8mm",
    classeDocument: "document-liste-financiere",
  });

export const telechargerDocumentPdf = async (
  zone,
  {
    nomFichier = "document.pdf",
    orientation = "portrait",
    format = "a4",
    marge = 10,
  } = {}
) => {
  if (!zone) {
    window.alert("Le document à télécharger n'est pas encore disponible.");
    return false;
  }

  try {
    await document.fonts?.ready;
    const toile = await html2canvas(zone, {
      backgroundColor: "#ffffff",
      scale: Math.min(3, Math.max(2, window.devicePixelRatio || 2)),
      useCORS: true,
      allowTaint: false,
      logging: false,
    });
    const pdf = new jsPDF(orientation, "mm", format);
    const largeurPage = pdf.internal.pageSize.getWidth();
    const hauteurPage = pdf.internal.pageSize.getHeight();
    const largeurMax = largeurPage - marge * 2;
    const hauteurMax = hauteurPage - marge * 2;
    const ratio = Math.min(
      largeurMax / toile.width,
      hauteurMax / toile.height
    );
    const largeur = toile.width * ratio;
    const hauteur = toile.height * ratio;
    const gauche = (largeurPage - largeur) / 2;
    const haut = (hauteurPage - hauteur) / 2;

    pdf.addImage(
      toile.toDataURL("image/png"),
      "PNG",
      gauche,
      haut,
      largeur,
      hauteur
    );
    pdf.save(nomFichier.endsWith(".pdf") ? nomFichier : `${nomFichier}.pdf`);
    return true;
  } catch {
    window.alert(
      "Le téléchargement PDF a échoué. Vous pouvez utiliser le bouton Imprimer."
    );
    return false;
  }
};
