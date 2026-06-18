import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaiementModals = () => {
  const [tranches, setTranches] = useState([]);
  const [selectedTranche, setSelectedTranche] = useState('');
  const [isOrdreModalOpen, setIsOrdreModalOpen] = useState(false);
  const [isDetteModalOpen, setIsDetteModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch des tranches
  useEffect(() => {
    const fetchTranches = async () => {
      try {
        const response = await axios.get('https://api.ecolapp.cd/api/tranche/direction/3');
        setTranches(response.data.trancheAll);
      } catch (error) {
        setError('Erreur lors de la récupération des tranches');
      }
    };

    fetchTranches();
  }, []);

  // Gestion des redirections
  const handleOrdreSubmit = () => {
    if (selectedTranche) {
      navigate(`/primaire/paiement_en_ordre/${selectedTranche}`);
    } else {
      setError('Veuillez sélectionner une tranche avant de valider.');
    }
  };

  const handleDetteSubmit = () => {
    if (selectedTranche) {
      navigate(`/primaire/paiement_avec_dettes/${selectedTranche}`);
    } else {
      setError('Veuillez sélectionner une tranche avant de valider.');
    }
  };

  return (
    <div className="paiement-modals-container">
      {error && <p className="error-message">{error}</p>}

      {/* Boutons pour ouvrir les modales */}
      <button
        className="btn btn-primary"
        onClick={() => {
          setIsOrdreModalOpen(true);
          setError(null);
        }}
      >
        Paiements en ordre
      </button>
      <button
        className="btn btn-secondary"
        onClick={() => {
          setIsDetteModalOpen(true);
          setError(null);
        }}
      >
        Paiements avec dettes
      </button>

      {/* Modal pour paiements en ordre */}
      {isOrdreModalOpen && (
        <div className="custom-modal">
          <div className="modal-content">
            <h5 className="modal-title">Paiements en ordre</h5>
            <div className="mb-3">
              <label className="form-label">Sélectionnez une tranche</label>
              <select
                className="form-control"
                value={selectedTranche}
                onChange={(e) => setSelectedTranche(e.target.value)}
              >
                <option value="">-- Choisir une tranche --</option>
                {tranches.map((tranche) => (
                  <option key={tranche.id} value={tranche.id}>
                    {tranche.nom}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-footer justify-content-between align-items-center d-flex">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsOrdreModalOpen(false)}
              >
                Annuler
              </button>
              <button
                className="btn btn-primary"
                onClick={handleOrdreSubmit}
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour paiements avec dettes */}
      {isDetteModalOpen && (
        <div className="custom-modal">
          <div className="modal-content">
            <h5 className="modal-title">Paiements avec dettes</h5>
            <div className="mb-3">
              <label className="form-label">Sélectionnez une tranche</label>
              <select
                className="form-control"
                value={selectedTranche}
                onChange={(e) => setSelectedTranche(e.target.value)}
              >
                <option value="">-- Choisir une tranche --</option>
                {tranches.map((tranche) => (
                  <option key={tranche.id} value={tranche.id}>
                    {tranche.nom}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-footer justify-content-between align-items-center d-flex">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsDetteModalOpen(false)}
              >
                Annuler
              </button>
              <button
                className="btn btn-primary"
                onClick={handleDetteSubmit}
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
        }
        .error-message {
          color: red;
          font-size: 14px;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default PaiementModals;
