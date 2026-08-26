import { API_BASE_URL } from "../../composants/api/api";

export const obtenirEcolePaiement = (paiement) =>
  paiement?.ecole || paiement?.eleve?.ecole || null;

export const obtenirUrlLogoEcole = (ecole, logoParDefaut) => {
  const ecoleId = Number(ecole?.id);

  if (Number.isInteger(ecoleId) && ecoleId > 0 && ecole?.photo_profil) {
    return `${API_BASE_URL}/ecoles/${ecoleId}/logo`;
  }

  return logoParDefaut;
};
