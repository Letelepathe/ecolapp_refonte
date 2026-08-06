import React from "react";

const EcranChargement = ({
  titre = "Chargement de votre espace",
  message = "Nous préparons les informations nécessaires. Merci de patienter.",
  erreur = "",
  onReessayer,
}) => (
  <div className="ecran-chargement" role={erreur ? "alert" : "status"} aria-live="polite">
    <div className="ecran-chargement-carte">
      {!erreur && <span className="ecran-chargement-spinner" aria-hidden="true" />}
      <h2>{erreur ? "Chargement impossible" : titre}</h2>
      <p>{erreur || message}</p>
      {erreur && <>
        {onReessayer && <button type="button" className="btn" onClick={onReessayer}>Réessayer</button>}
        <small>Si le problème persiste, contactez l’administrateur de votre école.</small>
      </>}
    </div>
  </div>
);

export default EcranChargement;
