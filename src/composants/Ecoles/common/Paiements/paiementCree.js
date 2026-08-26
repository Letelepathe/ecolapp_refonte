import axios from "axios";

const URL_API = "https://api.ecolapp.cd/api";

const creerErreurRecu = (message) => {
  const erreur = new Error(message);
  erreur.code = "RECU_PAIEMENT_INDISPONIBLE";
  return erreur;
};

const extrairePaiementEnregistre = (response) =>
  response?.data?.paiement || response?.data?.Paiement || null;

const estPaiementHydrate = (paiement) =>
  Boolean(
    paiement?.eleve &&
      paiement?.classe &&
      paiement?.annee &&
      paiement?.motif &&
      paiement?.tranche &&
      paiement?.mode_paiement
  );

export const obtenirPaiementCreePourRecu = async (response) => {
  const paiementEnregistre = extrairePaiementEnregistre(response);
  const paiementId = Number(paiementEnregistre?.id);

  if (!Number.isInteger(paiementId) || paiementId <= 0) {
    throw creerErreurRecu(
      "Le paiement est enregistré, mais son identifiant est absent de la réponse du serveur."
    );
  }

  if (estPaiementHydrate(paiementEnregistre)) {
    return paiementEnregistre;
  }

  const detailResponse = await axios.get(`${URL_API}/paiement/${paiementId}`);
  const paiementDetail = detailResponse.data?.paiement;

  if (Number(paiementDetail?.id) !== paiementId) {
    throw creerErreurRecu(
      "Le reçu récupéré ne correspond pas au paiement qui vient d'être enregistré."
    );
  }

  return paiementDetail;
};
