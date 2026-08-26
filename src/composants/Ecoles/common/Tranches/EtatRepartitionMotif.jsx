import React from "react";

const formatMontant = (valeur, devise) =>
  `${Number(valeur || 0).toLocaleString("fr-FR", {
    maximumFractionDigits: 2,
  })}${devise ? ` ${devise}` : ""}`;

const EtatRepartitionMotif = ({
  nomMotif,
  montantMotif,
  montantAffecte,
  montantDisponible,
  montantSaisi,
  devise,
  onVoirTranches,
}) => {
  const complet = montantDisponible <= 0;
  const aucuneRepartition = montantAffecte <= 0;
  const depassement =
    montantSaisi !== "" &&
    Number(montantSaisi || 0) > Number(montantDisponible || 0);

  return (
    <div
      className={`alert ${complet ? "alert-warning" : "alert-info"} mt-2 mb-0`}
      role="status"
    >
      <div className="d-flex flex-wrap justify-content-between gap-2">
        <div>
          <strong>{nomMotif || "Motif sélectionné"}</strong>
          {complet ? (
            <p className="mb-1 mt-1">
              Le montant de ce motif est entièrement réparti.{" "}
              <strong>
                {formatMontant(montantAffecte, devise)} sur{" "}
                {formatMontant(montantMotif, devise)}
              </strong>{" "}
              sont déjà affectés aux tranches de cette année.
            </p>
          ) : aucuneRepartition ? (
            <p className="mb-1 mt-1">
              Aucune autre tranche n'utilise encore ce motif pour cette année.
            </p>
          ) : (
            <p className="mb-1 mt-1">
              <strong>{formatMontant(montantAffecte, devise)}</strong> sont déjà
              affectés sur <strong>{formatMontant(montantMotif, devise)}</strong>.
            </p>
          )}
          <div className="small">
            Montant encore disponible :{" "}
            <strong>{formatMontant(montantDisponible, devise)}</strong>.
            {complet &&
              " Une nouvelle tranche peut rester en brouillon à zéro, mais elle ne peut pas être activée avec un montant positif."}
          </div>
          {depassement && (
            <div className="text-danger mt-2">
              Le montant saisi dépasse le reste disponible. Introduisez un
              montant inférieur ou égal à{" "}
              <strong>{formatMontant(montantDisponible, devise)}</strong>.
            </div>
          )}
        </div>
        {onVoirTranches && (
          <button
            type="button"
            className="btn btn-sm btn-outline-primary align-self-start"
            onClick={onVoirTranches}
          >
            Voir les tranches de ce motif
          </button>
        )}
      </div>
    </div>
  );
};

export default EtatRepartitionMotif;
