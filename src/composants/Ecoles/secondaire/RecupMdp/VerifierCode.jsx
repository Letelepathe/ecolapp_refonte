import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VerifierCode = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost/ecole-app/apis/verify-code.php",
        { code },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, 
        }
      );

      if (response.data.success) {
        setMessage("Code vérifié avec succès !");
        navigate("/secondaire/reinitialiser-mot-de-passe");
      } else {
        setMessage(response.data.message);
      }
    } catch (err) {
      console.error("Erreur lors de la requête:", err);
      setMessage(err.response?.data?.message || "Une erreur est survenue.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col-lg-8 col-12 card py-2">
            <h3 className="text-center">Vérification du Code</h3>
            <p className="text-center">Un code de vérification vous été envoyé par mail. Veuillez le saisir pour continuer.</p>
            <form onSubmit={handleVerify}>
              <div className="mb-3">
                
                <input
                  type="text"
                  className="form-control"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn  w-100">
                Vérifier
              </button>
              {message && <p className="mt-3">{message}</p>}
            </form>
        </div>
      </div>
    </div>
  );
};

export default VerifierCode;
 