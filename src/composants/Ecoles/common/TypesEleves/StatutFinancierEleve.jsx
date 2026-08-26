import React, { useEffect, useMemo, useState } from "react";
import {
  creerContexteTypesEleves,
  listerTypesEleves,
  obtenirTypeParDefaut,
  trouverAttributionTypeEleve,
} from "../../../../services/typesEleves/typesElevesService";

const StatutFinancierEleve = ({ eleveId, anneeId }) => {
  const contexte = useMemo(() => creerContexteTypesEleves(), []);
  const [typeEleve, setTypeEleve] = useState(null);
  const [source, setSource] = useState("defaut");

  useEffect(() => {
    if (!eleveId) {
      setTypeEleve(null);
      return;
    }

    Promise.all([
      trouverAttributionTypeEleve(contexte, { eleveId, anneeId }),
      listerTypesEleves(contexte, { inclureInactifs: true }),
      obtenirTypeParDefaut(contexte),
    ]).then(([attribution, types, typeParDefaut]) => {
      const attribue = types.find(
        (type) => String(type.id) === String(attribution?.typeEleveId)
      );
      setTypeEleve(attribue || typeParDefaut);
      setSource(attribue ? "attribution" : "defaut");
    });
  }, [eleveId, anneeId]);

  if (!eleveId || !typeEleve) return null;

  return (
    <div className="alert alert-light border mt-3">
      <div className="d-flex justify-content-between gap-2">
        <strong>Statut financier de l'élève</strong>
        <span className="badge bg-secondary">
          {source === "attribution" ? "Attribué" : "Ordinaire par défaut"}
        </span>
      </div>
      <div className="mt-2">
        <strong>{typeEleve.nom}</strong>
        {typeEleve.description && (
          <p className="text-muted mb-0">{typeEleve.description}</p>
        )}
      </div>
      <p className="small text-muted mt-2 mb-0">
        Le montant applicable sera déterminé par la tranche sélectionnée.
      </p>
    </div>
  );
};

export default StatutFinancierEleve;
