import { useEffect, useState } from "react";
import {
  creerContexteTypesEleves,
  listerTypesEleves,
} from "./typesElevesService";

const lireIdTypeEleve = (eleve = {}) =>
  eleve.type_eleve_id ??
  eleve.typeEleveId ??
  eleve.type_eleve?.id ??
  eleve.typeEleve?.id ??
  null;

export const obtenirNomTypeEleve = (eleve, typesEleves = []) => {
  const nomInclus =
    eleve?.type_eleve?.nom ??
    eleve?.type_eleve?.name ??
    eleve?.typeEleve?.nom ??
    eleve?.typeEleve?.name ??
    eleve?.type_eleve_nom;

  if (nomInclus) return nomInclus;

  const typeId = lireIdTypeEleve(eleve);
  const typeTrouve = typesEleves.find(
    (type) => String(type.id) === String(typeId)
  );

  if (typeTrouve) return typeTrouve.nom;

  const typeParDefaut = typesEleves.find((type) => type.estTypeParDefaut);
  return typeParDefaut?.nom || "Non défini";
};

export const useTypesEleves = () => {
  const [typesEleves, setTypesEleves] = useState([]);

  useEffect(() => {
    let composantActif = true;

    const chargerTypes = async () => {
      try {
        const types = await listerTypesEleves(creerContexteTypesEleves());
        if (composantActif) setTypesEleves(types);
      } catch {
        // La liste des élèves reste utilisable si ce référentiel est indisponible.
        if (composantActif) setTypesEleves([]);
      }
    };

    chargerTypes();
    return () => {
      composantActif = false;
    };
  }, []);

  return typesEleves;
};
