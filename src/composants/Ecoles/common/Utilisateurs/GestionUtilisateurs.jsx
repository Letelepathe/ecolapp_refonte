import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiEdit2, FiUser, FiUserCheck, FiUserX, FiX } from "react-icons/fi";
import { preparerImageUpload } from "../../../../services/images/preparerImageUpload";

const API = "https://api.ecolapp.cd/api";
const estActif = (utilisateur) => String(utilisateur.status) === "0";

const messageApi = (error, fallback) =>
  Object.values(error.response?.data?.errors || error.response?.data?.errorsList || {}).flat().find(Boolean) ||
  error.response?.data?.message || error.response?.data?.error_msg || fallback;

const GestionUtilisateurs = ({ cycle, SidebarLeft, NavbarTop }) => {
  const ecoleId = localStorage.getItem("ecole_id");
  const direction = localStorage.getItem("direction");
  const utilisateurConnecteId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("auth_token");
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [fonctions, setFonctions] = useState([]);
  const [filtre, setFiltre] = useState("tous");
  const [recherche, setRecherche] = useState("");
  const [selection, setSelection] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(true);
  const [traitement, setTraitement] = useState(false);
  const [photoEnPreparation, setPhotoEnPreparation] = useState(false);
  const [erreurPhoto, setErreurPhoto] = useState("");

  const charger = useCallback(async () => {
    setChargement(true);
    setErreur("");
    try {
      const [reponseUtilisateurs, reponseFonctions] = await Promise.all([
        axios.get(`${API}/user/all/ecole/${ecoleId}/direction/${direction}`),
        axios.get(`${API}/fonction/ecole/${ecoleId}/direction/${direction}`),
      ]);
      setUtilisateurs(Array.isArray(reponseUtilisateurs.data?.userAll) ? reponseUtilisateurs.data.userAll : []);
      setFonctions(Array.isArray(reponseFonctions.data?.fonctionAll) ? reponseFonctions.data.fonctionAll : []);
    } catch (error) {
      setErreur(messageApi(error, "Impossible de charger les utilisateurs."));
    } finally {
      setChargement(false);
    }
  }, [ecoleId, direction]);

  useEffect(() => { charger(); }, [charger]);

  const visibles = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    return utilisateurs.filter((utilisateur) => {
      const correspondStatut = filtre === "tous" || (filtre === "actifs" ? estActif(utilisateur) : !estActif(utilisateur));
      const texte = `${utilisateur.name || ""} ${utilisateur.last_name || ""} ${utilisateur.first_name || ""} ${utilisateur.email || utilisateur.mail || ""}`.toLowerCase();
      return correspondStatut && (!terme || texte.includes(terme));
    });
  }, [utilisateurs, filtre, recherche]);

  const ouvrirModification = (utilisateur) => {
    setErreurPhoto("");
    setSelection({
    id: utilisateur.id,
    name: utilisateur.name || "",
    last_name: utilisateur.last_name || "",
    first_name: utilisateur.first_name || "",
    sexe: utilisateur.sexe || "Homme",
    email: utilisateur.email || utilisateur.mail || "",
    phone: utilisateur.phone || "",
    address: utilisateur.address || "",
    fonction_id: utilisateur.fonction_id || "",
    file: null,
    });
  };

  const choisirPhoto = async (event) => {
    const input = event.target;
    const fichier = input.files?.[0] || null;
    setErreurPhoto("");
    if (!fichier) {
      setSelection((courant) => ({ ...courant, file: null }));
      return;
    }

    setPhotoEnPreparation(true);
    try {
      const photo = await preparerImageUpload(fichier);
      setSelection((courant) => ({ ...courant, file: photo }));
    } catch (error) {
      input.value = "";
      setSelection((courant) => ({ ...courant, file: null }));
      setErreurPhoto(error.message || "Cette photo ne peut pas être utilisée.");
    } finally {
      setPhotoEnPreparation(false);
    }
  };

  const modifier = async (event) => {
    event.preventDefault();
    if (photoEnPreparation) return;
    setTraitement(true);
    setErreur("");
    try {
      const donnees = new FormData();
      Object.entries(selection).forEach(([cle, valeur]) => {
        if (cle !== "id" && valeur !== null) donnees.append(cle, valeur);
      });
      donnees.append("_method", "PUT");
      await axios.post(`${API}/user/edit/${selection.id}`, donnees, { headers });
      setSelection(null);
      setMessage("Utilisateur modifié avec succès.");
      await charger();
    } catch (error) {
      setErreur(messageApi(error, "Impossible de modifier cet utilisateur."));
    } finally {
      setTraitement(false);
    }
  };

  const changerStatut = async () => {
    setTraitement(true);
    setErreur("");
    try {
      await axios.patch(`${API}/user/${confirmation.id}/status`, { actif: !estActif(confirmation) }, { headers });
      setMessage(estActif(confirmation) ? "Utilisateur désactivé." : "Utilisateur réactivé.");
      setConfirmation(null);
      await charger();
    } catch (error) {
      setErreur(messageApi(error, "Impossible de changer le statut de cet utilisateur."));
    } finally {
      setTraitement(false);
    }
  };

  return (
    <div className="container-fluid position-relative d-flex p-0">
      <SidebarLeft />
      <div className="content">
        <NavbarTop />
        <div className="container-fluid pt-4 px-3 px-lg-4 gestion-utilisateurs">
          <div className="rounded p-3 p-lg-4">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="mb-0">Utilisateurs</h6>
              <Link className="btn" to={`/${cycle}/creationcompte`}><i className="bi bi-plus" /> Créer un utilisateur</Link>
            </div>
            {message && <div className="alert alert-success">{message}</div>}
            {erreur && <div className="alert alert-danger">{erreur}</div>}
            <div className="gestion-utilisateurs__filtres mb-3">
              <input className="form-control" value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Rechercher un utilisateur" />
              <select className="form-control" value={filtre} onChange={(e) => setFiltre(e.target.value)}>
                <option value="tous">Tous les statuts</option><option value="actifs">Actifs</option><option value="desactives">Désactivés</option>
              </select>
            </div>
            <div className="table-responsive">
              <table className="table text-start align-middle mb-0 gestion-utilisateurs__table">
                <thead><tr><th>Utilisateur</th><th>Contact</th><th>Fonction</th><th>Rôle</th><th>Statut</th><th>Actions</th></tr></thead>
                <tbody>
                  {!chargement && visibles.map((m) => <tr key={m.id}>
                    <td><div className="d-flex align-items-center gap-2"><span className={`gestion-utilisateurs__avatar ${String(m.sexe).toLowerCase() === "femme" ? "femme" : ""}`}>{m.file ? <img src={`https://api.ecolapp.cd/public/imgUser/${m.file}`} alt="" /> : <FiUser />}</span><span><strong>{m.name} {m.last_name}</strong><small>{m.first_name} · {m.sexe}</small></span></div></td>
                    <td><span>{m.email || m.mail || "—"}</span><small>{m.phone || "—"}</small></td>
                    <td>{m.fonction?.name || "—"}</td><td>{m.role || "—"}</td>
                    <td><span className={`badge ${estActif(m) ? "bg-success" : "bg-secondary"}`}>{estActif(m) ? "Actif" : "Désactivé"}</span></td>
                    <td><div className="gestion-utilisateurs__actions"><button className="btn btn-sm" onClick={() => ouvrirModification(m)}><FiEdit2 /> Modifier</button><button className="btn btn-sm" disabled={m.id === utilisateurConnecteId} onClick={() => setConfirmation(m)}>{estActif(m) ? <FiUserX /> : <FiUserCheck />} {estActif(m) ? "Désactiver" : "Réactiver"}</button></div></td>
                  </tr>)}
                  {chargement && <tr><td colSpan="6" className="text-center">Chargement…</td></tr>}
                  {!chargement && visibles.length === 0 && <tr><td colSpan="6" className="text-center">Aucun utilisateur trouvé.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selection && <div className="modal d-block gestion-utilisateurs__modal" role="dialog" aria-modal="true"><div className="modal-dialog modal-lg modal-dialog-centered"><form className="modal-content" onSubmit={modifier}><div className="modal-header"><h5 className="modal-title">Modifier l’utilisateur</h5><button type="button" className="btn-close" onClick={() => setSelection(null)} aria-label="Fermer" /></div><div className="modal-body"><div className="row g-3">
        {[['name','Nom'],['last_name','Postnom'],['first_name','Prénom'],['email','Email'],['phone','Téléphone'],['address','Adresse']].map(([name,label]) => <div className="col-md-6" key={name}><label>{label}</label><input type={name === 'email' ? 'email' : 'text'} className="form-control" value={selection[name]} onChange={(e) => setSelection({...selection,[name]:e.target.value})} required={['name','last_name','first_name','email'].includes(name)} /></div>)}
        <div className="col-md-6"><label>Sexe</label><select className="form-control" value={selection.sexe} onChange={(e) => setSelection({...selection,sexe:e.target.value})}><option>Homme</option><option>Femme</option></select></div>
        <div className="col-md-6"><label>Fonction</label><select className="form-control" value={selection.fonction_id} onChange={(e) => setSelection({...selection,fonction_id:e.target.value})}><option value="">Sélectionner</option>{fonctions.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div>
        <div className="col-12"><label>Nouvelle photo <span className="text-muted">(optionnelle)</span></label><input type="file" className="form-control" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={choisirPhoto} disabled={photoEnPreparation} />{photoEnPreparation && <small className="text-muted d-block mt-1">Optimisation de la photo…</small>}{selection.file && !photoEnPreparation && <small className="text-success d-block mt-1">Photo prête ({Math.ceil(selection.file.size / 1024)} Ko).</small>}{erreurPhoto && <div className="text-danger mt-1" role="alert">{erreurPhoto}</div>}</div>
      </div></div><div className="modal-footer"><button type="button" className="btn" onClick={() => setSelection(null)}>Annuler</button><button className="btn" disabled={traitement}>{traitement ? "Enregistrement…" : "Enregistrer"}</button></div></form></div></div>}

      {confirmation && <div className="modal d-block gestion-utilisateurs__modal" role="dialog" aria-modal="true"><div className="modal-dialog modal-dialog-centered"><div className="modal-content"><div className="modal-header"><h5>{estActif(confirmation) ? "Désactiver" : "Réactiver"} l’utilisateur</h5><button type="button" className="btn-close" onClick={() => setConfirmation(null)} /></div><div className="modal-body">Confirmer l’action pour <strong>{confirmation.name} {confirmation.last_name}</strong> ? {estActif(confirmation) && "Ses sessions seront fermées, mais ses données seront conservées."}</div><div className="modal-footer"><button className="btn" onClick={() => setConfirmation(null)}>Annuler</button><button className="btn" disabled={traitement} onClick={changerStatut}>Confirmer</button></div></div></div></div>}
    </div>
  );
};

export default GestionUtilisateurs;
