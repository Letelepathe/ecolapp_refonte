import React from "react";

const BarreActions = ({
  cycle,
  nbFiltre,
  nbSel,
  toutFiltreSel,
  bascResultat,
  viderSel,
  exportPdf,
  ouvrirApercu,
}) => (
  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
    <div>
      <h5 className="mb-1">Cartes d'élèves</h5>
      <p className="text-muted mb-0">Génération seule ou groupée pour le cycle {cycle}.</p>
    </div>
    <div className="d-flex flex-wrap gap-2">
      <button className="btn btn-outline-primary" onClick={bascResultat} disabled={!nbFiltre}>
        {toutFiltreSel ? "Désélectionner ce résultat" : "Sélectionner ce résultat"}
      </button>
      <button className="btn btn-secondary" onClick={viderSel} disabled={!nbSel}>
        Vider
      </button>
      <button className="btn btn-primary" onClick={ouvrirApercu} disabled={!nbSel || exportPdf}>
        Générer aperçu
      </button>
    </div>
  </div>
);

export default BarreActions;
