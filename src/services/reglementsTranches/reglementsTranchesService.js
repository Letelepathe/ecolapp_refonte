import { apiReglementsTranchesRepository } from "./apiReglementsTranchesRepository";
import { browserReglementsTranchesRepository } from "./browserReglementsTranchesRepository";
import { choisirSourcePersistance } from "../../config/persistence";

export const SOURCE_REGLEMENTS_TRANCHES = choisirSourcePersistance(
  import.meta.env.VITE_REGLEMENTS_TRANCHES_REPOSITORY
);

const repository =
  SOURCE_REGLEMENTS_TRANCHES === "api"
    ? apiReglementsTranchesRepository
    : browserReglementsTranchesRepository;

export const creerContexteReglements = () => ({
  ecoleId: localStorage.getItem("ecole_id"),
  direction: localStorage.getItem("direction"),
});

export const listerConfigurationsTranches = (contexte) =>
  repository.lister(contexte);

export const obtenirConfigurationTranche = (contexte, trancheId) =>
  repository.obtenir(contexte, trancheId);

export const enregistrerConfigurationTranche = (contexte, configuration) =>
  repository.enregistrer(contexte, configuration);

export const obtenirReglementType = (configuration, typeEleveId) =>
  configuration?.reglements?.find(
    (reglement) =>
      String(reglement.typeEleveId) === String(typeEleveId) &&
      reglement.actif !== false
  ) || null;

export const calculerMontantTranche = (configuration, typeEleveId) => {
  const montantNormal = Math.max(
    0,
    Number(configuration?.montantNormal) || 0
  );
  const reglement = obtenirReglementType(configuration, typeEleveId);

  if (!reglement) {
    return { applicable: true, montant: montantNormal, reglement: null };
  }
  if (reglement.applicable === false) {
    return { applicable: false, montant: 0, reglement };
  }
  return {
    applicable: true,
    montant: Math.max(0, Number(reglement.montant) || 0),
    reglement,
  };
};
