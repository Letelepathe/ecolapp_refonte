import React from "react";
import ApercuCartes from "./ApercuCartes";

const ModalApercuCartes = ({
  zoneRef,
  ouvert,
  fermer,
  eleves,
  ecole,
  photosKo,
  photoKo,
  impCartes,
  telechPdf,
  exportPdf,
}) => {
  if (!ouvert) return null;

  return (
    <div className="modal-cartes" role="dialog" aria-modal="true" aria-labelledby="titre-modal-cartes">
      <div className="dialog-cartes modal-lg">
        <div className="entete-modal-cartes">
          <div>
            <h5 id="titre-modal-cartes" className="mb-1">Aperçu des cartes d'élèves</h5>
            <p className="mb-0 text-muted">{eleves.length} carte(s) prête(s) à imprimer ou télécharger.</p>
          </div>
          <button type="button" className="btn-close" aria-label="Fermer" onClick={fermer}></button>
        </div>

        <div className="actions-modal-cartes">
          <button type="button" className="btn btn-secondary" onClick={fermer}>
            Fermer
          </button>
          <button type="button" className="btn btn-primary" onClick={impCartes} disabled={!eleves.length}>
            Imprimer
          </button>
          <button type="button" className="btn btn-success" onClick={telechPdf} disabled={!eleves.length || exportPdf}>
            {exportPdf ? "Génération..." : "Télécharger"}
          </button>
        </div>

        <div className="corps-modal-cartes">
          <ApercuCartes
            zoneRef={zoneRef}
            eleves={eleves}
            ecole={ecole}
            photosKo={photosKo}
            photoKo={photoKo}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalApercuCartes;
