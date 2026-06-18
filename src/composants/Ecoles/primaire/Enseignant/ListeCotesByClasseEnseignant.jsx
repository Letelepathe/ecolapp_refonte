import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import SidebarLeft from "../Users/Profil/SidebarLeft";
import NavbarTop from "../Users/Profil/NavbarTop";

function getValidIntegerFromQuery(param, defaultValue = 0) {
  const value = new URLSearchParams(window.location.search).get(param);
  const integerValue = parseInt(value, 10);
  return Number.isInteger(integerValue) ? integerValue : defaultValue;
}

const ListeCotesByClasseEnseignant = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');
  
  const [cotes, setCotes] = useState([]);
  const [filteredCotes, setFilteredCotes] = useState([]);
  const [typesTravail, setTypesTravail] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeTravail, setSelectedTypeTravail] = useState('');
  const [errors, setErrors] = useState('');
  const [editNote, setEditNote] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const classeId = getValidIntegerFromQuery('classe_id', 0);
  const optionId = getValidIntegerFromQuery('option_id', 0);
  const periodeId = getValidIntegerFromQuery('periode_id', 0);
  const coursId = getValidIntegerFromQuery('cours_id', 0);

  useEffect(() => {
    const fetchCotes = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/cotes/ecole/${ecole_id}/direction/${direction}`, {
          params: { classe_id: classeId, option_id : optionId, periode_id: periodeId, cours_id: coursId, ecole_id : ecole_id, direction : direction },
          withCredentials: true,
        });

        if (Array.isArray(response.data.cotes)) {
          setCotes(response.data.cotes);
          setFilteredCotes(response.data.cotes);
          setErrors(''); 
        } else {
          setErrors("Les données récupérées ne sont pas valides.");
        }
        console.log(response.data); 
      } catch (error) {
        setErrors("Erreur lors de la récupération des cotes.");
      }
    };

    if (classeId && periodeId && coursId) {
      fetchCotes();
    } else {
      setErrors("Paramètres manquants.");
    }
  }, [classeId, optionId, periodeId, coursId, ecole_id, direction]);

  useEffect(() => {
    const fetchTypesTravail = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/typeTravail/ecole/${ecole_id}/direction/${direction}`);
        if (response.data.status === 200) {
          setTypesTravail(response.data.typetravailAll);
          setErrors('');
          console.log('Type travail', response.data.typetravailAll);
        } else {
          setErrors("Erreur lors de la récupération des types de travail.");
        }
      } catch (error) {
        setErrors("Erreur lors de la récupération des types de travail.");
      }
    };

    fetchTypesTravail();
  }, [ecole_id, direction]);

  const deleteCote = async (id) => {
    try {
      const response = await axios.get(`https://api.ecolapp.cd/api/cotes/delete/${id}`);
      if (response.data.status === 200) {
        const updatedCotes = cotes.filter(cote => cote.id !== id);
        setCotes(updatedCotes);
        setFilteredCotes(updatedCotes);
        setErrors(response.data.message);
      } else {
        setErrors(response.data.error_msg || "Erreur lors de la suppression.");
      }
    } catch (error) {
      setErrors("Une erreur s'est produite lors de la suppression.");
    }
  };

  const updateCote = async () => {
    if (editingId === null || editNote === null) {
      setErrors("ID de cote ou note à modifier manquants.");
      return;
    }

    try {
      const response = await axios.put(`https://api.ecolapp.cd/api/cotes/edit/${editingId}/${parseFloat(editNote)}`);

      if (response.data.status === 200) {
        const updatedCotes = cotes.map(cote => 
          cote.id === editingId ? { ...cote, note: editNote } : cote
        );
        setCotes(updatedCotes);
        setFilteredCotes(updatedCotes);
        setEditingId(null);
        setEditNote(null);
        setErrors('');
      } else {
        setErrors("Erreur lors de la modification.");
      }
    } catch (error) {
      setErrors("Erreur lors de la modification.");
    }
  };

  useEffect(() => {
    console.log("Données avant filtrage :", cotes);
    console.log("Terme de recherche :", searchTerm);
    console.log("Type sélectionné :", selectedTypeTravail);
  
    const filtered = cotes.filter(cote => {
      const coteTypeEpreuve = cote.type_epreuve ? cote.type_epreuve.trim().toLowerCase() : '';
      const selectedType = selectedTypeTravail.trim().toLowerCase();
      const search = searchTerm.trim().toLowerCase();
  
      const matchType = selectedType === '' || coteTypeEpreuve === selectedType;
      const matchNom = [
        cote.eleve.name?.toLowerCase(),
        cote.eleve.last_name?.toLowerCase(),
        cote.eleve.first_name?.toLowerCase() || ''
      ].some(field => field.includes(search));
  
      return matchType && matchNom;
    });
  
    console.log("Données après filtrage :", filtered);
  
    setFilteredCotes(filtered);
  }, [searchTerm, selectedTypeTravail, cotes]);
  

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <SidebarLeft />
      <div className="content">
        <NavbarTop />
          <div className="container mt-5">
           
            <div className="mt-2 mb-2 justify-content-between align-items-center d-flex">
                <Link to='/primaire/profil_user' className='btn btn-warning text-white'>
                  <i className="bi bi-arrow-left"></i> Retour
                </Link>
                
                <Link
                  to={`/primaire/cote_generale?classe_id=${classeId}&option_id=${optionId}&periode_id=${periodeId}&cours_id=${coursId}`}
                  className="btn btn-primary"
                >
                  Note générale
                </Link>
                <Link
                  to={`/primaire/deliberation?classe_id=${classeId}&option_id=${optionId}&periode_id=${periodeId}&cours_id=${coursId}`}
                  className="btn btn-success"
                >
                  Aller à la délibération
                </Link>
            </div> 


            <h2 className="text-center">Liste des Cotes</h2>

            {errors && <p className="text-danger">{errors}</p>}

            <div className="row mb-3">
              <div className="col-md-6 mb-2 mt-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher par nom, postnom ou prénom"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-2 mt-2">
                <select
                  className="form-control"
                  value={selectedTypeTravail}
                  onChange={(e) => setSelectedTypeTravail(e.target.value)}
                >
                  <option value="">Tous les types de travail</option>
                  {typesTravail.map(type => (
                    <option key={type.id} value={type.name.trim()}>{type.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Affichage des informations communes une seule fois */}
            {filteredCotes.length > 0 && (
              <div className="mb-3 text-center">
                <p><strong>Cotes des élèves de : </strong>{filteredCotes[0].classe.name || 'Non précisée'}</p>
                <p><strong>Cours : </strong>{filteredCotes[0].cour.name}</p>
                <p><strong>Épreuve : </strong>{filteredCotes[0].type_epreuve}</p>
                <p><strong>Période : </strong>{filteredCotes[0].periode.name}</p>
                <p><strong>Année scolaire : </strong>{filteredCotes[0].annee.name}</p>
                
              </div>
            )}

            {/* Tableau des élèves */}
            <div className="table-responsive container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Élève</th>
                    <th>Note obtenue</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCotes.length > 0 ? (
                    filteredCotes.map((cote, index) => (
                      <tr key={cote.id}>
                        <td>{index + 1}</td>
                        <td>{cote.eleve.name} {cote.eleve.last_name} {cote.eleve.first_name}</td>
                        <td>
                          {editingId === cote.id ? (
                            <input
                              type="number"
                              value={editNote}
                              onChange={(e) => setEditNote(e.target.value)}
                              step="0.01"
                            />
                          ) : (
                            <span>
                              {cote.note } / {cote.total_general}
                            </span>
                          )}
                        </td>
                        <td>
                          {editingId === cote.id ? (
                            <button className="btn btn-success btn-sm" onClick={updateCote}>Sauvegarder</button>
                          ) : (
                            <div className="d-flex">
                              <button 
                                className="btn btn-primary btn-sm mx-1" 
                                onClick={() => { setEditingId(cote.id); setEditNote(cote.note); }}
                              >
                                Modifier
                              </button>
                              <button 
                                className="btn btn-danger btn-sm" 
                                onClick={() => deleteCote(cote.id)}
                              >
                                Supprimer
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">Aucune cote disponible</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
      </div>
    </div>
  );
};

export default ListeCotesByClasseEnseignant; 
 