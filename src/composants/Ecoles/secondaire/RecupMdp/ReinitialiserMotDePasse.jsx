import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ReinitialiserMotDePasse = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/ecole-app/apis/reset-password",
        { password, confirmPassword },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        navigate("/secondaire/reinitialisation-reussie"); 
      } else {
        console.log(response.data);
        setMessage(response.data.message);
      }
    } catch (err) {
      console.error("Erreur lors de la requête:", err);
      setMessage("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col-lg-6 col-12 card py-2">
          <h3 className="text-center">Réinitialisation du Mot de Passe</h3>
          <form onSubmit={handleReset}>
            <div className="mb-3">
              <label className="form-label">Nouveau mot de passe</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirmez le mot de passe</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn  w-100">
              Réinitialiser
            </button>
            {message && <p className="mt-3 text-danger">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReinitialiserMotDePasse;
