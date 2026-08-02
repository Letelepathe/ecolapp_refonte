import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "https://api.ecolapp.cd/api";

const extraireMessageErreur = (error) => {
  const data = error?.response?.data || error;
  const erreurs = data?.errorsList || data?.errors;
  const premierMessage = erreurs
    ? Object.values(erreurs).flat().find(Boolean)
    : null;

  return (
    premierMessage ||
    data?.error_msg ||
    data?.message ||
    "Une erreur est survenue, veuillez réessayer."
  );
};

const AjouterAnneeScolaire = ({ BarreGauche, NavHaut, cycle }) => {
  const [annee, setAnnee] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const name = annee.trim();
    if (!name) {
      setErrorMessage("L’année scolaire est requise.");
      return;
    }

    const ecoleId = localStorage.getItem("ecole_id");
    if (!ecoleId) {
      setErrorMessage("L’école active est introuvable. Reconnectez-vous.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API}/annee/create`, {
        name,
        ecole_id: ecoleId,
        direction: cycle,
      });

      if (Number(response.data?.status) !== 200) {
        throw response.data;
      }

      setSuccessMessage("Année scolaire ajoutée avec succès !");
      setAnnee("");
    } catch (error) {
      setErrorMessage(extraireMessageErreur(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid position-relative d-flex p-0">
      <BarreGauche />
      <main className="content">
        <NavHaut />
        <div className="section d-flex flex-column align-items-center justify-content-center py-4">
          <div className="col-lg-6 col-md-8 col-12">
            <div className="card mb-3">
              <div className="card-body">
                <div className="justify-content-between align-items-center d-flex gap-2">
                  <Link to={`/${cycle}/liste_annee_scolaire`} className="btn">
                    Liste années
                  </Link>
                  <h1 className="h6 text-center mb-0">Ajouter année scolaire</h1>
                </div>
                <form onSubmit={handleSubmit} className="mt-3">
                  <div className="form-group">
                    <label htmlFor={`annee-${cycle}`}>Année scolaire</label>
                    <input
                      type="text"
                      className="form-control"
                      id={`annee-${cycle}`}
                      value={annee}
                      onChange={(event) => setAnnee(event.target.value)}
                      placeholder="2026-2027"
                      autoComplete="off"
                    />
                  </div>
                  {errorMessage && (
                    <div className="alert alert-danger mt-3" role="alert">
                      {errorMessage}
                    </div>
                  )}
                  {successMessage && (
                    <div className="alert alert-success mt-3" role="status">
                      {successMessage}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn w-100 mt-2 mb-2"
                  >
                    {isSubmitting ? "Enregistrement en cours…" : "Enregistrer"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AjouterAnneeScolaire;
