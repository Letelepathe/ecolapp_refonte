export const imprimerZoneCartes = (zone, titre = "Impression des cartes") => {
  if (!zone) return;

  const contenu = zone.outerHTML;
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((element) => element.outerHTML)
    .join("\n");

  const fenetre = window.open("", "_blank", "width=1200,height=800");
  if (!fenetre) {
    window.print();
    return;
  }

  fenetre.document.open();
  fenetre.document.write(`<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${titre}</title>
  ${styles}
  <style>
    body { margin: 0; padding: 16px; background: #fff; }
    .zone-cartes { display: flex !important; flex-wrap: wrap !important; gap: 16px !important; justify-content: center !important; align-items: flex-start !important; visibility: visible !important; position: static !important; }
    .zone-cartes, .zone-cartes * { visibility: visible !important; }
    .carte-vide { display: none !important; }
    @page { size: A4 landscape; margin: 8mm; }
    @media print { body { padding: 0; } .zone-cartes { position: static !important; } }
  </style>
</head>
<body>${contenu}</body>
</html>`);
  fenetre.document.close();

  const lancerImpression = () => {
    fenetre.focus();
    fenetre.print();
  };

  setTimeout(lancerImpression, 700);
};
