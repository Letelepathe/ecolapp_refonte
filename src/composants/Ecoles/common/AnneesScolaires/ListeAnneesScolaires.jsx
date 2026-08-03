import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "https://api.ecolapp.cd/api";
const messageApi = (error, fallback) => error?.status_msg || error?.response?.data?.status_msg || error?.response?.data?.message || error?.response?.data?.error_msg || fallback;

const ListeAnneesScolaires = ({ BarreGauche, NavHaut, cycle }) => {
  const ecoleId = localStorage.getItem("ecole_id");
  const [annees, setAnnees] = useState([]);
  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");
  const [chargement, setChargement] = useState(true);
  const [actionId, setActionId] = useState(null);

  const charger = useCallback(async () => {
    setChargement(true);
    try {
      const response = await axios.get(`${API}/annee/ecole/${ecoleId}/direction/${cycle}`);
      setAnnees(Array.isArray(response.data?.anneeAll) ? response.data.anneeAll : []);
    } catch (error) {
      setErreur(messageApi(error, "Impossible de charger les années scolaires."));
    } finally {
      setChargement(false);
    }
  }, [ecoleId, cycle]);

  useEffect(() => { charger(); }, [charger]);

  const executer = async (annee, action) => {
    setActionId(annee.id);
    setErreur("");
    setMessage("");
    try {
      const url = action === "activer"
        ? `${API}/annee/activer/ecole/${ecoleId}/annee/${annee.id}/direction/${cycle}`
        : `${API}/annee/delete/${annee.id}`;
      const response = await axios.get(url);
      if (Number(response.data?.status) !== 200) throw response.data;
      setMessage(response.data?.status_msg || `Année ${action === "activer" ? "activée" : "désactivée"} avec succès.`);
      await charger();
    } catch (error) {
      setErreur(messageApi(error, `Impossible de ${action} cette année scolaire.`));
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="container-fluid position-relative d-flex p-0">
      <BarreGauche />
      <main className="content cycle-scolaire-page">
        <NavHaut />
        <div className="section d-flex flex-column align-items-center justify-content-center py-4">
          <div className="col-lg-6 col-md-8 col-12">
            <div className="card mb-3">
              <div className="card-body d-flex justify-content-between align-items-center gap-2">
                <h1 className="h6 mb-0">Liste des années scolaires</h1>
                <Link to={`/${cycle}/ajouter_annee_scolaire`} className="btn">Ajouter année</Link>
              </div>
              <div className="px-3">
                {message && <div className="alert alert-success">{message}</div>}
                {erreur && <div className="alert alert-danger">{erreur}</div>}
              </div>
              <div className="table-responsive">
                <table className="table text-start align-middle mb-0">
                  <thead><tr><th>Année scolaire</th><th>Statut</th><th>Action</th></tr></thead>
                  <tbody>
                    {annees.map((annee) => {
                      const active = Number(annee.status) === 1;
                      return <tr key={annee.id}><td>{annee.name}</td><td><span className={`badge ${active ? "bg-success" : "bg-secondary"}`}>{active ? "Active" : "Inactive"}</span></td><td><button type="button" className="btn btn-sm" disabled={actionId === annee.id} onClick={() => executer(annee, active ? "désactiver" : "activer")}>{actionId === annee.id ? "Traitement…" : active ? "Désactiver" : "Activer"}</button></td></tr>;
                    })}
                    {!chargement && annees.length === 0 && <tr><td colSpan="3" className="text-center">Aucune année trouvée.</td></tr>}
                    {chargement && <tr><td colSpan="3" className="text-center">Chargement…</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListeAnneesScolaires;
