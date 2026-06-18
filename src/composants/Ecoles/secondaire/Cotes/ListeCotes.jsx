import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import SidebarLeft from "../Administration/SidebarLeft";
import NavbarTop from "../Administration/NavbarTop";

function getValidIntegerFromQuery(param, defaultValue = 0) {
  const value = new URLSearchParams(window.location.search).get(param);
  const integerValue = parseInt(value, 10);
  return Number.isInteger(integerValue) ? integerValue : defaultValue;
}

const ListeCotes = () => {
  const [cotes, setCotes] = useState([]);
  const [filteredCotes, setFilteredCotes] = useState([]);
  const [typesTravail, setTypesTravail] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeTravail, setSelectedTypeTravail] = useState('');
  const [errors, setErrors] = useState('');
  const [editNote, setEditNote] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const classeId = getValidIntegerFromQuery('classe_id', 0);
  const periodeId = getValidIntegerFromQuery('periode_id', 0);
  const coursId = getValidIntegerFromQuery('cours_id', 0);

  useEffect(() => {
    const fetchCotes = async () => {
      try {
        const response = await axios.get('http://localhost/ecole-app/apis/getCote.php', {
          params: { classe_id: classeId, periode_id: periodeId, cours_id: coursId },
          withCredentials: true,
        });

        if (Array.isArray(response.data)) {
          setCotes(response.data);
          setFilteredCotes(response.data);
          setErrors(''); 
        } else {
          setErrors("Les données récupérées ne sont pas valides.");
        }
      } catch (error) {
        setErrors("Erreur lors de la récupération des cotes.");
      }
    };

    if (classeId && periodeId && coursId) {
      fetchCotes();
    } else {
      setErrors("Paramètres manquants.");
    }
  }, [classeId, periodeId, coursId]);

  useEffect(() => {
    const fetchTypesTravail = async () => {
      try {
        const response = await axios.get('http://localhost/ecole-app/apis/getTypeTravail');
        if (Array.isArray(response.data)) {
          setTypesTravail(response.data);
          setErrors(''); 
        } else {
          setErrors("Erreur lors de la récupération des types de travail.");
        }
      } catch (error) {
        setErrors("Erreur lors de la récupération des types de travail.");
      }
    };

    fetchTypesTravail();
  }, []);

  const deleteCote = async (id) => {
    try {
      const response = await axios.post('http://localhost/ecole-app/apis/deleteCote.php', { id_cote: id });
      if (response.data.success) {
        const updatedCotes = cotes.filter(cote => cote.id !== id);
        setCotes(updatedCotes);
        setFilteredCotes(updatedCotes);
        setErrors('');
      } else {
        setErrors("Erreur lors de la suppression.");
      }
    } catch (error) {
      setErrors("Erreur lors de la suppression.");
    }
  };

  const updateCote = async () => {
    if (editingId === null || editNote === null) {
      setErrors("ID de cote ou note à modifier manquants.");
      return;
    }

    try {
      const response = await axios.post('http://localhost/ecole-app/apis/updateCote.php', {
        id_cote: editingId,
        note: parseFloat(editNote),
      });

      if (response.data.success) {
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
    const filtered = cotes.filter(cote => {
      const coteTypeEpreuve = cote.type_epreuve ? cote.type_epreuve.trim().toLowerCase() : '';
      const selectedType = selectedTypeTravail.trim().toLowerCase();
      const search = searchTerm.trim().toLowerCase();

      const matchType = selectedType === '' || coteTypeEpreuve === selectedType;
      const matchNom = [
        cote.eleve_nom?.toLowerCase(),
        cote.eleve_prenom?.toLowerCase(),
        cote.eleve_postnom?.toLowerCase() || ''
      ].some(field => field.includes(search));

      return matchType && matchNom;
    });

    setFilteredCotes(filtered);
  }, [searchTerm, selectedTypeTravail, cotes]);

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <SidebarLeft />
      <div className="content">
        <NavbarTop />
        <div className="container mt-5">
          <div className="mt-2 mb-2 justify-content-between align-items-center d-flex">
            <Link to='/secondaire/bureau_admin' className='btn btn-warning text-white'>
              <i className="bi bi-arrow-left"></i> Retour
            </Link>
            <Link
              to={`/secondaire/cote_generale?classe_id=${classeId}&periode_id=${periodeId}&cours_id=${coursId}`}
                className="btn btn-primary"
              >
              Note générale
            </Link>
          </div>
          <h2 className="text-center">Liste des Cotes</h2>

          {errors && <p className="text-danger">{errors}</p>}

          {/* Affichage des informations communes une seule fois */}
          {filteredCotes.length > 0 && filteredCotes[0].total_general && (
            <div className="mb-3 text-center">
              <p><strong>Cotes des élèves de : </strong>{filteredCotes[0].nom_classe || 'Non précisée'}</p>
              <p><strong>Cours : </strong>{filteredCotes[0].nom_cours}</p>
              <p><strong>Epreuve : </strong>{filteredCotes[0].type_epreuve}</p>
              <p><strong>Période : </strong>{filteredCotes[0].nom_periode}</p>
              <p><strong>Année scolaire : </strong>{filteredCotes[0].annee}</p>
              
            </div>
          )}

          {/* Barre de recherche et filtre */}
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
                {typesTravail.map((type) => (
                  <option key={type.id} value={type.typeTravail.trim()}>{type.typeTravail}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tableau des cotes */}
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Élève</th>
                  <th>Note obtenue </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCotes.length > 0 ? (
                  filteredCotes.map((cote, index) => (
                    <tr key={cote.id}>
                      <td>{index + 1}</td>
                      <td>{cote.eleve_nom} {cote.eleve_postnom} {cote.eleve_prenom}</td>
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

export default ListeCotes;
