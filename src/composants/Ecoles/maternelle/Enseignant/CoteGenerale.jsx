import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import SidebarLeft from "../Users/Profil/SidebarLeft";
import NavbarTop from "../Users/Profil/NavbarTop";

function getValidIntegerFromQuery(param, defaultValue = 0) {
  const value = new URLSearchParams(window.location.search).get(param);
  const integerValue = parseInt(value, 10);
  return Number.isInteger(integerValue) ? integerValue : defaultValue;
}

const CoteGenerale = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');
  
  const [cotesGenerales, setCotesGenerales] = useState([]);
  const [filteredCotes, setFilteredCotes] = useState([]); // Pour conserver l'affichage commun
  const [editNote, setEditNote] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState('');

  const classeId = getValidIntegerFromQuery('classe_id', 0);
  const periodeId = getValidIntegerFromQuery('periode_id', 0);
  const coursId = getValidIntegerFromQuery('cours_id', 0);
  const optionId = getValidIntegerFromQuery('option_id', 0);

  useEffect(() => {
    const fetchCotesGenerales = async () => {
      try {
        const response = await axios.get(`https://api.ecolapp.cd/api/cotegenerale/ecole/${ecole_id}/direction/${direction}`, {
          params: { classe_id: classeId, option_id : optionId, periode_id: periodeId, cours_id: coursId, ecole_id: ecole_id, direction : direction },
          withCredentials: true,
        });

          setCotesGenerales(response.data.cotes);
          setFilteredCotes(response.data.cotes); // Utilisé pour afficher les informations communes
          setErrors('');             
          console.log(response.data.cotes);
        
      } catch (error) {
        setErrors("Erreur lors de la récupération des cotes générales.");
      }
    };

    if (classeId && periodeId && coursId) {
      fetchCotesGenerales();
    } else {
      setErrors("Paramètres manquants.");
    }
  }, [classeId, optionId, periodeId, coursId, ecole_id, direction]);

  const updateCoteGenerale = async () => {
    if (!editingId || editNote === null) {
      setErrors("ID ou note à modifier manquants.");
      return;
    }

    try {
      
      const response = await axios.put(`https://api.ecolapp.cd/api/cotegenerale/edit/${editingId}/${parseFloat(editNote)}`);

      if (response.data.status === 200) {
        const updatedCotes = cotesGenerales.map(cote =>
          cote.id === editingId ? { ...cote, total_obtenu: editNote } : cote
        );
        setCotesGenerales(updatedCotes);
        setEditingId(null);
        setEditNote(null);
        setErrors('');
      } else {
        setErrors(response.data.error || "Erreur lors de la modification.");
      }
    } catch (error) {
      setErrors("Erreur lors de la modification.");
    }
  };

  return (
    <div className="container-fluid position-relative  d-flex p-0">
      <SidebarLeft />
      <div className="content">
        <NavbarTop />
        <div className="container mt-5">
          <Link to='/maternelle/profil_user' className='btn  text-white'>
            <i className="bi bi-arrow-left"></i> Retour
          </Link>
          <h2 className="text-center">Cotes Générales</h2>

          {errors && <p className="text-danger">{errors}</p>}

          {/* Affichage des informations communes une seule fois */}
          {filteredCotes.length > 0 && (
            <div className="mb-3 text-center">
              <p><strong>Cotes des élèves de : </strong>{filteredCotes[0]?.classe.name || 'Non précisée'}</p>
              <p><strong>Cours : </strong>{filteredCotes[0]?.cour.name || 'Non précisé'}</p>
              <p><strong>Cote générale : </strong>{filteredCotes[0]?.total_general || 'Non précisée'}</p>
              <p><strong>Période : </strong>{filteredCotes[0]?.periode.name || 'Non précisée'}</p>
              <p><strong>Année scolaire : </strong>{filteredCotes[0]?.annee.name || 'Non précisée'}</p>
            </div>
          )}

          <div className="table-responsive container">
            <table className="table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Élève</th>
                  <th>Note obtenue /{filteredCotes[0]?.total_general || ''}</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cotesGenerales.length > 0 ? (
                  cotesGenerales.map((cote, index) => (
                    <tr key={cote.id}>
                      <td>{index + 1}</td>
                      <td>{cote.eleve_nom} {cote.eleve.name} {cote.eleve.last_name} {cote.eleve.first_name}</td>
                      <td>
                        {editingId === cote.id ? (
                          <input
                            type="number"
                            value={editNote}
                            onChange={(e) => setEditNote(e.target.value)}
                            step="0.01"
                          />
                        ) : (
                          cote.total_obtenu
                        )}
                      </td>
                      <td>
                        {editingId === cote.id ? (
                          <button className="btn  " onClick={updateCoteGenerale}>Sauvegarder</button>
                        ) : (
                          <button
                            className="btn  "
                            onClick={() => { setEditingId(cote.id); setEditNote(cote.total_obtenu); }}
                          >
                            Modifier
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">Aucune cote générale disponible</td>
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

export default CoteGenerale;
