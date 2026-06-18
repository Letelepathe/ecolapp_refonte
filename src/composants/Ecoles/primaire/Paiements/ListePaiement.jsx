import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import SidebarLeft from "../Administration/SidebarLeft";
import NavbarTop from "../Administration/NavbarTop";
import LogoEcoleApp from '../../../../static/images/logo_ecolapp.jpg';

const ListePaiement = () => {
  const ecole_id = localStorage.getItem('ecole_id'); 
  const direction = localStorage.getItem('direction'); 

  const [paiements, setPaiements] = useState([]);
  const [filteredPaiements, setFilteredPaiements] = useState([]); // État pour le filtrage
  const [searchTerm, setSearchTerm] = useState(""); // Terme de recherche
  const [selectedClass, setSelectedClass] = useState(""); // Classe sélectionnée
  const [classes, setClasses] = useState([]); // Liste des classes
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedOption, setSelectedOption] = useState(""); 
  const [options, setOptions] = useState([]); 

  const receiptRef = useRef(null);

  const [motifs, setMotifs] = useState([]);
  const [selectedMotif, setSelectedMotif] = useState('');
  const [isOrdreModalOpen, setIsOrdreModalOpen] = useState(false);
  const [isDetteModalOpen, setIsDetteModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch des motifs
  useEffect(() => {
    const fetchMotifs = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/motif/ecole/${ecole_id}/direction/${direction}`);
        setMotifs(response.data.motifAll);
      } catch (error) {
        setError('Erreur lors de la récupération des motifs');
      }
    };

    fetchMotifs();
  }, [ecole_id, direction]);

  // Gestion des redirections
  const handleOrdreSubmit = () => {
    if (selectedMotif) {
      navigate(`/primaire/paiement_en_ordre/${selectedMotif}`);
    } else {
      setError('Veuillez sélectionner une tranche avant de valider.');
    }
  };

  const handleDetteSubmit = () => {
    if (selectedMotif) {
      navigate(`/primaire/paiement_avec_dette/${selectedMotif}`);
    } else {
      setError('Veuillez sélectionner une tranche avant de valider.');
    }
  };




  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/classe/ecole/${ecole_id}/direction/${direction}`);
        setClasses(response.data.classesAll);
      } catch (error) {
        setError("Erreur lors de la récupération des classes");
      }
    };

    fetchClasses();
  }, [ecole_id, direction]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/option/ecole/${ecole_id}/direction/${direction}`);
        setOptions(response.data.optionAll);
      } catch (error) {
        setError("Erreur lors de la récupération des options");
      }
    };

    fetchOptions();
  }, [ecole_id, direction]);

  // Fetch des paiements
  useEffect(() => {
    const fetchPaiements = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/paiement/ecole/${ecole_id}/direction/${direction}`);
        setPaiements(response.data.paiementsAll);
        setFilteredPaiements(response.data.paiementsAll);
      } catch (error) {
        setError("Erreur lors de la récupération des paiements");
      }
    };

    fetchPaiements();
  }, [ecole_id, direction]);

  // Filtrer les paiements par classe, option et recherche
  useEffect(() => {
    const results = paiements.filter((paiement) => {
      const name = paiement.eleve.name?.toLowerCase() || "";
      const last_name = paiement.eleve.last_name?.toLowerCase() || "";
      const first_name = paiement.eleve.first_name?.toLowerCase() || "";
      const matricule = String(paiement.eleve.matricule || "").toLowerCase();
      const name_annee = paiement.annee.name?.toLowerCase() || "";

      // Vérifier si l'élève appartient à l'option sélectionnée
      const matchesOption = selectedOption ? paiement.eleve.options_id === Number(selectedOption) : true;
      // Vérifier si l'élève appartient à la classe sélectionnée
      const matchesClass = selectedClass ? paiement.classe.name === selectedClass : true;

      return (
        matchesClass &&
        matchesOption &&
        (name.includes(searchTerm.toLowerCase()) ||
          last_name.includes(searchTerm.toLowerCase()) ||
          first_name.includes(searchTerm.toLowerCase()) ||
          matricule.includes(searchTerm.toLowerCase()) ||
          name_annee.includes(searchTerm.toLowerCase()))
      );
    });

    setFilteredPaiements(results);
  }, [searchTerm, selectedClass, selectedOption, paiements]);


  const generateProof = async (paiementId) => {
    try {
      const response = await axios.get(
        `https://api.ecolapp.cd/api/paiement/${paiementId}`
      );

      if (response.data.status === 200) {
        setSelectedReceipt(response.data.paiement);
        setError(""); // Réinitialiser l'erreur
      } else {
        setError(response.data.message || "Erreur lors de la récupération de la preuve.");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur.");
    }
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <SidebarLeft />
      <div className="content">
        <NavbarTop />
        <section className="container mt-3 shadow bg-white py-3">
          <div className="justify-content-between align-items-center d-flex">
            <h2 className="text-primary text-center">Liste des paiements</h2>
            <Link to="/primaire/ajouter_paiement" className="btn btn-primary mb-3">
              <i className="bi bi-plus"></i> Ajouter paiement
            </Link>
          </div>
          <div className="justify-content-between align-items-center d-flex">
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
          </div>
          <div className="table-responsive hide-on-print">
            
            {error && <p className="text-danger">{error}</p>}

            {/* Sélection de la classe */}
            <select
              className="form-select mb-3"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Toutes les classes</option>
              {classes.map((classe) => (
                <option key={classe.id} value={classe.name}>
                  {classe.name}
                </option>
              ))}
            </select>

            <select
                className="form-select mb-3"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
            >
                <option value="">Toutes les options</option>
                {options.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.name}
                </option>
                ))}
            </select>

            {/* Barre de recherche */}
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Rechercher par nom, postnom, prénom, matricule ou année..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {filteredPaiements.length > 0 ? (
              <table className="table text-start align-middle table-bordered table-hover mb-0">
                <thead>
                  <tr className="text-dark">
                    <th>Id</th>
                    <th>Nom</th>
                    <th>Postnom</th>
                    <th>Prénom</th>
                    <th>Sexe</th>
                    <th>Classe</th>
                    <th>Matricule</th>
                    <th>Montant</th>
                    <th>Devise</th>
                    <th>Mode</th>
                    <th>Tranche</th>
                    <th>Motif</th>
                    <th>Année scolaire</th>
                    <th>Date et heure</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPaiements.map((paiement, index) => (
                    <tr key={paiement.id}>
                      <td>{index + 1}</td>
                      <td>{paiement.eleve.name}</td>
                      <td>{paiement.eleve.last_name}</td>
                      <td>{paiement.eleve.first_name}</td>
                      <td>{paiement.eleve.sexe}</td>
                      <td>{paiement.classe.name}</td>
                      <td>{paiement.eleve.matricule}</td>
                      <td>{paiement.montant}</td>
                      <td>{paiement.devise.name}</td>
                      <td>{paiement.mode_paiement.name}</td>
                      <td>{paiement.tranche.name}</td>
                      <td>{paiement.motif.name}</td>
                      <td>{paiement.annee.name}</td>
                      <td>
                        {new Date(paiement.created_at).toLocaleString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                        })}
                      </td>
                      
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => generateProof(paiement.id)}
                        >
                          Générer Preuve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Aucun paiement correspondant trouvé.</p>
            )}
          </div>

          {/* Reçu pour paiement sélectionné */}
          {selectedReceipt && (
            <div ref={receiptRef} className="mt-4">
              <div className="receipt-container">
                <div className="bloc_header">
                  <h5>ecolapp</h5>
                  <img src={LogoEcoleApp} alt="Logo de l'école" className="logo_paiement" />
                </div>
                <div className="receipt-header">Reçu de Paiement N° {selectedReceipt.id}</div>

                <div className="receipt-section">
                  <div>
                    <span className="label_paiement">Nom :</span> <span className="info">{selectedReceipt.eleve.name} </span><br />
                    <span className="label_paiement">Postnom :</span> <span className="info">{selectedReceipt.eleve.last_name} </span><br />
                    <span className="label_paiement">Prénom :</span> <span className="info">{selectedReceipt.eleve.first_name} </span>
                  </div>
                  <div>
                    <span className="label_paiement">Sexe :</span> <span className="info">{selectedReceipt.eleve.sexe} </span><br />
                    <span className="label_paiement">Classe :</span> <span className="info">{selectedReceipt.classe.name} </span><br />
                    <span className="label_paiement">Matricule :</span> <span className="info">{selectedReceipt.eleve.matricule} </span>
                  </div>
                </div>

                <div className="receipt-section">
                  <div>
                    <span className="label_paiement">Année scolaire :</span> <span className="info">{selectedReceipt.annee.name} </span><br />
                    <span className="label_paiement">Motif :</span> <span className="info">{selectedReceipt.motif.name}</span>
                  </div>
                  <div>
                    <span className="label_paiement">Devise :</span> <span className="info">{selectedReceipt.devise.name} </span><br />
                    <span className="label_paiement">Montant :</span> <span className="info">{selectedReceipt.montant} </span><br />
                    <span className="label_paiement">Tranche :</span> <span className="info">{selectedReceipt.tranche.name} </span>
                  </div>
                </div>

                <div className="signature">
                  <span>{new Date(selectedReceipt.created_at).toLocaleString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                  </span>
                </div>
                <button className="btn btn-primary hide-on-print" onClick={printReceipt}>
                  Imprimer
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
      {/* Modal pour paiements en ordre */}
      {isOrdreModalOpen && (
        <div className="custom-modal">
          <div className="modal-content">
            <h5 className="modal-title">Paiements en ordre</h5>
            <div className="mb-3">
              <label className="form-label">Sélectionnez un motif</label>
              <select
                className="form-control"
                value={selectedMotif}
                onChange={(e) => setSelectedMotif(e.target.value)}
              >
                <option value="">-- Choisir un motif --</option>
                {motifs.map((motif) => (
                  <option key={motif.id} value={motif.id}>
                    {motif.name}
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
              <label className="form-label">Sélectionnez un motif</label>
              <select
                className="form-control"
                value={selectedMotif}
                onChange={(e) => setSelectedMotif(e.target.value)}
              >
                <option value="">-- Choisir un motif --</option>
                {motifs.map((motif) => (
                  <option key={motif.id} value={motif.id}>
                    {motif.name}
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
      
    </div>
  );
};

export default ListePaiement;
