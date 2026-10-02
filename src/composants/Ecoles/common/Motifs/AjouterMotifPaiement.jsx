import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { obtenirDirectionCycle } from "../../../../services/cycles/cyclesScolaires";
import MotifFormulaire from "./MotifFormulaire";

const API = "https://api.ecolapp.cd/api";

const AjouterMotifPaiement = ({ BarreGauche, NavHaut, cycle }) => {
  const ecoleId = localStorage.getItem("ecole_id");
  const direction = obtenirDirectionCycle(cycle);
  const [devises, setDevises] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`${API}/devise/ecole/${ecoleId}/direction/${direction}`).then((response) => setDevises(response.data?.deviseAll || [])).catch(() => setDevises([]));
  }, [ecoleId, direction]);

  return <div className="container-fluid position-relative d-flex p-0"><BarreGauche /><main className="content"><NavHaut /><div className="container"><section className="section d-flex flex-column align-items-center justify-content-center py-4"><div className="col-lg-6 col-md-8 col-12"><div className="card"><div className="card-body"><div className="d-flex justify-content-between align-items-center gap-2 mb-3"><h1 className="h6 mb-0">Ajouter un motif de paiement</h1><Link to={`/${cycle}/liste_motif`} className="btn">Liste motifs</Link></div>{message && <div className="alert alert-success">{message}</div>}{devises.length === 0 ? <div className="alert alert-warning">Ajoutez d’abord une devise active.</div> : <MotifFormulaire devises={devises} ecoleId={ecoleId} direction={direction} onSuccess={setMessage} />}</div></div></div></section></div></main></div>;
};

export default AjouterMotifPaiement;
