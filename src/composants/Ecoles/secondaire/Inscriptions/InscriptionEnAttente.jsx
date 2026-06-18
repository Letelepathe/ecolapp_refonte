import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLeft from "../Administration/SidebarLeft";
import NavbarTop from "../Administration/NavbarTop";

const InscriptionEnAttente = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');
  
  const [inscriptions, setInscriptions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [options, setOptions] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClasse, setFilterClasse] = useState('');
  const [filterOption, setFilterOption] = useState('');
  const users_id = localStorage.getItem("userId"); // Récupérer l'userId depuis le localStorage

  // Fonction pour récupérer les classes et options
  const fetchOptions = useCallback(async () => {
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/option/ecole/${ecole_id}/direction/${direction}`);
      setOptions(response.data.optionAll);
      console.log(response.data.optionAll);
    } catch (error) {
      console.error("Erreur lors de la récupération des options", error);
    }
  }, [ecole_id, direction]);

   // Récupérer les classes
   const fetchClasses = useCallback(async () => {
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/classe/ecole/${ecole_id}/direction/${direction}`);
      setClasses(response.data.classesAll);
      console.log(response.data.classesAll)
    } catch (error) {
      console.error("Erreur lors de la récupération des classes", error);
    }
  }, [ecole_id, direction]);

  const fetchInscriptions = useCallback(async () => {
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/inscription/ecole/${ecole_id}/direction/${direction}`, {
        params: {
          search: searchTerm,       // Mot-clé de recherche
          filterClasse: filterClasse, // Filtre par classe
          filterOption: filterOption, // Filtre par option
        },
      }); 
  
      if (response.data.status === 200) {
        setInscriptions(response.data.inscriptionEnAttente);
      } else {
        setInscriptions([]);
      }
    } catch (error) {
      setError("Erreur lors de la récupération des données d'inscriptions.");
    }
  }, [searchTerm, filterClasse, filterOption, ecole_id, direction]);
  
  useEffect(() => {
    fetchClasses();
    fetchOptions();
  }, [ecole_id, direction, fetchClasses, fetchOptions]); 

  useEffect(() => {
    fetchInscriptions();  // Recharger les inscriptions quand les filtres changent
  }, [fetchInscriptions]);
 
  const confirmerInscription = async (id) => {
    try {
        const response = await axios.get(`https://api.ecolapp.cd/api/inscription/valide/${id}/${users_id}`);
        console.log("Réponse de l'API :", response.data);
        fetchInscriptions(); // Recharger les données après confirmation
    } catch (error) {
        console.error("Erreur API :", error);
        setError("Erreur lors de la confirmation de l'inscription.");
    }
  };


  const supprimerInscription = async (id) => {
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/inscription/delete/${id}`);
      console.log("Réponse de l'API :", response.data);
      fetchInscriptions(); // Recharger les données après suppression
    } catch (error) {
      setError("Erreur lors de la suppression de l'inscription.");
    }
  };

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className='container-fluid position-relative bg-white d-flex p-0'>
      <SidebarLeft />
      <div className="content">
        <NavbarTop />
        <div className="container mt-3">
          <div className="justify-content-between align-items-center d-flex">
            <Link to='/secondaire/liste_eleve' className='btn btn-warning text-white'>Listes élèves</Link>
            <Link to='/secondaire/liste_eleve_inscrit_secondaire' className='btn btn-warning text-white'>Inscriptions confirmées</Link>
            <Link to='/bulletin/checking' className='btn btn-white' target='_blank' rel='noopener noreferrer' style={{background:'#1769ff', color:'#fff'}}> Checker bulletin</Link>
          </div>
          <h2 className="text-center" style={{ color: '#1769ff' }}>Liste des Inscriptions du secondaire en attente</h2>

          {/* Barre de recherche et filtre */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Rechercher par nom, prénom, classe ou matricule"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 2 }}
            />
            <select
              className="form-select"
              value={filterClasse}
              onChange={(e) => setFilterClasse(e.target.value)}
              style={{ flex: 1 }}
            >
              <option value="">Filtrer par classe</option>
              {classes.map((classe) => (
                <option key={classe.id} value={classe.id}>{classe.name}</option>
              ))}
            </select>
            <select
              className="form-select"
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              style={{ flex: 1 }}
            >
              <option value="">Filtrer par option</option>
              {options.map((option) => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>

          {inscriptions.length === 0 ? (
            <p className="text-center mt-3">Aucune inscription trouvée.</p>
          ) : (
            <div className='table-responsive'>
              <table className="table table-striped mt-4">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Nom</th>
                    <th>Postnom</th>
                    <th>Prénom</th>
                    <th>École de Provenance</th>
                    <th>Pourcentage</th>
                    <th>Option</th>
                    <th>Classe</th>
                    <th>Année</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inscriptions.map((inscription, index) => (
                    <tr key={inscription.id}>
                      <td>{index + 1}</td>
                      <td>{inscription.name}</td>
                      <td>{inscription.last_name}</td>
                      <td>{inscription.first_name}</td>
                      <td>{inscription.ecole_provenance}</td>
                      <td>{inscription.percent}%</td>
                      <td>{inscription.option.name || 'N/A'}</td>
                      <td>{inscription.classe.name || 'N/A'}</td>
                      <td>{inscription.annee.name}</td>
                      <td>{Number(inscription.status) ? 'Confirmé' : 'Non confirmé'}</td>
                      <td className="justify-content-between d-flex">

                          {inscription.status !== undefined && Number(inscription.status) === 0 && (
                            <button
                              className="btn btn-primary mt-2 mb-2"
                              onClick={() => confirmerInscription(inscription.id)}
                            >
                              Confirmer
                            </button>
                          )}
                          
                          <button
                            className="btn btn-danger mt-2 mb-2"
                            onClick={() => supprimerInscription(inscription.id)}
                          >
                            Supprimer 
                          </button>
                          
                        <Link 
                          to={`/secondaire/details_info_eleve_inscrit/${inscription.id}`} 
                          className="btn btn-info text-white mt-2 mb-2" target='_blank' rel='noopener noreferrer'
                        > 
                          Détails    
                        </Link>
                      </td>    
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InscriptionEnAttente;
