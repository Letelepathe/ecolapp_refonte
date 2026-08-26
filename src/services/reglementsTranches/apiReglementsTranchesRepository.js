import { api } from "../../composants/api/api";

const normaliser = (configuration = {}) => ({
  trancheId:
    configuration.trancheId ??
    configuration.tranche_id ??
    configuration.id,
  motifId: configuration.motifId ?? configuration.motif_id ?? "",
  montantNormal:
    configuration.montantNormal ??
    configuration.montant_normal ??
    configuration.montant ??
    0,
  deviseId: configuration.deviseId ?? configuration.devise_id ?? "",
  anneeId: configuration.anneeId ?? configuration.annee_id ?? "",
  ordre: configuration.ordre ?? "",
  echeance: configuration.echeance ?? configuration.date_echeance ?? "",
  statut:
    configuration.statut ??
    configuration.configuration_status ??
    "brouillon",
  reglements: (
    configuration.reglements_payement ||
    configuration.reglements ||
    []
  ).map((reglement) => ({
    typeEleveId:
      reglement.typeEleveId ?? reglement.type_eleve_id,
    montant: reglement.montant ?? 0,
    applicable: reglement.applicable !== false,
    actif: reglement.actif !== false,
  })),
});

const payload = (configuration) => ({
  motif_id: configuration.motifId || null,
  montant: configuration.montantNormal,
  devise_id: configuration.deviseId || null,
  annee_id: configuration.anneeId || null,
  ordre: configuration.ordre || null,
  date_echeance: configuration.echeance || null,
  statut: configuration.statut || "brouillon",
  reglements: (configuration.reglements || []).map((reglement) => ({
    type_eleve_id: reglement.typeEleveId,
    montant: reglement.montant,
    applicable: reglement.applicable,
    actif: reglement.actif,
  })),
});

export const apiReglementsTranchesRepository = {
  async lister(contexte) {
    const reponse = await api.get(
      `/ecoles/${contexte.ecoleId}/directions/${contexte.direction}/tranches-reglements`
    );
    const liste = reponse.data.data || reponse.data.tranches || [];
    return liste.map(normaliser);
  },

  async obtenir(_contexte, trancheId) {
    const reponse = await api.get(
      `/tranches/${trancheId}/reglements-payement`
    );
    return normaliser(reponse.data.data || reponse.data.tranche);
  },

  async enregistrer(_contexte, configuration) {
    const reponse = await api.put(
      `/tranches/${configuration.trancheId}/reglements-payement`,
      payload(configuration)
    );
    return normaliser(reponse.data.data || reponse.data.tranche);
  },
};
