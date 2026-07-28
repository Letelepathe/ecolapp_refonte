import React, { useEffect, useMemo, useState } from "react";
import {
  creerContexteTypesEleves,
  listerTypesEleves,
} from "../../../../services/typesEleves/typesElevesService";
import SelectTypeEleve from "./SelectTypeEleve";

const ConfirmationInscriptionModal = ({
  inscription,
  onAnnuler,
  onConfirmer,
}) => {
  const contexte = useMemo(() => creerContexteTypesEleves(), []);
  const [types, setTypes] = useState([]);
  const [typeId, setTypeId] = useState("");
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    listerTypesEleves(contexte).then((liste) => {
      setTypes(liste);
      const parDefaut = liste.find((type) => type.estTypeParDefaut) || liste[0];
      setTypeId(parDefaut?.id || "");
    });
  }, []);

  const confirmer = async () => {
    const type = types.find((element) => String(element.id) === String(typeId));
    if (!type) {
      setErreur("Sélectionnez un type d'élève.");
      return;
    }

    setChargement(true);
    setErreur("");
    try {
      await onConfirmer({ inscription, typeEleve: type });
      onAnnuler();
    } catch {
      setErreur("La confirmation n'a pas abouti. Aucune attribution locale n'a été validée.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="custom-modal" role="dialog" aria-modal="true" aria-labelledby="titre-confirmation">
      <div className="modal-content">
        <h2 id="titre-confirmation" className="h5">Confirmer l'inscription</h2>
        <p>
          <strong>{inscription.name} {inscription.last_name} {inscription.first_name}</strong>
          <br />
          {inscription.classe?.name || "Classe non précisée"} · {inscription.annee?.name || "Année non précisée"}
        </p>
        <div className="alert alert-info">
          Les montants de chaque tranche seront déterminés selon le type
          sélectionné. Sans choix particulier, le type par défaut « Ordinaire »
          est utilisé.
        </div>
        <SelectTypeEleve
          types={types}
          value={typeId}
          onChange={(event) => setTypeId(event.target.value)}
        />
        {erreur && <p className="text-danger mt-3">{erreur}</p>}
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button type="button" className="btn btn-outline-secondary" onClick={onAnnuler} disabled={chargement}>
            Annuler
          </button>
          <button type="button" className="btn" onClick={confirmer} disabled={chargement || !typeId}>
            {chargement ? "Confirmation..." : "Confirmer avec ce type"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationInscriptionModal;
