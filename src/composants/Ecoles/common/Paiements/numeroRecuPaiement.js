export const obtenirNumeroRecuPaiement = (paiement) => {
  const numero = Number(paiement?.numero_recu);
  return Number.isInteger(numero) && numero > 0 ? numero : null;
};

export const formaterNumeroRecuPaiement = (paiement) => {
  const numero = obtenirNumeroRecuPaiement(paiement);
  return numero === null ? null : String(numero).padStart(2, "0");
};

export const obtenirReferenceRecuPaiement = (paiement) => {
  const numero = formaterNumeroRecuPaiement(paiement);
  if (numero) return `N°${numero}`;

  return "N° non attribué";
};
