import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { obtenirDirectionCycle } from "../../../../services/cycles/cyclesScolaires";
import MotifFormulaire from "./MotifFormulaire";

const API = "https://api.ecolapp.cd/api";
const formatMontant = (valeur) => Number(valeur || 0).toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const ListeMotifsPaiement = ({ BarreGauche, NavHaut, cycle }) => {
  const ecoleId = localStorage.getItem("ecole_id");
  const direction = obtenirDirectionCycle(cycle);
  const [motifs, setMotifs] = useState([]);
  const [devises, setDevises] = useState([]);
  const [selection, setSelection] = useState(null);
  const [suppression, setSuppression] = useState(null);
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(true);

  const charger = useCallback(async () => {
    setChargement(true);
    try {
      const [motifsResponse, devisesResponse] = await Promise.all([axios.get(`${API}/motif/ecole/${ecoleId}/direction/${direction}`), axios.get(`${API}/devise/ecole/${ecoleId}/direction/${direction}`)]);
      setMotifs(motifsResponse.data?.motifAll || []);
      setDevises(devisesResponse.data?.deviseAll || []);
    } catch { setErreur("Impossible de charger les motifs."); }
    finally { setChargement(false); }
  }, [ecoleId, direction]);

  useEffect(() => { charger(); }, [charger]);

  const apresModification = async (texte) => { setSelection(null); setMessage(texte); await charger(); };
  const supprimer = async () => {
    try {
      const response = await axios.get(`${API}/motif/delete/${suppression.id}`);
      if (Number(response.data?.status) !== 200) throw new Error();
      setSuppression(null); setMessage("Motif supprimé avec succès."); await charger();
    } catch { setErreur("Impossible de supprimer ce motif."); }
  };

  return <div className="container-fluid position-relative d-flex p-0"><BarreGauche /><main className="content"><NavHaut /><div className="container py-4"><div className="card"><div className="card-body"><div className="d-flex justify-content-between align-items-center gap-2 mb-3"><h1 className="h6 mb-0">Motifs de paiement</h1><Link to={`/${cycle}/ajouter_motif`} className="btn">Ajouter motif</Link></div>{message && <div className="alert alert-success">{message}</div>}{erreur && <div className="alert alert-danger">{erreur}</div>}<div className="table-responsive"><table className="table text-start align-middle mb-0"><thead><tr><th>Motif</th><th>Montant</th><th>Devise</th><th>Actions</th></tr></thead><tbody>{motifs.map((motif) => <tr key={motif.id}><td>{motif.name}</td><td>{formatMontant(motif.montant)}</td><td>{motif.devise?.name || "—"}</td><td><div className="d-flex flex-wrap gap-2"><button type="button" className="btn btn-sm" onClick={() => setSelection(motif)}>Modifier</button><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setSuppression(motif)}>Supprimer</button></div></td></tr>)}{!chargement && motifs.length === 0 && <tr><td colSpan="4" className="text-center">Aucun motif trouvé.</td></tr>}{chargement && <tr><td colSpan="4" className="text-center">Chargement…</td></tr>}</tbody></table></div></div></div></div></main>{selection && <div className="custom-modal" role="dialog" aria-modal="true"><div className="modal-content"><h2 className="h5">Modifier le motif</h2><MotifFormulaire motif={selection} devises={devises} ecoleId={ecoleId} direction={direction} onSuccess={apresModification} onCancel={() => setSelection(null)} /></div></div>}{suppression && <div className="custom-modal" role="dialog" aria-modal="true"><div className="modal-content"><h2 className="h5">Supprimer le motif</h2><p>Confirmer la suppression de <strong>{suppression.name}</strong> ? Son historique financier sera conservé.</p><div className="d-flex justify-content-end gap-2"><button type="button" className="btn btn-outline-secondary" onClick={() => setSuppression(null)}>Annuler</button><button type="button" className="btn btn-danger" onClick={supprimer}>Supprimer</button></div></div></div>}</div>;
};

export default ListeMotifsPaiement;
