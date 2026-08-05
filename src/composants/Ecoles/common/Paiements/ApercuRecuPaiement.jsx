import React, { useRef, useState } from "react";
import {
  imprimerRecuPaiement,
  telechargerDocumentPdf,
} from "../../../common/impressionDocuments";
import RecuPaiement from "./RecuPaiement";
import {
  FORMATS_RECU_PAIEMENT,
  lireFormatRecuPrefere,
  memoriserFormatRecu,
  obtenirFormatRecu,
} from "../../../../services/impression/formatsRecuPaiement";

const ApercuRecuPaiement = ({ paiement, onFermer }) => {
  const recuRef = useRef(null);
  const [telechargement, setTelechargement] = useState(false);
  const ecoleId = paiement?.ecole_id || paiement?.ecole?.id || localStorage.getItem("ecole_id");
  const [formatId, setFormatId] = useState(() => lireFormatRecuPrefere(ecoleId));
  const format = obtenirFormatRecu(formatId);

  if (!paiement) return null;

  const telecharger = async () => {
    setTelechargement(true);
    await telechargerDocumentPdf(recuRef.current, {
      nomFichier: `recu-paiement-${paiement.id || "sans-numero"}.pdf`,
      orientation: "portrait",
      format: format.formatPdf,
      marge: format.margeMm,
      centrerVerticalement: !format.compact,
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

        <div className="actions-modal-cartes d-flex flex-wrap align-items-end justify-content-between gap-2 my-3">
          <div className="format-recu-paiement">
            <label htmlFor="format-recu-paiement">Format d'impression</label>
            <select
              id="format-recu-paiement"
              className="form-select"
              value={formatId}
              onChange={(event) => {
                const suivant = event.target.value;
                setFormatId(suivant);
                memoriserFormatRecu(ecoleId, suivant);
              }}
            >
              {FORMATS_RECU_PAIEMENT.map((option) => (
                <option key={option.id} value={option.id}>{option.libelle}</option>
              ))}
            </select>
            {format.compact && (
              <small className="text-muted">Sur téléphone, choisissez ensuite le service d'impression Bluetooth.</small>
            )}
          </div>
          <div className="d-flex flex-wrap justify-content-end gap-2">
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
              imprimerRecuPaiement(recuRef.current, paiement.id, format)
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
        </div>

        <div className="apercu-recu-financier__zone">
          <RecuPaiement ref={recuRef} paiement={paiement} formatId={formatId} />
        </div>
      </div>
    </div>
  );
};

export default ApercuRecuPaiement;
