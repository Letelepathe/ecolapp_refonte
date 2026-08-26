import { typesElevesRepository } from "./typesElevesRepository";

export const creerContexteTypesEleves = () => ({
  ecoleId: localStorage.getItem("ecole_id"),
  direction: localStorage.getItem("direction"),
});

export const listerTypesEleves = (contexte, options) =>
  typesElevesRepository.listerTypes(contexte, options);

export const obtenirTypeParDefaut = async (contexte) => {
  const types = await listerTypesEleves(contexte);
  return types.find((type) => type.estTypeParDefaut) || types[0] || null;
};

export const enregistrerTypeEleve = (contexte, typeEleve) =>
  typesElevesRepository.enregistrerType(contexte, typeEleve);

export const attribuerTypeEleve = (contexte, attribution) =>
  typesElevesRepository.attribuerType(contexte, attribution);

export const trouverAttributionTypeEleve = (contexte, recherche) =>
  typesElevesRepository.trouverAttribution(contexte, recherche);
