import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

import SidebarLeft from '../Users/Profil/SidebarLeft';
import NavbarTop from  '../Users/Profil/NavbarTop';

const AjouterCoteExamen = () => {
  const ecole_id = localStorage.getItem('ecole_id');
  const direction = localStorage.getItem('direction');

  const navigate = useNavigate();
  const location = useLocation();

  const [eleves, setEleves] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [cours, setCours] = useState([]);
  const [notes, setNotes] = useState({});

  const [totalGeneral, setTotalGeneral] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState('');
  const [eleveErrors, setEleveErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Ajout de l'état isSubmitting
  const users_id = localStorage.getItem("userId");

  // Fonction pour extraire un paramètre de la query string
  function getValidIntegerFromQuery(param, defaultValue = 0) {
    const value = new URLSearchParams(location.search).get(param);
    const integerValue = parseInt(value, 10);
    return Number.isInteger(integerValue) ? integerValue : defaultValue;
  }

  const classeId = getValidIntegerFromQuery('classe_id', 0);
  const optionId = getValidIntegerFromQuery('option_id', 0);

  useEffect(() => {
    if (classeId === 0) {
      console.warn('classe_id est invalide ou manquant');
      setErrors('Classe invalide ou manquante.');
      return;
    }

    const fetchData = async () => {
      try {
        const [eleveRes, semestreRes, coursRes] = await Promise.all([
          axios.get(`https://api.ecolapp.cd/api/classes/eleves/ecole/${ecole_id}/direction/${direction}/classe/${classeId}/option/${optionId}`),
          axios.get(`https://api.ecolapp.cd/api/semestre/ecole/${ecole_id}/direction/${direction}`),
          axios.get(`https://api.ecolapp.cd/api/coursens/enseignant/${users_id}`, {
            withCredentials: true, 
          }),

        ]);

        if (eleveRes.data.status === 200) {
          setEleves(eleveRes.data.eleves || []);
        } else {
          setErrors(eleveRes.data.message || 'Aucun élève trouvé.');
        }

        setSemestres(semestreRes.data.semestreAll || []);
        setCours(coursRes.data.cours || []);

        console.log(semestreRes.data.semestreAll);


      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        setErrors('Erreur lors de la récupération des données.');
      }
    };

    fetchData();
  }, [users_id, classeId, optionId, ecole_id, direction]);

  const handleNoteChange = (eleveId, note) => {
    setNotes({ ...notes, [eleveId]: note });

    // Si l'utilisateur modifie une note, on efface les erreurs associées à cet élève
    setEleveErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[eleveId];
      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Active l'état de soumission

    const newEleveErrors = {};
    // Vérification que la note de chaque élève ne dépasse pas le total général
    for (const eleveId in notes) {
      if (parseFloat(notes[eleveId]) > parseFloat(totalGeneral)) {
        newEleveErrors[eleveId] = `La note de cet élève (${notes[eleveId]}) dépasse le total général (${totalGeneral}).`;
      }
    }

    if (Object.keys(newEleveErrors).length > 0) {
      setEleveErrors(newEleveErrors);
      setErrors('Veuillez corriger les erreurs avant de soumettre.');
      setIsSubmitting(false); // Désactive l'état de soumission
      return;
    }

    // Préparation des données pour l'envoi
    const formData = Object.keys(notes).map((eleveId) => ({
      eleve_id: eleveId,
      classe_id: classeId,
      cours_id: e.target.cours.value,
      semestre_id: e.target.semestre.value,
      note_max: totalGeneral,
      note_obtenue: notes[eleveId],
      ecole_id : ecole_id,
      direction : direction,
    }));

    try {
      const response = await axios.post('https://api.ecolapp.cd/api/examen/create', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
 
      if (response.data.status === 200) {
        setSuccessMessage(response.data.success_msg);
        navigate(`/primaire/liste_cote_examen_classe_by_enseignant?classe_id=${classeId}&option_id=${optionId}&semestre_id=${e.target.semestre.value}&cours_id=${e.target.cours.value}`);
      } else {
        setErrors(response.data.message || 'Erreur lors de l\'enregistrement des cotes.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des cotes :', error);
      setErrors('Erreur de connexion au serveur.');
    } finally {
      setIsSubmitting(false); // Désactive l'état de soumission après l'opération
    }
  };

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <SidebarLeft/>
      <div className="content">
        <NavbarTop/>
        <div className="container mt-5">
          <h2 className="text-center text-primary">Ajouter des Cotes</h2>
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Tableau des élèves */}
              <div className="col-lg-8 order-2 order-lg-1">
                <table className="table mt-3">
                  <thead>
                    <tr>
                      <th>Élève</th>
                      <th>Note</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {eleves.map((eleve) => (
                      <tr key={eleve.id}>
                        <td>{eleve.name} {eleve.first_name}</td>
                        <td>
                          <input
                            type="number"
                            className={`form-control ${eleveErrors[eleve.id] ? 'is-invalid' : ''}`}
                            min="0"
                            onChange={(e) => handleNoteChange(eleve.id, e.target.value)}
                          />
                        </td>
                        <td>
                          {eleveErrors[eleve.id] && <span className="text-danger">{eleveErrors[eleve.id]}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Formulaire des métadonnées */}
              <div className="col-lg-4 order-1 order-lg-2" style={{ marginTop: '42px' }}>
                
                <div className="mb-3">
                  <label htmlFor="total_general">Total général</label>
                  <input
                    type="number"
                    className="form-control"
                    id="total_general"
                    name="total_general"
                    value={totalGeneral}
                    onChange={(e) => setTotalGeneral(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="semestre">Semestre</label>
                  <select id="semestre" name="semestre" className="form-control">
                    <option value="">Sélectionnez un semestre</option>
                    {semestres.map((semestre) => (
                      <option key={semestre.id} value={semestre.id}>{semestre.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="cours">Cours</label>
                  <select id="cours" name="cours" className="form-control">
                    <option value="">Sélectionnez un cours</option>
                    {cours.map((c) => (
                      <option key={c.cour.id} value={c.cour.id}>{c.cour.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="d-grid mt-3">
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enregistrement en cours...' : 'Enregistrer'}
              </button>
            </div>

            {/* Messages de succès ou d'erreur */}
            {successMessage && <p className="text-success mt-2">{successMessage}</p>}
            {errors && <p className="text-danger mt-2">{errors}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AjouterCoteExamen;
