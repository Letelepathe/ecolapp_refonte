import { api } from "../../composants/api/api";

const extraireListe = (reponse) =>
  reponse?.data?.types_eleves ||
  reponse?.data?.typesEleves ||
  reponse?.data?.data ||
  [];

const normaliserType = (type) => ({
  ...type,
  estTypeParDefaut:
    type.estTypeParDefaut ??
    Boolean(type.est_type_par_defaut ?? type.par_defaut),
});

const versPayload = (type) => ({
  nom: type.nom,
  description: type.description,
  actif: type.actif,
  par_defaut: type.estTypeParDefaut,
});

export const apiTypesElevesRepository = {
  async listerTypes(contexte, { inclureInactifs = false } = {}) {
    const reponse = await api.get(
      `/ecoles/${contexte.ecoleId}/directions/${contexte.direction}/types-eleves`,
      { params: { inclure_inactifs: inclureInactifs ? 1 : 0 } }
    );
    return extraireListe(reponse).map(normaliserType);
  },

  async enregistrerType(contexte, type) {
    const chemin = type.id
      ? `/types-eleves/${type.id}`
      : `/ecoles/${contexte.ecoleId}/directions/${contexte.direction}/types-eleves`;
    const reponse = type.id
      ? await api.put(chemin, versPayload(type))
      : await api.post(chemin, versPayload(type));
    return normaliserType(
      reponse.data.type_eleve || reponse.data.typeEleve || reponse.data.data
    );
  },

  async attribuerType(_contexte, attribution) {
    const chemin = attribution.inscriptionId
      ? `/inscriptions/${attribution.inscriptionId}/type-eleve`
      : `/eleves/${attribution.eleveId}/type-eleve`;
    const reponse = await api.post(
      chemin,
      {
        type_eleve_id: attribution.typeEleveId,
        annee_id: attribution.anneeId,
        source: attribution.source,
      }
    );
    return reponse.data.attribution || reponse.data.data;
  },

  async trouverAttribution(_contexte, { inscriptionId, eleveId, anneeId } = {}) {
    const chemin = inscriptionId
      ? `/inscriptions/${inscriptionId}/type-eleve`
      : `/eleves/${eleveId}/type-eleve`;
    const reponse = await api.get(chemin, { params: { annee_id: anneeId } });
    const attribution = reponse.data.attribution || reponse.data.data || null;
    if (!attribution) return null;
    return {
      ...attribution,
      typeEleveId: attribution.typeEleveId ?? attribution.type_eleve_id,
      anneeId: attribution.anneeId ?? attribution.annee_id,
      eleveId: attribution.eleveId ?? attribution.eleve_id,
      inscriptionId: attribution.inscriptionId ?? attribution.inscription_id,
    };
  },
};
