import React from "react";

const nombre = (valeur) => {
  const resultat = Number(valeur);
  return Number.isFinite(resultat) ? resultat : 0;
};

const formatMontant = (valeur, devise) =>
  `${nombre(valeur).toLocaleString("fr-FR", {
    maximumFractionDigits: 2,
  })}${devise ? ` ${devise}` : ""}`;

export const calculerReportPaiement = ({
  montantSaisi,
  trancheSelectionnee,
  lignes = [],
}) => {
  const index = lignes.findIndex(
    (ligne) => String(ligne.id) === String(trancheSelectionnee?.id)
  );
  const suivantes = lignes
    .slice(Math.max(0, index + 1))
    .filter((ligne) => ligne.applicable !== false && nombre(ligne.reste) > 0);
  const excedent = Math.max(
    0,
    nombre(montantSaisi) - nombre(trancheSelectionnee?.reste)
  );

  return {
    excedent,
    prochaineTranche: suivantes[0] || null,
    soldeAutresTranches: suivantes.reduce(
      (total, ligne) => total + nombre(ligne.reste),
      0
    ),
    soldeTotalMotif:
      nombre(trancheSelectionnee?.reste) +
      suivantes.reduce((total, ligne) => total + nombre(ligne.reste), 0),
  };
};

const DepassementTrancheModal = ({
  montantSaisi,
  trancheSelectionnee,
  lignes = [],
  devise = "",
  onAnnuler,
  onAjuster,
  onPreparerSuivante,
}) => {
  if (!trancheSelectionnee) return null;

  const report = calculerReportPaiement({
    montantSaisi,
    trancheSelectionnee,
    lignes,
  });
  const peutContinuer =
    report.prochaineTranche && report.excedent > 0;

  return (
    <div
      className="custom-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titre-depassement-tranche"
    >
      <div className="modal-content">
        <h3 id="titre-depassement-tranche" className="h5">
          Montant supérieur au solde de la tranche
        </h3>
        <p>
          Le montant restant à payer pour{" "}
          <strong>{trancheSelectionnee.nom}</strong> est de{" "}
          <strong>
            {formatMontant(trancheSelectionnee.reste, devise)}
          </strong>
          . Vous devez introduire un montant inférieur ou égal à ce solde.
        </p>

        {peutContinuer ? (
          <div className="alert alert-info">
            Après ce paiement, l'excédent de{" "}
            <strong>{formatMontant(report.excedent, devise)}</strong> pourra
            être reporté vers <strong>{report.prochaineTranche.nom}</strong>.
            Chaque paiement restera confirmé séparément.
          </div>
        ) : (
          <div className="alert alert-info">
            Il reste au total{" "}
            <strong>{formatMontant(report.soldeTotalMotif, devise)}</strong> à
            payer pour cet élève sur ce motif. Aucune autre tranche applicable
            ne reste après celle-ci.
          </div>
        )}

        <div className="d-flex flex-wrap justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onAnnuler}
          >
            Annuler
          </button>
          <button type="button" className="btn" onClick={onAjuster}>
            Utiliser {formatMontant(trancheSelectionnee.reste, devise)}
          </button>
          {peutContinuer && (
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => onPreparerSuivante(report)}
            >
              Payer puis passer à la tranche suivante
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepassementTrancheModal;
