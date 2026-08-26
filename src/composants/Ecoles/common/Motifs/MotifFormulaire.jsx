import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://api.ecolapp.cd/api";
const vide = { name: "", montant: "", devise_id: "" };
const messageApi = (error, fallback) => error?.response?.data?.error_msg || Object.values(error?.response?.data?.errorsList || {}).flat().find(Boolean) || fallback;

const MotifFormulaire = ({ motif, devises, ecoleId, direction, onSuccess, onCancel }) => {
  const [formulaire, setFormulaire] = useState(vide);
  const [erreur, setErreur] = useState("");
  const [enregistrement, setEnregistrement] = useState(false);

  useEffect(() => {
    setFormulaire(motif ? {
      name: motif.name || "",
      montant: String(motif.montant ?? "").replace(".", ","),
      devise_id: motif.devise_id || motif.devise?.id || "",
    } : vide);
    setErreur("");
  }, [motif]);

  const envoyer = async (event) => {
    event.preventDefault();
    setErreur("");
    const montant = formulaire.montant.trim().replace(",", ".");
    if (!/^\d+(\.\d{1,2})?$/.test(montant)) {
      setErreur("Saisissez un montant positif avec au maximum deux décimales.");
      return;
    }

    setEnregistrement(true);
    try {
      const payload = { ...formulaire, montant, ecole_id: ecoleId, direction };
      const response = motif
        ? await axios.put(`${API}/motif/edit/${motif.id}`, payload)
        : await axios.post(`${API}/motif/create`, payload);
      onSuccess(response.data?.status_msg || `Motif ${motif ? "modifié" : "ajouté"} avec succès.`);
      if (!motif) setFormulaire(vide);
    } catch (error) {
      setErreur(messageApi(error, `Impossible de ${motif ? "modifier" : "créer"} le motif.`));
    } finally {
      setEnregistrement(false);
    }
  };

  return (
    <form onSubmit={envoyer}>
      <div className="mb-3"><label htmlFor="motif-name">Motif</label><input id="motif-name" className="form-control" value={formulaire.name} onChange={(event) => setFormulaire({ ...formulaire, name: event.target.value })} required /></div>
      <div className="mb-3"><label htmlFor="motif-montant">Montant</label><input id="motif-montant" type="text" inputMode="decimal" className="form-control" value={formulaire.montant} onChange={(event) => setFormulaire({ ...formulaire, montant: event.target.value })} placeholder="20,50" required /><small className="text-muted">Le point et la virgule sont acceptés, avec deux décimales maximum.</small></div>
      <div className="mb-3"><label htmlFor="motif-devise">Devise</label><select id="motif-devise" className="form-control" value={formulaire.devise_id} onChange={(event) => setFormulaire({ ...formulaire, devise_id: event.target.value })} required><option value="">Sélectionner une devise</option>{devises.map((devise) => <option key={devise.id} value={devise.id}>{devise.name}</option>)}</select></div>
      {erreur && <div className="alert alert-danger" role="alert">{erreur}</div>}
      <div className="d-flex justify-content-end gap-2">{onCancel && <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Annuler</button>}<button type="submit" className="btn" disabled={enregistrement}>{enregistrement ? "Enregistrement…" : "Enregistrer"}</button></div>
    </form>
  );
};

export default MotifFormulaire;
