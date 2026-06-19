import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const CheckMatricule = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');
  const [matricule, setMatricule] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!matricule.trim()) {
      setErrorMessage('Veuillez saisir le matricule.');
      setIsLoading(false);
    }
    setErrorMessage('');
    setIsLoading(true);
    try {
      console.log("Envoi du matricule:", matricule);

      // Appel de l'API pour vérifier le matricule
      const response = await axios.post('https://api.ecolapp.cd/api/eleve/suivi/checkMatricule', { matricule, ecole_id: ecole_id, direction: direction }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('Réponse de l\'API:', response.data);

      // Vérifier la réponse de l'API
      if (response.data.success) {
        localStorage.setItem('eleveId', response.data.id_eleve);
        // Rediriger l'utilisateur vers le panel de l'élève avec l'ID récupéré
        navigate(`/maternelle/panel_eleve/${response.data.eleve.id}/${response.data.eleve.ecole_id}/${response.data.eleve.direction}`);
      } else {
        // Afficher un message d'erreur si l'élève n'est pas trouvé
        setErrorMessage(response.data.message);
        setMatricule('');
      }
      console.log(response.data);
    } catch (error) {
      console.error('Erreur lors de la requête:', error);
      setErrorMessage("Une erreur s'est produite. Veuillez réessayer plus tard.");
      setMatricule('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="code-admin-container">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-lg-6 text-center u-style-469e96e5">
            <h2 className="mb-4 u-style-43ef163a">
              <i className="bi bi-person-check-fill me-2"></i>Vérification d'Identité
            </h2>
            <hr />
            <p className="mb-4 text-muted">
              Veuillez saisir votre matricule pour confirmer que vous êtes un élève ou un parent d'élève.
            </p>
            <form onSubmit={handleSubmit} className="code-form mt-4 p-4">
              <input
                type="text"
                name="matricule"
                className="form-control mb-3 code-input"
                placeholder="Matricule"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)} />
              
              <button type="submit" disabled={isLoading} className="btn  w-100 submit-button">
              {isLoading ? "Traitement en cours..." : "Valider"}
              </button>
              {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>);

};

export default CheckMatricule;
