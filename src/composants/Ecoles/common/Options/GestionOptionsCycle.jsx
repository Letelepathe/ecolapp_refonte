import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { obtenirDirectionCycle } from "../../../../services/cycles/cyclesScolaires";

const API = "https://api.ecolapp.cd/api";

const lireErreur = (error, fallback) => {
  const data = error?.response?.data;
  const validations = data?.errorsList || data?.errors;
  if (validations) return Object.values(validations).flat().join(" ");
  return data?.error_msg || data?.message || fallback;
};

const Cadre = ({ SidebarLeft, NavbarTop, children }) => (
  <div className="container-fluid position-relative d-flex p-0">
    <SidebarLeft />
    <div className="content">
      <NavbarTop />
      <div className="container py-4">{children}</div>
    </div>
  </div>
);

export const AjouterOptionCycle = ({ cycle, SidebarLeft, NavbarTop }) => {
  const ecoleId = localStorage.getItem("ecole_id");
  const direction = obtenirDirectionCycle(cycle);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (!name.trim()) return setError("Le nom de l'option est requis.");
    setSaving(true);
    try {
      const response = await axios.post(`${API}/option/create`, {
        name: name.trim(), ecole_id: Number(ecoleId), direction, section_id: null,
      });
      if (Number(response.data.status) !== 200) throw { response };
      setName("");
      setMessage("Option ajoutée avec succès.");
    } catch (requestError) {
      setError(lireErreur(requestError, "Impossible d'ajouter cette option."));
    } finally {
      setSaving(false);
    }
  };

  return <Cadre SidebarLeft={SidebarLeft} NavbarTop={NavbarTop}>
    <section className="section d-flex justify-content-center">
      <div className="col-lg-6 col-md-8 col-12 card"><div className="card-body">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <Link to={`/${cycle}/liste_option`} className="btn text-white">Liste des options</Link>
          <h6 className="mb-0">Ajouter une option</h6>
        </div>
        <form onSubmit={submit} noValidate>
          <label htmlFor="option-name">Nom de l'option ou du programme</label>
          <input id="option-name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
          <small className="text-muted">Cette option sera utilisée automatiquement lors des inscriptions de ce cycle.</small>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {message && <div className="alert alert-success mt-3">{message}</div>}
          <button className="btn w-100 mt-3" disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer"}</button>
        </form>
      </div></div>
    </section>
  </Cadre>;
};

export const ListeOptionsCycle = ({ cycle, SidebarLeft, NavbarTop }) => {
  const ecoleId = localStorage.getItem("ecole_id");
  const direction = obtenirDirectionCycle(cycle);
  const [options, setOptions] = useState([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/option/ecole/${ecoleId}/direction/${direction}`);
      setOptions(response.data.optionAll || []);
    } catch (requestError) {
      setError(lireErreur(requestError, "Impossible de charger les options."));
    }
  }, [direction, ecoleId]);
  useEffect(() => { load(); }, [load]);

  const remove = async (id) => {
    if (!window.confirm("Désactiver cette option ?")) return;
    try {
      await axios.get(`${API}/option/delete/${id}`);
      setOptions((current) => current.filter((option) => option.id !== id));
    } catch (requestError) {
      setError(lireErreur(requestError, "Impossible de désactiver cette option."));
    }
  };

  return <Cadre SidebarLeft={SidebarLeft} NavbarTop={NavbarTop}>
    <div className="card"><div className="card-body">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <h6 className="mb-0">Options et programmes</h6>
        <Link className="btn" to={`/${cycle}/ajouter_option`}>Ajouter une option</Link>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive"><table className="table align-middle mb-0">
        <thead><tr><th>Nom</th><th className="text-end">Action</th></tr></thead>
        <tbody>{options.map((option) => <tr key={option.id}>
          <td>{option.name}</td>
          <td className="text-end"><button type="button" className="btn btn-sm" onClick={() => remove(option.id)}>Désactiver</button></td>
        </tr>)}</tbody>
      </table></div>
      {!options.length && !error && <p className="text-muted mt-3">Aucune option configurée pour ce cycle.</p>}
    </div></div>
  </Cadre>;
};
