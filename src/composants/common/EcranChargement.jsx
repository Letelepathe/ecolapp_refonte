import React from "react";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

const EcranChargement = ({
  titre = "Chargement de votre espace",
  message = "Nous préparons les informations nécessaires. Merci de patienter.",
  erreur = "",
  onReessayer,
}) => {
  const estEnErreur = Boolean(erreur);

  return (
    <main
      className={`ecran-chargement${estEnErreur ? " ecran-chargement-erreur" : ""}`}
      role={estEnErreur ? "alert" : "status"}
      aria-live={estEnErreur ? "assertive" : "polite"}
      aria-busy={!estEnErreur}
    >
      <section className="ecran-chargement-carte">
        <span className="ecran-chargement-marque" aria-hidden="true">E</span>

        {estEnErreur ? (
          <span className="ecran-chargement-alerte" aria-hidden="true">
            <FiAlertTriangle />
          </span>
        ) : (
          <span className="ecran-chargement-spinner" aria-hidden="true">
            <span />
          </span>
        )}

        <span className="ecran-chargement-surtitre">
          {estEnErreur ? "Un problème est survenu" : "Ecolapp prépare vos données"}
        </span>
        <h2>{estEnErreur ? "Chargement impossible" : titre}</h2>
        <p>{erreur || message}</p>

        {!estEnErreur && (
          <span className="ecran-chargement-points" aria-hidden="true">
            <i /><i /><i />
          </span>
        )}

        {estEnErreur && (
          <>
            {onReessayer && (
              <button type="button" className="btn ecran-chargement-reessayer" onClick={onReessayer}>
                <FiRefreshCw aria-hidden="true" />
                Réessayer
              </button>
            )}
            <small>Si le problème persiste, contactez l’administrateur de votre école.</small>
          </>
        )}
      </section>
    </main>
  );
};

export default EcranChargement;