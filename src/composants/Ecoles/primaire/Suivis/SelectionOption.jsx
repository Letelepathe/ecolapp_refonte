import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const SelectionOption = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage('');

    try {
      const response = await axios.post('http://localhost/ecole-app/apis/traitementSelection.php', {
        choix: selectedOption
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      setResponseMessage(response.data.message);

      if (response.data.success) {
        switch (selectedOption) {
          case 'resultats':
            navigate('/primaire/resultats');
            break;
          case 'frais':
            navigate('/primaire/frais');
            break;
          case 'cours':
            navigate('/primaire/cours');
            break;
          case 'notes':
            navigate('/primaire/notes');
            break;
          case 'emploi':
            navigate('/primaire/emploi');
            break;
          default:
            navigate('/primaire');
            break;
        }
      }
    } catch (error) {
      setResponseMessage("Erreur lors de la communication avec l'API.");
      console.error(error);
    }
  };

  return (
    <div className="code-admin-container">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-lg-6 text-center u-style-469e96e5">
            <h2 className="mb-4 u-style-43ef163a">
              <i className="bi bi-ui-checks me-2"></i>Choix de l'Action
            </h2>
            <hr />
            <p className="mb-4 text-muted">
              Veuillez sélectionner une option pour continuer :
            </p>
            <form onSubmit={handleSubmit} className="selection-form mt-4 p-4">
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="form-select mb-3"
                required>
                
                <option value="" disabled>Choisissez une option...</option>
                <option value="resultats">Consulter les résultats</option>
                <option value="frais">Voir les frais de scolarité</option>
                <option value="cours">Consulter les cours enseignés</option>
                <option value="notes">Consulter les notes</option>
                <option value="emploi">Consulter l'emploi du temps</option>
              </select>
              <button type="submit" className="btn  w-100 submit-button">
                Valider
              </button>
              {responseMessage && <p className="mt-3 text-info">{responseMessage}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>);

};

export default SelectionOption;
