export const FORMATS_RECU_PAIEMENT = Object.freeze([
  { id: "pos58", libelle: "POS 58 mm", formatPdf: [58, 200], tailleCss: "58mm 200mm", margeMm: 2, compact: true },
  { id: "pos80", libelle: "POS 80 mm", formatPdf: [80, 220], tailleCss: "80mm 220mm", margeMm: 3, compact: true },
  { id: "a6", libelle: "A6", formatPdf: "a6", tailleCss: "A6", margeMm: 6 },
  { id: "a5", libelle: "A5", formatPdf: "a5", tailleCss: "A5", margeMm: 8 },
  { id: "a4", libelle: "A4", formatPdf: "a4", tailleCss: "A4", margeMm: 12 },
]);

export const FORMAT_RECU_DEFAUT = "a4";

export const obtenirFormatRecu = (id) =>
  FORMATS_RECU_PAIEMENT.find((format) => format.id === id) ||
  FORMATS_RECU_PAIEMENT.find((format) => format.id === FORMAT_RECU_DEFAUT);

export const adapterFormatRecuAuContenu = (format, element) => {
  if (!format?.compact || !element || !Array.isArray(format.formatPdf)) {
    return format;
  }

  const [largeurPage] = format.formatPdf;
  const largeurElement = element.scrollWidth || element.offsetWidth;
  const hauteurElement = element.scrollHeight || element.offsetHeight;
  if (!largeurElement || !hauteurElement) return format;

  const marge = Number(format.margeMm) || 0;
  const largeurUtile = Math.max(1, largeurPage - marge * 2);
  const hauteurContenu = largeurUtile * (hauteurElement / largeurElement);
  const hauteurPage = Math.ceil(hauteurContenu + marge * 2 + 2);

  return {
    ...format,
    formatPdf: [largeurPage, hauteurPage],
    tailleCss: `${largeurPage}mm ${hauteurPage}mm`,
  };
};

const clePreference = (ecoleId) =>
  `ecolapp:impression-recu:${String(ecoleId || "defaut")}`;

export const lireFormatRecuPrefere = (ecoleId) => {
  if (typeof window === "undefined") return FORMAT_RECU_DEFAUT;
  const id = window.localStorage.getItem(clePreference(ecoleId));
  return obtenirFormatRecu(id).id;
};

export const memoriserFormatRecu = (ecoleId, formatId) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(clePreference(ecoleId), obtenirFormatRecu(formatId).id);
};
