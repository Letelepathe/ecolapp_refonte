import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const echapperHtml = (valeur = "") =>
  String(valeur)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const attendreImages = async (conteneur) => {
  const images = Array.from(
    conteneur.images || conteneur.querySelectorAll?.("img") || []
  );
  await Promise.all(
    images.map((image) => {
      if (image.complete) return Promise.resolve();
      return new Promise((resolve) => {
        image.onload = resolve;
        image.onerror = resolve;
        setTimeout(resolve, 5000);
      });
    })
  );
};

const attendreMiseEnPage = (fenetre) =>
  new Promise((resolve) => {
    fenetre.requestAnimationFrame(() => {
      fenetre.requestAnimationFrame(() => setTimeout(resolve, 100));
    });
  });

const attendreDocument = (fenetre) =>
  new Promise((resolve) => {
    if (fenetre.document.readyState === "complete") {
      resolve();
      return;
    }
    fenetre.addEventListener("load", resolve, { once: true });
    setTimeout(resolve, 1500);
  });

const dimensionsPage = (format, orientation) => {
  if (Array.isArray(format) && format.length === 2) {
    const dimensions = format.map(Number);
    return orientation === "landscape" ? [...dimensions].reverse() : dimensions;
  }
  const formats = {
    A4: [210, 297],
    A5: [148, 210],
    A6: [105, 148],
    LETTER: [216, 279],
  };
  const dimensions = formats[String(format).toUpperCase()] || formats.A4;
  return orientation === "landscape" ? [...dimensions].reverse() : dimensions;
};

const margeEnMillimetres = (marge) => {
  const valeur = Number.parseFloat(String(marge));
  return Number.isFinite(valeur) ? valeur : 10;
};

const capturerPages = async (zone, { format, orientation, marge }) => {
  await document.fonts?.ready;
  await attendreImages(zone);

  const toile = await html2canvas(zone, {
    backgroundColor: "#ffffff",
    scale: Math.min(2.5, Math.max(2, window.devicePixelRatio || 2)),
    useCORS: true,
    allowTaint: false,
    logging: false,
  });
  const [largeurPage, hauteurPage] = dimensionsPage(format, orientation);
  const margeMm = margeEnMillimetres(marge);
  const largeurUtile = Math.max(1, largeurPage - margeMm * 2);
  const hauteurUtile = Math.max(1, hauteurPage - margeMm * 2);
  const hauteurSegment = Math.max(
    1,
    Math.floor(toile.width * (hauteurUtile / largeurUtile)),
  );
  const pages = [];

  for (let haut = 0; haut < toile.height; haut += hauteurSegment) {
    const hauteur = Math.min(hauteurSegment, toile.height - haut);
    const page = document.createElement("canvas");
    page.width = toile.width;
    page.height = hauteur;
    const contexte = page.getContext("2d");
    contexte.fillStyle = "#ffffff";
    contexte.fillRect(0, 0, page.width, page.height);
    contexte.drawImage(
      toile,
      0,
      haut,
      toile.width,
      hauteur,
      0,
      0,
      toile.width,
      hauteur,
    );
    pages.push(page.toDataURL("image/png"));
  }

  return pages;
};

export const imprimerDocument = async (
  zone,
  {
    titre = "Document",
    orientation = "portrait",
    format = "A4",
    marge = "10mm",
    classeDocument = "",
    taillePage = null,
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

  try {
    const pages = await capturerPages(zone, { format, orientation, marge });
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
  <style>
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body { margin: 0; padding: 0; background: #fff; }
    .document-impression {
      width: 100%;
      margin: 0 auto;
    }
    .page-impression {
      width: 100%;
      break-after: page;
      page-break-after: always;
    }
    .page-impression:last-child {
      break-after: auto;
      page-break-after: auto;
    }
    .page-impression img { display: block; width: 100%; height: auto; }
    @page { size: ${taillePage || (Array.isArray(format) ? `${format[0]}mm ${format[1]}mm` : `${format} ${orientation}`)}; margin: ${marge}; }
  </style>
</head>
<body>
  <main class="document-impression ${classeSecurisee}">
    ${pages
      .map(
        (page, index) =>
          `<section class="page-impression"><img src="${page}" alt="Page ${index + 1} du document" /></section>`,
      )
      .join("")}
  </main>
</body>
</html>`);
    fenetre.document.close();
    await attendreDocument(fenetre);
    await attendreImages(fenetre.document);
    await attendreMiseEnPage(fenetre);
    fenetre.focus();
    fenetre.addEventListener("afterprint", () => fenetre.close(), {
      once: true,
    });
    fenetre.print();
    return true;
  } catch (erreur) {
    console.error("Préparation de l'impression impossible", erreur);
    fenetre.close();
    window.alert(
      "L'impression n'a pas pu être préparée. Rechargez la page puis réessayez."
    );
    return false;
  }
};

export const imprimerRecuPaiement = (zone, numero, profil = {}) =>
  imprimerDocument(zone, {
    titre: numero ? `Reçu de paiement ${numero}` : "Reçu de paiement",
    orientation: "portrait",
    format: profil.formatPdf || "A4",
    taillePage: profil.tailleCss || "A4",
    marge: `${profil.margeMm ?? 12}mm`,
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
    pagination = false,
    centrerVerticalement = true,
  } = {}
) => {
  if (!zone) {
    window.alert("Le document à télécharger n'est pas encore disponible.");
    return false;
  }

  try {
    await document.fonts?.ready;
    await attendreImages(zone);
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
    const ratio = pagination
      ? largeurMax / toile.width
      : Math.min(largeurMax / toile.width, hauteurMax / toile.height);
    const largeur = toile.width * ratio;
    const hauteur = toile.height * ratio;
    const gauche = (largeurPage - largeur) / 2;
    const image = toile.toDataURL("image/png");

    if (pagination && hauteur > hauteurMax) {
      const nombrePages = Math.ceil(hauteur / hauteurMax);

      for (let page = 0; page < nombrePages; page += 1) {
        if (page > 0) pdf.addPage();
        pdf.addImage(
          image,
          "PNG",
          gauche,
          marge - page * hauteurMax,
          largeur,
          hauteur
        );
      }
    } else {
      const haut = centrerVerticalement ? (hauteurPage - hauteur) / 2 : marge;
      pdf.addImage(image, "PNG", gauche, haut, largeur, hauteur);
    }
    pdf.save(nomFichier.endsWith(".pdf") ? nomFichier : `${nomFichier}.pdf`);
    return true;
  } catch {
    window.alert(
      "Le téléchargement PDF a échoué. Vous pouvez utiliser le bouton Imprimer."
    );
    return false;
  }
};
