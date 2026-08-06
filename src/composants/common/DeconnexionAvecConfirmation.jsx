import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DeconnexionAvecConfirmation = ({ redirection = "/", champs = ["userId"] }) => {
  const navigate = useNavigate();
  const [chargement, setChargement] = useState(false);

  const confirmer = () => {
    setChargement(true);
    champs.forEach((champ) => localStorage.setItem(champ, ""));
    setTimeout(() => navigate(redirection), 250);
  };

  return (
    <div className="deconnexion-page d-flex align-items-center justify-content-center min-vh-100">
      <div className="deconnexion-dialogue card shadow border-0 p-4 text-center">
        <div className="deconnexion-icone mx-auto mb-3"><i className="bi bi-box-arrow-right" /></div>
        <h4>Confirmer la déconnexion</h4>
        <p className="text-muted">Voulez-vous vraiment fermer votre session Ecolapp sur cet appareil ?</p>
        <div className="d-flex gap-2 justify-content-center flex-wrap">
          <button className="btn btn-light border" onClick={() => navigate(-1)} disabled={chargement}>Annuler</button>
          <button className="btn btn-danger" onClick={confirmer} disabled={chargement}>{chargement ? "Déconnexion..." : "Oui, me déconnecter"}</button>
        </div>
      </div>
    </div>
  );
};
export default DeconnexionAvecConfirmation;
