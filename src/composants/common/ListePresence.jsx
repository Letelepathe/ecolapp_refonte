import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { API_BASE_URL, messageErreur } from "../api/api";
import SidebarEcole from "./TableauDeBord/SidebarEcole";
import EcranChargement from "./EcranChargement";

const nomComplet = (eleve) =>
  [eleve.name, eleve.last_name, eleve.first_name].filter(Boolean).join(" ") || eleve.matricule || "Élève";

const ListePresence = () => {
  const { cycle } = useParams();
  const ecoleId = localStorage.getItem("ecole_id");
  const direction = localStorage.getItem("direction");
  const [eleves, setEleves] = useState([]);
  const [motifs, setMotifs] = useState([]);
  const [presences, setPresences] = useState({});
  const [recherche, setRecherche] = useState("");
  const [chargement, setChargement] = useState(true);
  const [enregistrement, setEnregistrement] = useState(false);
  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const charger = async () => {
      try {
        let page = 1;
        let dernierePage = 1;
        const resultat = [];
        do {
          const reponse = await axios.get(`${API_BASE_URL}/eleve/ecole/${ecoleId}/direction/${direction}?page=${page}`);
          const pagination = reponse.data?.eleve || {};
          resultat.push(...(Array.isArray(pagination.data) ? pagination.data : []));
          dernierePage = Number(pagination.last_page || 1);
          page += 1;
        } while (page <= dernierePage);
        const reponseMotifs = await axios.get(`${API_BASE_URL}/motif_absence/ecole/${ecoleId}/direction/${direction}`);
        setEleves(resultat);
        setMotifs(reponseMotifs.data?.motifAll || []);
      } catch (error) {
        setErreur(messageErreur(error, "Impossible de charger la liste de présence."));
      } finally {
        setChargement(false);
      }
    };
    if (ecoleId && direction) charger();
    else { setErreur("École ou direction introuvable dans la session."); setChargement(false); }
  }, [ecoleId, direction]);

  const elevesFiltres = useMemo(() => {
    const valeur = recherche.trim().toLowerCase();
    return valeur ? eleves.filter((eleve) =>
      `${nomComplet(eleve)} ${eleve.classe?.name || ""} ${eleve.option?.name || ""}`.toLowerCase().includes(valeur)
    ) : eleves;
  }, [eleves, recherche]);

  const modifier = (id, changement) => setPresences((actuelles) => ({
    ...actuelles,
    [id]: { ...actuelles[id], ...changement },
  }));

  const enregistrer = async () => {
    setErreur(""); setMessage("");
    if (eleves.some((eleve) => typeof presences[eleve.id]?.present !== "boolean")) {
      setErreur("Cochez Présent ou Absent pour chaque élève."); return;
    }
    if (eleves.some((eleve) => presences[eleve.id].present === false && !presences[eleve.id].motif_absence)) {
      setErreur("Sélectionnez un motif pour chaque élève absent."); return;
    }
    const donnees = eleves.map((eleve) => ({
      ecole_id: ecoleId, direction, eleve_id: eleve.id,
      date_presence: new Date().toISOString().slice(0, 10),
      present: presences[eleve.id].present ? 1 : 0,
      motif_absence: presences[eleve.id].motif_absence || null,
    }));
    setEnregistrement(true);
    try {
      const reponse = await axios.post(`${API_BASE_URL}/presences/create`, { presences: donnees });
      if (Number(reponse.data?.status) !== 200) throw new Error(reponse.data?.message || "Enregistrement refusé");
      setMessage("Liste de présence enregistrée avec succès.");
    } catch (error) {
      setErreur(messageErreur(error, "Impossible d’enregistrer les présences."));
    } finally { setEnregistrement(false); }
  };

  if (chargement) return <EcranChargement titre="Chargement de la liste de présence" />;
  return <div className="container-fluid position-relative d-flex p-0 refonte-shell">
    <Helmet><title>Ecolapp | Liste présence</title></Helmet>
    <SidebarEcole cycle={cycle} titreCycle={cycle} />
    <main className="content refonte-content dashboard-page p-4">
      <div className="dashboard-hero"><div><h1>Liste présence</h1><p>Enregistrez la présence quotidienne de tous les élèves.</p></div></div>
      {erreur && <div className="alert alert-danger">{erreur}</div>}{message && <div className="alert alert-success">{message}</div>}
      <section className="card p-3">
        <div className="d-flex flex-wrap justify-content-between gap-2 mb-3"><h5>Présences du jour</h5><input className="form-control w-auto" value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Rechercher un élève" /></div>
        <div className="table-responsive"><table className="table align-middle"><thead><tr><th>Élève</th><th>Classe / option</th><th>Présent</th><th>Absent</th><th>Motif</th></tr></thead><tbody>
          {elevesFiltres.map((eleve) => { const presence = presences[eleve.id] || {}; return <tr key={eleve.id}><td>{nomComplet(eleve)}</td><td>{eleve.classe?.name || "-"} {eleve.option?.name || ""}</td><td><input type="checkbox" checked={presence.present === true} onChange={() => modifier(eleve.id, { present: true, motif_absence: null })} /></td><td><input type="checkbox" checked={presence.present === false} onChange={() => modifier(eleve.id, { present: false })} /></td><td><select className="form-select" disabled={presence.present !== false} value={presence.motif_absence || ""} onChange={(e) => modifier(eleve.id, { motif_absence: e.target.value })}><option value="">Sélectionner</option>{motifs.map((motif) => <option key={motif.id} value={motif.id}>{motif.name}</option>)}</select></td></tr>; })}
          {!elevesFiltres.length && <tr><td colSpan="5" className="text-center text-muted">Aucun élève trouvé.</td></tr>}
        </tbody></table></div>
        <button className="btn align-self-start" disabled={enregistrement || !eleves.length} onClick={enregistrer}>{enregistrement ? "Enregistrement..." : "Enregistrer"}</button>
      </section>
    </main>
  </div>;
};

export default ListePresence;
