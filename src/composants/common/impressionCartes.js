import html2canvas from "html2canvas";

const attendreImages = async (zone) => {
  const images = Array.from(zone.querySelectorAll("img"));
  await Promise.all(images.map((image) => {
    if (image.complete) return Promise.resolve();
    return new Promise((resolve) => {
      image.onload = resolve;
      image.onerror = resolve;
    });
  }));
};

const imprimerImagesCartes = (fenetre, images, titre) => {
  fenetre.document.open();
  fenetre.document.write(`<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${titre}</title>
  <style>
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { margin: 0; padding: 14px; background: #fff; font-family: Arial, sans-serif; }
    .page-cartes-capture { display: flex; flex-wrap: wrap; gap: 14px; align-items: flex-start; justify-content: center; }
    .capture-carte { width: min(100%, 270mm); break-inside: avoid; page-break-inside: avoid; margin: 0 auto 8mm; }
    .capture-carte img { display: block; width: 100%; height: auto; border: 0; }
    @page { size: A4 landscape; margin: 8mm; }
    @media print {
      body { padding: 0; }
      .page-cartes-capture { gap: 6mm; }
      .capture-carte { width: 270mm; max-width: 100%; }
    }
    @media (max-width: 820px) {
      body { padding: 8px; }
      .capture-carte { width: 100%; }
    }
  </style>
</head>
<body>
  <main class="page-cartes-capture">
    ${images.map((image) => `<article class="capture-carte"><img src="${image}" alt="Carte à imprimer" /></article>`).join("")}
  </main>
</body>
</html>`);
  fenetre.document.close();

  setTimeout(() => {
    fenetre.focus();
    fenetre.print();
  }, 450);
};

const imprimerHtmlFallback = (fenetre, zone, titre) => {
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((element) => element.outerHTML)
    .join("\n");

  fenetre.document.open();
  fenetre.document.write(`<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${titre}</title>
  ${styles}
  <style>
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { margin: 0; padding: 16px; background: #fff; }
    .zone-cartes { display: flex !important; flex-wrap: wrap !important; gap: 16px !important; justify-content: center !important; align-items: flex-start !important; visibility: visible !important; position: static !important; width: 100% !important; padding: 0 !important; }
    .zone-cartes, .zone-cartes * { visibility: visible !important; }
    .carte-vide { display: none !important; }
    @page { size: A4 landscape; margin: 8mm; }
  </style>
</head>
<body>${zone.outerHTML}</body>
</html>`);
  fenetre.document.close();

  setTimeout(() => {
    fenetre.focus();
    fenetre.print();
  }, 1200);
};

export const imprimerZoneCartes = async (zone, titre = "Impression des cartes") => {
  if (!zone) return;

  const fenetre = window.open("", "_blank", "width=1200,height=800");
  if (!fenetre) {
    window.print();
    return;
  }

  try {
    await document.fonts?.ready;
    await attendreImages(zone);

    const cartes = Array.from(zone.querySelectorAll(".fiche-carte-eleve, .modele-carte-scolaire"));
    const cibles = cartes.length ? cartes : [zone];
    const captures = [];

    for (const carte of cibles) {
      const canvas = await html2canvas(carte, {
        backgroundColor: "#ffffff",
        scale: Math.min(3, Math.max(2, window.devicePixelRatio || 2)),
        useCORS: true,
        allowTaint: false,
        logging: false,
        scrollX: 0,
        scrollY: -window.scrollY,
      });
      captures.push(canvas.toDataURL("image/png"));
    }

    imprimerImagesCartes(fenetre, captures, titre);
  } catch {
    imprimerHtmlFallback(fenetre, zone, titre);
  }
};
