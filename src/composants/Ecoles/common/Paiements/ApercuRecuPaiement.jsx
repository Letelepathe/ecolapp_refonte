import React, { useRef, useState } from "react";
import {
  imprimerRecuPaiement,
  telechargerDocumentPdf,
} from "../../../common/impressionDocuments";
import RecuPaiement from "./RecuPaiement";

const ApercuRecuPaiement = ({ paiement, onFermer }) => {
  const recuRef = useRef(null);
  const [telechargement, setTelechargement] = useState(false);

  if (!paiement) return null;

  const telecharger = async () => {
    setTelechargement(true);
    await telechargerDocumentPdf(recuRef.current, {
      nomFichier: `recu-paiement-${paiement.id || "sans-numero"}.pdf`,
      orientation: "portrait",
      format: "a4",
      marge: 12,
    });
    setTelechargement(false);
  };

  return (
    <div
      className="custom-modal apercu-recu-financier"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titre-apercu-recu"
    >
      <div className="modal-content">
        <header className="d-flex justify-content-between gap-3 align-items-start">
          <div>
            <h3 id="titre-apercu-recu" className="h5 mb-1">
              Aperçu du reçu de paiement
            </h3>
            <p className="text-muted mb-0">
              Vérifiez le reçu avant de l'imprimer ou de le télécharger.
            </p>
          </div>
          <button
            type="button"
            className="btn-close"
            aria-label="Fermer"
            onClick={onFermer}
          />
        </header>

        <div className="actions-modal-cartes d-flex flex-wrap justify-content-end gap-2 my-3">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onFermer}
          >
            Fermer
          </button>
          <button
            type="button"
            className="btn"
            onClick={() =>
              imprimerRecuPaiement(recuRef.current, paiement.id)
            }
          >
            Imprimer
          </button>
          <button
            type="button"
            className="btn"
            disabled={telechargement}
            onClick={telecharger}
          >
            {telechargement ? "Préparation…" : "Télécharger"}
          </button>
        </div>

        <div className="apercu-recu-financier__zone">
          <RecuPaiement ref={recuRef} paiement={paiement} />
        </div>
      </div>
    </div>
  );
};

export default ApercuRecuPaiement;
