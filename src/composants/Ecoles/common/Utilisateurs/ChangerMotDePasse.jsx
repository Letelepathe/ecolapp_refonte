import React, { useState } from "react";
import axios from "axios";
import ChampMotDePasse from "../../../common/ChampMotDePasse";

const valeursInitiales = { current_password: "", password: "", password_confirmation: "" };

const ChangerMotDePasse = () => {
  const [ouvert, setOuvert] = useState(false);
  const [formulaire, setFormulaire] = useState(valeursInitiales);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");
  const [chargement, setChargement] = useState(false);

  const fermer = () => { setOuvert(false); setErreur(""); setFormulaire(valeursInitiales); };
  const changer = (event) => setFormulaire((actuel) => ({ ...actuel, [event.target.name]: event.target.value }));

  const soumettre = async (event) => {
    event.preventDefault();
    setErreur("");
    if (formulaire.password !== formulaire.password_confirmation) {
      setErreur("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    setChargement(true);
    try {
      const reponse = await axios.put("https://api.ecolapp.cd/api/user/password", formulaire, {
        headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
      });
      setSucces(reponse.data?.status_msg || "Mot de passe modifié avec succès.");
      fermer();
    } catch (error) {
      setErreur(error.response?.data?.message || error.response?.data?.error_msg || "Impossible de modifier le mot de passe.");
    } finally {
      setChargement(false);
    }
  };

  return <div className="changer-mot-de-passe">
    {succes && <div className="alert alert-success">{succes}</div>}
    <button type="button" className="btn changer-mot-de-passe__ouvrir" onClick={() => { setSucces(""); setOuvert(true); }}>
      <i className="bi bi-shield-lock" /> Changer mon mot de passe
    </button>
    {ouvert && <div className="modal d-block changer-mot-de-passe__modal" role="dialog" aria-modal="true">
      <div className="modal-dialog modal-dialog-centered"><form className="modal-content" onSubmit={soumettre}>
        <div className="modal-header"><h5 className="modal-title">Changer mon mot de passe</h5><button type="button" className="btn-close" onClick={fermer} aria-label="Fermer" /></div>
        <div className="modal-body">
          {erreur && <div className="alert alert-danger">{erreur}</div>}
          <div className="mb-3"><label>Mot de passe actuel</label><ChampMotDePasse className="form-control" name="current_password" value={formulaire.current_password} onChange={changer} autoComplete="current-password" required /></div>
          <div className="mb-3"><label>Nouveau mot de passe</label><ChampMotDePasse className="form-control" name="password" value={formulaire.password} onChange={changer} autoComplete="new-password" minLength={8} required /></div>
          <div><label>Confirmer le nouveau mot de passe</label><ChampMotDePasse className="form-control" name="password_confirmation" value={formulaire.password_confirmation} onChange={changer} autoComplete="new-password" minLength={8} required /></div>
        </div>
        <div className="modal-footer"><button type="button" className="btn" onClick={fermer}>Annuler</button><button className="btn" disabled={chargement}>{chargement ? "Modification…" : "Modifier"}</button></div>
      </form></div>
    </div>}
  </div>;
};

export default ChangerMotDePasse;
