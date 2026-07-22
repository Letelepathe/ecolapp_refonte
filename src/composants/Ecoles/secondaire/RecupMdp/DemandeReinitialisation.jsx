import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DemandeReinitialisation = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost/ecole-app/apis/request-reset", 
        { email },
        {
          headers: {
            "Content-Type": "application/json", 
          },
          withCredentials: true, 
        }
      );

      console.log("Réponse API :", response); 
      setSuccess(response.data.message); 
      navigate("/secondaire/verifier-code", { state: { email } }); 
    } catch (err) {
      console.error("Erreur lors de la requête :", err.response || err);
      setError(err.response?.data?.error || "Une erreur est survenue."); 
    }
  };

  return (
    <div className="container mt-5">
      <div className="card row">
        <div className="col-lg-6 col-12 card py-2">
          <div className="card-header text-center">
            <h3>Demande de Réinitialisation</h3>
          </div>
          <div className="card-body">
            {/* Message d'erreur */}
            {error && <div className="alert alert-danger">{error}</div>}
            {/* Message de succès */}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Adresse e-mail</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Entrez votre e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn  w-100">
                Envoyer
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandeReinitialisation;
