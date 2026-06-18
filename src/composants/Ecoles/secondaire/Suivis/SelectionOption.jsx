import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';

const SelectionOption = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage(''); 

    try {
      const response = await axios.post('http://localhost/ecole-app/apis/traitementSelection.php', {
        choix: selectedOption,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, 
      });

      setResponseMessage(response.data.message);

      if (response.data.success) {
        switch (selectedOption) {
          case 'resultats':
            navigate('/secondaire/resultats');
            break;
          case 'frais':
            navigate('/secondaire/frais');
            break;
          case 'cours':
            navigate('/secondaire/cours');
            break;
          case 'notes':
            navigate('/secondaire/notes');
            break;
          case 'emploi':
                navigate('/secondaire/emploi');
                break;
          default:
            navigate('/secondaire');
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
          <div className="col-lg-6 text-center" style={{ marginTop: '150px' }}>
            <h2 className="mb-4" style={{color: '#1769ff'}}>
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
                required
              >
                <option value="" disabled>Choisissez une option...</option>
                <option value="resultats">Consulter les résultats</option>
                <option value="frais">Voir les frais de scolarité</option>
                <option value="cours">Consulter les cours enseignés</option>
                <option value="notes">Consulter les notes</option>
                <option value="emploi">Consulter l'emploi du temps</option>
              </select>
              <button className="btn btn-white" style={{background:'#1769ff', color:'#fff', padding:'10px', borderRadius:'25px'}} type="submit">Valider</button>
              {responseMessage && <p className="mt-3 text-info">{responseMessage}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionOption;
