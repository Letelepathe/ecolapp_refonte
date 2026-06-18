import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ChangerCodeAdmin = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      console.log("Requête déjà en cours, requête ignorée.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      console.log("Envoi de la requête...");
      const response = await axios.post('http://localhost/ecole-app/apis/changeCodeAdmin.php', null, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Réponse reçue : ", response.data);

      if (response.data.success) {
        setErrorMessage(response.data.message);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi : ", error);
      setErrorMessage("Une erreur s'est produite. Veuillez réessayer plus tard.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="code-admin-container">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-lg-6 text-center u-style-469e96e5">
            <h2 className="mb-4 u-style-43ef163a">Administration</h2>
            <p>Changer code admin</p>
            <hr />
            <form onSubmit={handleSubmit} className="code-form mt-4 p-4">
              <button
                type="submit"
                className="btn btn-primary w-100 submit-button"
                disabled={isSubmitting} // Désactive le bouton pendant la soumission
              >
                {isSubmitting ? 'Génération en cours...' : 'Générer'}
              </button>
              {errorMessage &&
              <p className="text-danger mt-3">
                  {errorMessage} <br />
                  <Link to='/secondaire/bureau_admin' className='btn btn-primary'>Retour</Link>
                </p>
              }
            </form>
          </div>
        </div>
      </div>
    </div>);

};

export default ChangerCodeAdmin;
